import logo from './logo.svg';
import './App.css';
import {useEffect, useState} from "react";

function App() {
    const [score, setScore] = useState(0);
    const [valueForPlus, setValueForPlus] = useState(1);
    const [isClicked, setIsClicked] = useState(false);

    // Функция для обработки нажатия
    const handleClick = () => {
        setIsClicked(true);
        setScore(score + 1);
        setTimeout(() => setIsClicked(false), 100); // Убрать эффект через 100 мс
    };

    useEffect(() => {
        if(score <= 100){
            setValueForPlus(1);
        }else if(score <= 500){
            setValueForPlus(2);
        }else if(score <= 1000){
            setValueForPlus(3);
        }else if(score > 1000){
            setValueForPlus(4);
        }
    }, [score]);

    useEffect(() => {
        const interval = setInterval(() => {

            setScore(prevScore => prevScore + valueForPlus);
        }, 1000);

        return () => clearInterval(interval); // Очищаем интервал при размонтировании компонента
    }, [valueForPlus]);

    return (
    <div className="App">
        <div className="game-container">
            <span className="score">Score: <strong>{score}</strong> (+{valueForPlus}/sec)</span>
            <button className="clicker" onClick={handleClick} style={isClicked ? { boxShadow: 'inset 0px 0px 15px 0px #000' } : {}}>CLICK</button>
        </div>
    </div>
    );
}

export default App;
