import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

const SessionContext = React.createContext();

const SessionProvider = ({children}) => {

    const history = useHistory();

    const [driver, setDriver] = useState(() => {
        if (localStorage.getItem('acTracker')) {
            let currentState = JSON.parse(localStorage.getItem('acTracker'));

            if (currentState.driver)
                return currentState.driver;
        }

        return null;
    });

    useEffect(() => {
        let currentState = {};

        if (localStorage.getItem('acTracker'))
            currentState = JSON.parse(localStorage.getItem('acTracker'));

        currentState.driver = driver;

        localStorage.setItem('acTracker', JSON.stringify(currentState));
    }, [driver]);

    const checkSession = () => {
        return axios.get('/session/status')
            .then(() => {
                return true;
            })
            .catch(err => {
                console.error('Session expired: ' + err);

                history.push('/login');
            });
    };

    return (
        <SessionContext.Provider value={{ driver, setDriver, checkSession }}>
            {children}
        </SessionContext.Provider>
    );
}

export { SessionContext, SessionProvider };