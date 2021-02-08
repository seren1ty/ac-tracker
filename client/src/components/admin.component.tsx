import React from 'react'

const AdminComponent = () => {

    return (
        <React.Fragment>
            <div>
                <div className="lap-title-row">
                    <span className="lap-title">Manage Data</span>
                    <span className="lap-add-holder">
                        {/* TODO Convert to Select box for Tracks/Cars/Drivers/Games/Groups */}
                        <button className="add-btn btn btn-primary sub-item" type="button">Edit</button>
                    </span>
                </div>
                <div>
                    <p>Data displayed here</p>
                </div>
            </div>
        </React.Fragment>
    )
}

export default AdminComponent