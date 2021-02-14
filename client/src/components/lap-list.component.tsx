import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { isBefore, isAfter } from 'date-fns';
import LapItem from './lap-item.component';
import { SessionContext } from '../context/session.context';
import { getAcTrackerGameState, setAcTrackerGameState } from './common/ac-localStorage';
import { isLapRecord, isLapRecordForCar, isPersonalLapRecordForCar } from '../utils/laptime.utils';
import { Car, Driver, Lap, Track } from '../types';

const LapList: React.FC = () => {

    const session = useContext(SessionContext);

    const [originalLaps, setOriginalLaps] = useState([]);

    const [laps, setLaps] = useState<Lap[]>([]);
    const [tracks, setTracks] = useState<Track[]>([]);
    const [cars, setCars] = useState<Car[]>([]);
    const [drivers, setDrivers] = useState<Driver[]>([]);

    const history = useHistory();

    useEffect(() => {
        handleLoadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session?.game]);

    const handleLoadData = () => {
        if (!session)
            return;

        session.setLoading(true);

        session.checkSession()
            .then((success) => {
                if (!success)
                    return;

                axios.get('/laps/' + session.game)
                    .then(res => {
                        setOriginalLaps(res.data);

                        handleSetLaps(res.data);

                        session.setLoading(false);
                    })
                    .catch(err => {
                        console.error(err);
                    });

                axios.get('/tracks/' + session.game)
                    .then(res => {
                        handleSetTracks(res.data);
                    })
                    .catch(err => {
                        console.error(err);
                    });

                axios.get('/cars/' + session.game)
                    .then(res => {
                        handleSetCars(res.data);
                    })
                    .catch(err => {
                        console.error(err);
                    });

                axios.get('/drivers')
                    .then(res => {
                        handleSetDrivers(res.data);
                    })
                    .catch(err => {
                        console.error(err);
                    });
            });
    }

    const handleSetLaps = (newLaps: Lap[]) => {
        let sortedLaps = handleChangeSort(getAcTrackerGameState(session?.game).sortType, newLaps);

        if (getAcTrackerGameState(session?.game).trackType !== 'ALL')
            sortedLaps = sortedLaps.filter((lap: Lap) => lap.track === getAcTrackerGameState(session?.game).trackType);

        if (getAcTrackerGameState(session?.game).carType !== 'ALL')
            sortedLaps = sortedLaps.filter((lap: Lap) => lap.car === getAcTrackerGameState(session?.game).carType);

        if (getAcTrackerGameState(session?.game).driverType !== 'ALL')
            sortedLaps = sortedLaps.filter((lap: Lap) => lap.driver === getAcTrackerGameState(session?.game).driverType);

        setLaps(sortedLaps);
    };

    const handleSetTracks = (newTracks: Track[]) => {
        newTracks.sort((a,b) => {
            return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);
        });

        setTracks(newTracks);
    };

    const handleSetCars = (newCars: Car[]) => {
        newCars.sort((a,b) => {
            return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);
        });

        setCars(newCars);
    };

    const handleSetDrivers = (newDrivers: Driver[]) => {
        newDrivers.sort((a,b) => {
            return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);
        });

        setDrivers(newDrivers);
    };

    const onClickAdd = () => {
        history.push('/addLap');
    }

    const onChangeTrack = (trackEvent: React.ChangeEvent<HTMLSelectElement>) => {
        handleChangeTrack(trackEvent.target.value);

        setAcTrackerGameState(session?.game, { ...getAcTrackerGameState(session?.game), trackType: trackEvent.target.value });
    }

    const handleChangeTrack = (newTrackType: string) => {
        let filteredLaps;

        filteredLaps = [...originalLaps];

        filteredLaps = handleChangeSort(getAcTrackerGameState(session?.game).sortType, filteredLaps);

        if (getAcTrackerGameState(session?.game).driverType !== 'ALL')
            filteredLaps = filteredLaps.filter((lap: Lap) => lap.driver === getAcTrackerGameState(session?.game).driverType);

        if (getAcTrackerGameState(session?.game).carType !== 'ALL')
            filteredLaps = filteredLaps.filter((lap: Lap) => lap.car === getAcTrackerGameState(session?.game).carType);

        if (newTrackType !== 'ALL')
            filteredLaps = filteredLaps.filter((lap: Lap) => lap.track === newTrackType);

        setLaps(filteredLaps);
    }

    const onChangeCar = (carEvent: React.ChangeEvent<HTMLSelectElement>) => {
        handleChangeCar(carEvent.target.value);

        setAcTrackerGameState(session?.game, { ...getAcTrackerGameState(session?.game), carType: carEvent.target.value });
    }

    const handleChangeCar = (newCarType: string) => {
        let filteredLaps;

        filteredLaps = [...originalLaps];

        filteredLaps = handleChangeSort(getAcTrackerGameState(session?.game).sortType, filteredLaps);

        if (getAcTrackerGameState(session?.game).trackType !== 'ALL')
            filteredLaps = filteredLaps.filter((lap: Lap) => lap.track === getAcTrackerGameState(session?.game).trackType);

        if (getAcTrackerGameState(session?.game).driverType !== 'ALL')
            filteredLaps = filteredLaps.filter((lap: Lap) => lap.driver === getAcTrackerGameState(session?.game).driverType);

        if (newCarType !== 'ALL')
            filteredLaps = filteredLaps.filter((lap: Lap) => lap.car === newCarType);

        setLaps(filteredLaps);
    }

    const onChangeDriver = (driverEvent: React.ChangeEvent<HTMLSelectElement>) => {
        handleChangeDriver(driverEvent.target.value);

        setAcTrackerGameState(session?.game, { ...getAcTrackerGameState(session?.game), driverType: driverEvent.target.value });
    }

    const handleChangeDriver = (newDriverType: string) => {
        let filteredLaps;

        filteredLaps = [...originalLaps];

        filteredLaps = handleChangeSort(getAcTrackerGameState(session?.game).sortType, filteredLaps);

        if (getAcTrackerGameState(session?.game).trackType !== 'ALL')
            filteredLaps = filteredLaps.filter((lap: Lap) => lap.track === getAcTrackerGameState(session?.game).trackType);

        if (getAcTrackerGameState(session?.game).carType !== 'ALL')
            filteredLaps = filteredLaps.filter((lap: Lap) => lap.car === getAcTrackerGameState(session?.game).carType);

        if (newDriverType !== 'ALL')
            filteredLaps = filteredLaps.filter((lap: Lap) => lap.driver === newDriverType);

        setLaps(filteredLaps);
    }

    const onChangeSort = (sortEvent: React.ChangeEvent<HTMLSelectElement>) => {
        setAcTrackerGameState(session?.game, { ...getAcTrackerGameState(session?.game), sortType: sortEvent.target.value });

        const sortedLaps = handleChangeSort(sortEvent.target.value);

        setLaps(sortedLaps);
    }

    const handleChangeSort = (newSortType: string, newLaps?: Lap[]) => {
        let currentLaps = newLaps ? newLaps : [...laps];

        if (newSortType === 'TRACK') {
            currentLaps.sort((a,b) => {
                return (a.laptime > b.laptime) ? 1 : ((b.laptime > a.laptime) ? -1 : 0);
            });

            currentLaps.sort((a,b) => {
                return (a.track > b.track) ? 1 : ((b.track > a.track) ? -1 : 0);
            });
        }
        else if (newSortType === 'CAR') {
            currentLaps.sort((a,b) => {
                return (a.laptime > b.laptime) ? 1 : ((b.laptime > a.laptime) ? -1 : 0);
            });

            currentLaps.sort((a,b) => {
                return (a.car > b.car) ? 1 : ((b.car > a.car) ? -1 : 0);
            });
        }
        else if (newSortType === 'DRIVER') {
            currentLaps.sort((a,b) => {
                return (a.laptime > b.laptime) ? 1 : ((b.laptime > a.laptime) ? -1 : 0);
            });

            currentLaps.sort((a,b) => {
                return (a.driver > b.driver) ? 1 : ((b.driver > a.driver) ? -1 : 0);
            });
        }
        else if (newSortType === 'LAPTIME') {
            currentLaps.sort((a,b) => {
                return (a.laptime > b.laptime) ? 1 : ((b.laptime > a.laptime) ? -1 : 0);
            });
        }
        else if (newSortType === 'DATE') {
            currentLaps.sort((a,b) => {
                return (a.laptime > b.laptime) ? 1 : ((b.laptime > a.laptime) ? -1 : 0);
            });

            currentLaps.sort((a,b) => {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);

                const aBiggerB = isBefore(dateA, dateB) ? 1 : (isAfter(dateA, dateB) ? -1 : 0);

                return aBiggerB;
            });
        }

        return currentLaps;
    }

    const checkLapRecord = (currentLap: Lap) => {
        return isLapRecord(originalLaps, currentLap);
    }

    const checkLapRecordForCar = (currentLap: Lap) => {
        return isLapRecordForCar(originalLaps, currentLap);
    }

    const checkPersonalLapRecordForCar = (currentLap: Lap) => {
        return isPersonalLapRecordForCar(originalLaps, currentLap);
    }

    const deleteLap = (id: string) => {
        axios.delete('/laps/delete/' + id)
            .then(res => {
                setLaps(laps.filter((lap: Lap) => lap._id !== id));

                setOriginalLaps(originalLaps.filter((lap: Lap) => lap._id !== id));

                history.push('/');
            })
            .catch(err => {
                console.error('Error [Delete Lap]: ' + err);
            });
    }

    if (!session || session.loading) {
        return (
            <React.Fragment>
                <div className="mt-2 ml-2">
                    <strong>Loading your lap records...</strong>
                </div>
            </React.Fragment>
        );
    }

    return (
        <React.Fragment>
        <div>
            <div className="lap-title-row">
                <span className="lap-title">Lap Records</span>
                <span className="lap-add-holder">
                    <button className="add-lap-btn btn btn-primary sub-item" type="button" onClick={onClickAdd}>Add New Lap</button>
                </span>
            </div>
            <div className="lap-filter-labels pt-3 mr-0">
                <span className="lap-filter-md">
                    <select className="lap-filter-select" onChange={onChangeTrack} value={getAcTrackerGameState(session?.game).trackType}>
                        <option value="ALL">All Tracks</option>
                        {
                            tracks.map(track => {
                                return <option value={track.name} key={track._id}>{track.name}</option>
                            })
                        }
                    </select>
                </span>
                <span className="lap-filter-md sub-item">
                    <select className="lap-filter-select" onChange={onChangeCar} value={getAcTrackerGameState(session?.game).carType}>
                        <option value="ALL">All Cars</option>
                        {
                            cars.map(car => {
                                return <option value={car.name} key={car._id}>{car.name}</option>
                            })
                        }
                    </select>
                </span>
                <span className="lap-filter-lg">
                    <select className="lap-filter-select" onChange={onChangeDriver} value={getAcTrackerGameState(session?.game).driverType}>
                        <option value="ALL">All Drivers</option>
                        {
                            drivers.map(driver => {
                                return <option value={driver.name} key={driver._id}>{driver.name}</option>
                            })
                        }
                    </select>
                </span>
                <span className="sub-item">
                    <label>Sort by </label>
                    <select className="lap-filter-select" onChange={onChangeSort} value={getAcTrackerGameState(session?.game).sortType}>
                        <option value="DATE">Date</option>
                        <option value="TRACK">Track</option>
                        <option value="CAR">Car</option>
                        <option value="DRIVER">Driver</option>
                        <option value="LAPTIME">Laptime</option>
                    </select>
                </span>
                <span className="laps-shown">
                    <span className="sub-item">Laps: </span>
                    <span>{laps.length} / {originalLaps.length}</span>
                </span>
            </div>
            <table className="table table-hover mt-2">
                <thead className="thead-light">
                    <tr>
                        <th>Track</th>
                        <th>Car</th>
                        <th></th>
                        <th>Laptime</th>
                        <th>Driver</th>
                        <th className="sub-item">Gears</th>
                        <th className="sub-item">TC</th>
                        <th className="sub-item">SC</th>
                        <th>Date</th>
                        <th className="sub-item"></th>
                        <th className="actions-heading sub-item">Actions</th>
                    </tr>
                </thead>
                <tbody>
                {
                    laps.map(lap => {
                        return (
                            <LapItem lap={lap}
                            isLapRecord={checkLapRecord}
                            isLapRecordForCar={checkLapRecordForCar}
                            isPersonalLapRecordForCar={checkPersonalLapRecordForCar}
                            deleteLap={deleteLap}
                            key={lap._id}
                            />
                        )
                    })
                }
                </tbody>
            </table>
        </div>
        </React.Fragment>
    );
}

export default LapList;