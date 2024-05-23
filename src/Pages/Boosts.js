import '../App.css';
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import avatarImage from "../Resources/images/avatar.jpg";
import coinImage from "../Resources/images/coin.svg";
import rocketImage from "../Resources/images/rocket.svg";
import GameContext from "../Context/GameContext";
import WebSocketContext from "../Context/WebSocketContext";
import Loader from "../Components/Loader";

function Boosts() {
    const { score, coinsPerClick, energy, totalEarn, coinsPerSecond, playerImprovements, updateGame } = useContext(GameContext);
    const socket = useContext(WebSocketContext);
    const [clickBoostPrice, setClickBoostPrice] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    const telegram = window.Telegram.WebApp;
    let telegramUserId = null;
    if(telegram){
        telegramUserId = telegram.user.id;
        console.log("Telegram user ID взяли в telegram object! " + telegramUserId)
    }

    useEffect(() => {
        setClickBoostPrice(coinsPerClick * 1000);

    }, []);

    function buyImprovement(id) {
        improvements.forEach((item, i) => {
            if (item['id'] === id) {
                let playerNewImprovements = playerImprovements;
                if (playerNewImprovements['data'][item.id]) {
                    playerNewImprovements['data'][item.id]['level'] += 1;
                } else {
                    playerNewImprovements['data'][item.id] = { "level": 2 };
                }

                updateGame({
                    score: parseFloat(score) - parseFloat(improvements[i]['price']),
                    coinsPerSecond: coinsPerSecond + (parseFloat(improvements[i]['give_coins'] / 60 / 60)),
                    playerImprovements: playerNewImprovements
                });

                console.log("Сработал updateGame | score is " + score);
                console.log("coinsPerSecond is: " + coinsPerSecond);

                improvements[i]['price'] = improvements[i]['price'] * improvements[i]['price_coef'];
                improvements[i]['give_coins'] = improvements[i]['give_coins'] * improvements[i]['give_coins_coef'];
                improvements[i]['coins_mining_now'] = (improvements[i]['coins_mining_now'] || 0) + improvements[i]['give_coins'];
            }
        });

        console.log(playerImprovements);
        console.log(id);

        let bodyData = {
            "improvements": playerImprovements,
            "coins_per_second": coinsPerSecond
        };

        fetch(`https://game-api.pixie.fun/api/clicker/improvements/set/${telegramUserId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(bodyData)
        }).then(response => response.json())
            .then(response => {
                console.log(response);
            });
    }

    useEffect(() => {
        if (socket && score !== null && score !== undefined) {
            const socket_data = JSON.stringify({
                "Score": parseFloat(score),
                "TelegramId": parseInt(telegramUserId),
                "Energy": parseInt(energy),
                "TotalEarn": parseFloat(totalEarn)
            });

            socket.send(socket_data);
            console.log("Отправили пакет на сервер");
            console.log(socket_data);
        }
    }, [score, socket, telegramUserId, energy, totalEarn]);

    if (!isLoaded) return <Loader />;

    return (
        <div className="App">
            <div className="improve_container">
                <h1 className="improve_container-name">Бусты</h1>

                <div className="improve_container-row">
                    {improvements.map(item => (
                        <div key={item.id} className={"improve_container-row-item " + (parseInt(item.price) > parseInt(score) ? "disabled" : "")} onClick={() => { if (parseInt(item.price) < parseInt(score)) { buyImprovement(item.id) } }}>
                            <div className="improve_container-row-item-main">
                                <div className="improve_container-row-item-main-leftSide">
                                    <img src={rocketImage} alt="" />
                                </div>
                                <div className="improve_container-row-item-main-rightSide">
                                    <span className="improve_container-row-item-main-rightSide-name">{item.name_ru}</span>
                                    <span className="improve_container-row-item-main-rightSide-description">Прибыль в час</span>
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

export default Boosts;