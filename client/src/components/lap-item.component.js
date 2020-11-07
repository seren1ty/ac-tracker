import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import AcDate from './common/ac-date.component';
import ReactTooltip from 'react-tooltip';
import replayIcon from '../assets/replay_blue_transparent.png';
import notesIcon from '../assets/notes_blue.png';
import { SessionContext } from '../context/session.context';

const LapItem = props => {

    const session = useContext(SessionContext);

    const [showConfirm, setShowConfirm] = useState(false);

    const history = useHistory();

    const highlightDriversLap = () => {
        return shownLapsAreNotLimitedToCurrentDriver() && lapIsForCurrentDriver();
    }

    const shownLapsAreNotLimitedToCurrentDriver = () => {
        return localStorage.getItem('acTracker') && JSON.parse(localStorage.getItem('acTracker')).driverType !== props.lap.driver;
    }

    const lapIsForCurrentDriver = () => {
        return session.driver === props.lap.driver;
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
            <td>{props.lap.track}</td>
            <td className="lap-car-cell">{props.lap.car}</td>
            <td className="lap-replay-cell">
            {
                props.lap.replay &&
                <span>
                    <a href={props.lap.replay} target="_"  data-tip="Launch Replay">
                        <img className="lap-replay-icon" src={replayIcon} alt="replay"></img>
                    </a>
                    <ReactTooltip place="left" effect="solid"/>
                </span>
            }
            </td>
            <td><strong>{props.lap.laptime}</strong></td>
            <td>{props.lap.driver}</td>
            <td>{props.lap.gearbox === 'Manual' ? 'Manual' : 'Auto'}</td>
            <td>{props.lap.traction}</td>
            <td>{props.lap.stability}</td>
            <td className="lap-date-cell"><AcDate date={props.lap.date}/></td>
            <td className="lap-notes-cell">
            {
                props.lap.notes &&
                <span>
                    <span data-tip={props.lap.notes}>
                        <img className="lap-notes-icon" src={notesIcon} alt="notes"></img>
                    </span>
                    <ReactTooltip place="left" effect="solid"/>
                </span>
            }
            </td>
            <td className="lap-row-actions">
            {
                showConfirm === true ? (
                    <div>
                        <button className="btn btn-sm btn-danger pt-0 pb-0 mr-2 mb-0" type="button" onClick={() => props.deleteLap(props.lap._id)}>Delete</button>
                        <button className="cancel-delete-lap btn btn-link" href="#" onClick={onClickCancel}>Cancel</button>
                    </div>
                ) : (
                    <div>
                    {
                        session.driver === props.lap.driver && (
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