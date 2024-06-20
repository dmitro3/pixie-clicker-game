import '../App.css';
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import avatarImage from "../Resources/images/avatar.jpg";
import coinImage from "../Resources/images/coin.svg";
import rocketImage from "../Resources/images/rocket.svg";
import GameContext from "../Context/GameContext";
import Loader from "../Components/Loader";
import WebAppUser from "@twa-dev/sdk";
import {useTranslation} from "react-i18next";
import telegramIcon from "../Resources/images/tasks/telegram.svg";
import xIcon from "../Resources/images/x-twitter.svg";
import iconArrow from "../Resources/images/tasks/arrow.svg";
import present_image from "../Resources/images/present.svg";
import gorgon_icon from "../Resources/images/gorgon.jpg";
import hexn_icon from "../Resources/images/tasks/hexn.png";
import cryptowolf_icon from "../Resources/images/tasks/cryptowolf.jpg";
import tonchurch_icon from "../Resources/images/tasks/tonchurch.svg";


function Earns() {
    const { score, coinsPerClick, energy, totalEarn, coinsPerSecond, playerImprovements, updateGame, userId, token } = useContext(GameContext);
    const [clickBoostPrice, setClickBoostPrice] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    const [tasks, setTasks] = useState([]);
    const [viewPopup, setViewPopup] = useState(false);
    const [currentTask, setCurrentTask] = useState(null);
    const [taskNotCompleted, setTaskNotCompleted] = useState(false);
    const [shareText, setShareText] = useState("");

    const { t, i18n } = useTranslation();

    useEffect(() => {
        if(i18n.language === 'ru'){
            setShareText("Играй со мной, стань босом студии и получай токены через аирдроп!%0A\uD83D\uDCB8 +20k монет за вход%0A\uD83D\uDD25 +50k монет, если у тебя есть Telegram Premium")
        }else if(i18n.language === 'uk'){
            setShareText("Грай зі мною, стань босом студії та отримай токени через ейрдроп!%0A\uD83D\uDCB8 +20k монет у якості подарунка%0A\uD83D\uDD25 +50k монет, якщо у тебе Telegram Premium")
        }else{
            setShareText("Play with be, become a studio boss and get tokens via airdrop! %0A\uD83D\uDCB8 +20k coins as a gift%0A\uD83D\uDD25 +50k coins, if you have Telegram Premium")
        }

        let language_code_is = WebAppUser.initDataUnsafe.user ? WebAppUser.initDataUnsafe.user.language_code : 'ru';

        fetch(`${process.env.REACT_APP_API_URL}/clicker/tasks/get/all/${userId}/${language_code_is}`)
        // fetch(`http://game.pixie.loc/api/clicker/tasks/get/all/${userId}/${language_code_is}`)
            .then(response => response.json())
            .then(response => {
                setTasks(response.tasks);
                setIsLoaded(true);
            });
    }, []);

    function translatedName(item){
        if(i18n.language === 'ru'){
            return item.name_ru;
        }else if(i18n.language === 'uk'){
            return item.name_uk;
        }else{
            return item.name_en;
        }
    }

    function taskMore(task){
        if([10, 11, 12].includes(task.id)){
            if(task.was_completed){
                return;
            }
        }else{
            if(task.task_id){
                return;
            }
        }

        setCurrentTask(task);
        setViewPopup(true);
    }
    function locateToLink(link){
        return window.location = link;
    }
    function checkRules(task){
        let data = {
            "task_id":task.id
        };

        fetch(`${process.env.REACT_APP_API_URL}/v2/tasks/check/complete`, {
        // fetch('http://game.pixie.loc/api/clicker/tasks/check/complete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'auth-api-token': token
            },
            body: JSON.stringify(data)
        }).then(response => response.json())
            .then(response => {
               if(response.message === 'ok'){
                   updateGame({
                       score: parseFloat(response.balance)
                   });

                   setViewPopup(false);
                   setCurrentTask(null);

                   setTasks([]);
                   setIsLoaded(false);

                   let language_code_is = WebAppUser.initDataUnsafe.user ? WebAppUser.initDataUnsafe.user.language_code : 'ru';
                   fetch(`${process.env.REACT_APP_API_URL}/clicker/tasks/get/all/${userId}/${language_code_is}`)
                       .then(response => response.json())
                       .then(response => {
                           setTasks(response.tasks);
                           setIsLoaded(true);
                       });
               }else{
                   setTaskNotCompleted(true);
                   setTimeout(()=>{
                       setTaskNotCompleted(false);
                   }, 3000);
               }
            });
    }

    function closePopupTasks(){
        setViewPopup(false);
        setCurrentTask(null);
        setTaskNotCompleted(false);
    }

    function taskImage(id){
        if(id === 8){
            return <img src={xIcon} alt="" className="tasks_container-item-image"/>
        }else if(id === 13){
            return <img src={gorgon_icon} alt="" className="tasks_container-item-image"/>
        }else if(id === 14){
            return <img src={hexn_icon} alt="" className="tasks_container-item-image"/>
        }else if(id === 15){
            return <img src={coinImage} alt="" className="tasks_container-item-image"/>
        }else if(id === 16){
            return <img src={cryptowolf_icon} alt="" className="tasks_container-item-image"/>
        }else if(id === 19){
            return <img src={tonchurch_icon} alt="" className="tasks_container-item-image"/>
        }else{
            return <img src={telegramIcon} alt="" className="tasks_container-item-image"/>
        }

    }

    if (!isLoaded) return <Loader />;

    return (
        <div className="App">
            <div className="tasks_container">
                <h1 className="tasks_container-name">{t('Tasks')}</h1>

                {viewPopup ?
                    <div className="offline_profit_container">
                        <div className="offline_profit_container-content tasks">
                            <button className="offline_profit_container-content-button-close" onClick={()=>{closePopupTasks()}}>✕</button>
                            <span className="offline_profit_container-content-text">{translatedName(currentTask)}</span>
                            <span className="offline_profit_container-content-value">
                                <img src={coinImage} alt=""/>
                                {currentTask.coins.toLocaleString()}
                            </span>

                            {[10,11,12].includes(currentTask.id) ?
                                <div className="tasks-invite-friends-progress-bar-container">
                                    <> ({currentTask.friends_invited === null ? 0 : currentTask.friends_invited} / {currentTask.friends_invite})</>
                                    <div className="tasks-invite-friends-progress-bar">
                                        <div className="tasks-invite-friends-progress-bar-value" style={{
                                            width: (((currentTask.friends_invited === null ? 0 : currentTask.friends_invited) / currentTask.friends_invite * 100) > 100 ? 100 : ((currentTask.friends_invited === null ? 0 : currentTask.friends_invited) / currentTask.friends_invite * 100)) + "%"
                                        }}>
                                        </div>

                                    </div>
                                </div>
                            : '' }
                            <div className="popup_tasks_buttons-bottom">
                                {taskNotCompleted ? <span className="popup_tasks_buttons-bottom-text">{t('Task not completed')}!</span> : ''}
                                <div className="popup_tasks_buttons">
                                    {currentTask.id !== 15 ?
                                        <>
                                            {[10,11,12].includes(currentTask.id) ?
                                                <a className="popup_tasks_buttons-button" href={"https://t.me/share/url?url=https://t.me/pixie_project_bot?start="+ userId +"&text=" + shareText}>{t('Invite')}</a>
                                                :
                                                <button className="popup_tasks_buttons-button" onClick={()=>{locateToLink(currentTask.link)}}>{t('Subscribe')}</button>
                                            }
                                        </>
                                        :
                                        ''
                                    }
                                    {currentTask.id === 15 ?
                                        <button className="popup_tasks_buttons-button" onClick={()=>{checkRules(currentTask)}}>{t('Get')}</button>
                                    :
                                        <button className="popup_tasks_buttons-button second" onClick={()=>{checkRules(currentTask)}}>{t('Check')}</button>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="offline_profit_container-overlay" onClick={()=>{closePopupTasks()}}></div>
                    </div>
                    : ''}

                <div className="tasks_container-column">
                    <a href={"https://t.me/share/url?url=https://t.me/pixie_project_bot?start="+ userId +"&text=" + shareText} className="referrals_task">
                        <img src={present_image} alt=""/>
                        <div className="referrals_task-text">
                            <span className="referrals_task-text-name">{t('Invite friends task')}</span>
                            <span className="referrals_task-text-undername">{t('Invite your friends and get both 20k coins each. Or 50k each for a friend who has Telegram premium')}</span>
                        </div>
                    </a>

                    {tasks.map((task) => (
                        <button className={"tasks_container-item " + (
                            ([10, 11, 12].includes(task.id) ? (task.was_completed ? 'disabled' : '') : (task.task_id ? 'disabled' : ''))
                        )} onClick={() => {taskMore(task)}}>

                            {taskImage(task.id)}
                            <div className="tasks_container-item-text">
                                <span className="tasks_container-item-text-name">
                                    {translatedName(task)}
                                    {[10,11,12].includes(task.id) ? <> ({task.friends_invited === null ? 0 : task.friends_invited} / {task.friends_invite})</> : ''}
                                </span>
                                <span className="tasks_container-item-text-value">+{task.coins.toLocaleString('ru')}</span>
                            </div>
                            <img src={iconArrow} alt="" className="tasks_container-item-icon-row"/>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Earns;