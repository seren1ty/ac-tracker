import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { getAcTrackerState, setAcTrackerState } from '../components/common/ac-localStorage';

type ContextProps = {
    children: React.ReactNode
}

type Session = {
    loading: boolean;
    game: string | null;
    driver: string | null;
    setLoading: (loading: boolean) => void;
    setGame: (game: string) => void;
    setDriver: (driver: string | null) => void;
    checkSession: () => Promise<boolean | void>;
}

const SessionContext = React.createContext<Session | null>(null);

const SessionProvider = ({children}: ContextProps) => {

    const history = useHistory();

    const [loading, setLoading] = useState(false);

    const [game, setGame] = useState(() => {
        return (!!getAcTrackerState() && !!getAcTrackerState().game) ? getAcTrackerState().game : 'Assetto Corsa';
    });

    const [driver, setDriver] = useState(() => {
        return getAcTrackerState() ? getAcTrackerState().driver : null;
    });

    useEffect(() => {
        setAcTrackerState({ ...getAcTrackerState(), game: game });
    }, [game]);

    useEffect(() => {
        setAcTrackerState({ ...getAcTrackerState(), driver: driver });
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
        <SessionContext.Provider value={{ loading, game, driver, setLoading, setGame, setDriver, checkSession }}>
            {children}
        </SessionContext.Provider>
    );
}

export { SessionContext, SessionProvider };