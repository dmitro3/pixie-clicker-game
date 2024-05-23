import React, { useContext, useEffect, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import WebSocketContext from "./Context/WebSocketContext";
import BottomMenu from './Components/BottomMenu';
import coinImage from "./Resources/images/coin.svg";
import GameContext from "./Context/GameContext";
import avatarImage from "./Resources/images/avatar.jpg";
import WebApp from "@twa-dev/sdk";
import Loader from "./Components/Loader";

const Layout = () => {
    let { id } = useParams();

    const telegram = window.Telegram.WebApp;
    if(telegram){
        id = telegram.user.id;
        console.log("Telegram user ID взяли в telegram object! " + id)
    }

    useEffect(() => {
        WebApp.ready();
        WebApp.expand();
    }, []);

    const { score, coinsPerClick, coinsPerSecond, playerImprovements, energy, totalEarn, maxEnergy, updateGame } = useContext(GameContext);
    const socket = useContext(WebSocketContext);
    const [firstName, setFirstName] = useState(null);
    const [lastName, setLastName] = useState(null);
    const [username, setUsername] = useState(null);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        fetch(`https://game-api.pixie.fun/api/clicker/user/get/${id}`)
            .then(response => response.json())
            .then(response => {
                setFirstName(response.user.first_name);
                setLastName(response.user.last_name);
                setUsername(response.user.username);

                let user_score = parseFloat(response.user.balance);
                let energy = parseInt(response.user.current_energy);

                if (response.user.last_online_at) {
                    let last_online_at = (response.user.last_online_at).replace(/ /, 'T').replace(/ /, ':') + 'Z';

                    let dateNowObj = new Date(response.user.date_now);
                    let lastOnlineAtObj = new Date(last_online_at);
                    let difference = dateNowObj - lastOnlineAtObj;
                    let differenceInSeconds = Math.round(difference / 1000);
                    let differenceInMinutes = parseInt(differenceInSeconds / 60);

                    if (differenceInMinutes > 1) {
                        if (differenceInSeconds > (60 * 60 * 3)) {
                            differenceInSeconds = 60 * 60 * 3;
                        }

                        user_score = user_score + parseFloat(differenceInSeconds) * parseFloat(response.user.coins_per_second);
                        energy = energy + parseInt(differenceInSeconds * 1);
                        if (energy > parseInt(response.user.max_energy)) {
                            energy = parseInt(response.user.max_energy);
                        }
                    }
                }

                updateGame({
                    score: user_score,
                    coinsPerClick: parseFloat(response.user.coins_per_click),
                    coinsPerSecond: parseFloat(response.user.coins_per_second),
                    playerImprovements: JSON.parse(response.user.improvements_data),
                    energy: parseInt(energy),
                    maxEnergy: parseInt(response.user.max_energy),
                    totalEarn: parseFloat(response.user.total_earn)
                });

                setLoaded(true);
            });
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            updateGame(prev => ({
                ...prev,
                score: prev.score + prev.coinsPerSecond,
                energy: prev.energy >= prev.maxEnergy ? prev.energy = prev.maxEnergy : prev.energy + 1,
                totalEarn: prev.totalEarn + prev.coinsPerSecond
            }));
        }, 1000);

        return () => clearInterval(interval);
    }, [coinsPerSecond]);

    useEffect(() => {
        if (socket && score !== null && totalEarn !== null) {
            const socket_data = JSON.stringify({
                "Score": parseFloat(score),
                "TelegramId": parseInt(id),
                "Energy": parseInt(energy),
                "TotalEarn": parseFloat(totalEarn)
            });

            socket.send(socket_data);
            console.log("Отправили пакет на сервер");
            console.log(socket_data);
        }
    }, [score, socket, id, energy, totalEarn]);

    function parseBigNumber(number) {
        if (number >= 10000 && number < 1000000) {
            return `${parseInt(number / 1000)}k`
        } else if (number >= 1000000) {
            return `${parseInt(number / 1000000)}kk`
        } else {
            return `${parseInt(number)}`
        }
    }

    if (!loaded || !playerImprovements || isNaN(score)) return <Loader />;

    return (
        <div className="app">
            <div className="game-container_header">
                <div className="game-container_header-leftSide">
                    <img src={avatarImage} alt="" />
                    <span className="game-container_header-leftSide-name">
                        {firstName ? `${firstName} ${lastName || ''}` : username}
                    </span>
                </div>
            </div>
            <div className="game-container">
                <div className="game-container_stats">
                    <div className="game-container_stats-item">
                        <span className="game-container_stats-item-name">Earn per tap</span>
                        <span className="game-container_stats-item-value">
                            <img src={coinImage} alt="" />
                            +{coinsPerClick}
                        </span>
                    </div>
                    <div className="game-container_stats-item">
                        <span className="game-container_stats-item-name">Coins to level up</span>
                        <span className="game-container_stats-item-value">0</span>
                    </div>
                    <div className="game-container_stats-item">
                        <span className="game-container_stats-item-name">Profit per hour</span>
                        <span className="game-container_stats-item-value">
                            <img src={coinImage} alt="" />
                            {parseBigNumber(coinsPerSecond * 60 * 60)}
                        </span>
                    </div>
                </div>
                <span className="score">
                    <img src={coinImage} alt="" />
                    {parseInt(score)}
                </span>
            </div>

            <Outlet />
            <BottomMenu />
        </div>
    );
};

export default Layout;