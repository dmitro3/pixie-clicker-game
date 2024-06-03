import '../App.css';
import {useContext, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import avatarImage from "../Resources/images/avatar.jpg"
import coinImage from "../Resources/images/coin.svg"
import Loader from "../Components/Loader";
import WebAppUser from "@twa-dev/sdk";
import GameContext from "../Context/GameContext";
import {useTranslation} from "react-i18next";
import coinsImage from "../Resources/images/leaderboard-coins.svg"

import pixie_0 from "../Resources/images/pixie/0.png"
import pixie_1 from "../Resources/images/pixie/1.png"
import pixie_2 from "../Resources/images/pixie/2.png"
import pixie_3 from "../Resources/images/pixie/3.png"
import pixie_4 from "../Resources/images/pixie/4.png"
import pixie_5 from "../Resources/images/pixie/5.png"
import pixie_6 from "../Resources/images/pixie/6.png"
import pixie_7 from "../Resources/images/pixie/7.png"
import pixie_8 from "../Resources/images/pixie/8.png"
import pixie_9 from "../Resources/images/pixie/9.png"

function Leaderboard() {
    const [leaderboardData, setLeaderboardData] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    const { userId, level } = useContext(GameContext);

    const { t, i18n } = useTranslation();

    const pixieImages = [
        pixie_0,
        pixie_1,
        pixie_2,
        pixie_3,
        pixie_4,
        pixie_5,
        pixie_6,
        pixie_7,
        pixie_8,
        pixie_9,
    ];

    useEffect(() => {
        // fetch(`https://game-api.pixie.fun/api/clicker/leaderboard/get`)
        fetch(`https://game-api.pixie.fun/api/clicker/leaderboard/level/${userId}/get`)
            .then(response => response.json())
            .then(response => {
                setLeaderboardData(response.users);
                setIsLoaded(true);
            });
    }, []);

    function nicknameFormat(first_name, last_name, username){
        let nickname = "";
        if(first_name !== 'None' && first_name !== null){
            nickname = first_name;
        }
        if(last_name !== 'None' && last_name !== null){
            if(nickname !== ""){
                nickname = nickname + " " + last_name;
            }else{
                nickname = last_name;
            }
        }

        if(nickname === ""){
            nickname = username;

            if(nickname === ""){
                nickname = "Hidden username";
            }
        }

        return nickname;
    }

    if(!isLoaded) return <Loader />;

    return (
        <div className="App">
            <div className="leaderboard-container">
                <img src={coinsImage} alt="" className="leaderboard-header-image" />
                {/*<h1 className="leaderboard-container_name">{t('Leaderboard')}</h1>*/}
                <h1 className="leaderboard-container_name">Level {level} {t('Leaderboard')}</h1>
                <div className="leaderboard-list">
                    {leaderboardData.map((user, i) => (
                        <div className={"leaderboard-list_item " + (user.user_id === userId ? 'current' : '')}>
                            {/*<img src={user.avatar_url || avatarImage} alt="avatar" className="leaderboard-list_item-avatar"/>*/}
                            <img src={pixieImages[user.user_id % 10]} alt="avatar" className="leaderboard-list_item-avatar"/>
                            <div className="leaderboard-list_item-info">
                                <span className="leaderboard-list_item-info-name">{nicknameFormat(user.first_name, user.last_name, user.username)}</span>
                                <span className="leaderboard-list_item-info-balance">
                                <img src={coinImage} alt="coin" className="leaderboard-list_item-info-balance-coin"/>
                                    {parseInt(user.total_earn).toLocaleString('en')}
                            </span>
                            </div>
                            <div className="leaderboard-list_item-rating">
                                {i + 1}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Leaderboard;
