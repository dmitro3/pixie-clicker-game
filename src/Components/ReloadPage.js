import React, {useEffect, useState} from 'react';
import '../Resources/styles/loader.css'
import {useTranslation} from "react-i18next";

const ReloadPage = () => {
    const { t, i18n } = useTranslation();

    function handleReload(){
        window.location.reload();
    }

    return (
        <div className="reloadPage-container">
            {/*<div className="loader"></div>*/}
            {/*<span className="reloadPage-container_text">{t('An error has occurred')}</span>*/}
            <span className="reloadPage-container_text">{t('Connection lost')}</span>
            <span className="reloadPage-container_text">{t('Re-enter the game')}</span>
            <button onClick={handleReload} className="reload-page-button">{t('reload button')}</button>
        </div>
    );
};

export default ReloadPage;