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

    const updateTrack = (newTrack: Track) => {
        console.log(newTrack);
    }

    const updateCar = (newCar: Car) => {
        console.log(newCar);
    }

    const updateDriver = (newDriver: Driver) => {
        console.log(newDriver);
    }

    const updateGame = (newGame: Game) => {
        console.log(newGame);
    }

    const deleteTrack = (track: Track, index: number) => {
        console.log(track);
    }

    const deleteCar = (car: Car, index: number) => {
        console.log(car);
    }

    const deleteDriver = (driver: Driver, index: number) => {
        console.log(driver);
    }

    const deleteGame = (game: Game, index: number) => {
        console.log(game);
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
                    <AdminDataBoxes data={tracks} onUpdate={updateTrack} onDelete={deleteTrack} />
                }
                {
                    dataType === 'Cars' &&
                    <AdminDataBoxes data={cars} onUpdate={updateCar} onDelete={deleteCar} />
                }
                {
                    dataType === 'Drivers' &&
                    <AdminDataBoxes data={drivers} onUpdate={updateDriver} onDelete={deleteDriver} />
                }
                {
                    dataType === 'Games' &&
                    <AdminDataBoxes data={games} onUpdate={updateGame} onDelete={deleteGame} />
                }
                </div>
            }
            </div>
        </React.Fragment>
    )
}

export default Admin