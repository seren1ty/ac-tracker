import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Lap } from '../lap-list.component';

type LapActionsProps = {
    sessionDriver: string | null | undefined;
    lap: Lap;
    deleteLap: (id: string) => void;
}

const LapActions = (props: LapActionsProps) => {

    const history = useHistory();

    const [showConfirm, setShowConfirm] = useState(false);

    const onClickDelete = () => {
        setShowConfirm(true);
    }

    const onClickCancel = () => {
        setShowConfirm(false);
    }

    const onClickEdit = () => {
        history.push({ pathname: '/editLap/' + props.lap._id, state: props.lap });
    }

    return (
        <div>
        {
            showConfirm === true ? (
                <div>
                    <button className="btn btn-sm btn-danger pt-0 pb-0 mr-2 mb-0"
                        type="button" onClick={() => props.deleteLap(props.lap._id)}>Delete</button>
                    <button className="cancel-delete-lap btn btn-link"
                        onClick={onClickCancel}>Cancel</button>
                </div>
            ) : (
                <div>
                {
                    props.sessionDriver === props.lap.driver && (
                    <span>
                        <button className="edit-btn btn btn-sm btn-primary pt-0 pr-3 pb-0 pl-3 ml-0 mr-2"
                            disabled={ props.sessionDriver !== props.lap.driver } type="button" onClick={onClickEdit}>Edit</button>
                        <button className="delete-btn btn btn-sm btn-danger pt-0 pb-0" id="DeleteButton"
                            disabled={ props.sessionDriver !== props.lap.driver } type="button" onClick={onClickDelete}>Delete</button>
                    </span>
                    )
                }
                </div>
            )
        }
        </div>
    );
}

export default LapActions;