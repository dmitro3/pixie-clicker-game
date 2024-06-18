import '../App.css';
import {useContext, useEffect, useRef, useState} from "react";
import {NavLink, useParams} from "react-router-dom";
import energyIcon from "../Resources/images/energy_icon.svg"
import rocketIcon from "../Resources/images/rocket.svg"
import GameContext from "../Context/GameContext";
import WebApp from "@twa-dev/sdk";
import WebAppUser from "@twa-dev/sdk";
import {useTranslation} from "react-i18next";
import stoneCoin1 from "../Resources/images/coins/stone-1.svg";
import stoneCoin2 from "../Resources/images/coins/stone-2.svg";
import woodenCoin1 from "../Resources/images/coins/wooden-1.svg";
import bronzeCoin1 from "../Resources/images/coins/bronze-1.svg";
import silverCoin1 from "../Resources/images/coins/silver-1.svg";
import goldenCoin1 from "../Resources/images/coins/gold-1.svg";
import goldenCoin2 from "../Resources/images/coins/gold-2.svg";
import styled from "styled-components";
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

import coinImage from "../Resources/images/coin.svg";

import default_skin from "../Resources/images/human-free.png";

function Index() {
    const { score, coinsPerClick, energy, totalEarn, maxEnergy, updateGame, token, userId, level, coinId, coinImageId, skinImageId, coinShadowColor } = useContext(GameContext);
    const [isClicked, setIsClicked] = useState(false);
    const [clicks, setClicks] = useState([]);
    const [clicksCount, setClicksCount] = useState(1);

    const [vibrateCheckText, setVibrateCheckText] = useState("Кликни для проверки");

    const [levelPercents, setLevelPercents] = useState(0);
    const [levelValue, setLevelValue] = useState(0);

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
        console.log("coin image id is " + coinImageId)
        console.log("skinImageId id is " + skinImageId)

        levels_score.forEach((level, i) => {
            if(parseFloat(levels_score[i][0]) <= parseFloat(totalEarn) && parseFloat(levels_score[i][1]) >= parseFloat(totalEarn)){
                setLevelPercents(totalEarn / (levels_score[i][1] / 100));

                updateGame({
                    level: parseInt(i)
                });

                setLevelValue(i);
            }
        });
    }, []);

    useEffect(() => {
        levels_score.forEach((level, i) => {
            if(parseFloat(levels_score[i][0]) <= parseFloat(totalEarn) && parseFloat(levels_score[i][1]) >= parseFloat(totalEarn)){
                setLevelPercents(totalEarn / (levels_score[i][1] / 100));

                updateGame({
                    level: parseInt(i)
                });

                setLevelValue(i);
            }
        });
    }, [totalEarn]);

    const { t, i18n } = useTranslation();

    const timer = useRef(null);

    const handleClick = (event) => {
        let coinsPerClickNow = coinsPerClick;
        let isMinusEnergy = true;

        if(energy < coinsPerClick){
            return;
            // coinsPerClickNow = 1;
            // isMinusEnergy = false;
        }

        if (timer.current) {
            clearTimeout(timer.current);
        }

        // Устанавливаем новый таймер
        timer.current = setTimeout(() => {
            sendRequest(clicksCount);
            setClicksCount(1);
        }, 2000); // Задержка в 3 секунды

        setClicksCount(clicksCount + 1);

        console.log("clicks count is " + clicksCount)

        if(WebApp){
            WebApp.HapticFeedback.impactOccurred('medium');
        }
        
        const touch = event.changedTouches[0];
        
        const newItem = {
            id: Date.now(),
            x: touch.clientX,
            y: touch.clientY,
            coinsPerClickNow:coinsPerClickNow
        };

        setClicks(currentClicks => [...currentClicks, newItem]);

        setTimeout(() => {
            setClicks(currentClicks => currentClicks.filter(item => item.id !== newItem.id));
        }, 1000); // Удаляем элемент через 1 секунду

        setIsClicked(true);
        // setScore(score + coinsPerClick);
        updateGame({
            score: score + coinsPerClickNow,
            energy: energy - (isMinusEnergy ? coinsPerClick : 0),
            totalEarn: totalEarn + coinsPerClickNow
        });

        setTimeout(() => setIsClicked(false), 100); // Убрать эффект через 100 мс
    };

    function sendRequest(clicks_count){
        let date_now_obj = new Date();
        let date_now_timestamp = date_now_obj.getTime();
        date_now_timestamp = parseInt(date_now_timestamp) / 1000;
        date_now_timestamp = parseInt(date_now_timestamp) - 2;

        let data = {
            "clicks_count":clicks_count,
            "timestamp":date_now_timestamp
        };

        fetch(`${process.env.REACT_APP_API_URL}/v2/tap`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'auth-api-token': token
            },
            body: JSON.stringify(data)
        }).then(response => response.json())
            .then(response => {
                date_now_obj = new Date();
                date_now_timestamp = parseInt(parseInt(date_now_obj.getTime()) / 1000);
                let diff_timestamps = date_now_timestamp - response.timestamp_now;
                console.log("Разница в секундах " + diff_timestamps);
                console.log("Разница в секундах сервер " + response.timestamp_diff);

                updateGame({
                    energy: parseInt(response.current_energy),
                    score: parseFloat(response.balance)
                })
                console.log(response);
            });
    }

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

    // const StyledClicker = styled.div`
    //     width: 70vw;
    //     height: 70vw;
    //     margin: 0 auto;
    //     outline: none;
    //     border: none;
    //     border-radius: 50%;
    //     background-image: url(${"Resources/images/clicker-background-default.svg"});
    //     background-position: center;
    //     background-size: 102%;
    //     box-shadow: 0px 0px 90px 0px #90a3b0;
    //     user-select: none;
    //     -webkit-user-select: none;
    //     -moz-user-select: none;
    //     -ms-user-select: none;
    //     display: flex;
    //     align-items: center;
    //     justify-content: center;
    //     box-shadow: ${isClicked ? ('0px 0px 110px 0px ' + coinShadowColor) : ('0px 0px 90px 0px ' + coinShadowColor)};
    //     background-image: url(${coins_images[coinImageId]})
    // `;

    let afterStyles = `
        .clicker::after{
            content: "";
            width: 190px;
            height: 190px;
            display: block;
            background-image: url(${!isNaN(skinImageId) ? skins_images[skinImageId] : default_skin});
            background-repeat: no-repeat;
            background-size: contain;
            background-position: center center;
        }
    `

    return (
        <div className="App">
            <style>{afterStyles}</style>
            <div>
                <div className="level-content">
                    <div className="level-content-level">
                        <span className="level-content-value">Level: {levelValue}</span>
                        <NavLink to="/leaderboard" className="level-content-leaderboard">Leaderboard ></NavLink>
                    </div>
                    <div className="level-line-container">
                        <div className="level-line" style={{width:levelPercents + '%'}}></div>
                    </div>
                </div>

                {!isNaN(coinImageId) ?
                    <div className={"clicker " + (energy >= coinsPerClick ? '' : 'disabled')} onTouchEnd={handleClick} style={{
                        boxShadow: isClicked ? ('0px 0px 110px 0px ' + coinShadowColor) : ('0px 0px 90px 0px ' + coinShadowColor),
                        backgroundImage: `url(${coins_images[coinImageId]})`
                    }}></div>
                :
                    <div className={"clicker " + (energy >= coinsPerClick ? '' : 'disabled')} onTouchEnd={handleClick} style={
                        isClicked ? {boxShadow: '0px 0px 110px 0px #AD5519'} : {}
                    }></div>
                }
                {clicks.map(({ id, x, y, coinsPerClickNow }) => (
                    <div className="tap-value-with-coin-image"
                        key={id}
                        style={{
                            position: 'fixed',
                            left: x,
                            top: y,
                            opacity: 1,
                            animation: 'fly 1.5s forwards',
                            pointerEvents: 'none',
                            color:'#fff',
                            fontFamily: 'Pixel',
                            fontSize: '28px'
                        }}
                    >
                        <img src={coinImage} alt=""/>
                        {coinsPerClickNow}
                    </div>
                ))}

                <div className="energy_and_boost">
                    <div className="energy_container">
                        <img src={energyIcon} alt=""/>
                        {energy}/{maxEnergy}
                    </div>

                    <NavLink to="/boosts" className="boost_button">
                        <img src={rocketIcon} alt=""/>
                        boost
                    </NavLink>
                </div>

                {userId === 875591451 ?
                    <span className="admin-text">{WebAppUser.initDataUnsafe && WebAppUser.initDataUnsafe.user ? WebAppUser.initDataUnsafe.user.language_code
                : ''}</span> : ''}
            </div>
        </div>
    );
}

export default Index;
