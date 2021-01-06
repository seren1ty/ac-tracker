import React, { useContext, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import AcDate from './common/ac-date.component';
import Truncator from './common/truncator.component';
import ReactTooltip from 'react-tooltip';
import replayIcon from '../assets/replay_blue.png';
import notesIcon from '../assets/notes_blue.png';
import { SessionContext } from '../context/session.context';
import { getAcTrackerGameState } from './common/ac-localStorage';
import { Lap } from './lap-list.component';

type LapItemProps = {
    lap: Lap;
    /* generateLapSplits: (currentLap: Lap) => string; */
    isLapRecord: (currentLap: Lap) => boolean;
    isLapRecordForCar: (currentLap: Lap) => boolean;
    isPersonalLapRecordForCar: (currentLap: Lap) => boolean;
    deleteLap: (_id: string) => void;
}

const LapItem = (props: LapItemProps) => {

    const [lap, setLap] = useState<Lap>(props.lap);

    useEffect(() => {
        lap.isLapRecord = props.isLapRecord(lap);
        lap.isLapRecordForCar = props.isLapRecordForCar(lap);
        lap.isPersonalLapRecordForCar = props.isPersonalLapRecordForCar(lap);

        setLap({...lap});
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const session = useContext(SessionContext);

    const [showConfirm, setShowConfirm] = useState(false);

    const history = useHistory();

    const highlightDriversLap = () => {
        return shownLapsAreNotLimitedToCurrentDriver() && lapIsForCurrentDriver();
    }

    const shownLapsAreNotLimitedToCurrentDriver = () => {
        return getAcTrackerGameState(session?.game).driverType !== lap.driver;
    }

    const lapIsForCurrentDriver = () => {
        return !!session ? session.driver === lap.driver : false;
    }

    const onClickEdit = () => {
        history.push({ pathname: '/editLap/' + lap._id, state: lap });
    }

    const onClickDelete = () => {
        setShowConfirm(true);
    }

    const onClickCancel = () => {
        setShowConfirm(false);
    }

    return (
        <tr className={"lap-row " + ( highlightDriversLap() ? 'drivers-lap' : '' )}>
            <td>
                <Truncator id={"track_" + lap._id} value={lap.track} max={20}/>
            </td>
            <td className="lap-car-cell">
                <Truncator id={"car_" + lap._id} value={lap.car} max={25}/>
            </td>
            <td className="lap-replay-cell">
            {
                lap.replay &&
                <span>
                    <a href={lap.replay} target="_" data-tip="Launch Replay" data-for={"replay_" + lap._id}>
                        <img className="lap-replay-icon" src={replayIcon} alt="replay"></img>
                    </a>
                    <ReactTooltip id={"replay_" + lap._id} place="left" effect="solid"/>
                </span>
            }
            </td>
            <td>
                <span className={ 
                    (lap.isLapRecord ? "lap-record": "") +
                    (lap.isLapRecordForCar ? "lap-record-for-car": "") +
                    (lap.isPersonalLapRecordForCar ? "personal-lap-record-for-car": "")}>
                    <span data-tip data-for={"laptime_" + lap._id}>
                        <strong>{lap.laptime}</strong>
                    </span>
                    {
                        (lap.isLapRecord || lap.isLapRecordForCar || lap.isPersonalLapRecordForCar) &&
                        <ReactTooltip id={"laptime_" + lap._id} place="left" effect="solid">
                        {
                            lap.isLapRecord &&
                            <span>Track Record across all cars</span>
                        }
                        {
                            lap.isLapRecordForCar &&
                            <span>Track Record for the {lap.car}</span>
                        }
                        {
                            lap.isPersonalLapRecordForCar &&
                            <span>Personal best lap for {lap.driver} in the {lap.car}</span>
                        }
                        {/* <span dangerouslySetInnerHTML={{ __html: lap.laptimeDetails }}></span> */}
                        </ReactTooltip>
                    }
                </span>
            </td>
            <td>{lap.driver}</td>
            <td className="sub-item">{lap.gearbox === 'Manual' ? 'Manual' : 'Auto'}</td>
            <td className="sub-item">{lap.traction}</td>
            <td className="sub-item">{lap.stability}</td>
            <td className="lap-date-cell"><AcDate date={lap.date}/></td>
            <td className="lap-notes-cell sub-item">
            {
                lap.notes &&
                <span>
                    <span data-tip={lap.notes} data-for={"notes_" + lap._id}>
                        <img className="lap-notes-icon" src={notesIcon} alt="notes"></img>
                    </span>
                    <ReactTooltip id={"notes_" + lap._id} place="left" effect="solid"/>
                </span>
            }
            </td>
            <td className="lap-row-actions sub-item">
            {
                showConfirm === true ? (
                    <div>
                        <button className="btn btn-sm btn-danger pt-0 pb-0 mr-2 mb-0" type="button" onClick={() => props.deleteLap(lap._id)}>Delete</button>
                        <button className="cancel-delete-lap btn btn-link" onClick={onClickCancel}>Cancel</button>
                    </div>
                ) : (
                    <div>
                    {
                        !!session && session.driver === lap.driver && (
                            <span>
                            <button className="edit-btn btn btn-sm btn-primary pt-0 pr-3 pb-0 pl-3 ml-0 mr-2" disabled={ session.driver !== lap.driver } type="button" onClick={onClickEdit}>Edit</button>
                            <button className="delete-btn btn btn-sm btn-danger pt-0 pb-0" disabled={ session.driver !== lap.driver } type="button" onClick={onClickDelete}>Delete</button>
                        </span>
                        )
                    }
                    </div>
                )
            }
            </td>
        </tr>
    );
}

export default LapItem