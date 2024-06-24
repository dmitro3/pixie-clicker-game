import '../App.css';
import React, {useContext, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import avatarImage from "../Resources/images/avatar.jpg"
import coinImage from "../Resources/images/coin.svg"
import Loader from "../Components/Loader";
import WebAppUser from "@twa-dev/sdk";
import GameContext from "../Context/GameContext";
import {useTranslation} from "react-i18next";
import coinsImage from "../Resources/images/leaderboard-coins.svg"

import default_skin from "../Resources/images/human-free.png";
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

import pencilIcon from "../Resources/images/pencil.svg";

function Families() {
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

    const [isLoaded, setIsLoaded] = useState(false);
    const [families, setFamilies] = useState([]);
    const [familiesObject, setFamiliesObject] = useState([]);
    const [currentFamily, setCurrentFamily] = useState(null);
    const [currentFamilyUsers, setCurrentFamilyUsers] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [showPopupEdit, setShowPopupEdit] = useState(false);
    const [showPopupCreate, setShowPopupCreate] = useState(false);
    const [file, setFile] = useState(null);
    const [name, setName] = useState(null);
    const [description, setDescription] = useState(null);
    const [isCreateLoader, setIsCreateLoader] = useState(false);
    const [errorFileSize, setErrorFileSize] = useState("");
    const [nameSearchFamilies, setNameSearchFamilies] = useState("");

    const { userId, level, family_id, updateGame, score, token } = useContext(GameContext);

    const { t, i18n } = useTranslation();

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/v1/family/list/${userId}`)
            .then(response => response.json())
            .then(response => {
                setFamilies(response.families);
                setFamiliesObject(response.families);
                setIsLoaded(true);
            });
    }, []);

    function showPopupCreateFamily(){
        if(family_id !== null){
            return false;
        }
        setShowPopupCreate(true);
    }

    function viewFamilyMore(family){
        setShowPopup(true);

        fetch(`${process.env.REACT_APP_API_URL}/v1/family/users/${family.id}`)
            .then(response => response.json())
            .then(response => {
                setCurrentFamilyUsers(response.users);

                setCurrentFamily(family);
            });
    }

    function closePopup(){
        setCurrentFamilyUsers(null);
        setCurrentFamily(null);
        setShowPopup(false);
    }
    function editPopup(){
        setCurrentFamilyUsers(null);
        setShowPopup(false);

        if(currentFamily.creator_id === userId){
            setShowPopupEdit(true);
        }

    }
    function closePopupCreate(){
        setShowPopupCreate(false);
    }
    function closePopupEdit(){
        setShowPopupEdit(false);
    }

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        if(!description || !name){
            return false;
        }

        if(score < 250000000){
            return false;
        }

        // Проверка, если файл существует и его размер превышает 2MB
        if (file && file.size > (2097152 / 2)) {
            setErrorFileSize("File size should not exceed 1MB")

            setTimeout(function(){
                setErrorFileSize("");
            }, 3000);
            return false;
        }

        const formData = new FormData();
        formData.append('image', file);
        formData.append('name', name);
        formData.append('description', description);

        setIsCreateLoader(true);

        try {
            fetch(`${process.env.REACT_APP_API_URL}/v2/family/create`, {
                method: 'POST',
                headers: {
                    'auth-api-token': token
                },
                body: formData,
            }).then(response => response.json())
                .then(response => {
                    if(response.message === 'ok'){
                        updateGame({
                            score: parseFloat(response.balance),
                            family_id: parseInt(response.family_id)
                        });

                        setShowPopupCreate(false);
                        setIsCreateLoader(false);

                        fetch(`${process.env.REACT_APP_API_URL}/v1/family/list/${userId}`)
                            .then(response => response.json())
                            .then(response => {
                                setFamilies(response.families);
                                setFamiliesObject(response.families);
                                setCurrentFamily(response.families);
                                setIsLoaded(true);
                            });
                    }
                });
        } catch (error) {
            console.error('Error:', error);
            alert('Upload failed');
        }
    };
    const handleSubmitEdit = async (event) => {
        if(currentFamily.creator_id !== userId){
            return false;
        }

        if(!description || !name){
            return false;
        }

        if(score < 125000000){
            return false;
        }

        // Проверка, если файл существует и его размер превышает 2MB
        if (file && file.size > (2097152 / 2)) {
            setErrorFileSize("File size should not exceed 1MB")

            setTimeout(function(){
                setErrorFileSize("");
            }, 3000);
            return false;
        }

        const formData = new FormData();
        formData.append('image', file);
        formData.append('name', currentFamily.name);
        formData.append('description', currentFamily.description);

        setIsCreateLoader(true);

        try {
            fetch(`${process.env.REACT_APP_API_URL}/v2/family/edit`, {
                method: 'POST',
                headers: {
                    'auth-api-token': token
                },
                body: formData,
            }).then(response => response.json())
                .then(response => {
                    if(response.message === 'ok'){
                        updateGame({
                            score: parseFloat(response.balance),
                            family_id: parseInt(response.family_id)
                        });

                        setShowPopupCreate(false);
                        setIsCreateLoader(false);

                        fetch(`${process.env.REACT_APP_API_URL}/v1/family/list/${userId}`)
                            .then(response => response.json())
                            .then(response => {
                                setFamilies(response.families);
                                setFamiliesObject(response.families);
                                setCurrentFamily(response.families);
                                setIsLoaded(true);
                            });
                    }
                });
        } catch (error) {
            console.error('Error:', error);
            alert('Upload failed');
        }
    };

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

        if (nickname.length > 20) {
            nickname = nickname.slice(0, 20);
            nickname = nickname + "...";
        }
        return nickname;
    }

    function handleNameChange(event){
        const inputText = event.target.value;
        // Устанавливаем текст только если он меньше или равен 30 символам
        if (inputText.length <= 20) {
            setName(inputText);
        }
    }
    function handleDescriptionChange(event){
        const inputText = event.target.value;
        // Устанавливаем текст только если он меньше или равен 30 символам
        if (inputText.length <= 50) {
            setDescription(inputText);
        }
    }

    function leaveFamily(family){
        if(family_id !== family.id){
            return;
        }

        let data = {
            "family_id":family.id
        };

        setCurrentFamilyUsers(null);

        fetch(`${process.env.REACT_APP_API_URL}/v2/family/leave`, {
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
                        family_id:null
                    });

                    fetch(`${process.env.REACT_APP_API_URL}/v1/family/users/${family.id}`)
                        .then(response => response.json())
                        .then(response => {
                            setCurrentFamilyUsers(response.users);

                            setCurrentFamily(family);
                        });

                    fetch(`${process.env.REACT_APP_API_URL}/v1/family/list/${userId}`)
                        .then(response => response.json())
                        .then(response => {
                            setFamilies(response.families);
                            setFamiliesObject(response.families);
                            setIsLoaded(true);
                        });
                }else{
                    console.log("error");
                }
            });
    }

    function joinFamily(family){
        if(family_id !== null){
            return;
        }

        let data = {
            "family_id":family.id,
            "user_id":userId
        };

        setCurrentFamilyUsers(null);

        fetch(`${process.env.REACT_APP_API_URL}/v1/family/join`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(data)
        }).then(response => response.json())
            .then(response => {
                if(response.message === 'ok'){
                    updateGame({
                        family_id:family.id
                    });

                    fetch(`${process.env.REACT_APP_API_URL}/v1/family/users/${family.id}`)
                        .then(response => response.json())
                        .then(response => {
                            setCurrentFamilyUsers(response.users);

                            setCurrentFamily(family);
                        });

                    fetch(`${process.env.REACT_APP_API_URL}/v1/family/list/${userId}`)
                        .then(response => response.json())
                        .then(response => {
                            setFamilies(response.families);
                            setFamiliesObject(response.families);
                            setIsLoaded(true);
                        });
                }else{
                    console.log("error");
                }
            });
    }

    function searchFamiliesSubmit(e){
        e.preventDefault();

        setFamilies(familiesObject.filter(item => item.name.toLowerCase().includes(nameSearchFamilies)));
    }
    function searchFamilies(e){
        setFamilies(familiesObject.filter(item => item.name.toLowerCase().includes(nameSearchFamilies)));
    }

    if(!isLoaded) return <Loader />;

    return (
        <div className="App">
            <div className="families-header">
                <h1 className="families-name-page">Families</h1>
                <button className={"families-create " + (family_id === null ? '' : 'disabled')} onClick={()=>{showPopupCreateFamily()}}>Create family</button>
            </div>

            {showPopupCreate ?
                <div className="family-popup">
                    <div className="family-popup-content">
                        <>
                            {isCreateLoader ?
                                <Loader />
                            :
                                <>
                                    <button className="family-popup-content-users-item-button-close" onClick={()=>{closePopupCreate()}}>✕</button>

                                    <h3 className="family-popup-content-name">Create family</h3>

                                    <div className="family-popup-content-form-group">
                                        <label htmlFor="name">Name</label>
                                        <input type="text" id="name" value={name} onChange={handleNameChange} />
                                    </div>

                                    <div className="family-popup-content-form-group">
                                        <label htmlFor="description">Description</label>
                                        <input type="text" id="description" value={description} onChange={handleDescriptionChange} />
                                    </div>

                                    <div className="family-popup-content-form-group">
                                        <label htmlFor="file">Image</label>
                                        <input type="file" id="file" onChange={handleFileChange} />
                                    </div>

                                    <div className="create-family-price">
                                        <img src={coinImage} alt=""/>
                                        250,000,000
                                    </div>

                                    <p className="error-file-size">{errorFileSize}</p>

                                    <button className={"family-popup-content-create " + ((score < 250000000 ? 'disabled' : ''))} onClick={handleSubmit}>Create</button>
                                </>
                            }
                        </>
                    </div>
                    <div className="family-popup-overlay" onClick={()=>{closePopupCreate()}}></div>
                </div>
            :
                ''
            }


            {showPopupEdit ?
                <div className="family-popup">
                    <div className="family-popup-content">
                        <>
                            {isCreateLoader ?
                                <Loader />
                            :
                                <>
                                    <button className="family-popup-content-users-item-button-close" onClick={()=>{closePopupEdit()}}>✕</button>

                                    <h3 className="family-popup-content-name">Edit family</h3>

                                    <div className="family-popup-content-form-group">
                                        <label htmlFor="name">Name</label>
                                        <input type="text" id="name" value={currentFamily.name} onChange={handleNameChange} />
                                    </div>

                                    <div className="family-popup-content-form-group">
                                        <label htmlFor="description">Description</label>
                                        <input type="text" id="description" value={currentFamily.description} onChange={handleDescriptionChange} />
                                    </div>


                                    <div className="family-popup-content-form-group edit-family">
                                        <label htmlFor="file">
                                            {currentFamily.image !== null && currentFamily.image !== '' ?
                                                <img src={"https://api-v2.pixie-game.com/storage/" + currentFamily.image} alt="" className="families_list-item-image"/>
                                            :
                                                <img src={coinImage} alt="" className="families_list-item-image"/>
                                            }
                                        </label>
                                        <input type="file" id="file" onChange={handleFileChange} />
                                    </div>

                                    <div className="create-family-price">
                                        <img src={coinImage} alt=""/>
                                        125,000,000
                                    </div>

                                    <p className="error-file-size">{errorFileSize}</p>

                                    <button className={"family-popup-content-create " + ((score < 125000000 ? 'disabled' : ''))} onClick={handleSubmitEdit}>Edit</button>
                                </>
                            }
                        </>
                    </div>
                    <div className="family-popup-overlay" onClick={()=>{closePopupCreate()}}></div>
                </div>
            :
                ''
            }

            {showPopup ?
                <div className="family-popup">
                    <div className="family-popup-content">
                        {currentFamilyUsers !== null ?
                            <>
                                <button className="family-popup-content-users-item-button-close" onClick={()=>{closePopup()}}>✕</button>
                                {/*{currentFamily.id === family_id && currentFamily.creator_id === userId ?*/}
                                {/*    <button className="family-popup-content-users-item-button-edit" onClick={()=>{editPopup()}}>*/}
                                {/*        <img src={pencilIcon} alt=""/>*/}
                                {/*    </button>*/}
                                {/*:*/}
                                {/*    ''*/}
                                {/*}*/}

                                <div className="family-popup-content-header">
                                    <h1 className="family-popup-content-name">
                                        {currentFamily.name}
                                    </h1>
                                    <span className="family-popup-content-header-level">
                                    level {currentFamily.level}
                                </span>
                                </div>
                                <h2 className="family-popup-content-description">
                                    {currentFamily.description}
                                </h2>

                                {currentFamily.id === family_id ?
                                    <div className="family-buttons-row">
                                        <button className="family-buttons-row-button donate">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M6 10V8C6 4.69 7 2 12 2C17 2 18 4.69 18 8V10" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                                <path d="M12 18.5C13.3807 18.5 14.5 17.3807 14.5 16C14.5 14.6193 13.3807 13.5 12 13.5C10.6193 13.5 9.5 14.6193 9.5 16C9.5 17.3807 10.6193 18.5 12 18.5Z" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                                <path d="M17 22H7C3 22 2 21 2 17V15C2 11 3 10 7 10H17C21 10 22 11 22 15V17C22 21 21 22 17 22Z" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                            </svg>

                                            Donate
                                        </button>
                                        {currentFamily.creator_id === userId ? '' :
                                            <button className="family-buttons-row-button leave" onClick={()=>{leaveFamily(currentFamily)}}>Leave</button>
                                        }
                                    </div>
                                :
                                    ''
                                }

                                {family_id === null ?
                                    <div className="family-buttons-row">
                                        <button className="family-buttons-row-button join" onClick={()=>joinFamily(currentFamily)}>Join</button>
                                    </div>
                                :
                                    ''
                                }


                                <div className="family-popup-content-users-list">
                                    <span className="family-popup-content-users-count">{currentFamilyUsers.length} users</span>
                                    {currentFamilyUsers.map((user, i) => (
                                        <div className="family-popup-content-users-item">
                                            <div className="family-popup-content-users-item-avatar-container">
                                                <img src={user.current_skin_id ? skins_images[user.current_skin_id - 1] : default_skin} alt="avatar" className="family-popup-content-users-item-avatar"/>
                                            </div>
                                            <div className="family-popup-content-users-item-content">
                                                <span className="family-popup-content-users-item-name">{nicknameFormat(user.first_name, user.last_name, user.username)}</span>
                                                <span className="family-popup-content-users-item-content-totalearn">
                                                <img src={coinImage} alt=""/>
                                                    {parseInt(user.total_earn).toLocaleString('en')}
                                            </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        :
                            <Loader />
                        }

                    </div>
                    <div className="family-popup-overlay" onClick={()=>{closePopup()}}></div>
                </div>
            :
                ''
            }

            {/*<button className="family-create" onClick={()=>{showPopupCreateFamily()}}>+</button>*/}

            <form className="families_list-search-form" onSubmit={searchFamiliesSubmit}>
                <input type="text" placeholder="Name or code" value={nameSearchFamilies} onChange={(e)=>{setNameSearchFamilies(e.target.value);}} />
                <button onClick={()=>{searchFamilies()}}>search</button>
            </form>

            <div className="families_list">
                {families.map((family, i) => (
                    <div className={"families_list-item " + (family.user_id_in_family === userId ? "selected" : "")} onClick={() => {viewFamilyMore(family)}}>
                        {family.image !== null && family.image !== '' ?
                            <img src={"https://api-v2.pixie-game.com/storage/" + family.image} alt="" className="families_list-item-image"/>
                        :
                            <img src={coinImage} alt="" className="families_list-item-image"/>
                        }

                        <div className="families_list-item-content">
                            <div className="families_list-item-header">
                                <span className="families_list-item-name">{family.name}</span>
                                <span className="families_list-item-level">Level {family.level}</span>
                            </div>
                            <div className="families_list-item-bottom-text">
                                <span className="families_list-item-creator">{nicknameFormat(family.first_name, family.last_name, family.username)}</span>
                                <span className="families_list-item-counter-users">{family.users_count} users</span>
                            </div>
                        </div>
                    </div>
                ))}

            </div>
        </div>
    );
}

export default Families;
