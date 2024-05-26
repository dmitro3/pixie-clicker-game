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

function Boosts() {
    const { score, coinsPerClick, energy, totalEarn, coinsPerSecond, playerImprovements, updateGame, userId } = useContext(GameContext);
    const socket = useContext(WebSocketContext);
    const [clickBoostPrice, setClickBoostPrice] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    const [multitapPrice, setMultitapPrice] = useState(null);

    const { t, i18n } = useTranslation();

    useEffect(() => {
        let price = 1000;
        for(let i = 1; i <= coinsPerClick; i++){
            if(i <= 5){
                price = price * 1.6;
            }else if(i <= 10){
                price = price * 1.45;
            }else if(i <= 15){
                price = price * 1.35;
            }else if(i <= 20){
                price = price * 1.25;
            }else if(i <= 25){
                price = price * 1.1;
            }else{
                price = price * 1;
            }

            price = parseInt(price);
        }
        setMultitapPrice(price);
    }, []);

    useEffect(() => {
        let price = 1000;
        for(let i = 1; i <= coinsPerClick; i++){
            if(i <= 5){
                price = price * 1.6;
            }else if(i <= 10){
                price = price * 1.45;
            }else if(i <= 15){
                price = price * 1.35;
            }else if(i <= 20){
                price = price * 1.25;
            }else if(i <= 25){
                price = price * 1.1;
            }else{
                price = price * 1;
            }

            price = parseInt(price);
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

        console.log("multitapPrice is " + multitapPrice)

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

    if (multitapPrice === null) return <Loader />;

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