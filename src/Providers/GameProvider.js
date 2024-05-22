import React, { useState, useMemo } from 'react';
import GameContext from '../Context/GameContext';

const GameProvider = ({ children }) => {
    // console.log("Game provider loaded");

    const [gameState, setGameState] = useState({
        score: null,
        coinsPerClick: null,
        coinsPerSecond: null,
        playerImprovements:{},
        energy:null,
        maxEnergy:null,
        totalEarn:null
    });

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