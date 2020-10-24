import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import LapItem from './lap-item.component';

const LapList = props => {

    const [originalLaps, setOriginalLaps] = useState([]);

    const [laps, setLaps] = useState([]);
    const [tracks, setTracks] = useState([]);
    const [drivers, setDrivers] = useState([]);

    const [trackType, setTrackType] = useState('ALL');
    const [driverType, setDriverType] = useState(() => {
        if (!localStorage.getItem('acTracker'))
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

        axios.get('/drivers')
            .then(res => {
                handleSetDrivers(res.data);
            })
            .catch(err => {
                console.error(err);
            });
    }, []);

    const handleSetLaps = (newLaps) => {
        const sortedLaps = handleChangeSort(sortType, newLaps);

        if (driverType === 'ALL')
            setLaps(sortedLaps);
        else
            setLaps(sortedLaps.filter(lap => lap.driver === driverType));
    };

    const handleSetTracks = (newTracks) => {
        newTracks.sort((a,b) => {
            return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);
        });

        setTracks(newTracks);
    };

    const handleSetDrivers = (newDrivers) => {
        newDrivers.sort((a,b) => {
            return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);
        });

        setDrivers(newDrivers);
    };

    const onChangeTrack = (trackEvent) => {
        let filteredLaps;

        filteredLaps = [...originalLaps];

        filteredLaps = handleChangeSort(sortType, filteredLaps);

        if (driverType !== 'ALL')
            filteredLaps = filteredLaps.filter(lap => lap.driver === driverType);

        if (trackEvent.target.value !== 'ALL')
            filteredLaps = filteredLaps.filter(lap => lap.track === trackEvent.target.value);

        setTrackType(trackEvent.target.value);

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
                <span>
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
                <span>
                    <span> | Driver: </span>
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
                    <span> | Sort by: </span>
                    <select onChange={onChangeSort} value={sortType}>
                        <option value="TRACK">Track</option>
                        <option value="CAR">Car</option>
                        <option value="DRIVER">Driver</option>
                        <option value="LAPTIME">Laptime</option>
                    </select>
                </span>
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