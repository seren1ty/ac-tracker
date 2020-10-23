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
        <tr>
            <td>{props.lap.track}</td>
            <td>{props.lap.car}</td>
            <td>{props.lap.laptime}</td>
            <td>{props.lap.driver}</td>
            <td>{props.lap.gearbox}</td>
            <td>{props.lap.traction}</td>
            <td>{props.lap.stability}</td>
            <td><AcDate date={props.lap.date}/></td>
            <td>
            {
                showConfirm === true ? (
                    <span>
                        <a href="#" onClick={() => props.deleteLap(props.lap._id)}>Delete</a> | <a href="#" onClick={onClickCancel}>Back</a>
                    </span>
                ) : (
                    <span>
                        <a href="#" onClick={onClickEdit}>Edit</a> | <a href="#" onClick={onClickDelete}>Delete</a>
                    </span>
                )
            }
            </td>
        </tr>
    );
}

export default LapItem