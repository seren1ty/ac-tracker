import React, { useState } from 'react';
import Truncator from './truncator.component';

type AdminBoxData = {
    _id: string;
    name: string;
}

type AdminDataProps = {
    data: AdminBoxData[];
}

const AdminDataBoxes = (props: AdminDataProps) => {

    const [hoveredId, setHoveredId] = useState('');
    const [showConfirm, setShowConfirm] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [newItemName, setNewItemName] = useState('');

    const onHoverBox = (itemId: string) => {
        if (showConfirm || showEdit)
            return;

        console.log(itemId);

        setHoveredId(itemId);
    }

    const onLeaveBox = () => {
        if (showConfirm || showEdit)
            return;

        setHoveredId("");
    }

    const onClickDelete = () => {
        setShowConfirm(true);
    }

    const onClickDeleteConfirm = () => {

    }

    const onClickDeleteCancel = () => {
        setShowConfirm(false);
    }

    const onClickEdit = (dataItem: AdminBoxData) => {
        setNewItemName(dataItem.name);

        setShowEdit(true);
    }

    const onChangeNewItemName = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewItemName(event.target.value);
    }

    const onClickEditConfirm = () => {

    }

    const onClickEditCancel = () => {
        setShowEdit(false);
    }

    return (
        <div className="data-container">
        {
            props.data?.map((dataItem) => {
                return (
                    <div className="data-box" key={dataItem._id}
                        onClick={() => onHoverBox(dataItem._id)}
                        onMouseEnter={() => onHoverBox(dataItem._id)}
                        onMouseLeave={onLeaveBox}>
                    {
                        (!showEdit || (showEdit && hoveredId !== dataItem._id)) &&
                        <Truncator id={"track_" + dataItem._id} value={dataItem.name} max={19}/>
                    }
                    {
                        hoveredId === dataItem._id &&
                        <div>
                        {
                            !showEdit &&
                            <div>
                            {
                                !showConfirm &&
                                <div>
                                    <div className="data-box-edit" onClick={() => onClickEdit(dataItem)}>Edit</div>
                                    <div className="data-box-delete" onClick={onClickDelete}>Delete</div>
                                </div>
                            }
                            {
                                showConfirm &&
                                <div>
                                    <div className="data-box-delete-confirm" onClick={onClickDeleteConfirm}>Delete</div>
                                    <div className="data-box-delete-cancel" onClick={onClickDeleteCancel}>Cancel</div>
                                </div>
                            }
                            </div>
                        }

                        {
                            showEdit &&
                            <div>
                                <input className="data-box-edit-input"
                                    type="text"
                                    value={newItemName}
                                    onChange={onChangeNewItemName}
                                />
                                <div className="data-box-edit-confirm" onClick={onClickEditConfirm}>Update</div>
                                <div className="data-box-edit-cancel" onClick={onClickEditCancel}>Cancel</div>
                            </div>
                        }
                        </div>
                    }
                    </div>
                )
            })
        }
        </div>
    );
}

export default AdminDataBoxes;