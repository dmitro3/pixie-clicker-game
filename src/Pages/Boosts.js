import '../App.css';
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import avatarImage from "../Resources/images/avatar.jpg";
import coinImage from "../Resources/images/coin.svg";
import rocketImage from "../Resources/images/rocket.svg";
import GameContext from "../Context/GameContext";
import WebSocketContext from "../Context/WebSocketContext";
import Loader from "../Components/Loader";
import WebAppUser from "@twa-dev/sdk";
import {useTranslation} from "react-i18next";

import energyIcon from "../Resources/images/improvements/6.png";

function Boosts() {
    const { score, coinsPerClick, energy, maxEnergy, totalEarn, coinsPerSecond, playerImprovements, updateGame, userId } = useContext(GameContext);
    const socket = useContext(WebSocketContext);
    const [clickBoostPrice, setClickBoostPrice] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    const [multitapPrice, setMultitapPrice] = useState(null);
    const [energyTotalPrice, setEnergyTotalPrice] = useState(null);

    const { t, i18n } = useTranslation();

    useEffect(() => {
        let price = 1000;
        for(let i = 1; i <= coinsPerClick; i++){
            price = price * 2;
        }
        setMultitapPrice(price);

        price = 1000;
        for(let i = 1; i <= ((maxEnergy / 500) - 1); i++){
            price = price * 2;
        }
        setEnergyTotalPrice(price);
    }, []);

    useEffect(() => {
        let price = 1000;
        for(let i = 1; i <= coinsPerClick; i++){
            price = price * 2;
        }
        setMultitapPrice(price);
    }, [coinsPerClick]);
    function multitap(){
        if(score < multitapPrice){
            return;
        }

        let data = {
            "user_id":userId,
            "coins_per_click":coinsPerClick + 1
        };

        updateGame({
            coinsPerClick:coinsPerClick + 1,
            score: score - multitapPrice
        });

        fetch("https://game-api.pixie.fun/api/clicker/boosts/multitap/buy",{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(data)
        }).then(response => response.json())
            .then(response => {
               console.log(response);
            });
    }

    useEffect(() => {
        let price = 1000;
        for(let i = 1; i <= ((maxEnergy / 500) - 1); i++){
            price = price * 2;
        }
        setEnergyTotalPrice(price);
    }, [maxEnergy]);
    function energyTotal(){
        if(score < energyTotalPrice){
            return;
        }

        let data = {
            "user_id":userId,
            "maxEnergy":maxEnergy + 500
        };

        updateGame({
            maxEnergy:maxEnergy + 500,
            score: score - energyTotalPrice
        });

        fetch("https://game-api.pixie.fun/api/clicker/boosts/energytotal/buy",{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(data)
        }).then(response => response.json())
            .then(response => {
               console.log(response);
            });
    }

    if (multitapPrice === null || energyTotalPrice === null) return <Loader />;

    return (
        <div className="App">
            <div className="boosts_container">
                <h1 className="boosts_container-name">{t('Boosts')}</h1>

                <div className="boosts_container-column">
                    <button className={"boosts_container-row-button " + (score < multitapPrice ? 'disabled' : '')} onClick={multitap}>
                        <img src={rocketImage} alt="" className="boosts_container-row-button-icon" />
                        <div className="boosts_container-row-button-text">
                            <span className="boosts_container-row-button-text-name">Multitap</span>
                            <div className="boosts_container-row-button-text-undername">
                                <span className="boosts_container-row-button-text-undername-coins">
                                    <img src={coinImage} alt=""/>
                                    {parseInt(multitapPrice / 1000)}K
                                </span>
                                <span className="boosts_container-row-button-text-undername-lvl">
                                    {coinsPerClick + 1} lvl
                                </span>
                            </div>
                        </div>
                    </button>
                    <button className={"boosts_container-row-button " + (score < energyTotalPrice ? 'disabled' : '')} onClick={energyTotal}>
                        <img src={energyIcon} alt="" className="boosts_container-row-button-icon" />
                        <div className="boosts_container-row-button-text">
                            <span className="boosts_container-row-button-text-name">Energy limit</span>
                            <div className="boosts_container-row-button-text-undername">
                                <span className="boosts_container-row-button-text-undername-coins">
                                    <img src={coinImage} alt=""/>
                                    {parseInt(energyTotalPrice / 1000)}K
                                </span>
                                <span className="boosts_container-row-button-text-undername-lvl">
                                    {(maxEnergy / 500) - 1} lvl
                                </span>
                            </div>
                        </div>
                    </button>
                    <button className={"boosts_container-row-button disabled"}>
                        <img src={energyIcon} alt="" className="boosts_container-row-button-icon" />
                        <div className="boosts_container-row-button-text">
                            <span className="boosts_container-row-button-text-name">Energy per second</span>
                            <div className="boosts_container-row-button-text-undername">
                                <span className="boosts_container-row-button-text-undername-coins">
                                    <img src={coinImage} alt=""/>
                                    coming soon
                                </span>
                                <span className="boosts_container-row-button-text-undername-lvl">
                                    {/*{coinsPerClick + 1} lvl*/}
                                </span>
                            </div>
                        </div>
                    </button>
                    {/*<button className="boosts_container-row-button">*/}
                    {/*    <img src={rocketImage} alt="" className="boosts_container-row-button-icon"/>*/}
                    {/*    <div className="boosts_container-row-button-text">*/}
                    {/*        <span className="boosts_container-row-button-text-name">Energy recovery per second</span>*/}
                    {/*        <div className="boosts_container-row-button-text-undername">*/}
                    {/*            <span className="boosts_container-row-button-text-undername-coins">*/}
                    {/*                <img src={coinImage} alt=""/>*/}
                    {/*                1K*/}
                    {/*            </span>*/}
                    {/*            <span className="boosts_container-row-button-text-undername-lvl">*/}
                    {/*                7 lvl*/}
                    {/*            </span>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*</button>*/}
                    {/*<button className="boosts_container-row-button">*/}
                    {/*    <img src={rocketImage} alt="" className="boosts_container-row-button-icon"/>*/}
                    {/*    <div className="boosts_container-row-button-text">*/}
                    {/*        <span className="boosts_container-row-button-text-name">Max energy</span>*/}
                    {/*        <div className="boosts_container-row-button-text-undername">*/}
                    {/*            <span className="boosts_container-row-button-text-undername-coins">*/}
                    {/*                <img src={coinImage} alt=""/>*/}
                    {/*                1K*/}
                    {/*            </span>*/}
                    {/*            <span className="boosts_container-row-button-text-undername-lvl">*/}
                    {/*                7 lvl*/}
                    {/*            </span>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*</button>*/}
                </div>
            </div>
        </div>
    );
}

export default Boosts;