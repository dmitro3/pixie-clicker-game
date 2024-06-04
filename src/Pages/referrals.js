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

import default_skin from "../Resources/images/human-free.png";

import pixie_0 from "../Resources/images/pixie/0.png";
import pixie_1 from "../Resources/images/pixie/1.png";
import pixie_2 from "../Resources/images/pixie/2.png";
import pixie_3 from "../Resources/images/pixie/3.png";
import pixie_4 from "../Resources/images/pixie/4.png";
import pixie_5 from "../Resources/images/pixie/5.png";
import pixie_6 from "../Resources/images/pixie/6.png";
import pixie_7 from "../Resources/images/pixie/7.png";
import pixie_8 from "../Resources/images/pixie/8.png";
import pixie_9 from "../Resources/images/pixie/9.png";
import present_image from "../Resources/images/present.svg"
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

function Referrals() {
    const [referralsData, setReferralsData] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [groupedReferrals, setGroupedReferrals] = useState(false);
    const [countReferrals, setCountReferrals] = useState(false);
    const [shareText, setShareText] = useState("");
    const [sumGetCoins, setSumGetCoins] = useState(0);
    const [earnsFromLevels, setEarnsFromLevels] = useState({0:0,1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0});

    const { score, updateGame, totalEarn, userId } = useContext(GameContext);

    const { t, i18n } = useTranslation();

    let referrals_coefs = [
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
        if(i18n.language === 'ru'){
            setShareText("Играй со мной, стань босом студии и получай токены через аирдроп!%0A\uD83D\uDCB8 +20k монет за вход%0A\uD83D\uDD25 +50k монет, если у тебя есть Telegram Premium")
        }else if(i18n.language === 'uk'){
            setShareText("Грай зі мною, стань босом студії та отримай токени через ейрдроп!%0A\uD83D\uDCB8 +20k монет у якості подарунка%0A\uD83D\uDD25 +50k монет, якщо у тебе Telegram Premium")
        }else{
            setShareText("Play with be, become a studio boss and get tokens via airdrop! %0A\uD83D\uDCB8 +20k coins as a gift%0A\uD83D\uDD25 +50k coins, if you have Telegram Premium")
        }

        fetch(`https://game-api.pixie.fun/api/clicker/referrals/get/${userId}`)
            .then(response => response.json())
            .then(response => {
                let referrals = response.referrals;
                let new_referrals = [];
                let total_recieved_can_now = 0;

                if(response.referrals.length > 500){
                    referrals_coefs = [
                        0,
                        0.8,
                        0.7,
                        0.6,
                        0.5,
                        0.4,
                        0.3,
                        0.2,
                        0.1
                    ];
                }

                referrals.forEach(item => {
                    let new_item = {};

                    switch(item.level){
                        case 1:
                            new_item.earn_received = item.earn_received_level_1 || 0;
                            break;
                        case 2:
                            new_item.earn_received = item.earn_received_level_2 || 0;
                            break;
                        case 3:
                            new_item.earn_received = item.earn_received_level_3 || 0;
                            break;
                        case 4:
                            new_item.earn_received = item.earn_received_level_4 || 0;
                            break;
                        case 5:
                            new_item.earn_received = item.earn_received_level_5 || 0;
                            break;
                        case 6:
                            new_item.earn_received = item.earn_received_level_6 || 0;
                            break;
                        case 7:
                            new_item.earn_received = item.earn_received_level_7 || 0;
                            break;
                        case 8:
                            new_item.earn_received = item.earn_received_level_8 || 0;
                            break;
                    }

                    new_item.first_name = item.first_name;
                    new_item.last_name = item.last_name;
                    new_item.username = item.username;
                    new_item.level = item.level;
                    new_item.referal_id = item.referal_id;
                    new_item.total_earn = item.total_earn;
                    new_item.skin_id = item.skin_id;


                    new_item.can_recieved = (parseFloat(new_item.total_earn) / 100 * referrals_coefs[parseInt(new_item.level)]) - new_item.earn_received;

                    if(new_item.can_recieved < 0 || isNaN(new_item.can_recieved)){
                        new_item.can_recieved = 0;
                    }

                    total_recieved_can_now = parseFloat(total_recieved_can_now) + parseFloat(new_item.can_recieved);

                    new_referrals.push(new_item);
                });

                setSumGetCoins(total_recieved_can_now);
                setReferralsData(new_referrals);
                setCountReferrals(response.referrals.length);
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

    function getCoinsFromReferrals(){
        setIsLoaded(false);

        if(parseFloat(sumGetCoins) < 0){
            setSumGetCoins(parseFloat(sumGetCoins) * (-1))
        }

        updateGame({
            score: parseFloat(score) + parseFloat(sumGetCoins),
            totalEarn: parseFloat(totalEarn) + parseFloat(sumGetCoins)
        });

        fetch("https://game-api.pixie.fun/api/clicker/v2/referrals/get/coins", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({"user_id":userId})
        }).then(response => response.json())
            .then(response => {
                console.log(response);
                fetch(`https://game-api.pixie.fun/api/clicker/referrals/get/${userId}`)
                    .then(response => response.json())
                    .then(response => {
                        let referrals = response.referrals;
                        let new_referrals = [];
                        let total_recieved_can_now = 0;

                        if(response.referrals.length > 500){
                            referrals_coefs = [
                                0,
                                0.8,
                                0.7,
                                0.6,
                                0.5,
                                0.4,
                                0.3,
                                0.2,
                                0.1
                            ];
                        }

                        referrals.forEach(item => {
                            let new_item = {};

                            switch(item.level){
                                case 1:
                                    new_item.earn_received = item.earn_received_level_1 || 0;
                                    break;
                                case 2:
                                    new_item.earn_received = item.earn_received_level_2 || 0;
                                    break;
                                case 3:
                                    new_item.earn_received = item.earn_received_level_3 || 0;
                                    break;
                                case 4:
                                    new_item.earn_received = item.earn_received_level_4 || 0;
                                    break;
                                case 5:
                                    new_item.earn_received = item.earn_received_level_5 || 0;
                                    break;
                                case 6:
                                    new_item.earn_received = item.earn_received_level_6 || 0;
                                    break;
                                case 7:
                                    new_item.earn_received = item.earn_received_level_7 || 0;
                                    break;
                                case 8:
                                    new_item.earn_received = item.earn_received_level_8 || 0;
                                    break;
                            }

                            new_item.first_name = item.first_name;
                            new_item.last_name = item.last_name;
                            new_item.username = item.username;
                            new_item.level = item.level;
                            new_item.referal_id = item.referal_id;
                            new_item.total_earn = item.total_earn;


                            new_item.can_recieved = (parseFloat(new_item.total_earn) / 100 * referrals_coefs[parseInt(new_item.level)]) - new_item.earn_received;

                            if(new_item.can_recieved < 0 || isNaN(new_item.can_recieved)){
                                new_item.can_recieved = 0;
                            }

                            total_recieved_can_now = parseFloat(total_recieved_can_now) + parseFloat(new_item.can_recieved);

                            new_referrals.push(new_item);
                        });

                        setSumGetCoins(total_recieved_can_now);
                        setReferralsData(new_referrals);
                        setCountReferrals(response.referrals.length);

                        setIsLoaded(true);
                    });
            })
    }

    if(!isLoaded) return <Loader />;

    return (
        <div className="App">
            <div className="referrals_container">

                <a href={"https://t.me/share/url?url=https://t.me/pixie_project_bot?start="+ userId +"&text=" + shareText} className="referrals_task">
                    <img src={present_image} alt=""/>
                    <div className="referrals_task-text">
                        <span className="referrals_task-text-name">{t('Invite friends task')}</span>
                        <span className="referrals_task-text-undername">{t('Invite your friends and get both 20k coins each. Or 50k each for a friend who has Telegram premium')}</span>
                    </div>
                </a>

                <button className="referrals_get_coins" onClick={getCoinsFromReferrals}>Claim {parseInt(sumGetCoins) < 0 || isNaN(parseInt(sumGetCoins)) ? '0' : parseInt(sumGetCoins).toLocaleString('en')} coins</button>
                <h1 className="referrals_container-name">{t('Referrals list')} {countReferrals > 0 ? <span className="referrals-counter-all">Total {countReferrals}</span> : ''}</h1>
                <div className="referrals_container-list">
                    {countReferrals > 0 ? Object.keys(groupedReferrals).map(level => (
                        <div key={level}>
                            <span className="referrals_container-list-levelname">{t('Level')} {level} <span className="percents_for_referals_text">
                                (+{referrals_coefs[parseInt(level)]}%) <span className="referrals-counter-all">({groupedReferrals[level].length} people)</span>
                            </span>:</span>
                            <div className="referrals_container-list-items">
                                {groupedReferrals[level].length > 30 ? <span className="so-more-referrals-count">
                                        {t('More than')} {parseInt(groupedReferrals[level].length / 10) * 10}...
                                    {/*<span className="referrals-get-coins-more">*/}
                                    {/*    <img src={coinImage} alt="" className="referrals_container-list-items-item-info-coins-image"/>+{parseInt(earnsFromLevels[level]).toLocaleString('en')}*/}
                                    {/*</span>*/}
                                </span> :
                                    groupedReferrals[level].map(referral => (
                                        <>
                                            <div className="referrals_container-list-items-item" key={referral.referal_id}>
                                                {/*Referal ID: {referral.referal_id}, Inviter ID: {referral.inviter_id}, Username: {referral.username || 'N/A'}*/}

                                                {/*<img src={referral.avatar_url || avatarImage} alt="" className="referrals_container-list-items-item-image"/>*/}
                                                {/*<img src={pixieImages[referral.referal_id % 10]} alt="" className="referrals_container-list-items-item-image"/>*/}
                                                <div className="referrals_container-list-items-item-image-container">
                                                    <img src={referral.skin_id ? skins_images[referral.skin_id - 1] : default_skin} alt="" className="referrals_container-list-items-item-image"/>
                                                </div>
                                                <div className="referrals_container-list-items-item-info">
                                                    <span className="referrals_container-list-items-item-info-name">
                                                        {nicknameFormat(referral.first_name, referral.last_name, referral.username)}
                                                    </span>
                                                    <span className="referrals_container-list-items-item-info-coins">
                                                    <img src={coinImage} alt="" className="referrals_container-list-items-item-info-coins-image"/>
                                                    {/*+{parseInt((parseInt(referral.total_earn) / 100) * referrals_coefs[parseInt(level)]) || 0}*/}
                                                    +{parseInt(referral.can_recieved) >= 0 ? parseInt(referral.can_recieved).toLocaleString('en') : 0}
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
