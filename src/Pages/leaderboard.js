import '../App.css';
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import avatarImage from "../Resources/images/avatar.jpg"
import coinImage from "../Resources/images/coin.svg"

function Leaderboard() {

    return (
        <div className="App">
            <div className="leaderboard-container">
                <div className="leaderboard-list">
                    <div className="leaderboard-list_item">
                        <img src={avatarImage} alt="avatar" className="leaderboard-list_item-avatar"/>
                        <div className="leaderboard-list_item-info">
                            <span className="leaderboard-list_item-info-name">Alex Alex</span>
                            <span className="leaderboard-list_item-info-balance">
                                <img src={coinImage} alt="coin" className="leaderboard-list_item-info-balance-coin"/>
                                88,888
                            </span>
                        </div>
                        <div className="leaderboard-list_item-rating">
                            1
                        </div>
                    </div>
                    <div className="leaderboard-list_item">
                        <img src={avatarImage} alt="avatar" className="leaderboard-list_item-avatar"/>
                        <div className="leaderboard-list_item-info">
                            <span className="leaderboard-list_item-info-name">Alex Alex</span>
                            <span className="leaderboard-list_item-info-balance">
                                <img src={coinImage} alt="coin" className="leaderboard-list_item-info-balance-coin"/>
                                88,888
                            </span>
                        </div>
                        <div className="leaderboard-list_item-rating">
                            1
                        </div>
                    </div>
                    <div className="leaderboard-list_item">
                        <img src={avatarImage} alt="avatar" className="leaderboard-list_item-avatar"/>
                        <div className="leaderboard-list_item-info">
                            <span className="leaderboard-list_item-info-name">Alex Alex</span>
                            <span className="leaderboard-list_item-info-balance">
                                <img src={coinImage} alt="coin" className="leaderboard-list_item-info-balance-coin"/>
                                88,888
                            </span>
                        </div>
                        <div className="leaderboard-list_item-rating">
                            1
                        </div>
                    </div>
                    <div className="leaderboard-list_item">
                        <img src={avatarImage} alt="avatar" className="leaderboard-list_item-avatar"/>
                        <div className="leaderboard-list_item-info">
                            <span className="leaderboard-list_item-info-name">Alex Alex</span>
                            <span className="leaderboard-list_item-info-balance">
                                <img src={coinImage} alt="coin" className="leaderboard-list_item-info-balance-coin"/>
                                88,888
                            </span>
                        </div>
                        <div className="leaderboard-list_item-rating">
                            1
                        </div>
                    </div>
                    <div className="leaderboard-list_item">
                        <img src={avatarImage} alt="avatar" className="leaderboard-list_item-avatar"/>
                        <div className="leaderboard-list_item-info">
                            <span className="leaderboard-list_item-info-name">Alex Alex</span>
                            <span className="leaderboard-list_item-info-balance">
                                <img src={coinImage} alt="coin" className="leaderboard-list_item-info-balance-coin"/>
                                88,888
                            </span>
                        </div>
                        <div className="leaderboard-list_item-rating">
                            1
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Leaderboard;
