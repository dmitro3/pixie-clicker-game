import '../App.css';
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import coinImage from "../Resources/images/coin.svg"
import avatarImage from "../Resources/images/avatar.jpg"
import menu_firstImage from "../Resources/images/menu/first.svg"
import menu_secondImage from "../Resources/images/menu/second.svg"
import menu_thirdImage from "../Resources/images/menu/third.svg"
import menu_fourImage from "../Resources/images/menu/four.svg"

function Index() {
    let { id } = useParams();

    const [score, setScore] = useState(0);
    const [coinsPerClick, setCoinsPerClick] = useState(1);
    const [coinsPerSecond, setCoinsPerSecond] = useState(1);
    const [isClicked, setIsClicked] = useState(false);
    const [socket, setSocket] = useState(null);
    const [loaded, setLoaded] = useState(false);

    const [clicks, setClicks] = useState([]);

    // Функция для обработки нажатия
    const handleClick = (event) => {
        const touch = event.changedTouches[0];
        
        const newItem = {
            id: Date.now(),
            x: touch.clientX,
            y: touch.clientY,
        };

        setClicks(currentClicks => [...currentClicks, newItem]);

        setTimeout(() => {
            setClicks(currentClicks => currentClicks.filter(item => item.id !== newItem.id));
        }, 1000); // Удаляем элемент через 1 секунду

        setIsClicked(true);
        setScore(score + coinsPerClick);
        setTimeout(() => setIsClicked(false), 100); // Убрать эффект через 100 мс
    };

    useEffect(() => {
        fetch(`https://game-api.pixie.fun/api/clicker/user/get/${id}`)
            .then(response => response.json())
            .then(response => {
                console.log(response.user);
                setCoinsPerClick(response.user.coins_per_click);
                setCoinsPerSecond(response.user.coins_per_second);
                setScore(response.user.balance);

                setLoaded(true);
            });
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {

            setScore(prevScore => prevScore + coinsPerSecond);
        }, 1000);

        return () => clearInterval(interval); // Очищаем интервал при размонтировании компонента
    }, [coinsPerSecond]);

    useEffect(() => {
        // Создаем WebSocket соединение при загрузке компонента
        // const ws = new WebSocket("ws://127.0.0.1:8080");
        const ws = new WebSocket("wss://game-api.pixie.fun:8080");

        // Устанавливаем обработчики событий для WebSocket соединения
        ws.onopen = () => {
            console.log("WebSocket соединение установлено");
            setSocket(ws);
        };

        ws.onclose = () => {
            console.log("WebSocket соединение закрыто");
        };

        return () => {
            // Закрываем WebSocket соединение при размонтировании компонента
            ws.close();
        };
    }, [loaded]);

    useEffect(() => {
        if (socket && score != 0) {
            socket.send(JSON.stringify({ "Score":score, "TelegramId":parseInt(id) }));
        }
    }, [score, socket]);

    if (!loaded) return <>Loading...</>

    return (
        <div className="App">
            <div className="game-container_header">
                <div className="game-container_header-leftSide">
                    <img src={avatarImage} alt=""/>
                    <span className="game-container_header-leftSide-name">
                            John Doe
                        </span>
                </div>
            </div>
            <div className="game-container">
                <div className="game-container_stats">
                    <div className="game-container_stats-item">
                        <span className="game-container_stats-item-name">Earn per tap</span>
                        <span className="game-container_stats-item-value">
                            <img src={coinImage} alt=""/>
                            +{coinsPerClick}
                        </span>
                    </div>
                    <div className="game-container_stats-item">
                        <span className="game-container_stats-item-name">Coins to level up</span>
                        <span className="game-container_stats-item-value">0</span>
                    </div>
                    <div className="game-container_stats-item">
                        <span className="game-container_stats-item-name">Profit per hour</span>
                        <span className="game-container_stats-item-value">
                            <img src={coinImage} alt=""/>
                            0
                        </span>
                    </div>
                </div>
                <span className="score">
                    <img src={coinImage} alt=""/>
                    {score}
                </span>
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

            <div className="bottom_menu">
                <div className="bottom_menu-container">
                    <div className="bottom_menu-item">
                        <img src={menu_firstImage} alt=""/>
                    </div>
                    <div className="bottom_menu-item">
                        <img src={menu_secondImage} alt=""/>
                    </div>
                    <div className="bottom_menu-item">
                        <img src={menu_thirdImage} alt=""/>
                    </div>
                    <div className="bottom_menu-item">
                        <img src={menu_fourImage} alt=""/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Index;
