import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import AcDate from './common/ac-date.component';

const LapItem = props => {

    const [showConfirm, setShowConfirm] = useState(false);

    const history = useHistory();

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
        <tr className="lap-row">
            <td>{props.lap.track}</td>
            <td>{props.lap.car}</td>
            <td><strong>{props.lap.laptime}</strong></td>
            <td>{props.lap.driver}</td>
            <td>{props.lap.gearbox}</td>
            <td>{props.lap.traction}</td>
            <td>{props.lap.stability}</td>
            <td><AcDate date={props.lap.date}/></td>
            <td className="lap-row-actions">
            {
                showConfirm === true ? (
                    <div>
                        <button className="btn btn-sm btn-danger pt-0 pb-0 mr-2 mb-0" type="button" onClick={() => props.deleteLap(props.lap._id)}>Delete</button>
                        <button className="cancel-delete-lap btn btn-link" href="#" onClick={onClickCancel}>Cancel</button>
                    </div>
                ) : (
                    <div>
                        <button className="btn btn-sm btn-primary pt-0 pr-3 pb-0 pl-3 ml-0 mr-2" type="button" onClick={onClickEdit}>Edit</button>
                        <button className="btn btn-sm btn-danger pt-0 pb-0" type="button" onClick={onClickDelete}>Delete</button>
                    </div>
                )
            }
            </td>
        </tr>
    );
}

export default LapItem