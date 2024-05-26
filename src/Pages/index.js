import '../App.css';
import {useContext, useEffect, useState} from "react";
import {NavLink, useParams} from "react-router-dom";
import energyIcon from "../Resources/images/energy_icon.svg"
import rocketIcon from "../Resources/images/rocket.svg"
import GameContext from "../Context/GameContext";
import WebApp from "@twa-dev/sdk";
import WebAppUser from "@twa-dev/sdk";

function Index() {
    const { score, coinsPerClick, energy, totalEarn, maxEnergy, updateGame, userId } = useContext(GameContext);
    const [isClicked, setIsClicked] = useState(false);
    const [clicks, setClicks] = useState([]);

    const [vibrateCheckText, setVibrateCheckText] = useState("Кликни для проверки");

    // const [levelPercents, setLevelPercents] = useState(0);

    // const levels_score = [
    //     [0, 10000],
    //     [10001, 20000],
    //     [20001, 30000],
    //     [30001, 50000],
    //     [50001, 70000],
    //     [70001, 90000],
    //     [90001, 110000],
    //     [110001, 150000],
    //     [150001, 190000],
    //     [190001, 250000],
    //     [250001, 350000],
    //     [350001, 450000],
    //     [450001, 550000],
    //     [550001, 650000],
    //     [650001, 750000],
    //     [750001, 1000000],
    //     [1000001, 1250000],
    //     [1250001, 1500000],
    //     [1500001, 1750000],
    //     [1750001, 2000000],
    //     [2000001, 3000000],
    //     [3000001, 4000000],
    //     [4000001, 5000000],
    //     [5000001, 6000000],
    //     [6000001, 7000000],
    //     [7000001, 8000000],
    //     [8000001, 9000000],
    //     [9000001, 10000000],
    // ];

    // useEffect(() => {
    //     let iteraion_number = 0;
    //     let level_score_min = 0;
    //     let level_score_max = 0;
    //
    //     levels_score.forEach((item, i) => {
    //         if(levels_score[0] >= score && levels_score[1] <= score){
    //             iteraion_number = i;
    //             level_score_min = levels_score[0];
    //             level_score_max = levels_score[1];
    //         }
    //     });
    //
    //     let percents = level_score_max / 100 * (score - level_score_min);
    //     setLevelPercents(percents);
    // }, []);

    const handleClick = (event) => {
        if(WebApp){
            WebApp.HapticFeedback.impactOccurred('medium');
        }

        let coinsPerClickNow = coinsPerClick;
        let isMinusEnergy = true;

        if(energy < coinsPerClick){
            coinsPerClickNow = 1;
            isMinusEnergy = false;
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

    return (
        <div className="App">
            <div>
                {/*<div className="level-content">*/}
                {/*    <span className="level-content-value">Level: 1</span>*/}
                {/*    <div className="level-line-container">*/}
                {/*        <div className="level-line" style={{width:levelPercents + '%'}}></div>*/}
                {/*    </div>*/}
                {/*</div>*/}

                {/*<div className={"clicker " + (energy >= coinsPerClick ? '' : 'disabled')} onTouchEnd={handleClick} style={*/}
                <div className={"clicker"} onTouchEnd={handleClick} style={
                    // isClicked ? {boxShadow: '0px 0px 3px 20px rgba(217, 217, 217, 0.06)'} : {}
                    isClicked ? {boxShadow: '0px 0px 110px 0px #90a3b0'} : {}
                }></div>
                {clicks.map(({ id, x, y, coinsPerClickNow }) => (
                    <div
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
                <span className="admin-text">{WebAppUser.initDataUnsafe && WebAppUser.initDataUnsafe.user ? WebAppUser.initDataUnsafe.user.language_code : ''}</span> : ''}
            </div>
        </div>
    );
}

export default Index;
