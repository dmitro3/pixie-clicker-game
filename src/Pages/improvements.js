import '../App.css';
import {useContext, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import avatarImage from "../Resources/images/avatar.jpg"
import coinImage from "../Resources/images/coin.svg"
import rocketImage from "../Resources/images/rocket.svg"
import GameContext from "../Context/GameContext";

function Improvements() {
    const { score, coinsPerClick, coinsPerSecond, playerImprovements, updateGame } = useContext(GameContext);

    const [improvements, setImprovements] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    let id = sessionStorage.telegram_user_id;

    useEffect(() => {
        fetch(`https://game-api.pixie.fun/api/clicker/improvements/get`)
            .then(response => response.json())
            .then(response => {
                let improvements = response.improvements;
                improvements.forEach((item, i) => {
                    if(playerImprovements['data'][item.id]){
                        for(let level_iteration = 2; level_iteration <= playerImprovements['data'][item.id]['level']; level_iteration++){
                            improvements[i]['coins_mining_now'] = (improvements[i]['coins_mining_now'] || 0) + improvements[i]['give_coins'];

                            improvements[i]['price'] = improvements[i]['price'] * improvements[i]['price_coef'];
                            improvements[i]['give_coins'] = improvements[i]['give_coins'] * improvements[i]['give_coins_coef'];
                        }
                    }
                });

                setImprovements(improvements);
                setIsLoaded(true);


                console.log(playerImprovements)

            });
    }, []);

    function buyImprovement(id){
        improvements.forEach((item, i) => {
            if(item['id'] == id){
                let playerNewImprovements = playerImprovements;
                if(playerNewImprovements['data'][item.id]){
                    playerNewImprovements['data'][item.id]['level'] += 1;
                }else{
                    playerNewImprovements['data'][item.id] = {"level":2};
                }

                updateGame({
                    playerImprovements: playerNewImprovements,
                    coinsPerSecond: coinsPerSecond + (parseFloat(improvements[i]['give_coins'] / 60 / 60)),
                    score: parseFloat(score) - parseFloat(improvements[i]['price'])
                });

                console.log("coinsPerSecond is: " + coinsPerSecond)

                improvements[i]['price'] = improvements[i]['price'] * improvements[i]['price_coef'];
                improvements[i]['give_coins'] = improvements[i]['give_coins'] * improvements[i]['give_coins_coef'];
                improvements[i]['coins_mining_now'] = (improvements[i]['coins_mining_now'] || 0) + improvements[i]['give_coins'];
            }
        });

        console.log(playerImprovements)
        console.log(id)

        fetch(`https://game-api.pixie.fun/api/clicker/improvements/set/${telegram_user_id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(playerImprovements)
        }).then(response => response.json())
            .then(response => {
                console.log(response);
            })
    }

    if(!isLoaded) return <>Загрузка...</>;

    return (
        <div className="App">
            <div className="improve_container">
                <h1 className="improve_container-name">Майнинг</h1>

                <div className="improve_container-row">
                    {improvements.map(item => (
                        <div className={"improve_container-row-item " + (parseInt(item.price) > parseInt(score) ? "disabled" : "")} onClick={() => {if(parseInt(item.price) < parseInt(score)){buyImprovement(item.id)} }}>
                            <div className="improve_container-row-item-main">
                                <div className="improve_container-row-item-main-leftSide">
                                    <img src={rocketImage} alt=""/>
                                </div>
                                <div className="improve_container-row-item-main-rightSide">
                                    <span className="improve_container-row-item-main-rightSide-name">{item.name_ru}</span>
                                    <span className="improve_container-row-item-main-rightSide-description">Прибыль в час</span>
                                    <span className="improve_container-row-item-main-rightSide-coins">
                                    <img src={coinImage} alt=""/>
                                        {item.coins_mining_now ? `${parseInt(item.coins_mining_now)} (+${parseInt(item.give_coins)})` : `+${parseInt(item.give_coins)}`}
                                </span>
                                </div>
                            </div>
                            <div className="improve_container-row-item-bottom">
                                <div className="improve_container-row-item-bottom-currentLevel">
                                    <span className="improve_container-row-item-bottom-currentLevel-text">
                                        lvl {playerImprovements['data'][item.id] ? playerImprovements['data'][item.id]['level'] : "1" }
                                    </span>
                                </div>
                                <div className="improve_container-row-item-bottom-price">
                                <span className="improve_container-row-item-bottom-price-text">
                                    <img src={coinImage} alt=""/>
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
