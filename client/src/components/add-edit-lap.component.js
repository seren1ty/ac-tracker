import React, { useEffect, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const AddEditLap = props => {

    const location = useLocation();
    const [existingLap] = useState(location.state ? location.state : null);

    const [tracks, setTracks] = useState([]);
    const [cars, setCars] = useState([]);
    const [drivers, setDrivers] = useState([]);

    const [track, setTrack] = useState(() => {
        if (existingLap)
            return existingLap.track;

        if (localStorage.getItem('acTracker')) {
            if (JSON.parse(localStorage.getItem('acTracker')).newLapDefaultTrack)
                return JSON.parse(localStorage.getItem('acTracker')).newLapDefaultTrack;
        }

        return '';
    });

    const [car, setCar] = useState(() => {
        if (existingLap)
            return existingLap.car;

        if (localStorage.getItem('acTracker')) {
            if (JSON.parse(localStorage.getItem('acTracker')).newLapDefaultCar)
                return JSON.parse(localStorage.getItem('acTracker')).newLapDefaultCar;
        }

        return '';
    });

    const [laptime, setLaptime] = useState(existingLap ? existingLap.laptime : '');

    const [driver, setDriver] = useState(() => {
        if (existingLap)
            return existingLap.driver;

        if (localStorage.getItem('acTracker')) {
            if (JSON.parse(localStorage.getItem('acTracker')).newLapDefaultDriver)
                return JSON.parse(localStorage.getItem('acTracker')).newLapDefaultDriver;
        }

        return '';
    });

    const [gearbox, setGearbox] = useState(() => {
        if (existingLap)
            return existingLap.gearbox;

        if (localStorage.getItem('acTracker')) {
            if (JSON.parse(localStorage.getItem('acTracker')).newLapDefaultGearbox)
                return JSON.parse(localStorage.getItem('acTracker')).newLapDefaultGearbox;
        }

        return 'Automatic';
    });

    const [traction, setTraction] = useState(() => {
        if (existingLap)
            return existingLap.traction;

        if (localStorage.getItem('acTracker')) {
            if (JSON.parse(localStorage.getItem('acTracker')).newLapDefaultTraction)
                return JSON.parse(localStorage.getItem('acTracker')).newLapDefaultTraction;
        }

        return 'Factory';
    });

    const [stability, setStability] = useState(() => {
        if (existingLap)
            return existingLap.stability;

        if (localStorage.getItem('acTracker')) {
            if (JSON.parse(localStorage.getItem('acTracker')).newLapDefaultStability)
                return JSON.parse(localStorage.getItem('acTracker')).newLapDefaultStability;
        }

        return 'Factory';
    });

    const [notes, setNotes] = useState(() => {
        if (existingLap)
            return existingLap.notes;

        if (localStorage.getItem('acTracker')) {
            if (JSON.parse(localStorage.getItem('acTracker')).newLapDefaultNotes)
                return JSON.parse(localStorage.getItem('acTracker')).newLapDefaultNotes;
        }

        return '';
    });

    const [date, setDate] = useState(existingLap ? new Date(existingLap.date) : new Date());

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

        axios.get('/tracks')
            .then(res => {
                if (res.data.length > 0) {
                    setTracks(res.data.map(t => t.name));

                    if (!track)
                        setTrack(res.data[0].name);
                }
            })
            .catch(err => {
                console.error('Error [Get Tracks]: ' + err);
            });

        axios.get('/cars')
            .then(res => {
                if (res.data.length > 0) {
                    setCars(res.data.map(c => c.name));

                    if (!car)
                        setCar(res.data[0].name);
                }
            })
            .catch(err => {
                console.error('Error [Get Cars]: ' +err);
            });

        axios.get('/drivers')
            .then(res => {
                if (res.data.length > 0) {
                    let currentDriver = res.data[0].name;

                    if (localStorage.getItem('acTracker')) {
                        const acState = JSON.parse(localStorage.getItem('acTracker'));

                        if (acState.driverType !== 'ALL')
                            currentDriver = acState.driverType;
                    }

                    setDrivers(res.data.map(d => d.name));

                    if (!driver)
                        setDriver(currentDriver);
                }
            })
            .catch(err => {
                console.error('Error [Get Drivers]: ' +err);
            });
    }, []);

    const onChangeTrack = event => {
        setTrack(event.target.value);
    }

    const onChangeCar = event => {
        setCar(event.target.value);
    }

    const onChangeLaptime = event => {
        setLaptime(event.target.value);
    }

    const onChangeDriver = event => {
        setDriver(event.target.value);
    }

    const onChangeGearbox = event => {
        setGearbox(event.target.value);
    }

    const onChangeTraction = event => {
        setTraction(event.target.value);
    }

    const onChangeStability = event => {
        setStability(event.target.value);
    }

    const onChangeNotes = event => {
        setNotes(event.target.value);
    }

    const onChangeDate = newDate => {
        setDate(newDate);
    }

    const onSubmit = event => {
        event.preventDefault();

        const lapToSave = {
            track: track,
            car: car,
            laptime: laptime,
            driver: driver,
            gearbox: gearbox,
            traction: traction,
            stability: stability,
            notes: notes,
            date: date
        }

        console.log(lapToSave);

        if (existingLap)
            editLap(lapToSave);
        else
            addLap(lapToSave)
    }

    const addLap = (lapToSave) => {
        axios.post('/laps/add', lapToSave)
            .then(res => {
                updateNewLapDefaults();

                console.log(res.data)

                history.push('/');
            })
            .catch(err => {
                console.error('Error [Add Lap]: ' + err)
            });
    }

    const editLap = (lapToSave) => {
        axios.post('/laps/edit/' + existingLap._id, lapToSave)
            .then(res => {
                console.log(res.data)

                history.push('/');
            })
            .catch(err => {
                console.error('Error [Edit Lap]: ' + err)
            });
    }

    const updateNewLapDefaults = () => {
        if (localStorage.getItem('acTracker')) {
            const acState = JSON.parse(localStorage.getItem('acTracker'));

            acState.newLapDefaultTrack = track;
            acState.newLapDefaultCar = car;
            acState.newLapDefaultDriver = driver;
            acState.newLapDefaultGearbox = gearbox;
            acState.newLapDefaultTraction = traction;
            acState.newLapDefaultStability = stability;
            acState.newLapDefaultNotes = notes;

            localStorage.setItem('acTracker', JSON.stringify(acState));
        }
    }

    return (
        <div>
            {
                existingLap ? (
                    <h4>Edit Lap</h4>
                ) : (
                    <h4>New Lap</h4>
                )
            }
            <form onSubmit={onSubmit}>
                <div className="form-group mt-3">
                    <label>Track: </label>
                    <select
                        required
                        className="form-control"
                        value={track}
                        onChange={onChangeTrack}>
                        {
                            tracks.map(currTrack => {
                                return <option
                                    key={currTrack}
                                    value={currTrack}>{currTrack}
                                </option>;
                            })
                        }
                    </select>
                </div>
                <div className="form-group">
                    <label>Car: </label>
                    <select
                        required
                        className="form-control"
                        value={car}
                        onChange={onChangeCar}>
                        {
                            cars.map(currCar => {
                                return <option
                                    key={currCar}
                                    value={currCar}>{currCar}
                                </option>;
                            })
                        }
                    </select>
                </div>
                <div className="form-group">
                    <label>Laptime: </label>
                    <input type="text"
                        required
                        minlength="9"
                        maxlength="9"
                        pattern="\d{2}:\d{2}\.\d{3}"
                        className="form-control"
                        value={laptime}
                        onChange={onChangeLaptime}
                        placeholder="00:00.000"
                    />
                </div>
                <div className="form-group">
                    <label>Driver: </label>
                    <select
                        required
                        className="form-control"
                        value={driver}
                        onChange={onChangeDriver}>
                        {
                            drivers.map(currDriver => {
                                return <option
                                    key={currDriver}
                                    value={currDriver}>{currDriver}
                                </option>;
                            })
                        }
                    </select>
                </div>
                <div className="form-group">
                    <label>Gearbox: </label>
                    <select
                        required
                        className="form-control"
                        value={gearbox}
                        onChange={onChangeGearbox}>
                        <option value="Automatic">Automatic</option>
                        <option value="Manual">Manual</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Traction: </label>
                    <select
                        required
                        className="form-control"
                        value={traction}
                        onChange={onChangeTraction}>
                        <option value="Factory">Factory</option>
                        <option value="On">On</option>
                        <option value="Off">Off</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Stability: </label>
                    <select
                        required
                        className="form-control"
                        value={stability}
                        onChange={onChangeStability}>
                        <option value="Factory">Factory</option>
                        <option value="On">On</option>
                        <option value="Off">Off</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Notes: </label>
                    <input type="text"
                        className="form-control"
                        value={notes}
                        onChange={onChangeNotes}
                    />
                </div>
                <div className="form-group">
                    <label>Date: </label>
                    <div>
                        <DatePicker selected={date} onChange={onChangeDate}/>
                    </div>
                </div>

                <div className="form-group">
                    <input className="btn btn-primary mr-4" type="submit" value={existingLap ? "Update Lap" : "Add New Lap"}/>
                    <Link to="/">Cancel</Link>
                </div>
            </form>
        </div>
    )
}

export default AddEditLap;