import '../App.css';
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import avatarImage from "../Resources/images/avatar.jpg"
import coinImage from "../Resources/images/coin.svg"

function Leaderboard() {
    const [leaderboardData, setLeaderboardData] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        fetch(`https://game-api.pixie.fun/api/clicker/leaderboard/get`)
            .then(response => response.json())
            .then(response => {
                setLeaderboardData(response.users);
                setIsLoaded(true);
            });
    }, []);

    if(!isLoaded) return <>Загрузка...</>;

    return (
        <div className="App">
            <div className="leaderboard-container">
                <h1 className="leaderboard-container_name">Leaderboard</h1>
                <div className="leaderboard-list">
                    {leaderboardData.map((user, i) => (
                        <div className="leaderboard-list_item">
                            <img src={user.avatar_url || avatarImage} alt="avatar" className="leaderboard-list_item-avatar"/>
                            <div className="leaderboard-list_item-info">
                                <span className="leaderboard-list_item-info-name">{user.first_name ? user.first_name + " " + (user.last_name === 'None' ? '' : user.last_name) : user.username || 'Hidden username'}</span>
                                <span className="leaderboard-list_item-info-balance">
                                <img src={coinImage} alt="coin" className="leaderboard-list_item-info-balance-coin"/>
                                    {parseInt(user.balance)}
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
