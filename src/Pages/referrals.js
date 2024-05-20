import '../App.css';
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import avatarImage from "../Resources/images/avatar.jpg"
import coinImage from "../Resources/images/coin.svg"
import horizontalLine from "../Resources/images/horizontal_line.svg"

function Referrals() {
    let id = sessionStorage.telegram_user_id;

    const [referralsData, setReferralsData] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [groupedReferrals, setGroupedReferrals] = useState(false);
    const [countReferrals, setCountReferrals] = useState(false);
    const [shareText, setShareText] = useState("");

    useEffect(() => {
        if(referralsData !== null){
            setGroupedReferrals(referralsData.reduce((acc, referral) => {
                if (!acc[referral.level]) {
                    acc[referral.level] = [];
                }
                acc[referral.level].push(referral);
                return acc;
            }, {}));
        }


        setIsLoaded(true);
    }, [referralsData]);

    useEffect(() => {
        setShareText("Come and play with me!")

        fetch(`https://game-api.pixie.fun/api/clicker/referrals/get/${id}`)
            .then(response => response.json())
            .then(response => {
                setReferralsData(response.referrals);
                setCountReferrals(response.referrals.length);
            });
    }, []);

    if(!isLoaded) return <>Загрузка...</>;

    return (
        <div className="App">
            <div className="referrals_container">
                <h1 className="referrals_container-name">Referrals list</h1>
                <div className="referrals_container-list">
                    {countReferrals > 0 ? Object.keys(groupedReferrals).map(level => (
                        <div key={level}>
                            <span className="referrals_container-list-levelname">Level {level}:</span>
                            <div className="referrals_container-list-items">
                                {groupedReferrals[level].map(referral => (
                                    <>
                                        <div className="referrals_container-list-items-item" key={referral.referal_id}>
                                            {/*Referal ID: {referral.referal_id}, Inviter ID: {referral.inviter_id}, Username: {referral.username || 'N/A'}*/}

                                            <img src={referral.avatar_url || avatarImage} alt="" className="referrals_container-list-items-item-image"/>
                                            <div className="referrals_container-list-items-item-info">
                                                <span className="referrals_container-list-items-item-info-name">
                                                    {(referral.first_name ? `${referral.first_name} ${referral.last_name === 'None' ? '' : referral.last_name}` : referral.username) || 'Hidden username'}
                                                </span>
                                                <span className="referrals_container-list-items-item-info-coins">
                                                <img src={coinImage} alt="" className="referrals_container-list-items-item-info-coins-image"/>
                                                +{parseInt(referral.balance) || 0}
                                            </span>
                                            </div>
                                        </div>
                                        <img src={horizontalLine} alt="" className="referrals_horizontal_line"/>
                                    </>
                                ))}
                            </div>
                        </div>
                    )) :
                        <p className="referrals_empty">The list of referrals is empty :c</p>
                    }
                </div>

                <div className="referrals_share_container">
                    <a href={"https://t.me/share/url?url=https://t.me/pixie_test_bot?start="+ id +"&text=" + shareText} className="referrals_container_share">
                        Invite friends
                    </a>
                </div>
            </div>
        </div>
    );
}

export default Referrals;
