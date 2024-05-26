import '../App.css';
import {useContext, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import avatarImage from "../Resources/images/avatar.jpg"
import coinImage from "../Resources/images/coin.svg"
import horizontalLine from "../Resources/images/horizontal_line.svg"
import Loader from "../Components/Loader";
import WebAppUser from "@twa-dev/sdk";
import GameContext from "../Context/GameContext";
import {useTranslation} from "react-i18next";

function Referrals() {
    const [referralsData, setReferralsData] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [groupedReferrals, setGroupedReferrals] = useState(false);
    const [countReferrals, setCountReferrals] = useState(false);
    const [shareText, setShareText] = useState("");

    const { t, i18n } = useTranslation();

    const { userId } = useContext(GameContext);

    const referrals_coefs = [
        0,
        30,
        17.5,
        15,
        12.5,
        10,
        7.5,
        5,
        2.5
    ];

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

        fetch(`https://game-api.pixie.fun/api/clicker/referrals/get/${userId}`)
            .then(response => response.json())
            .then(response => {
                setReferralsData(response.referrals);
                setCountReferrals(response.referrals.length);
            });
    }, []);

    if(!isLoaded) return <Loader />;

    return (
        <div className="App">
            <div className="referrals_container">
                <h1 className="referrals_container-name">{t('Referrals list')}</h1>
                <div className="referrals_container-list">
                    {countReferrals > 0 ? Object.keys(groupedReferrals).map(level => (
                        <div key={level}>
                            <span className="referrals_container-list-levelname">{t('Level')} {level} <span className="percents_for_referals_text">
                                (+{referrals_coefs[parseInt(level)]}%)
                            </span>:</span>
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
                                                +{parseInt((parseInt(referral.total_earn) / 100) * referrals_coefs[parseInt(level)]) || 0}
                                            </span>
                                            </div>
                                        </div>
                                        <img src={horizontalLine} alt="" className="referrals_horizontal_line"/>
                                    </>
                                ))}
                            </div>
                        </div>
                    )) :
                        <p className="referrals_empty">{t('The list of referrals is empty :c')}</p>
                    }
                </div>

                <div className="referrals_share_container">
                    <a href={"https://t.me/share/url?url=https://t.me/pixie_project_bot?start="+ userId +"&text=" + shareText} className="referrals_container_share">
                        {t('Invite friends')}
                    </a>
                </div>
            </div>
        </div>
    );
}

export default Referrals;
