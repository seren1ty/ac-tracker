import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios';
import { SessionContext } from '../context/session.context';
import { Track, Car, Driver } from './lap-list.component';
import { Game } from './common/navbar.component';

const Admin = () => {

    const session = useContext(SessionContext);

    const [dataType, setDataType] = useState('Tracks');

    const [tracks, setTracks] = useState<Track[]>([]);
    const [cars, setCars] = useState<Car[]>([]);
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [games, setGames] = useState<Game[]>([]);

    useEffect(() => {
        if (dataType === 'Tracks')
            loadTracks();
        else if (dataType === 'Cars')
            loadCars();
        else if (dataType === 'Drivers')
            loadDrivers();
        else if (dataType === 'Games')
            loadGames();
    // eslint-disable-next-line
    }, [dataType]);

    const loadTracks = () => {
        if (!session)
            return;

        session.setLoading(true);

        session.checkSession()
            .then((success) => {
                if (!success)
                    return;

                axios.get('/tracks/' + session.game)
                    .then(res => {
                        setTracks(res.data);
                    })
                    .catch(err => {
                        console.error(err);
                    })
                    .finally(() => {
                        session.setLoading(false)
                    });
            });
    }

    const loadCars = () => {
        if (!session)
            return;

        session.setLoading(true);

        session.checkSession()
            .then((success) => {
                if (!success)
                    return;

                axios.get('/cars/' + session.game)
                    .then(res => {
                        setCars(res.data);
                    })
                    .catch(err => {
                        console.error(err);
                    })
                    .finally(() => {
                        session.setLoading(false)
                    });
            });
    }

    const loadDrivers = () => {
        if (!session)
            return;

        session.setLoading(true);

        session.checkSession()
            .then((success) => {
                if (!success)
                    return;

                axios.get('/drivers')
                    .then(res => {
                        setDrivers(res.data);
                    })
                    .catch(err => {
                        console.error(err);
                    })
                    .finally(() => {
                        session.setLoading(false)
                    });
            });
    }

    const loadGames = () => {
        if (!session)
            return;

        session.setLoading(true);

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
                    })
                    .finally(() => {
                        session.setLoading(false)
                    });
            });
    }

    const onChangeDataType = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setDataType(event.target.value);
    }

    return (
        <React.Fragment>
            <div className="admin-page">
                <div className="admin-title-row">
                    <span className="admin-title">Manage Data</span>
                    <span className="admin-select-data">
                        <select className="add-btn btn btn-primary sub-item" onChange={onChangeDataType}>
                            <option value="Tracks">Tracks</option>
                            <option value="Cars">Cars</option>
                            <option value="Drivers">Drivers</option>
                            <option value="Games">Games</option>
                        </select>
                    </span>
                </div>
                <div>
                    {
                        dataType === 'Tracks' &&
                        <div className="data-container">
                        {
                            tracks?.map((track) => {
                                return (
                                    <div className="data-box" key={track._id}>
                                        <span>{track.name}</span>
                                    </div>
                                )
                            })
                        }
                        </div>
                    }
                    {
                        dataType === 'Cars' &&
                        <div className="data-container">
                        {
                            cars?.map((car) => {
                                return (
                                    <div className="data-box" key={car._id}>
                                        <span>{car.name}</span>
                                    </div>
                                )
                            })
                        }
                        </div>
                    }
                    {
                        dataType === 'Drivers' &&
                        <div className="data-container">
                        {
                            drivers?.map((driver) => {
                                return (
                                    <div className="data-box" key={driver._id}>
                                        <span>{driver.name}</span>
                                    </div>
                                )
                            })
                        }
                        </div>
                    }
                    {
                        dataType === 'Games' &&
                        <div className="data-container">
                        {
                            games?.map((game) => {
                                return (
                                    <div className="data-box" key={game._id}>
                                        <span>{game.name}</span>
                                    </div>
                                )
                            })
                        }
                        </div>
                    }
                </div>
            </div>
        </React.Fragment>
    )
}

export default Admin