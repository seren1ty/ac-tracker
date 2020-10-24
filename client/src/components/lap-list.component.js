import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import LapItem from './lap-item.component';

const LapList = props => {

    const [originalLaps, setOriginalLaps] = useState([]);

    const [laps, setLaps] = useState([]);
    const [tracks, setTracks] = useState([]);
    const [cars, setCars] = useState([]);
    const [drivers, setDrivers] = useState([]);

    const [trackType, setTrackType] = useState(() => {
        if (!localStorage.getItem('acTracker') || !JSON.parse(localStorage.getItem('acTracker')).trackType)
            return 'ALL';
        else
            return JSON.parse(localStorage.getItem('acTracker')).trackType;
    });

    const [carType, setCarType] = useState(() => {
        if (!localStorage.getItem('acTracker') || !JSON.parse(localStorage.getItem('acTracker')).carType)
            return 'ALL';
        else
            return JSON.parse(localStorage.getItem('acTracker')).carType;
    });

    const [driverType, setDriverType] = useState(() => {
        if (!localStorage.getItem('acTracker') || !JSON.parse(localStorage.getItem('acTracker')).driverType)
            return 'ALL';
        else
            return JSON.parse(localStorage.getItem('acTracker')).driverType;
    });

    const [sortType, setSortType] = useState('LAPTIME');

    const history = useHistory();

    useEffect(() => {
        axios.get('/session/status')
            .then(user => {
                console.log('Session valid: ' + user);
            })
            .catch(err => {
                console.error('Session expired!');

                history.push('/login');
            });

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
    }, []);

    const handleSetLaps = (newLaps) => {
        let sortedLaps = handleChangeSort(sortType, newLaps);

        if (trackType !== 'ALL')
            sortedLaps = sortedLaps.filter(lap => lap.track === trackType);

        if (carType !== 'ALL')
            sortedLaps = sortedLaps.filter(lap => lap.car === carType);

        if (driverType !== 'ALL')
            sortedLaps = sortedLaps.filter(lap => lap.driver === driverType);

        setLaps(sortedLaps);
    };

    const handleSetTracks = (newTracks) => {
        newTracks.sort((a,b) => {
            return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);
        });

        setTracks(newTracks);
    };

    const handleSetCars = (newCars) => {
        newCars.sort((a,b) => {
            return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);
        });

        setCars(newCars);
    };

    const handleSetDrivers = (newDrivers) => {
        newDrivers.sort((a,b) => {
            return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);
        });

        setDrivers(newDrivers);
    };

    const onChangeTrack = (trackEvent) => {
        handleChangeTrack(trackEvent.target.value);

        let currentState = {};

        if (localStorage.getItem('acTracker'))
            currentState = JSON.parse(localStorage.getItem('acTracker'));

        currentState.trackType = trackEvent.target.value;

        localStorage.setItem('acTracker', JSON.stringify(currentState));
    }

    const handleChangeTrack = (newTrackType) => {
        let filteredLaps;

        filteredLaps = [...originalLaps];

        filteredLaps = handleChangeSort(sortType, filteredLaps);

        if (driverType !== 'ALL')
            filteredLaps = filteredLaps.filter(lap => lap.driver === driverType);

        if (carType !== 'ALL')
            filteredLaps = filteredLaps.filter(lap => lap.car === carType);

        if (newTrackType !== 'ALL')
            filteredLaps = filteredLaps.filter(lap => lap.track === newTrackType);

        setTrackType(newTrackType);

        setLaps(filteredLaps);
    }

    const onChangeCar = (carEvent) => {
        handleChangeCar(carEvent.target.value);

        let currentState = {};

        if (localStorage.getItem('acTracker'))
            currentState = JSON.parse(localStorage.getItem('acTracker'));

        currentState.carType = carEvent.target.value;

        localStorage.setItem('acTracker', JSON.stringify(currentState));
    }

    const handleChangeCar = (newCarType) => {
        let filteredLaps;

        filteredLaps = [...originalLaps];

        filteredLaps = handleChangeSort(sortType, filteredLaps);

        if (trackType !== 'ALL')
            filteredLaps = filteredLaps.filter(lap => lap.track === trackType);

        if (driverType !== 'ALL')
            filteredLaps = filteredLaps.filter(lap => lap.driver === driverType);

        if (newCarType !== 'ALL')
            filteredLaps = filteredLaps.filter(lap => lap.car === newCarType);

        setCarType(newCarType);

        setLaps(filteredLaps);
    }

    const onChangeDriver = (driverEvent) => {
        handleChangeDriver(driverEvent.target.value);

        let currentState = {};

        if (localStorage.getItem('acTracker'))
            currentState = JSON.parse(localStorage.getItem('acTracker'));

        currentState.driverType = driverEvent.target.value;

        localStorage.setItem('acTracker', JSON.stringify(currentState));
    }

    const handleChangeDriver = (newDriverType) => {
        let filteredLaps;

        filteredLaps = [...originalLaps];

        filteredLaps = handleChangeSort(sortType, filteredLaps);

        if (trackType !== 'ALL')
            filteredLaps = filteredLaps.filter(lap => lap.track === trackType);

        if (carType !== 'ALL')
            filteredLaps = filteredLaps.filter(lap => lap.car === carType);

        if (newDriverType !== 'ALL')
            filteredLaps = filteredLaps.filter(lap => lap.driver === newDriverType);

        setDriverType(newDriverType);

        setLaps(filteredLaps);
    }

    const onChangeSort = (sortEvent) => {
        const sortedLaps = handleChangeSort(sortEvent.target.value);

        setLaps(sortedLaps);
    }

    const handleChangeSort = (newSortType, newLaps) => {
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

        setSortType(newSortType);

        return currentLaps;
    }

    const deleteLap = id => {
        axios.delete('/laps/delete/' + id)
            .then(res => {
                console.log(res.data);

                setLaps(laps.filter(lap => lap._id !== id));

                setOriginalLaps(originalLaps.filter(lap => lap._id !== id));

                history.push('/');
            })
            .catch(err => {
                console.error('Error [Delete Lap]: ' + err);
            });
    }

    return (
        <div>
            <h4>Lap Records</h4>
            <div className="pt-2">
                <span className="pr-3">
                    <span>Track: </span>
                    <select onChange={onChangeTrack} value={trackType}>
                        <option value="ALL">All</option>
                        {
                            tracks.map(track => {
                                return <option value={track.name} key={track._id}>{track.name}</option>
                            })
                        }
                    </select>
                </span>
                <span className="pr-3">
                    <span>Car: </span>
                    <select onChange={onChangeCar} value={carType}>
                        <option value="ALL">All</option>
                        {
                            cars.map(car => {
                                return <option value={car.name} key={car._id}>{car.name}</option>
                            })
                        }
                    </select>
                </span>
                <span className="pr-3">
                    <span>Driver: </span>
                    <select onChange={onChangeDriver} value={driverType}>
                        <option value="ALL">All</option>
                        {
                            drivers.map(driver => {
                                return <option value={driver.name} key={driver._id}>{driver.name}</option>
                            })
                        }
                    </select>
                </span>
                <span>
                    <span>Sort by: </span>
                    <select onChange={onChangeSort} value={sortType}>
                        <option value="TRACK">Track</option>
                        <option value="CAR">Car</option>
                        <option value="DRIVER">Driver</option>
                        <option value="LAPTIME">Laptime</option>
                    </select>
                </span>
                <span className="lapsShown">Laps shown: {laps.length} / {originalLaps.length}</span>
            </div>
            <table className="table mt-2">
                <thead className="thead-light">
                    <tr>
                        <th>Track</th>
                        <th>Car</th>
                        <th>Laptime</th>
                        <th>Driver</th>
                        <th>Gearbox</th>
                        <th>TC</th>
                        <th>SC</th>
                        <th>Date</th>
                        <th>Actions</th>
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
    );
}

export default LapList;