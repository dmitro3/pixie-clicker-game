import '../App.css';
import {useContext, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import avatarImage from "../Resources/images/avatar.jpg"
import coinImage from "../Resources/images/coin.svg"
import Loader from "../Components/Loader";
import WebAppUser from "@twa-dev/sdk";
import GameContext from "../Context/GameContext";
import {useTranslation} from "react-i18next";

function Leaderboard() {
    const [leaderboardData, setLeaderboardData] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    const { userId } = useContext(GameContext);

    const { t, i18n } = useTranslation();

    useEffect(() => {
        fetch(`https://game-api.pixie.fun/api/clicker/leaderboard/get`)
            .then(response => response.json())
            .then(response => {
                setLeaderboardData(response.users);
                setIsLoaded(true);
            });
    }, []);

    if(!isLoaded) return <Loader />;

    return (
        <div className="App">
            <div className="leaderboard-container">
                <h1 className="leaderboard-container_name">{t('Leaderboard')}</h1>
                <div className="leaderboard-list">
                    {leaderboardData.map((user, i) => (
                        <div className={"leaderboard-list_item " + (user.user_id === userId ? 'current' : '')}>
                            <img src={user.avatar_url || avatarImage} alt="avatar" className="leaderboard-list_item-avatar"/>
                            <div className="leaderboard-list_item-info">
                                <span className="leaderboard-list_item-info-name">{user.first_name ? user.first_name + " " + (user.last_name === 'None' ? '' : user.last_name) : user.username || 'Hidden username'}</span>
                                <span className="leaderboard-list_item-info-balance">
                                <img src={coinImage} alt="coin" className="leaderboard-list_item-info-balance-coin"/>
                                    {parseInt(user.total_earn)}
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
