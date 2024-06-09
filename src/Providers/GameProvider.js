import React, {useState, useMemo, useEffect} from 'react';
import GameContext from '../Context/GameContext';
import WebAppUser from "@twa-dev/sdk";


const GameProvider = ({ children }) => {
    // console.log("Game provider loaded");

    const isRunningInTelegram = () => {
        return typeof WebAppUser.plaftorm === 'undefined' ? false : true;
    };

    // Function to check if the app is running on localhost
    const isLocalhost = () => {
        return window.location.hostname === 'localhost' && window.location.port === '3000';
    };

    const [gameState, setGameState] = useState({
        score: null,
        coinsPerClick: null,
        coinsPerSecond: null,
        playerImprovements:{},
        energy:null,
        maxEnergy:null,
        totalEarn:null,
        userId: (!isRunningInTelegram() && isLocalhost()) ? 875591451 : WebAppUser.initDataUnsafe.user.id,
        level:null,
        coinId:null,
        skinId:null,
        coinImageId:null,
        skinImageId:null,
        skinEarningBoost:0,
        skinPerTapBoost:0,
        energyBarBoost:0
    });

    // useEffect(() => {
    //     console.log("=========================")
    //     console.log(isRunningInTelegram())
    //     console.log(isLocalhost())
    //     console.log(isLocalhost())
    //     console.log("=========================")
    // }, []);

    // Функция для обновления состояния
    // const updateGame = (updates) => {
    //     setGameState((prevState) => ({ ...prevState, ...updates }));
    // };

    const updateGame = (updates) => {
        setGameState((prevState) => {
            if (typeof updates === 'function') {
                return { ...prevState, ...updates(prevState) };
            }
            return { ...prevState, ...updates };
        });
    };

    const value = useMemo(() => ({
        ...gameState,
        updateGame,
    }), [gameState]);

    return (
        <GameContext.Provider value={value}>
            {children}
        </GameContext.Provider>
    );
};

export default GameProvider;