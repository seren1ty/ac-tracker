import React, { useContext, useState } from 'react';
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
    deleteLap: (_id: string) => void;
}

const LapItem = (props: LapItemProps) => {

    const session = useContext(SessionContext);

    const [showConfirm, setShowConfirm] = useState(false);

    const history = useHistory();

    const highlightDriversLap = () => {
        return shownLapsAreNotLimitedToCurrentDriver() && lapIsForCurrentDriver();
    }

    const shownLapsAreNotLimitedToCurrentDriver = () => {
        return getAcTrackerGameState(session?.game).driverType !== props.lap.driver;
    }

    const lapIsForCurrentDriver = () => {
        return !!session ? session.driver === props.lap.driver : false;
    }

    const onClickEdit = () => {
        history.push({ pathname: '/editLap/' + props.lap._id, state: props.lap });
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
                <Truncator id={"track_" + props.lap._id} value={props.lap.track} max={20}/>
            </td>
            <td className="lap-car-cell">
                <Truncator id={"car_" + props.lap._id} value={props.lap.car} max={25}/>
            </td>
            <td className="lap-replay-cell">
            {
                props.lap.replay &&
                <span>
                    <a href={props.lap.replay} target="_" data-tip="Launch Replay" data-for={"replay_" + props.lap._id}>
                        <img className="lap-replay-icon" src={replayIcon} alt="replay"></img>
                    </a>
                    <ReactTooltip id={"replay_" + props.lap._id} place="left" effect="solid"/>
                </span>
            }
            </td>
            <td><strong>{props.lap.laptime}</strong></td>
            <td>{props.lap.driver}</td>
            <td className="sub-item">{props.lap.gearbox === 'Manual' ? 'Manual' : 'Auto'}</td>
            <td className="sub-item">{props.lap.traction}</td>
            <td className="sub-item">{props.lap.stability}</td>
            <td className="lap-date-cell"><AcDate date={props.lap.date}/></td>
            <td className="lap-notes-cell sub-item">
            {
                props.lap.notes &&
                <span>
                    <span data-tip={props.lap.notes} data-for={"notes_" + props.lap._id}>
                        <img className="lap-notes-icon" src={notesIcon} alt="notes"></img>
                    </span>
                    <ReactTooltip id={"notes_" + props.lap._id} place="left" effect="solid"/>
                </span>
            }
            </td>
            <td className="lap-row-actions sub-item">
            {
                showConfirm === true ? (
                    <div>
                        <button className="btn btn-sm btn-danger pt-0 pb-0 mr-2 mb-0" type="button" onClick={() => props.deleteLap(props.lap._id)}>Delete</button>
                        <button className="cancel-delete-lap btn btn-link" onClick={onClickCancel}>Cancel</button>
                    </div>
                ) : (
                    <div>
                    {
                        !!session && session.driver === props.lap.driver && (
                            <span>
                            <button className="edit-btn btn btn-sm btn-primary pt-0 pr-3 pb-0 pl-3 ml-0 mr-2" disabled={ session.driver !== props.lap.driver } type="button" onClick={onClickEdit}>Edit</button>
                            <button className="delete-btn btn btn-sm btn-danger pt-0 pb-0" disabled={ session.driver !== props.lap.driver } type="button" onClick={onClickDelete}>Delete</button>
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