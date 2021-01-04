import React, { useContext, useEffect, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { SessionContext } from '../context/session.context';
import { getAcTrackerState, setAcTrackerState } from './common/ac-localStorage';
import { Car, Lap, Track } from './lap-list.component';

const AddEditLap: React.FC = () => {

    const history = useHistory();

    const session = useContext(SessionContext);

    const location = useLocation();

    const [loading, setLoading] = useState(false);

    const [existingLap] = useState(() => {
        if (location.state) {
            return location.state;
        } else if (location.pathname.startsWith('/editLap')) {
            if (getAcTrackerState()) {
                let storedCurrentLap = getAcTrackerState().currentLapToEdit;

                if (storedCurrentLap && location.pathname.endsWith(storedCurrentLap._id))
                    return storedCurrentLap;
            }
        }

        return null;
    });

    const [tracks, setTracks] = useState([]);
    const [cars, setCars] = useState([]);

    const [addTrackInProgress, setAddTrackInProgress] = useState(false);
    const [newTrackName, setNewTrackName] = useState('');

    const [addCarInProgress, setAddCarInProgress] = useState(false);
    const [newCarName, setNewCarName] = useState('');

    const [submitClicked, setSubmitClicked] = useState(false);

    const [game, setGame] = useState<String | null | undefined>();

    const [track, setTrack] = useState(() => existingLap ? existingLap.track : getAcTrackerState().newLapDefaultTrack);

    const [car, setCar] = useState(() => existingLap ? existingLap.car : getAcTrackerState().newLapDefaultCar);

    const [laptime, setLaptime] = useState(() => existingLap ? existingLap.laptime : '');

    const [driver] = useState(() => session ? session.driver : existingLap ? existingLap.driver : '');

    const [gearbox, setGearbox] = useState(() => existingLap ? existingLap.gearbox : getAcTrackerState().newLapDefaultGearbox);

    const [traction, setTraction] = useState(() => existingLap ? existingLap.traction : getAcTrackerState().newLapDefaultTraction);

    const [stability, setStability] = useState(() => existingLap ? existingLap.stability : getAcTrackerState().newLapDefaultStability);

    const [date, setDate] = useState(() => existingLap ? new Date(existingLap.date) : new Date());

    const [replay, setReplay] = useState(() => existingLap ? existingLap.replay : '');

    const [notes, setNotes] = useState(() => existingLap ? existingLap.notes : getAcTrackerState().newLapDefaultNotes);

    useEffect(() => {
        setLoading(true);

        if (!session)
            return;

        session.checkSession()
            .then((success) => {
                if (!success)
                    return;

                if (!existingLap && location.pathname.startsWith('/editLap'))
                    window.location.href = '/';

                setGame(session.game);

                axios.get('/tracks/' + session.game)
                    .then(res => {
                        if (res.data.length > 0) {
                            setTracks(res.data.map((t: Track) => t.name));

                            if (!track)
                                setTrack(res.data[0].name);
                        }
                    })
                    .catch(err => {
                        console.error('Error [Get Tracks]: ' + err);
                    });

                axios.get('/cars/' + session.game)
                    .then(res => {
                        if (res.data.length > 0) {
                            setCars(res.data.map((c: Car) => c.name));

                            if (!car)
                                setCar(res.data[0].name);
                        }
                    })
                    .catch(err => {
                        console.error('Error [Get Cars]: ' + err);
                    });

                    // We are currently editting a lap, NOT creating a new one
                    if (location.state && location.pathname.startsWith('/editLap'))
                        setAcTrackerState({ ...getAcTrackerState(), currentLapToEdit: location.state });

                    setLoading(false);
            });

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // If game is switched whilst adding/editting a lap, redirect to main lap list
    useEffect(() => {
        if (!!game)
            history.push('/');
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session?.game]);

    const onChangeTrack = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setTrack(event.target.value);
    }

    const onChangeCar = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setCar(event.target.value);
    }

    const onChangeLaptime = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLaptime(event.target.value);
    }

    const onChangeGearbox = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setGearbox(event.target.value);
    }

    const onChangeTraction = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setTraction(event.target.value);
    }

    const onChangeStability = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setStability(event.target.value);
    }

    const onChangeDate = (newDate: Date) => {
        setDate(newDate);
    }

    const onChangeReplay = (event: React.ChangeEvent<HTMLInputElement>) => {
        setReplay(event.target.value);
    }

    const onChangeNotes = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNotes(event.target.value);
    }

    const onClickAddTrack = () => {
        setAddTrackInProgress(true);
    }

    const onClickCancelAddTrack = () => {
        setAddTrackInProgress(false);
    }

    const onChangeNewTrackName = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewTrackName(event.target.value);
    }

    const onClickAddCar = () => {
        setAddCarInProgress(true);
    }

    const onClickCancelAddCar = () => {
        setAddCarInProgress(false);
    }

    const onChangeNewCarName = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewCarName(event.target.value);
    }

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setSubmitClicked(true);

        const lapToSave: Lap = {
            _id: '',
            game: !existingLap ? session?.game : existingLap.game,
            track: !addTrackInProgress ? track : newTrackName,
            car: !addCarInProgress ? car : newCarName,
            laptime: laptime,
            driver: driver,
            gearbox: gearbox,
            traction: traction,
            stability: stability,
            date: date,
            replay: replay,
            notes: !notes ? '' : notes.trim(),
        }

        if (addTrackInProgress)
            handleAddNewTrack(lapToSave);
        else if (addCarInProgress)
            handleAddNewCar(lapToSave);
        else
            handleAddOrEditLap(lapToSave);
    }

    const handleAddNewTrack = (lapToSave: Lap) => {
        axios.post('/tracks/add', { game: session?.game, name: newTrackName })
            .then(() => {
                if (addCarInProgress)
                    handleAddNewCar(lapToSave);
                else
                    handleAddOrEditLap(lapToSave);
            })
            .then(() => setAddTrackInProgress(false))
            .catch(err => console.error('Error [Add Track]: ' + err));
    }

    const handleAddNewCar = (lapToSave: Lap) => {
        axios.post('/cars/add', { game: session?.game, name: newCarName })
            .then(() => handleAddOrEditLap(lapToSave))
            .then(() => setAddCarInProgress(false))
            .catch(err => console.error('Error [Add Car]: ' + err));
    }

    const handleAddOrEditLap = (lapToSave: Lap) => {
        if (existingLap)
            editLap(lapToSave);
        else
            addLap(lapToSave)
    }

    const addLap = (lapToSave: Lap) => {
        axios.post('/laps/add', lapToSave)
            .then(res => {
                updateNewLapDefaults();

                history.push('/');
            })
            .catch(err => {
                console.error('Error [Add Lap]: ' + err)
            });
    }

    const editLap = (lapToSave: Lap) => {
        axios.post('/laps/edit/' + existingLap._id, lapToSave)
            .then(res => {
                history.push('/');
            })
            .catch(err => {
                console.error('Error [Edit Lap]: ' + err)
            });
    }

    const updateNewLapDefaults = () => {
        let currentState = getAcTrackerState();

        currentState.newLapDefaultTrack = !addTrackInProgress ? track : newTrackName;
        currentState.newLapDefaultCar = !addCarInProgress ? car : newCarName;
        currentState.newLapDefaultGearbox = gearbox;
        currentState.newLapDefaultTraction = traction;
        currentState.newLapDefaultStability = stability;
        currentState.newLapDefaultNotes = notes;

        setAcTrackerState(currentState);
    }

    if (loading)
        return (<React.Fragment></React.Fragment>)

    return (
        <React.Fragment>
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
                                    <button className="add-track-car pr-0 btn btn-link" onClick={onClickCancelAddTrack}>Cancel</button>
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
                                minLength={9}
                                maxLength={9}
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
                            <input className="form-control driver-input"
                                required
                                value={driver}
                                disabled={true}/>
                        </div>
                    </div>
                </div>
                <div className="row mt-0">
                    <div className="col mr-3 pr-2">
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
                    <div className="col mr-3 pr-2">
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
                    <div className="col-4 add-edit-date">
                        <div className="form-group">
                            <label className="add-edit-label">Date</label>
                            <div>
                                <DatePicker selected={date} onChange={onChangeDate} dateFormat="dd/MM/yy"/>
                            </div>
                        </div>
                    </div>
                    <div className="col-8 pl-4 pr-0">
                        <div className="form-group">
                            <label className="add-edit-label">Replay</label>
                            <input className="form-control"
                                type="text"
                                value={replay}
                                onChange={onChangeReplay}
                                placeholder="Enter URL of uploaded lap replay - Eg. Youtube"/>
                        </div>
                    </div>
                </div>
                <div className="row mt-0 mr-0">
                    <div className="col-12 pr-0">
                        <div className="form-group">
                            <label className="add-edit-label">Notes</label>
                            <input className="form-control"
                                type="text"
                                value={notes}
                                onChange={onChangeNotes}/>
                        </div>
                    </div>
                </div>
                <div className="form-group mt-2 add-edit-button">
                    <input className="btn btn-primary mr-4"
                        type="submit"
                        disabled={submitClicked}
                        value={existingLap ? "Update Lap" : "Add New Lap"}/>
                    <Link to="/">Cancel</Link>
                </div>
            </form>
        </div>
        </React.Fragment>
    )
}

export default AddEditLap;