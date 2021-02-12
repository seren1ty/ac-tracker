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

    const [hoveredId, setHoveredId] = useState("");

    const onHoverBox = (itemId: string) => {
        console.log(itemId);

        setHoveredId(itemId);
    }

    return (
        <div className="data-container">
        {
            props.data?.map((dataItem) => {
                return (
                    <div className="data-box" key={dataItem._id}
                        onClick={() => onHoverBox(dataItem._id)}
                        onMouseEnter={() => onHoverBox(dataItem._id)}
                        onMouseLeave={() => setHoveredId("")}>
                    {
                        hoveredId === dataItem._id &&
                        <div className="data-box-edit">Edit</div>
                    }
                        <Truncator id={"track_" + dataItem._id} value={dataItem.name} max={19}/>
                    {
                        hoveredId === dataItem._id &&
                        <div className="data-box-delete">Delete</div>
                    }
                    </div>
                )
            })
        }
        </div>
    );
}

export default AdminDataBoxes;