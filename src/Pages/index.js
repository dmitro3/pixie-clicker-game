import '../App.css';
import {useContext, useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import coinImage from "../Resources/images/coin.svg"
import avatarImage from "../Resources/images/avatar.jpg"
import menu_firstImage from "../Resources/images/menu/first.svg"
import menu_secondImage from "../Resources/images/menu/second.svg"
import menu_thirdImage from "../Resources/images/menu/third.svg"
import menu_fourImage from "../Resources/images/menu/four.svg"
import GameContext from "../Context/GameContext";

function Index() {
    let { id } = useParams();
    sessionStorage.setItem("telegram_user_id", id);

    const { score, coinsPerClick, coinsPerSecond, updateGame } = useContext(GameContext);

    const [isClicked, setIsClicked] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [username, setUsername] = useState(false);

    const [clicks, setClicks] = useState([]);

    // Функция для обработки нажатия
    const handleClick = (event) => {
        const touch = event.changedTouches[0];
        
        const newItem = {
            id: Date.now(),
            x: touch.clientX,
            y: touch.clientY,
        };

        // console.log("click")

        setClicks(currentClicks => [...currentClicks, newItem]);

        setTimeout(() => {
            setClicks(currentClicks => currentClicks.filter(item => item.id !== newItem.id));
        }, 1000); // Удаляем элемент через 1 секунду

        setIsClicked(true);
        // setScore(score + coinsPerClick);
        updateGame({ score: score + coinsPerClick});

        setTimeout(() => setIsClicked(false), 100); // Убрать эффект через 100 мс
    };

    // if (!loaded) return <>Loading...</>

    return (
        <div className="App">
            <div>
                <div className="clicker" onTouchEnd={handleClick} style={
                    isClicked ? {boxShadow: '0px 0px 3px 20px rgba(217, 217, 217, 0.06)'} : {}
                }></div>
                {clicks.map(({ id, x, y }) => (
                    <div
                        key={id}
                        style={{
                            position: 'fixed',
                            left: x,
                            top: y,
                            opacity: 1,
                            animation: 'fly 1s forwards',
                            pointerEvents: 'none',
                            color:'#fff',
                            fontFamily: 'Pixel',
                            fontSize: '20px'
                        }}
                    >
                        {coinsPerClick}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Index;
