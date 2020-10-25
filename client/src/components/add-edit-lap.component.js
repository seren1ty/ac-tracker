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

    const [addTrackInProgress, setAddTrackInProgress] = useState(false);
    const [newTrackName, setNewTrackName] = useState('');

    const [addCarInProgress, setAddCarInProgress] = useState(false);
    const [newCarName, setNewCarName] = useState('');

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
            .catch(err => {
                console.error('Session expired: ' + err);

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

    const onClickAddTrack = () => {
        setAddTrackInProgress(true);
    }

    const onClickCancelAddTrack = () => {
        setAddTrackInProgress(false);
    }

    const onChangeNewTrackName = event => {
        setNewTrackName(event.target.value);
    }

    const onClickAddCar = () => {
        setAddCarInProgress(true);
    }

    const onClickCancelAddCar = () => {
        setAddCarInProgress(false);
    }

    const onChangeNewCarName = event => {
        setNewCarName(event.target.value);
    }

    const onSubmit = event => {
        event.preventDefault();

        const lapToSave = {
            track: !addTrackInProgress ? track : newTrackName,
            car: !addCarInProgress ? car : newCarName,
            laptime: laptime,
            driver: driver,
            gearbox: gearbox,
            traction: traction,
            stability: stability,
            notes: notes,
            date: date
        }

        console.log(lapToSave);

        if (addTrackInProgress)
            handleAddNewTrack(lapToSave);
        else if (addCarInProgress)
            handleAddNewCar(lapToSave);
        else
            handleAddOrEditLap(lapToSave);
    }

    const handleAddNewTrack = lapToSave => {
        axios.post('/tracks/add', { name: newTrackName })
            .then(() => {
                if (addCarInProgress)
                    handleAddNewCar(lapToSave);
                else
                    handleAddOrEditLap(lapToSave);
            })
            .then(() => setAddTrackInProgress(false))
            .catch(err => console.error('Error [Add Track]: ' + err));
    }

    const handleAddNewCar = lapToSave => {
        axios.post('/cars/add', { name: newCarName })
            .then(() => handleAddOrEditLap(lapToSave))
            .then(() => setAddCarInProgress(false))
            .catch(err => console.error('Error [Add Car]: ' + err));
    }

    const handleAddOrEditLap = lapToSave => {
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
        let currentState = {};

        if (localStorage.getItem('acTracker'))
            currentState = JSON.parse(localStorage.getItem('acTracker'));

        currentState.newLapDefaultTrack = !addTrackInProgress ? track : newTrackName;
        currentState.newLapDefaultCar = !addCarInProgress ? car : newCarName;
        currentState.newLapDefaultDriver = driver;
        currentState.newLapDefaultGearbox = gearbox;
        currentState.newLapDefaultTraction = traction;
        currentState.newLapDefaultStability = stability;
        currentState.newLapDefaultNotes = notes;

        localStorage.setItem('acTracker', JSON.stringify(currentState));
    }

    return (
        <>
        <div className="form-style">
            {
                existingLap ? (
                    <h4>Edit Lap</h4>
                ) : (
                    <h4>Add Lap</h4>
                )
            }
            <form onSubmit={onSubmit}>
                <div className="row mt-4">
                    <div className="col pr-4">
                        <div className="form-group">
                            <label className="add-edit-label-with-button">Track</label>
                            {
                                !addTrackInProgress ? (
                                    <button className="btn btn-sm btn-secondary add-track-car"
                                        type="button"
                                        onClick={onClickAddTrack}
                                        disabled={addTrackInProgress}>Add Track
                                    </button>
                                ) : (
                                    <button className="add-track-car pr-0 btn btn-link" href="#" onClick={onClickCancelAddTrack}>Cancel</button>
                                )
                            }
                            {
                                !addTrackInProgress ? (
                                    <select className="form-control"
                                        required
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
                                ) : (
                                    <input className="form-control"
                                        type="text"
                                        required
                                        value={newTrackName}
                                        onChange={onChangeNewTrackName}
                                        placeholder="Enter New Track Name"
                                    />
                                )
                            }
                        </div>
                    </div>
                    <div className="col">
                        <div className="form-group">
                            <label className="add-edit-label-with-button">Car</label>
                            {
                                !addCarInProgress ? (
                                    <button className="btn btn-sm btn-secondary add-track-car"
                                        type="button"
                                        onClick={onClickAddCar}
                                        disabled={addCarInProgress}>Add Car
                                    </button>
                                ) : (
                                    <button className="add-track-car pr-0 btn btn-link" onClick={onClickCancelAddCar}>Cancel</button>
                                )
                            }
                            {
                                !addCarInProgress ? (
                                    <select className="form-control"
                                        required
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
                                ) : (
                                    <input className="form-control"
                                        type="text"
                                        required
                                        value={newCarName}
                                        onChange={onChangeNewCarName}
                                        placeholder="Enter New Car Name"
                                    />
                                )
                            }
                        </div>
                    </div>
                </div>
                <div className="row mt-0">
                    <div className="col pr-4">
                        <div className="form-group">
                            <label className="add-edit-label">Laptime</label>
                            <input className="form-control"
                                type="text"
                                required
                                minLength="9"
                                maxLength="9"
                                pattern="\d{2}:\d{2}\.\d{3}"
                                value={laptime}
                                onChange={onChangeLaptime}
                                placeholder="00:00.000"
                            />
                            <small className="text-muted laptime-format">
                            {
                                laptime && laptime.length > 0 && laptime.length < 9 ? (
                                    <span>Format: 00:00.000</span>
                                ) : (
                                    <span>&nbsp;</span>
                                )
                            }
                            </small>
                        </div>
                    </div>
                    <div className="col">
                        <div className="form-group">
                            <label className="add-edit-label">Driver</label>
                            <select className="form-control"
                                required
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
                    </div>
                </div>
                <div className="row mt-0">
                    <div className="col mr-3">
                        <div className="form-group">
                            <label className="add-edit-label">Gearbox</label>
                            <select className="form-control"
                                required
                                value={gearbox}
                                onChange={onChangeGearbox}>
                                <option value="Automatic">Automatic</option>
                                <option value="Manual">Manual</option>
                            </select>
                        </div>
                    </div>
                    <div className="col mr-3">
                        <div className="form-group">
                            <label className="add-edit-label">Traction</label>
                            <select className="form-control"
                                required
                                value={traction}
                                onChange={onChangeTraction}>
                                <option value="Factory">Factory</option>
                                <option value="On">On</option>
                                <option value="Off">Off</option>
                            </select>
                        </div>
                    </div>
                    <div className="col">
                        <div className="form-group">
                            <label className="add-edit-label">Stability</label>
                            <select className="form-control"
                                required
                                value={stability}
                                onChange={onChangeStability}>
                                <option value="Factory">Factory</option>
                                <option value="On">On</option>
                                <option value="Off">Off</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="row mt-0 mr-0">
                    <div className="col-8">
                        <div className="form-group">
                            <label className="add-edit-label">Notes</label>
                            <input className="form-control"
                                type="text"
                                value={notes}
                                onChange={onChangeNotes}
                                />
                        </div>
                    </div>
                    <div className="col-4 pr-0 add-edit-date">
                        <div className="form-group">
                            <label className="add-edit-label">Date</label>
                            <div>
                                <DatePicker selected={date} onChange={onChangeDate} dateFormat="dd/MM/yy"/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="form-group mt-2 add-edit-button">
                    <input className="btn btn-primary mr-4" type="submit" value={existingLap ? "Update Lap" : "Add New Lap"}/>
                    <Link to="/">Cancel</Link>
                </div>
            </form>
        </div>
        </>
    )
}

export default AddEditLap;