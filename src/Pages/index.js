import '../App.css';
import {useContext, useEffect, useState} from "react";
import {NavLink, useParams} from "react-router-dom";
import energyIcon from "../Resources/images/energy_icon.svg"
import rocketIcon from "../Resources/images/rocket.svg"
import GameContext from "../Context/GameContext";
import WebApp from "@twa-dev/sdk";
import WebAppUser from "@twa-dev/sdk";
import {useTranslation} from "react-i18next";

function Index() {
    const { score, coinsPerClick, energy, totalEarn, maxEnergy, updateGame, userId, level } = useContext(GameContext);
    const [isClicked, setIsClicked] = useState(false);
    const [clicks, setClicks] = useState([]);

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

    const handleClick = (event) => {
        let coinsPerClickNow = coinsPerClick;
        let isMinusEnergy = true;

        if(energy < coinsPerClick){
            return;
            // coinsPerClickNow = 1;
            // isMinusEnergy = false;
        }

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

    return (
        <div className="App">
            <div>
                <div className="level-content">
                    <span className="level-content-value">Level: {levelValue}</span>
                    <div className="level-line-container">
                        <div className="level-line" style={{width:levelPercents + '%'}}></div>
                    </div>
                </div>

                <div className={"clicker " + (energy >= coinsPerClick ? '' : 'disabled')} onTouchEnd={handleClick} style={
                // <div className={"clicker"} onTouchEnd={handleClick} style={
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
                    <span className="admin-text">{WebAppUser.initDataUnsafe && WebAppUser.initDataUnsafe.user ? WebAppUser.initDataUnsafe.user.language_code
                : ''}</span> : ''}

                {userId === 463600889 ?
                    <span className="admin-text">{WebAppUser.initDataUnsafe && WebAppUser.initDataUnsafe.user ? WebAppUser.initDataUnsafe.user.language_code
                : ''}</span> : ''}
            </div>
        </div>
    );
}

export default Index;
