import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { getAcTrackerState, setAcTrackerState } from '../utils/ac-localStorage';
import { Driver } from '../types';

type ContextProps = {
    children: React.ReactNode
}

export type Session = {
    loading: boolean;
    group: string | null;
    game: string | null;
    driver: Driver | null;
    setLoading: (loading: boolean) => void;
    setGroup: (group: string) => void;
    setGame: (game: string) => void;
    setDriver: (driver: Driver | null) => void;
    checkSession: () => Promise<boolean | void>;
}

const SessionContext = React.createContext<Session | null>(null);

const SessionProvider = ({children}: ContextProps) => {

    const history = useHistory();

    const [loading, setLoading] = useState(false);

    const [group, setGroup] = useState(() => {
        return !!getAcTrackerState() ? getAcTrackerState().group : null;
    });

    const [game, setGame] = useState(() => {
        return !!getAcTrackerState() ? getAcTrackerState().game : null;
    });

    const [driver, setDriver] = useState(() => {
        return !!getAcTrackerState() ? getAcTrackerState().driver : null;
    });

    useEffect(() => {
        setAcTrackerState({ ...getAcTrackerState(), group: group });
    }, [group]);

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
        <SessionContext.Provider value={{ loading, group, game, driver, setLoading, setGroup, setGame, setDriver, checkSession }}>
            {children}
        </SessionContext.Provider>
    );
}

export { SessionContext, SessionProvider };