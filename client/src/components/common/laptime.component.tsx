import React from 'react';
import { Lap } from '../lap-list.component';
import ReactTooltip from 'react-tooltip';

type LaptimeProps = {
    lap: Lap;
}

const Laptime = (props: LaptimeProps) => {

    return (
        <span className={ 
            (props.lap.isLapRecord ? "lap-record": "") +
            (props.lap.isLapRecordForCar ? "lap-record-for-car": "") +
            (props.lap.isPersonalLapRecordForCar ? "personal-lap-record-for-car": "")}>
            <span data-tip data-for={"laptime_" + props.lap._id}>
                <strong>{props.lap.laptime}</strong>
            </span>
            {
                (props.lap.isLapRecord || props.lap.isLapRecordForCar || props.lap.isPersonalLapRecordForCar) &&
                <ReactTooltip id={"laptime_" + props.lap._id} place="left" effect="solid">
                {
                    props.lap.isLapRecord &&
                    <span>Track Record across all cars</span>
                }
                {
                    props.lap.isLapRecordForCar &&
                    <span>Track Record for the {props.lap.car}</span>
                }
                {
                    props.lap.isPersonalLapRecordForCar &&
                    <span>Personal best lap for {props.lap.driver} in the {props.lap.car}</span>
                }
                </ReactTooltip>
            }
        </span>
    );
}

export default Laptime;