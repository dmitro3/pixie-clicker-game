import React, { useContext, useEffect, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import WebSocketContext from "./Context/WebSocketContext";
import BottomMenu from './Components/BottomMenu';
import coinImage from "./Resources/images/coin.svg";
import GameContext from "./Context/GameContext";
import avatarImage from "./Resources/images/avatar.jpg";
import WebAppUser from "@twa-dev/sdk";
import Loader from "./Components/Loader";
import {useTranslation} from "react-i18next";
import ReloadPage from "./Components/ReloadPage";
import pixie_0 from "./Resources/images/pixie/0.png";
import pixie_1 from "./Resources/images/pixie/1.png";
import pixie_2 from "./Resources/images/pixie/2.png";
import pixie_3 from "./Resources/images/pixie/3.png";
import pixie_4 from "./Resources/images/pixie/4.png";
import pixie_5 from "./Resources/images/pixie/5.png";
import pixie_6 from "./Resources/images/pixie/6.png";
import pixie_7 from "./Resources/images/pixie/7.png";
import pixie_8 from "./Resources/images/pixie/8.png";
import pixie_9 from "./Resources/images/pixie/9.png";

const Layout = () => {
    const { score, coinsPerClick, coinsPerSecond, playerImprovements, energy, totalEarn, maxEnergy, updateGame, userId } = useContext(GameContext);
    const socket = useContext(WebSocketContext);
    const [firstName, setFirstName] = useState(null);
    const [lastName, setLastName] = useState(null);
    const [username, setUsername] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const [attentionReloadPage, setAttentionReloadPage] = useState(false);

    const [levelValue, setLevelValue] = useState(0);

    const [passiveProfitPopup, setPassiveProfitPopup] = useState(false);
    const [passiveProfitValue, setPassiveProfitValue] = useState(0);
    const [coinsNeedForNewLevel, setCoinsNeedForNewLevel] = useState(0);

    const { t, i18n } = useTranslation();

    const pixieImages = [
        pixie_0,
        pixie_1,
        pixie_2,
        pixie_3,
        pixie_4,
        pixie_5,
        pixie_6,
        pixie_7,
        pixie_8,
        pixie_9,
    ];

    const levels_score = [
        [0, 100_000],
        [100_001, 1_000_000],
        [1_000_001, 5_000_000],
        [5_000_001, 10_000_000],
        [10_000_001, 20_000_000],
        [20_000_001, 30_000_000],
        [30_000_001, 50_000_000],
        [50_000_001, 75_000_000],
        [75_000_001, 100_000_000],
        [100_000_001, 150_000_000],
        [150_000_001, 200_000_000],
        [200_000_001, 300_000_000],
        [300_000_001, 400_000_000],
        [400_000_001, 600_000_000],
        [600_000_001, 1_000_000_000],
        [1_000_000_001, 1_500_000_000],
        [1_500_000_001, 2_000_000_000],
        [2_000_000_001, 3_000_000_000],
    ];

    useEffect(() => {
        levels_score.forEach((level, i) => {
            if(parseFloat(levels_score[i][0]) <= parseFloat(totalEarn) && parseFloat(levels_score[i][1]) >= parseFloat(totalEarn)){
                // setLevelPercents(totalEarn / (levels_score[i][1] / 100));
                setLevelValue(i);
                setCoinsNeedForNewLevel(parseInt(levels_score[i][1] - totalEarn));
            }
        });
    }, [totalEarn]);

    useEffect(() => {
        if(!userId){return;}

        let user_language = "";
        if(WebAppUser.initDataUnsafe && WebAppUser.initDataUnsafe.user){
            user_language = WebAppUser.initDataUnsafe.user.language_code;
        }else{
            user_language = "ru";
        }

        fetch(`${process.env.REACT_APP_API_URL}/v2/clicker/user/get/${userId}/${user_language}`)
            .then(response => response.json())
            .then(response => {
                setFirstName(response.user.first_name);
                setLastName(response.user.last_name);
                setUsername(response.user.username);

                let user_score = parseFloat(response.user.balance);
                let energy = parseInt(response.user.current_energy);
                let total_earn = parseInt(response.user.total_earn);

                let maxEnergy = parseInt(response.user.max_energy);
                let temp_coins_per_second = parseFloat(response.user.coins_per_second);
                let temp_coins_per_click = parseFloat(response.user.coins_per_click);

                if(response.user.skin_id !== null){
                    console.log("есть бусты");
                    maxEnergy = maxEnergy + (maxEnergy / 100 * parseInt(response.user.energy_bar_boost));
                    temp_coins_per_second = temp_coins_per_second + (temp_coins_per_second / 100 * parseInt(response.user.earning_boost));
                    temp_coins_per_click = temp_coins_per_click + parseFloat(response.user.per_tap_boost);
                }

                if (response.user.last_online_at) {
                    let last_online_at = (response.user.last_online_at).replace(/ /, 'T').replace(/ /, ':') + 'Z';
                    let last_auth_at = (response.user.last_auth_date).replace(/ /, 'T').replace(/ /, ':') + 'Z';

                    let dateNowObj = new Date(response.user.date_now);
                    let lastOnlineAtObj = new Date(last_online_at);
                    let difference = dateNowObj - lastOnlineAtObj;
                    let differenceInSeconds = Math.round(difference / 1000);
                    let differenceInMinutes = parseInt(differenceInSeconds / 60);

                    let lastAuthAtObj = new Date(last_auth_at);
                    let diff_last_auth = dateNowObj - lastOnlineAtObj;
                    let diff_last_auth_sec = Math.round(diff_last_auth / 1000);
                    let diff_last_auth_min = Math.round(diff_last_auth_sec / 60);

                    if (differenceInMinutes > 1 && diff_last_auth_min > 1) {
                        setPassiveProfitPopup(true);

                        if (differenceInSeconds > (60 * 60 * 3)) {
                            differenceInSeconds = 60 * 60 * 3;
                        }


                        let passiveProfitValue = parseFloat(differenceInSeconds) * parseFloat(response.user.coins_per_second);
                        setPassiveProfitValue(passiveProfitValue);
                        user_score = user_score + passiveProfitValue;
                        total_earn = total_earn + parseFloat(differenceInSeconds) * parseFloat(response.user.coins_per_second);
                        energy = energy + parseInt(differenceInSeconds * 1);
                        if (energy > parseInt(maxEnergy)) {
                            energy = parseInt(maxEnergy);
                        }
                    }
                }

                updateGame({
                    score: user_score,
                    coinsPerClick: parseFloat(temp_coins_per_click),
                    coinsPerSecond: parseFloat(temp_coins_per_second),
                    playerImprovements: JSON.parse(response.user.improvements_data),
                    energy: parseInt(energy),
                    maxEnergy: parseInt(maxEnergy),
                    totalEarn: parseInt(total_earn),
                    coinImageId:parseInt(response.user.coin_image_id),
                    skinImageId:parseInt(response.user.skin_image_id),
                    coinId:parseInt(response.user.coin_id),
                    skinId:parseInt(response.user.skin_id),
                    coinShadowColor:response.user.coin_shadow_color,
                    skinEarningBoost:response.user.earning_boost,
                    skinPerTapBoost:response.user.per_tap_boost,
                    energyBarBoost:response.user.energy_bar_boost,
                    level:levelValue,
                    family_id:response.user.family_id ? parseInt(response.user.family_id) : null
                });

                console.log(playerImprovements)

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
        if (socket) {
            console.log("socket-соединение установлено")

            socket.onclose = () => {
                console.log("socket-соединение закрыто")
                setAttentionReloadPage(true);
            };
        }

        if (socket && !isNaN(score) && score !== null && totalEarn !== null && !isNaN(totalEarn)) {
            const socket_data = JSON.stringify({
                "Score": parseFloat(score),
                "TelegramId": parseInt(userId),
                "Energy": parseInt(energy),
                "TotalEarn": parseFloat(totalEarn)
            });

            socket.send(socket_data);
        }
    }, [score, socket, userId, energy, totalEarn]);

    function parseBigNumber(number) {
        if (number >= 10000 && number < 1000000) {
            return `${parseInt(number / 1000)}k`
        } else if (number >= 1000000) {
            return `${(number / 1000000).toFixed(3)}kk`
        } else {
            return `${parseInt(number)}`
        }
    }

    function passiveProfitPopupClose(){
        setPassiveProfitPopup(false);
    }

    function nicknameFormat(first_name, last_name, username){
        let nickname = "";
        if(first_name !== 'None' && first_name !== null){
            nickname = first_name;
        }
        if(last_name !== 'None' && last_name !== null){
            if(nickname !== ""){
                nickname = nickname + " " + last_name;
            }else{
                nickname = last_name;
            }
        }

        if(nickname === ""){
            nickname = username;

            if(nickname === ""){
                nickname = "Hidden username";
            }
        }

        return nickname;
    }

    if(attentionReloadPage) return <ReloadPage />;
    if (!loaded || isNaN(score)){
        // console.log(loaded)
        // console.log(playerImprovements)
        // console.log(score)
        return <Loader />
    }

    return (
        <div className="app">
            {passiveProfitPopup ? <>
                <div className="offline_profit_container">
                    <div className="offline_profit_container-content">
                        <span className="offline_profit_container-content-text">{t('Passive income amounted to')}</span>
                        <span className="offline_profit_container-content-value">
                            <img src={coinImage} alt=""/>
                            {parseInt(passiveProfitValue)}
                        </span>
                        <button className="offline_profit_container-content-button" onClick={passiveProfitPopupClose}>OK</button>
                    </div>
                    <div className="offline_profit_container-overlay"></div>
                </div>
            </> : ''}
            <div className="game-container_header">
                <div className="game-container_header-leftSide">
                    {/*<img src={avatarImage} alt="" />*/}
                    <img src={pixieImages[userId % 10]} alt="avatar"/>
                    <span className="game-container_header-leftSide-name">
                        {/*{firstName !== 'None' ? firstName : ''} {lastName !== 'None' ? lastName : ''} || username}*/}
                        {/*{firstName ? firstName + " " + (lastName === 'None' ? '' : lastName) : username || 'Hidden username'}*/}
                        {nicknameFormat(firstName, lastName, username)}
                    </span>
                </div>
            </div>
            <div className="game-container">
                <div className="game-container_stats">
                    <div className="game-container_stats-item">
                        <span className="game-container_stats-item-name">{t('Earn per tap')}</span>
                        <span className="game-container_stats-item-value">
                            <img src={coinImage} alt="" />
                            +{coinsPerClick}
                        </span>
                    </div>
                    <div className="game-container_stats-item">
                        <span className="game-container_stats-item-name">{t('Coins to level up')}</span>
                        <span className="game-container_stats-item-value">{parseInt(coinsNeedForNewLevel / 1000)}K</span>
                    </div>
                    <div className="game-container_stats-item">
                        <span className="game-container_stats-item-name">{t('Profit per hour')}</span>
                        <span className="game-container_stats-item-value">
                            <img src={coinImage} alt="" />
                            {parseBigNumber(coinsPerSecond * 60 * 60)}
                        </span>
                    </div>
                </div>
                <span className="score">
                    <img src={coinImage} alt="" />
                    {parseInt(score).toLocaleString('en')}
                </span>
            </div>

            <Outlet />
            <BottomMenu />
        </div>
    );
};

export default Layout;