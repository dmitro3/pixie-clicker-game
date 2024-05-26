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

function Improvements() {
    const { score, energy, totalEarn, coinsPerSecond, playerImprovements, updateGame, userId } = useContext(GameContext);
    const socket = useContext(WebSocketContext);
    const [improvements, setImprovements] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    const { t, i18n } = useTranslation();

    useEffect(() => {
        console.warn(playerImprovements);

        fetch(`https://game-api.pixie.fun/api/clicker/improvements/get`)
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
                console.log(improvements)
                setIsLoaded(true);

                console.warn(playerImprovements);
            });
    }, []);

    function buyImprovement(id) {
        console.warn(playerImprovements);


        improvements.forEach((item, i) => {
            if (item['id'] === id) {
                let playerNewImprovements = playerImprovements;

                if (playerNewImprovements['data'][item.id]) {
                    playerNewImprovements['data'][item.id]['level'] += 1;
                } else {
                    playerNewImprovements['data'][item.id] = { "level": 2 };
                }

                updateGame({
                    score: parseFloat(score) - parseFloat(item['price']),
                    coinsPerSecond: coinsPerSecond + (parseFloat(item['give_coins'] / 60 / 60)),
                    playerImprovements: playerNewImprovements
                });

                improvements[i]['price'] = improvements[i]['price'] * improvements[i]['price_coef'];
                improvements[i]['give_coins'] = improvements[i]['give_coins'] * improvements[i]['give_coins_coef'];
                improvements[i]['coins_mining_now'] = (improvements[i]['coins_mining_now'] || 0) + improvements[i]['give_coins'];
            }
        });

        console.warn(playerImprovements);
    }

    useEffect(() => {
        if(coinsPerSecond === 0){
            return;
        }

        console.warn(playerImprovements);

        let bodyData = {
            "improvements": playerImprovements,
            "coins_per_second": coinsPerSecond
        };

        console.log("bodyData is: ")
        console.log(bodyData)
        console.log("=======================")

        console.warn(playerImprovements);

        fetch(`https://game-api.pixie.fun/api/clicker/improvements/set/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(bodyData)
        }).then(response => response.json())
            .then(response => {
                console.log(response);

                console.warn(playerImprovements);
            });
    }, [coinsPerSecond]);


    useEffect(() => {
        console.warn(playerImprovements);

        if (socket && !isNaN(score) && score !== null && totalEarn !== null && !isNaN(totalEarn)) {
            const socket_data = JSON.stringify({
                "Score": parseFloat(score),
                "TelegramId": parseInt(userId),
                "Energy": parseInt(energy),
                "TotalEarn": parseFloat(totalEarn)
            });
            socket.send(socket_data);

            console.warn(playerImprovements);
        }
    }, [score, socket, userId, energy, totalEarn]);

    if (!isLoaded) return <Loader />;

    return (
        <div className="App">
            <div className="improve_container">
                <h1 className="improve_container-name">{t("improvements")}</h1>

                <div className="improve_container-row">
                    {improvements.map(item => (
                        <div key={item.id} className={"improve_container-row-item " + (parseInt(item.price) > parseInt(score) ? "disabled" : "")} onClick={() => { if (parseInt(item.price) < parseInt(score)) { buyImprovement(item.id) } }}>
                            <div className="improve_container-row-item-main">
                                <div className="improve_container-row-item-main-leftSide">
                                    <img src={rocketImage} alt="" />
                                </div>
                                <div className="improve_container-row-item-main-rightSide">
                                    <span className="improve_container-row-item-main-rightSide-name">{i18n.language === 'ru' ? item.name_ru : item.name_en}</span>
                                    <span className="improve_container-row-item-main-rightSide-description">{t('Profit per hour')}</span>
                                    <span className="improve_container-row-item-main-rightSide-coins">
                                        <img src={coinImage} alt="" />
                                        {item.coins_mining_now ? `${parseInt(item.coins_mining_now)} (+${parseInt(item.give_coins)})` : `+${parseInt(item.give_coins)}`}
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
                                        {parseInt(item.price)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Improvements;