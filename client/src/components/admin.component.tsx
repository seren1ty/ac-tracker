import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios';
import { SessionContext } from '../context/session.context';
import AdminDataBoxes from './common/admin-data-boxes';
import { Car, Driver, Game, Track } from '../types';

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
    }, [session?.game, dataType]);

    const loadTracks = () => {
        if (!session)
            return;

        session.setLoading(true);

        session.checkSession()
            .then((success) => {
                if (!success)
                    return;

                axios.get('/tracks/lapCheck/' + session.game)
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

                axios.get('/cars/lapCheck/' + session.game)
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

                axios.get('/drivers/lapCheck')
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

                axios.get('/games/lapCheck')
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

    const calculateTotal = () => {
        if (dataType === 'Tracks')
            return tracks.length;
        else if (dataType === 'Cars')
            return cars.length;
        else if (dataType === 'Drivers')
            return drivers.length;
        else if (dataType === 'Games')
            return games.length;
    }

    return (
        <React.Fragment>
            <div className="admin-page">
                <div className="admin-title-row">
                    <span className="admin-title">Manage Data</span>
                    <span className="admin-select-data">
                        <select className="add-btn btn btn-primary" onChange={onChangeDataType}>
                            <option value="Tracks">Tracks</option>
                            <option value="Cars">Cars</option>
                            <option value="Drivers">Drivers</option>
                            <option value="Games">Games</option>
                        </select>
                    </span>
                    <span className="admin-total">Total: <strong>{calculateTotal()}</strong></span>
                </div>
            {
                session?.loading &&
                <div className="mt-2 ml-2">
                    <strong>Loading data...</strong>
                </div>
            }
            {
                !session?.loading &&
                <div>
                {
                    dataType === 'Tracks' &&
                    <AdminDataBoxes data={tracks} />
                }
                {
                    dataType === 'Cars' &&
                    <AdminDataBoxes data={cars} />
                }
                {
                    dataType === 'Drivers' &&
                    <AdminDataBoxes data={drivers} />
                }
                {
                    dataType === 'Games' &&
                    <AdminDataBoxes data={games} />
                }
                </div>
            }
            </div>
        </React.Fragment>
    )
}

export default Admin