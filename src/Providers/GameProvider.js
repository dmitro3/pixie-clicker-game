import React, { useState, useMemo } from 'react';
import GameContext from '../Context/GameContext';

const GameProvider = ({ children }) => {
    // console.log("Game provider loaded");

    const [gameState, setGameState] = useState({
        score: 0,
        coinsPerClick: 0,
        coinsPerSecond: 0,
        playerImprovements:{},
        energy:0,
        maxEnergy:0,
        totalEarn:0
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