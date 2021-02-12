import React, { useContext, useEffect, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import axios from 'axios';
import ReactTooltip from 'react-tooltip';
import settingsIcon from '../../assets/settings_blue.png';
import logoutIcon from '../../assets/logout_blue.png';
import { SessionContext } from '../../context/session.context';
import { getAcTrackerState, setAcTrackerState } from './ac-localStorage';
import { Game } from '../../types';

const Navbar = () => {

    const history = useHistory();

    const location = useLocation();

    const session = useContext(SessionContext);

    const [games, setGames] = useState<Game[] | null>(null);

    const [game, setGame] = useState(() => {
        return session?.game ? session.game : 'Assetto Corsa';
    });

    const [showMobile, setShowMobile] = useState(false);

    useEffect(() => {
        initGames();

        // Backup check for mobile blocking initial request
        setTimeout(() => {
            if (!games)
                initGames();
        }, 2000)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session?.driver]);

    useEffect(() => {
        if (window.innerWidth < 390)
            setShowMobile(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [window.innerWidth]);

    const initGames = () => {
        if (!session)
            return;

        session.checkSession()
            .then((success) => {
                if (!success)
                    return;

                axios.get('/games')
                    .then(res => {
                        setGames(res.data);
                    })
                    .catch(err => {
                        console.error(err);
                    });
            });
    }

    const openAdmin = () => {
        history.push('/admin');
    }

    const onChangeGame = (gameEvent: React.ChangeEvent<HTMLSelectElement>) => {
        setGame(gameEvent.target.value);

        session?.setGame(gameEvent.target.value);

        setAcTrackerState({ ...getAcTrackerState(), game: gameEvent.target.value });
    }

    const logout = () => {
        axios.post('/session/logout')
            .then(() => {
                session?.setDriver(null);

                history.push('/login');
            });
    }

    if (location.pathname.startsWith('/login')) {
        return (
            <nav className="banner simple">
                <span className="nav-title">AC Tracker</span>
            </nav>
        );
    }

    return (
        <nav className="banner">
            <div>
                <Link className="nav-title" to="/">AC Tracker</Link>
            </div>
            <div className="banner-right">
                {
                    !!session && session?.driver?.isAdmin &&
                    <span>
                        <button className="nav-link nav-item btn btn-link" data-tip="Admin" data-for="admin" onClick={openAdmin}>
                            <img className="settings-icon" src={settingsIcon} alt="admin"></img>
                        </button>
                        <ReactTooltip id="admin" place="left" effect="solid"/>
                    </span>
                }
                <span>
                    <select className="game-select" onChange={onChangeGame} value={game}>
                    {
                        !!games &&
                        games.map((game: Game) => {
                            return <option key={game._id} value={game.name}>{ showMobile ? game.code : game.name }</option>
                        })
                    }
                    </select>
                </span>
                <span>
                    <button className="nav-link nav-item btn btn-link logout-btn" data-tip="Logout" data-for="logout" onClick={logout}>
                        <img className="logout-icon" src={logoutIcon} alt="logout"></img>
                    </button>
                    <ReactTooltip id="logout" place="left" effect="solid"/>
                </span>
            </div>
        </nav>
    );
}

export default Navbar;