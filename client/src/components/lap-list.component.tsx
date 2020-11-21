import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { isBefore, isAfter } from 'date-fns';
import Navbar from "./common/navbar.component";
import LapItem from './lap-item.component';
import { SessionContext } from '../context/session.context';
import { getAcTrackerState, setAcTrackerState } from './common/ac-localStorage';

export type Lap = {
    _id: string;
    track: string;
    car: string;
    driver: string;
    laptime: string;
    gearbox: string;
    traction: string;
    stability: string;
    date: Date;
    replay: string;
    notes: string;
}

export type Track = {
    _id: string;
    name: string;
}

export type Car = {
    _id: string;
    name: string;
}

export type Driver = {
    _id: string;
    name: string;
}

const LapList: React.FC = () => {

    const session = useContext(SessionContext);

    const [loading, setLoading] = useState(false);

    const [originalLaps, setOriginalLaps] = useState([]);

    const [laps, setLaps] = useState<Lap[]>([]);
    const [tracks, setTracks] = useState<Track[]>([]);
    const [cars, setCars] = useState<Car[]>([]);
    const [drivers, setDrivers] = useState<Driver[]>([]);

    const [trackType, setTrackType] = useState(() => {
        return getAcTrackerState() ? getAcTrackerState().trackType : 'ALL';
    });

    const [carType, setCarType] = useState(() => {
        return getAcTrackerState() ? getAcTrackerState().carType : 'ALL';
    });

    const [driverType, setDriverType] = useState(() => {
        return getAcTrackerState() ? getAcTrackerState().driverType : 'ALL';
    });

    const [sortType, setSortType] = useState(() => {
        return getAcTrackerState() ? getAcTrackerState().sortType : 'DATE';
    });

    const history = useHistory();

    useEffect(() => {
        setLoading(true);

        if (!session)
            return;

        session.checkSession()
            .then((success) => {
                if (!success)
                    return;

                axios.get('/laps')
                    .then(res => {
                        setOriginalLaps(res.data);

                        handleSetLaps(res.data);
                    })
                    .catch(err => {
                        console.error(err);
                    });

                axios.get('/tracks')
                    .then(res => {
                        handleSetTracks(res.data);
                    })
                    .catch(err => {
                        console.error(err);
                    });

                axios.get('/cars')
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

                setLoading(false);
            });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSetLaps = (newLaps: Lap[]) => {
        let sortedLaps = handleChangeSort(sortType, newLaps);

        if (trackType !== 'ALL')
            sortedLaps = sortedLaps.filter((lap: Lap) => lap.track === trackType);

        if (carType !== 'ALL')
            sortedLaps = sortedLaps.filter((lap: Lap) => lap.car === carType);

        if (driverType !== 'ALL')
            sortedLaps = sortedLaps.filter((lap: Lap) => lap.driver === driverType);

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

    const onChangeTrack = (trackEvent: React.ChangeEvent<HTMLSelectElement>) => {
        handleChangeTrack(trackEvent.target.value);

        setAcTrackerState({ ...getAcTrackerState(), trackType: trackEvent.target.value });
    }

    const handleChangeTrack = (newTrackType: string) => {
        let filteredLaps;

        filteredLaps = [...originalLaps];

        filteredLaps = handleChangeSort(sortType, filteredLaps);

        if (driverType !== 'ALL')
            filteredLaps = filteredLaps.filter((lap: Lap) => lap.driver === driverType);

        if (carType !== 'ALL')
            filteredLaps = filteredLaps.filter((lap: Lap) => lap.car === carType);

        if (newTrackType !== 'ALL')
            filteredLaps = filteredLaps.filter((lap: Lap) => lap.track === newTrackType);

        setTrackType(newTrackType);

        setLaps(filteredLaps);
    }

    const onChangeCar = (carEvent: React.ChangeEvent<HTMLSelectElement>) => {
        handleChangeCar(carEvent.target.value);

        setAcTrackerState({ ...getAcTrackerState(), carType: carEvent.target.value });
    }

    const handleChangeCar = (newCarType: string) => {
        let filteredLaps;

        filteredLaps = [...originalLaps];

        filteredLaps = handleChangeSort(sortType, filteredLaps);

        if (trackType !== 'ALL')
            filteredLaps = filteredLaps.filter((lap: Lap) => lap.track === trackType);

        if (driverType !== 'ALL')
            filteredLaps = filteredLaps.filter((lap: Lap) => lap.driver === driverType);

        if (newCarType !== 'ALL')
            filteredLaps = filteredLaps.filter((lap: Lap) => lap.car === newCarType);

        setCarType(newCarType);

        setLaps(filteredLaps);
    }

    const onChangeDriver = (driverEvent: React.ChangeEvent<HTMLSelectElement>) => {
        handleChangeDriver(driverEvent.target.value);

        setAcTrackerState({ ...getAcTrackerState(), driverType: driverEvent.target.value });
    }

    const handleChangeDriver = (newDriverType: string) => {
        let filteredLaps;

        filteredLaps = [...originalLaps];

        filteredLaps = handleChangeSort(sortType, filteredLaps);

        if (trackType !== 'ALL')
            filteredLaps = filteredLaps.filter((lap: Lap) => lap.track === trackType);

        if (carType !== 'ALL')
            filteredLaps = filteredLaps.filter((lap: Lap) => lap.car === carType);

        if (newDriverType !== 'ALL')
            filteredLaps = filteredLaps.filter((lap: Lap) => lap.driver === newDriverType);

        setDriverType(newDriverType);

        setLaps(filteredLaps);
    }

    const onChangeSort = (sortEvent: React.ChangeEvent<HTMLSelectElement>) => {
        const sortedLaps = handleChangeSort(sortEvent.target.value);

        setLaps(sortedLaps);

        setAcTrackerState({ ...getAcTrackerState(), sortType: sortEvent.target.value });
    }

    const handleChangeSort = (newSortType: string, newLaps?: Lap[]) => {
        let currentLaps = newLaps ? newLaps : laps;

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

        setSortType(newSortType);

        return currentLaps;
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

    if (loading)
        return (<React.Fragment></React.Fragment>)

    return (
        <React.Fragment>
        <Navbar/>
        <br/>
        <div>
            <h4>Lap Records</h4>
            <div className="lap-filter-labels pt-3 mr-0">
                <span className=" pr-3">
                    <label>Track </label>
                    <select className="lap-filter-select" onChange={onChangeTrack} value={trackType}>
                        <option value="ALL">All</option>
                        {
                            tracks.map(track => {
                                return <option value={track.name} key={track._id}>{track.name}</option>
                            })
                        }
                    </select>
                </span>
                <span className="pr-3">
                    <label>Car </label>
                    <select className="lap-filter-select" onChange={onChangeCar} value={carType}>
                        <option value="ALL">All</option>
                        {
                            cars.map(car => {
                                return <option value={car.name} key={car._id}>{car.name}</option>
                            })
                        }
                    </select>
                </span>
                <span className="pr-4">
                    <label>Driver </label>
                    <select className="lap-filter-select" onChange={onChangeDriver} value={driverType}>
                        <option value="ALL">All</option>
                        {
                            drivers.map(driver => {
                                return <option value={driver.name} key={driver._id}>{driver.name}</option>
                            })
                        }
                    </select>
                </span>
                <span>
                    <label>Sort by </label>
                    <select className="lap-filter-select" onChange={onChangeSort} value={sortType}>
                        <option value="DATE">Date</option>
                        <option value="TRACK">Track</option>
                        <option value="CAR">Car</option>
                        <option value="DRIVER">Driver</option>
                        <option value="LAPTIME">Laptime</option>
                    </select>
                </span>
                <span className="laps-shown">Laps shown: {laps.length} / {originalLaps.length}</span>
            </div>
            <table className="table table-hover mt-2">
                <thead className="thead-light">
                    <tr>
                        <th>Track</th>
                        <th>Car</th>
                        <th></th>
                        <th>Laptime</th>
                        <th>Driver</th>
                        <th>Gears</th>
                        <th>TC</th>
                        <th>SC</th>
                        <th>Date</th>
                        <th></th>
                        <th className="actions-heading">Actions</th>
                    </tr>
                </thead>
                <tbody>
                {
                    laps.map(lap => {
                        return <LapItem lap={lap} deleteLap={deleteLap} key={lap._id} />
                    })
                }
                </tbody>
            </table>
        </div>
        </React.Fragment>
    );
}

export default LapList;