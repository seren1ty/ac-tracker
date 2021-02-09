import React, { useState } from 'react'

const Admin = () => {

    const [dataType, setDataType] = useState('Tracks');

    const onChangeDataType = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setDataType(event.target.value);
    }

    return (
        <React.Fragment>
            <div>
                <div className="lap-title-row">
                    <span className="lap-title">Manage Data</span>
                    <span className="lap-add-holder">
                        <select className="add-btn btn btn-primary sub-item"
                            onChange={onChangeDataType}>
                            <option value="Tracks">Tracks</option>
                            <option value="Cars">Cars</option>
                            <option value="Drivers">Drivers</option>
                            <option value="Games">Games</option>
                        </select>
                    </span>
                </div>
                <div>
                    <p>Data displayed here {dataType}</p>
                </div>
            </div>
        </React.Fragment>
    )
}

export default Admin