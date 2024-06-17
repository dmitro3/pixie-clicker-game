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

import default_skin from "../Resources/images/human-free.png";

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
import skin_0 from "../Resources/images/skins/0.png";
import skin_1 from "../Resources/images/skins/1.png";
import skin_2 from "../Resources/images/skins/2.png";
import skin_3 from "../Resources/images/skins/3.png";
import skin_4 from "../Resources/images/skins/4.png";
import skin_5 from "../Resources/images/skins/5.png";
import skin_6 from "../Resources/images/skins/6.png";
import skin_7 from "../Resources/images/skins/7.png";
import skin_8 from "../Resources/images/skins/8.png";
import skin_9 from "../Resources/images/skins/9.png";
import skin_10 from "../Resources/images/skins/10.png";
import skin_11 from "../Resources/images/skins/11.png";
import skin_12 from "../Resources/images/skins/12.png";
import skin_13 from "../Resources/images/skins/13.png";
import skin_14 from "../Resources/images/skins/14.png";
import skin_15 from "../Resources/images/skins/15.png";
import skin_16 from "../Resources/images/skins/16.png";
import skin_17 from "../Resources/images/skins/17.png";
import skin_18 from "../Resources/images/skins/18.png";
import skin_19 from "../Resources/images/skins/19.png";
import skin_20 from "../Resources/images/skins/20.png";
import skin_21 from "../Resources/images/skins/21.png";
import skin_22 from "../Resources/images/skins/22.png";
import skin_23 from "../Resources/images/skins/23.png";
import skin_24 from "../Resources/images/skins/24.png";
import skin_25 from "../Resources/images/skins/25.png";
import skin_26 from "../Resources/images/skins/26.png";
import skin_27 from "../Resources/images/skins/27.png";

function Leaderboard() {
    const [leaderboardData, setLeaderboardData] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [userInLeaderboard, setUserInLeaderboard] = useState(false);
    const [curUser, setCuruser] = useState(null);

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
        fetch(`${process.env.REACT_APP_API_URL}/clicker/leaderboard/level/${userId}/get`)
            .then(response => response.json())
            .then(response => {
                setLeaderboardData(response.users);
                setCuruser(response.cur_user);

                (response.users).forEach(item => {
                    if(item.user_id === userId){
                        setUserInLeaderboard(true);
                    }
                });

                console.log("leaderboardData is " + userInLeaderboard)
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

    const skins_images = [
        skin_0,
        skin_1,
        skin_2,
        skin_3,
        skin_4,
        skin_5,
        skin_6,
        skin_7,
        skin_8,
        skin_9,
        skin_10,
        skin_11,
        skin_12,
        skin_13,
        skin_14,
        skin_15,
        skin_16,
        skin_17,
        skin_18,
        skin_19,
        skin_20,
        skin_21,
        skin_22,
        skin_23,
        skin_24,
        skin_25,
        skin_26,
        skin_27,
    ];

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
                            {/*<img src={pixieImages[user.user_id % 10]} alt="avatar" className="leaderboard-list_item-avatar"/>*/}
                            <div className="leaderboard-list_item-avatar-container">
                                <img src={user.skin_id ? skins_images[user.skin_id - 1] : default_skin} alt="avatar" className="leaderboard-list_item-avatar"/>
                            </div>
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

                    {userInLeaderboard ? '' :
                        <div className={"leaderboard-list_item fixed current"}>
                            <div className="leaderboard-list_item-avatar-container">
                                <img src={curUser.current_skin_id ? skins_images[curUser.current_skin_id - 1] : default_skin} alt="avatar" className="leaderboard-list_item-avatar"/>
                            </div>
                            <div className="leaderboard-list_item-info">
                                <span className="leaderboard-list_item-info-name">You</span>
                                <span className="leaderboard-list_item-info-balance">
                                    <img src={coinImage} alt="coin" className="leaderboard-list_item-info-balance-coin"/>
                                    {parseInt(curUser.total_earn).toLocaleString('en')}
                                </span>
                            </div>
                            <div className="leaderboard-list_item-rating">
                                +50
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}

export default Leaderboard;
