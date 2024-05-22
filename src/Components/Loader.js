import React, {useEffect, useState} from 'react';
import '../Resources/styles/loader.css'

const Loader = () => {
    const [loadingText, setLoadingText] = useState('Loading');

    useEffect(() => {
        let counterInterval = 0;

        let interval = setInterval(()=>{
            counterInterval++;

            if(counterInterval === 1){
                setLoadingText("Loading.")
            }else if(counterInterval === 2){
                setLoadingText("Loading..")
            }else if(counterInterval === 3){
                setLoadingText("Loading...")
            }else{
                setLoadingText("Loading")
                counterInterval = 0;
            }
        }, 500);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="loader_container">
            <div className="loader"></div>
            <span className="loader_text">{loadingText}</span>
        </div>
    );
};

export default Loader;