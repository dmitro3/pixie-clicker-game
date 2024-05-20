import React, {useContext, useEffect, useState} from 'react';
import {Outlet, useParams} from 'react-router-dom';
import BottomMenu from './Components/BottomMenu';
import coinImage from "./Resources/images/coin.svg";
import GameContext from "./Context/GameContext";
import avatarImage from "./Resources/images/avatar.jpg";

const Layout = () => {
    // let { id } = useParams();
    // sessionStorage.setItem("telegram_user_id", id);
    // console.log(id)

    let { id } = useParams()
    if(!id){
        let id = sessionStorage.telegram_user_id;
    }

    // let { id } = useParams();
    // let session_id = sessionStorage.id

    const { score, coinsPerClick, coinsPerSecond, playerImprovements, energy, maxEnergy, updateGame } = useContext(GameContext);
    const [socket, setSocket] = useState(null);
    const [firstName, setFirstName] = useState(null);
    const [lastName, setLastName] = useState(null);
    const [username, setUsername] = useState(null);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        fetch(`https://game-api.pixie.fun/api/clicker/user/get/${id}`)
            .then(response => response.json())
            .then(response => {
                console.log(response.user);
                console.log(JSON.parse(response.user.improvements_data))

                setFirstName(response.user.first_name);
                setLastName(response.user.last_name);
                setUsername(response.user.username);

                updateGame({
                    score:parseFloat(response.user.balance),
                    coinsPerClick:parseFloat(response.user.coins_per_click),
                    coinsPerSecond:parseFloat(response.user.coins_per_second),
                    playerImprovements:JSON.parse(response.user.improvements_data),
                    energy:response.user.current_energy,
                    maxEnergy:response.user.max_energy
                })

                setLoaded(true);
            });
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            updateGame(prev => ({
                ...prev,
                score: prev.score + prev.coinsPerSecond,
                energy: prev.energy >= prev.maxEnergy ? prev.energy = prev.maxEnergy : prev.energy + 1
            }));
        }, 1000);

        return () => clearInterval(interval); // Очищаем интервал при размонтировании компонента
    }, [coinsPerSecond]);

    useEffect(() => {
        // Создаем WebSocket соединение при загрузке компонента
        // const ws = new WebSocket("ws://127.0.0.1:8080");
        const ws = new WebSocket("wss://game-api.pixie.fun:8080");

        // Устанавливаем обработчики событий для WebSocket соединения
        ws.onopen = () => {
            console.log("WebSocket соединение установлено");
            setSocket(ws);
        };

        ws.onclose = () => {
            console.log("WebSocket соединение закрыто");
        };

        return () => {
            // Закрываем WebSocket соединение при размонтировании компонента
            ws.close();
        };
    }, [loaded]);

    useEffect(() => {
        // console.log("score is: " + score)

        if (socket && score != 0) {
            socket.send(JSON.stringify({ "Score":score, "TelegramId":parseInt(id), "Energy": energy}));
        }
    }, [score, socket]);

    function parseBigNumber(number){
        if(number >= 10000 && number < 1000000){
            return `${parseInt(number / 1000)}k`
        }else if(number >= 1000000){
            return `${parseInt(number / 1000000)}kk`
        }else{
            return `${parseInt(number)}`
        }
    }

    if(!loaded && !playerImprovements) return <>Loading...</>;

    return (
        <div className="app">
            <div className="game-container_header">
                <div className="game-container_header-leftSide">
                    <img src={avatarImage} alt=""/>
                    <span className="game-container_header-leftSide-name">
                        {firstName ? (firstName) + ' ' + (lastName || '') : username}
                    </span>
                </div>
            </div>
            <div className="game-container">
                <div className="game-container_stats">
                    <div className="game-container_stats-item">
                        <span className="game-container_stats-item-name">Earn per tap</span>
                        <span className="game-container_stats-item-value">
                            <img src={coinImage} alt=""/>
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
                            <img src={coinImage} alt=""/>
                            {parseBigNumber(coinsPerSecond * 60 * 60)}
                        </span>
                    </div>
                </div>
                <span className="score">
                    <img src={coinImage} alt=""/>
                    {parseInt(score)}
                </span>
            </div>

            <Outlet />
            <BottomMenu />
        </div>
    );
};

export default Layout;