import '../App.css';
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";

function Index() {
    let { id } = useParams();

    const [score, setScore] = useState(0);
    const [coinsPerClick, setCoinsPerClick] = useState(1);
    const [coinsPerSecond, setCoinsPerSecond] = useState(1);
    const [isClicked, setIsClicked] = useState(false);
    const [socket, setSocket] = useState(null);
    const [loaded, setLoaded] = useState(false);

    // Функция для обработки нажатия
    const handleClick = () => {
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

            setScore(prevScore => prevScore + coinsPerClick);
        }, 1000);

        return () => clearInterval(interval); // Очищаем интервал при размонтировании компонента
    }, [coinsPerClick]);

    useEffect(() => {
        // Создаем WebSocket соединение при загрузке компонента
        // const ws = new WebSocket("ws://127.0.0.1:8080");
        const ws = new WebSocket("wss://195.35.3.194:8080");

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
            <div className="game-container">
                <span className="score">Score: <strong>{score}</strong> (+{coinsPerClick}/sec)</span>
                <button className="clicker" onClick={handleClick} style={isClicked ? { boxShadow: 'inset 0px 0px 15px 0px #000' } : {}}>CLICK</button>
            </div>
        </div>
    );
}

export default Index;
