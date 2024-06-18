import '../App.css';
import React, { useContext, useEffect, useState } from "react";
import {NavLink, useParams} from "react-router-dom";
import avatarImage from "../Resources/images/avatar.jpg";
import coinImage from "../Resources/images/coin.svg";
import rocketImage from "../Resources/images/rocket.svg";
import GameContext from "../Context/GameContext";
import Loader from "../Components/Loader";
import WebAppUser from "@twa-dev/sdk";
import {useTranslation} from "react-i18next";

import stoneCoin1 from "../Resources/images/coins/stone-1.svg";
import stoneCoin2 from "../Resources/images/coins/stone-2.svg";
import woodenCoin1 from "../Resources/images/coins/wooden-1.svg";
import bronzeCoin1 from "../Resources/images/coins/bronze-1.svg";
import silverCoin1 from "../Resources/images/coins/silver-1.svg";
import goldenCoin1 from "../Resources/images/coins/gold-1.svg";
import goldenCoin2 from "../Resources/images/coins/gold-2.svg";

function Coins() {
    const { score, energy, totalEarn, coinsPerSecond, playerImprovements, updateGame, token, userId, coinId, coinImageId } = useContext(GameContext);

    const [coins, setCoins] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [viewPopup, setViewPopup] = useState(false);
    const [currentCoin, setCurrentCoin] = useState(null);

    const { t, i18n } = useTranslation();

    const coins_images = [
        "",
        "",
        stoneCoin1,
        stoneCoin2,
        woodenCoin1,
        bronzeCoin1,
        silverCoin1,
        goldenCoin1,
        goldenCoin2
    ];


    useEffect(() => {
        console.log("coinId is " + coinId)
        fetch(`${process.env.REACT_APP_API_URL}/clicker/coins/get/all/${userId}`)
            .then(response => response.json())
            .then(response => {
                let coins = response.coins;
                setCoins(coins);

                setIsLoaded(true);
            });
    }, []);

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
        if(coin.user_id !== null){
            return;
        }

        setCurrentCoin(coin);
        setViewPopup(true);
    }

    function closePopup(){
        setViewPopup(false);
        setCurrentCoin(null);
    }

    function buyCoin(){
        if(score < currentCoin.price){
            return;
        }

        let date_now_obj = new Date();
        let date_now_timestamp = date_now_obj.getTime();
        date_now_timestamp = parseInt(date_now_timestamp) / 1000;
        date_now_timestamp = parseInt(date_now_timestamp);

        setIsLoaded(false);
        let data = {
            "coin_id":currentCoin.id,
            "timestamp":date_now_timestamp
        };

        fetch(`${process.env.REACT_APP_API_URL}/v2/coins/buy`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'auth-api-token': token
            },
            body: JSON.stringify(data)
        }).then(response => response.json())
            .then(response => {
                console.log(response)
                if(response.message === "ok"){
                    setViewPopup(false);
                    setCurrentCoin(null);

                    fetch(`${process.env.REACT_APP_API_URL}/clicker/coins/get/all/${userId}`)
                        .then(response => response.json())
                        .then(response => {
                            let coins = response.coins;
                            setCoins(coins);

                            setIsLoaded(true);
                        });
                }

                updateGame({
                    score: parseFloat(response.balance)
                })
            });
    }

    function changeCoin(coin){
        let date_now_obj = new Date();
        let date_now_timestamp = date_now_obj.getTime();
        date_now_timestamp = parseInt(date_now_timestamp) / 1000;
        date_now_timestamp = parseInt(date_now_timestamp);

        let data = {
            "coin_id":coin.id,
            "timestamp":date_now_timestamp
        };


        fetch(`${process.env.REACT_APP_API_URL}/v2/coins/set`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'auth-api-token': token
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(response => {
                if(response.message === "ok"){
                    updateGame({
                        coinId:coin.id,
                        coinImageId:coin.image_id,
                        coinShadowColor:coin.shadow_color,
                    });
                }

                updateGame({
                    score: parseFloat(response.balance)
                })
            });
    }

    if (!isLoaded) return <Loader />;

    return (
        <div className="App">
            <div className="improve_container">
                {/*<h1 className="improve_container-name">{t("improvements")}</h1>*/}

                <div className="improvements_header-buttons">
                    <NavLink to="/improve" activeClassName="active" className="improvements_header-buttons-button">{t('improvements')}</NavLink>
                    <NavLink to="/coins" activeClassName="active" className="improvements_header-buttons-button">{t('coins')}</NavLink>
                    <NavLink to="/skins" activeClassName="active" className="improvements_header-buttons-button">{t('skins')}</NavLink>
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
                                    <button className={"popup_tasks_buttons-button second " + (score < currentCoin.price ? 'disabled' : '')} onClick={()=>{buyCoin(currentCoin.id)}}>{t('Buy')}</button>
                                </div>
                            </div>
                        </div>
                        <div className="offline_profit_container-overlay" onClick={()=>{closePopup()}}></div>
                    </div>
                    : ''}

                <div className="coins_container-row">
                    {coins.map(coin => (
                        <div className={"coins_container-row-item " + (coin.user_id ? 'buyed' : '') } onClick={() => clickCoinCard(coin)}>
                            <img src={coins_images[coin.image_id]} alt=""/>
                            <span className="coins_container-row-item-name">{translatedName(coin)}</span>
                            <span className="coins_container-row-item-price">
                                {coin.user_id ?
                                    coin.coin_id === coinId ? t('selected') : <button className="coins-button-choose" onClick={() => changeCoin(coin)}>{t('choose')}</button>
                                :
                                    <><img src={coinImage} alt=""/>{(coin.price).toLocaleString('en')}</>
                                }
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Coins;