import '../App.css';
import React, { useContext, useEffect, useState } from "react";
import {NavLink, useParams} from "react-router-dom";
import avatarImage from "../Resources/images/avatar.jpg";
import coinImage from "../Resources/images/coin.svg";
import rocketImage from "../Resources/images/rocket.svg";
import GameContext from "../Context/GameContext";
import WebSocketContext from "../Context/WebSocketContext";
import Loader from "../Components/Loader";
import WebAppUser from "@twa-dev/sdk";
import {useTranslation} from "react-i18next";

import rustyCoin1 from "../Resources/images/coins/rusty-1.svg";
import rustyCoin2 from "../Resources/images/coins/rusty-2.svg";
import stoneCoin1 from "../Resources/images/coins/stone-1.svg";
import stoneCoin2 from "../Resources/images/coins/stone-2.svg";
import woodenCoin1 from "../Resources/images/coins/wooden-1.svg";
import bronzeCoin1 from "../Resources/images/coins/bronze-1.svg";
import silverCoin1 from "../Resources/images/coins/silver-1.svg";
import goldenCoin1 from "../Resources/images/coins/gold-1.svg";
import goldenCoin2 from "../Resources/images/coins/gold-2.svg";

function Coinsskins() {
    const { score, energy, totalEarn, coinsPerSecond, playerImprovements, updateGame, userId } = useContext(GameContext);
    const socket = useContext(WebSocketContext);
    const [coins, setCoins] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [viewPopup, setViewPopup] = useState(false);
    const [currentCoin, setCurrentCoin] = useState(null);

    const { t, i18n } = useTranslation();

    const coins_images = [
        rustyCoin1,
        rustyCoin2,
        stoneCoin1,
        stoneCoin2,
        woodenCoin1,
        bronzeCoin1,
        silverCoin1,
        goldenCoin1,
        goldenCoin2
    ];


    useEffect(() => {
        fetch(`https://game-api.pixie.fun/api/clicker/coins/get/all/${userId}`)
            .then(response => response.json())
            .then(response => {
                let coins = response.coins;
                setCoins(coins);

                setIsLoaded(true);
            });
    }, []);


    useEffect(() => {
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

    function translatedName(item){
        if(i18n.language === 'ru'){
            return item.name_ru;
        }else if(i18n.language === 'uk'){
            return item.name_uk;
        }else{
            return item.name_en;
        }
    }

    function clickCoinCard(coin){
        setCurrentCoin(coin);
        setViewPopup(true);
    }

    function closePopup(){
        setViewPopup(false);
        setCurrentCoin(null);
    }

    function buyCoin(){
        let data = {
            "coin_id":currentCoin.id,
            "user_id":userId
        };

        fetch(`https://game-api.pixie.fun/api/clicker/coins/buy`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(data)
        }).then(response => response.json())
            .then(response => {
                if(response.message === "ok"){

                }else{

                }
                setCoins(coins);

                setIsLoaded(true);
            });
    }

    if (!isLoaded) return <Loader />;

    return (
        <div className="App">
            <div className="improve_container">
                <h1 className="improve_container-name">{t("improvements")}</h1>

                <div className="improvements_header-buttons">
                    <NavLink to="/improve" activeClassName="active" className="improvements_header-buttons-button">Улучшения</NavLink>
                    <NavLink to="/coinsskins" activeClassName="active" className="improvements_header-buttons-button">Монеты и скины</NavLink>
                </div>

                {viewPopup ?
                    <div className="offline_profit_container coins">
                        <div className="offline_profit_container-content tasks">
                            <button className="offline_profit_container-content-button-close" onClick={()=>{closePopup()}}>✕</button>
                            <span className="offline_profit_container-content-text">{translatedName(currentCoin)}</span>
                            <img src={coins_images[currentCoin.image_id]} alt=""/>
                            <span className="offline_profit_container-content-value">
                                <img src={coinImage} alt=""/>
                                {currentCoin.price.toLocaleString()}
                            </span>
                            <div className="popup_tasks_buttons-bottom">
                                <div className="popup_tasks_buttons">
                                    <button className="popup_tasks_buttons-button" onClick={()=> closePopup()}>{t('Close')}</button>
                                    <button className="popup_tasks_buttons-button second" onClick={()=>{buyCoin(currentCoin.id)}}>{t('Buy')}</button>
                                </div>
                            </div>
                        </div>
                        <div className="offline_profit_container-overlay" onClick={()=>{closePopup()}}></div>
                    </div>
                    : ''}

                <div className="coins_container-row">
                    {coins.map(coin => (
                        <div className={"coins_container-row-item"} onClick={() => clickCoinCard(coin)}>
                            <img src={coins_images[coin.image_id]} alt=""/>
                            <span className="coins_container-row-item-name">{translatedName(coin)}</span>
                            <span className="coins_container-row-item-price">
                                <img src={coinImage} alt=""/>
                                {(coin.price).toLocaleString('en')}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Coinsskins;