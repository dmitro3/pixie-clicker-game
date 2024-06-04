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

import skin_0 from "../Resources/images/skins/0.png";
import skin_1 from "../Resources/images/skins/1.png";
import skin_2 from "../Resources/images/skins/2.png";
import skin_3 from "../Resources/images/skins/3.png";
import skin_4 from "../Resources/images/skins/4.png";
import skin_5 from "../Resources/images/skins/5.png";
import skin_6 from "../Resources/images/skins/6.png";
import skin_7 from "../Resources/images/skins/7.png";
import skin_8 from "../Resources/images/skins/8.png";
import skin_9 from "../Resources/images/skins/9.png";
import skin_10 from "../Resources/images/skins/10.png";
import skin_11 from "../Resources/images/skins/11.png";
import skin_12 from "../Resources/images/skins/12.png";
import skin_13 from "../Resources/images/skins/13.png";
import skin_14 from "../Resources/images/skins/14.png";
import skin_15 from "../Resources/images/skins/15.png";
import skin_16 from "../Resources/images/skins/16.png";
import skin_17 from "../Resources/images/skins/17.png";
import skin_18 from "../Resources/images/skins/18.png";
import skin_19 from "../Resources/images/skins/19.png";
import skin_20 from "../Resources/images/skins/20.png";
import skin_21 from "../Resources/images/skins/21.png";
import skin_22 from "../Resources/images/skins/22.png";
import skin_23 from "../Resources/images/skins/23.png";
import skin_24 from "../Resources/images/skins/24.png";
import skin_25 from "../Resources/images/skins/25.png";
import skin_26 from "../Resources/images/skins/26.png";
import skin_27 from "../Resources/images/skins/27.png";

function Skins() {
    const { score, energy, totalEarn, coinsPerSecond, playerImprovements, updateGame, userId, skinId, skinImageId } = useContext(GameContext);
    const socket = useContext(WebSocketContext);
    const [skins, setSkins] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [viewPopup, setViewPopup] = useState(false);
    const [currentSkin, setCurrentSkin] = useState(null);

    const { t, i18n } = useTranslation();

    const skins_images = [
        skin_0,
        skin_1,
        skin_2,
        skin_3,
        skin_4,
        skin_5,
        skin_6,
        skin_7,
        skin_8,
        skin_9,
        skin_10,
        skin_11,
        skin_12,
        skin_13,
        skin_14,
        skin_15,
        skin_16,
        skin_17,
        skin_18,
        skin_19,
        skin_20,
        skin_21,
        skin_22,
        skin_23,
        skin_24,
        skin_25,
        skin_26,
        skin_27,
    ];

    useEffect(() => {
        console.log("skinId is " + skinId)
        fetch(`https://game-api.pixie.fun/api/clicker/skins/get/all/${userId}`)
            .then(response => response.json())
            .then(response => {
                let skins = response.skins;
                setSkins(skins);

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

    function clickCoinCard(skin){
        if(skin.user_id !== null){
            return;
        }

        setCurrentSkin(skin);
        setViewPopup(true);
    }

    function closePopup(){
        setViewPopup(false);
        setCurrentSkin(null);
    }

    function buySkin(){
        if(score < currentSkin.price){
            return;
        }

        setIsLoaded(false);
        let data = {
            "skin_id":currentSkin.id,
            "user_id":userId
        };

        fetch(`https://game-api.pixie.fun/api/clicker/skins/buy`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(data)
        }).then(response => response.json())
            .then(response => {
                if(response.message === "ok"){
                    updateGame({
                        score: score - parseFloat(currentSkin.price)
                    })
                    setViewPopup(false);
                    setCurrentSkin(null);

                    fetch(`https://game-api.pixie.fun/api/clicker/skins/get/all/${userId}`)
                        .then(response => response.json())
                        .then(response => {
                            let skins = response.skins;
                            setSkins(skins);

                            setIsLoaded(true);
                        });
                }else{

                }
            });
    }

    function changeCoin(skin){
        let data = {
            "skin_id":skin.id,
            "user_id":userId
        };

        fetch(`https://game-api.pixie.fun/api/clicker/skins/set`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(response => {
                if(response.message === "ok"){
                    updateGame({
                        skinId:skin.id,
                        skinImageId:skin.image_id
                    });

                }else{
                    console.log("error")
                }
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
                            {/*<span className="offline_profit_container-content-text">{translatedName(setCurrentSkin())}</span>*/}
                            <img src={skins_images[currentSkin.image_id]} alt=""/>
                            <span className="offline_profit_container-content-value">
                                <img src={coinImage} alt=""/>
                                {currentSkin.price.toLocaleString()}
                            </span>
                            <div className="popup_tasks_buttons-bottom">
                                <div className="popup_tasks_buttons">
                                    <button className="popup_tasks_buttons-button" onClick={()=> closePopup()}>{t('Close')}</button>
                                    <button className={"popup_tasks_buttons-button second " + (score < currentSkin.price ? 'disabled' : '')} onClick={()=>{buySkin(currentSkin.id)}}>{t('Buy')}</button>
                                </div>
                            </div>
                        </div>
                        <div className="offline_profit_container-overlay" onClick={()=>{closePopup()}}></div>
                    </div>
                    : ''}

                <div className="coins_container-row">
                    {skins.map(skin => (
                        <div className={"coins_container-row-item " + (skin.user_id ? 'buyed' : '') } onClick={() => clickCoinCard(skin)}>
                            <img src={skins_images[skin.image_id]} alt=""/>
                            {/*<span className="coins_container-row-item-name">{translatedName(skin)}</span>*/}
                            <span className="coins_container-row-item-price">
                                {skin.user_id ?
                                    skin.skin_id === skinId ? t('Selected') : <button className="coins-button-choose" onClick={() => changeCoin(skin)}>{t('Choose')}</button>
                                    :
                                    <><img src={coinImage} alt=""/>{(skin.price).toLocaleString('en')}</>
                                }
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Skins;