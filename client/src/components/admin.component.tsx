import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios';
import ReactTooltip from 'react-tooltip';
import addIcon from '../assets/add_blue.png';
import { SessionContext } from '../context/session.context';
import AdminDataAdd from './common/admin-data-add.component';
import AdminDataBoxes from './common/admin-data-boxes.component';
import { Car, Driver, Game, Track } from '../types';

const Admin = () => {

    const session = useContext(SessionContext);

    const [dataType, setDataType] = useState('Tracks');
    const [showAdd, setShowAdd] = useState(false);

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

        setShowAdd(false);
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

    const onClickAdd = () => {
        setShowAdd(true);
    }

    const handleAdd = async (newName: string) => {
        console.log(newName);

        if (dataType === 'Tracks') {
            const result = await performAdd('track', { game: session?.game, name: newName });

            if (!result)
                return;

            const newTracks = [...tracks,
                {
                    _id: result._id,
                    game: result.game,
                    name: result.name
                }
            ];

            newTracks.sort((a,b) => {
                return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);
            });

            setTracks(newTracks);
        }
        else if (dataType === 'Cars') {
            const result = await performAdd('car', { game: session?.game, name: newName });

            if (!result)
                return;

            const newCars = [...cars,
                {
                    _id: result._id,
                    game: result.game,
                    name: result.name
                }
            ];

            newCars.sort((a,b) => {
                return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);
            });

            setCars(newCars);
        }
        else if (dataType === 'Drivers') {
            const result = await performAdd('driver', { name: newName });

            if (!result)
                return;

            const newDrivers = [...drivers,
                {
                    _id: result._id,
                    name: result.name,
                    isAdmin: false
                }
            ];

            newDrivers.sort((a,b) => {
                return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);
            });

            setDrivers(newDrivers);
        }
        else if (dataType === 'Games') {
            const newCode = determineGameCode(newName)

            const result = await performAdd('game', { name: newName, code: newCode });

            if (!result)
                return;

            const newGames = [...games,
                {
                    _id: result._id,
                    name: result.name,
                    code: result.code
                }
            ];

            newGames.sort((a,b) => {
                return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);
            });

            setGames(newGames);
        }
    }

    const determineGameCode = (name: string): string => {
        const words = name.split(' ');

        let code = '';

        words.forEach((word) => code = code + word[0]);

        return code;
    }

    const cancelAdd = () => {
        setShowAdd(false);
    }

    const performAdd = (cmdType: string, request: any) => {
        return axios.post('/' + cmdType + 's/add', request)
            .then(result => {
                setShowAdd(false);

                return result.data;
            })
            .catch(err => console.error('Error [Add ' + cmdType + ']: ' + err));
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
        if (track.hasLaps)
            return;

        session?.setLoading(true);

        axios.delete('/tracks/delete/' + track._id)
            .then(res => {
                const updatedTracks = tracks.filter((track: Track) => track._id !== res.data._id)

                setTracks(updatedTracks);
            })
            .catch(err => {
                console.error(err);
            })
            .finally(() => {
                session?.setLoading(false)
            });
    }

    const deleteCar = (car: Car, index: number) => {
        if (car.hasLaps)
            return;

        session?.setLoading(true);

        axios.delete('/cars/delete/' + car._id)
            .then(res => {
                const updatedCars = cars.filter((car: Car) => car._id !== res.data._id)

                setCars(updatedCars);
            })
            .catch(err => {
                console.error(err);
            })
            .finally(() => {
                session?.setLoading(false)
            });
    }

    const deleteDriver = (driver: Driver, index: number) => {
        if (driver.hasLaps)
            return;

        session?.setLoading(true);

        axios.delete('/drivers/delete/' + driver._id)
            .then(res => {
                const updatedDrivers = drivers.filter((driver: Driver) => driver._id !== res.data._id)

                setDrivers(updatedDrivers);
            })
            .catch(err => {
                console.error(err);
            })
            .finally(() => {
                session?.setLoading(false)
            });
    }

    const deleteGame = (game: Game, index: number) => {
        if (game.hasLaps)
            return;

        session?.setLoading(true);

        axios.delete('/games/delete/' + game._id)
            .then(res => {
                const updatedGames = games.filter((game: Game) => game._id !== res.data._id)

                setGames(updatedGames);
            })
            .catch(err => {
                console.error(err);
            })
            .finally(() => {
                session?.setLoading(false)
            });
    }

    return (
        <React.Fragment>
            <div className="admin-page">
                <div className="admin-title-row">
                    <span className="admin-title">Manage Data</span>
                    <span className="admin-select-container">
                        <select className="admin-select" onChange={onChangeDataType}>
                            <option value="Tracks">Tracks</option>
                            <option value="Cars">Cars</option>
                            <option value="Drivers">Drivers</option>
                            <option value="Games">Games</option>
                        </select>
                    </span>
                    <span className="add-data-container">
                        <button className="add-data-btn" data-tip="Add" data-for="add" onClick={onClickAdd}>
                            <img className="add-icon" src={addIcon} alt="admin"></img>
                        </button>
                        <ReactTooltip id="add" place="right" effect="solid"/>
                    </span>
                    <span className="admin-total">
                        <span className="sub-item">Total: </span>
                        <span><strong>{calculateTotal()}</strong></span>
                    </span>
                </div>
            {
                session?.loading &&
                <div className="mt-2 ml-2">
                    <strong>Loading data...</strong>
                </div>
            }
            {
                !session?.loading &&
                <div className="data-container">
                {
                    !!showAdd &&
                    <AdminDataAdd showAdd={showAdd} onSave={handleAdd} onCancel={cancelAdd} />
                }
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