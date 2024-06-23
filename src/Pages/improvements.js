import '../App.css';
import { useContext, useEffect, useState } from "react";
import {NavLink, useParams} from "react-router-dom";
import avatarImage from "../Resources/images/avatar.jpg";
import coinImage from "../Resources/images/coin.svg";
import rocketImage from "../Resources/images/rocket.svg";
import GameContext from "../Context/GameContext";
import Loader from "../Components/Loader";
import WebAppUser from "@twa-dev/sdk";
import {useTranslation} from "react-i18next";

import improvement_icon_1 from "../Resources/images/improvements/1.png";
import improvement_icon_2 from "../Resources/images/improvements/2.png";
import improvement_icon_3 from "../Resources/images/improvements/3.png";
import improvement_icon_4 from "../Resources/images/improvements/4.png";
import improvement_icon_5 from "../Resources/images/improvements/5.png";
import improvement_icon_6 from "../Resources/images/improvements/6.png";
import improvement_icon_7 from "../Resources/images/improvements/7.png";
import improvement_icon_8 from "../Resources/images/improvements/8.png";
import improvement_icon_9 from "../Resources/images/improvements/9.png";
import improvement_icon_10 from "../Resources/images/improvements/10.png";
import improvement_icon_11 from "../Resources/images/improvements/11.png";
import improvement_icon_12 from "../Resources/images/improvements/12.png";
import improvement_icon_13 from "../Resources/images/improvements/13.png";
import improvement_icon_14 from "../Resources/images/improvements/14.png";
import improvement_icon_15 from "../Resources/images/improvements/15.png";
import improvement_icon_16 from "../Resources/images/improvements/16.png";
import improvement_icon_17 from "../Resources/images/improvements/17.png";
import improvement_icon_18 from "../Resources/images/improvements/18.png";
import improvement_icon_19 from "../Resources/images/improvements/19.png";
import improvement_icon_20 from "../Resources/images/improvements/20.png";
import improvement_icon_21 from "../Resources/images/improvements/21.png";
import improvement_icon_22 from "../Resources/images/improvements/22.png";
import improvement_icon_23 from "../Resources/images/improvements/23.png";
import improvement_icon_24 from "../Resources/images/improvements/24.png";
import improvement_icon_25 from "../Resources/images/improvements/25.png";
import improvement_icon_26 from "../Resources/images/improvements/26.png";
import improvement_icon_27 from "../Resources/images/improvements/27.png";
import toast, {Toaster} from "react-hot-toast";

function Improvements() {
    const { score, energy, totalEarn, coinsPerSecond, playerImprovements, updateGame, skinId, token, userId, skinEarningBoost } = useContext(GameContext);

    const [improvements, setImprovements] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    const improvements_icons = [
        "",
        improvement_icon_1,
        improvement_icon_2,
        improvement_icon_3,
        improvement_icon_4,
        improvement_icon_5,
        improvement_icon_6,
        improvement_icon_7,
        improvement_icon_8,
        improvement_icon_9,
        improvement_icon_10,
        improvement_icon_11,
        improvement_icon_12,
        improvement_icon_13,
        improvement_icon_14,
        improvement_icon_15,
        improvement_icon_16,
        improvement_icon_17,
        improvement_icon_18,
        improvement_icon_19,
        improvement_icon_20,
        improvement_icon_21,
        improvement_icon_22,
        improvement_icon_23,
        improvement_icon_24,
        improvement_icon_25,
        improvement_icon_26,
        improvement_icon_27
    ];

    const { t, i18n } = useTranslation();

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/clicker/improvements/get`)
            .then(response => response.json())
            .then(response => {
                let improvements = response.improvements;

                improvements.forEach((item, i) => {
                    if (playerImprovements['data'][item.id]) {
                        for (let level_iteration = 2; level_iteration <= playerImprovements['data'][item.id]['level']; level_iteration++) {
                            improvements[i]['coins_mining_now'] = (improvements[i]['coins_mining_now'] || 0) + improvements[i]['give_coins'];

                            improvements[i]['price'] = improvements[i]['price'] * improvements[i]['price_coef'];
                            improvements[i]['give_coins'] = improvements[i]['give_coins'] * improvements[i]['give_coins_coef'];
                        }
                    }
                });

                setImprovements(improvements);
                setIsLoaded(true);
            });
    }, []);

    function buyImprovement(improvement_item) {
        // setIsLoaded(false);

        let date_now_obj = new Date();
        let date_now_timestamp = date_now_obj.getTime();
        date_now_timestamp = parseInt(date_now_timestamp) / 1000;
        date_now_timestamp = parseInt(date_now_timestamp);

        let bodyData = {
            "improvement_id": improvement_item.id,
            "timestamp":date_now_timestamp
        };

        fetch(`${process.env.REACT_APP_API_URL}/v3/improvements/set`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'auth-api-token': token
            },
            body: JSON.stringify(bodyData)
        }).then(response => response.json())
            .then(response => {
                if(response.message === 'ok'){
                    improvements.forEach((item, i) => {
                        if (item['id'] === improvement_item.id) {
                            let playerNewImprovements = playerImprovements;

                            if (playerNewImprovements['data'][item.id]) {
                                playerNewImprovements['data'][item.id]['level'] += 1;
                            } else {
                                playerNewImprovements['data'][item.id] = { "level": 2 };
                            }

                            updateGame({
                                coinsPerSecond: parseFloat(response.coins_per_second),
                                playerImprovements: playerNewImprovements,
                                score: parseFloat(response.balance)
                            });

                            improvements[i]['price'] = improvements[i]['price'] * improvements[i]['price_coef'];
                            improvements[i]['give_coins'] = improvements[i]['give_coins'] * improvements[i]['give_coins_coef'];
                            improvements[i]['coins_mining_now'] = (improvements[i]['coins_mining_now'] || 0) + improvements[i]['give_coins'];
                        }
                    });
                    // setIsLoaded(true);
                    toast.success("Success!");

                    console.log(playerImprovements);
                }else{
                    // setIsLoaded(true);
                    toast.error("Error :c");
                }
            });
    }

    function translatedName(item){
        if(i18n.language === 'ru'){
            return item.name_ru;
        }else if(i18n.language === 'uk'){
            return item.name_uk;
        }else{
            return item.name_en;
        }
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

                <div className="improve_container-row">
                    {improvements.map(item => (
                        <div key={item.id} className={"improve_container-row-item " + (parseInt(item.price) > parseInt(score) ? "disabled" : "")} onClick={() => { if (parseInt(item.price) < parseInt(score)) { buyImprovement(item) } }}>
                            <div className="improve_container-row-item-main">
                                <div className="improve_container-row-item-main-leftSide">
                                    {/*<img src={rocketImage} alt="" />*/}
                                    <img src={improvements_icons[item.icon_number]} alt="" />
                                </div>
                                <div className="improve_container-row-item-main-rightSide">
                                    <span className="improve_container-row-item-main-rightSide-name">{translatedName(item)}</span>
                                    {item.id === 39 || item.id === 40 || item.id === 41 ?
                                        <span className="improve_container-row-item-main-rightSide-description">{t('Moneys for referal')}</span>
                                    :
                                        <span className="improve_container-row-item-main-rightSide-description">{t('Profit per hour')}</span>
                                    }
                                    <span className="improve_container-row-item-main-rightSide-coins">
                                        {item.id === 39 || item.id === 40 || item.id === 41 ?
                                            <>
                                                + $0.01

                                            </>
                                        :
                                            <>
                                                <img src={coinImage} alt="" />
                                                {item.coins_mining_now ? `${parseInt(item.coins_mining_now)} (+${parseInt(item.give_coins)})` : `+${parseInt(item.give_coins)}`}
                                            </>
                                        }
                                    </span>
                                </div>
                            </div>
                            <div className="improve_container-row-item-bottom">
                                <div className="improve_container-row-item-bottom-currentLevel">
                                    <span className="improve_container-row-item-bottom-currentLevel-text">
                                        lvl {playerImprovements['data'][item.id] ? playerImprovements['data'][item.id]['level'] : "1"}
                                    </span>
                                </div>
                                <div className="improve_container-row-item-bottom-price">
                                    <span className="improve_container-row-item-bottom-price-text">
                                        <img src={coinImage} alt="" />
                                        {item.id === 39 || item.id === 40 || item.id === 41 ?
                                            parseInt(item.price / 1_000_000_000_000) + " " + t('trillion')
                                        :
                                            parseInt(item.price)
                                        }
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div><Toaster/></div>
        </div>
    );
}

export default Improvements;