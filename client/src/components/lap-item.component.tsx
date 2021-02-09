import React, { useContext, useState, useEffect } from 'react';
import AcDate from './common/ac-date.component';
import Truncator from './common/truncator.component';
import ReactTooltip from 'react-tooltip';
import replayIcon from '../assets/replay_blue.png';
import notesIcon from '../assets/notes_blue.png';
import { SessionContext } from '../context/session.context';
import { getAcTrackerGameState } from './common/ac-localStorage';
import { Lap } from './lap-list.component';
import Laptime from './common/laptime.component';
import LapActions from './common/lap-actions.component';

type LapItemProps = {
    lap: Lap;
    isLapRecord: (currentLap: Lap) => boolean;
    isLapRecordForCar: (currentLap: Lap) => boolean;
    isPersonalLapRecordForCar: (currentLap: Lap) => boolean;
    deleteLap: (_id: string) => void;
}

const LapItem = (props: LapItemProps) => {

    const [lap, setLap] = useState<Lap>(props.lap);

    useEffect(() => {
        lap.isLapRecord = props.isLapRecord(lap);
        lap.isLapRecordForCar = props.isLapRecordForCar(lap);
        lap.isPersonalLapRecordForCar = props.isPersonalLapRecordForCar(lap);

        setLap({...lap});
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const session = useContext(SessionContext);

    const highlightDriversLap = () => {
        return shownLapsAreNotLimitedToCurrentDriver() && lapIsForCurrentDriver();
    }

    const shownLapsAreNotLimitedToCurrentDriver = () => {
        return getAcTrackerGameState(session?.game).driverType !== lap.driver;
    }

    const lapIsForCurrentDriver = () => {
        return !!session ? session.driver?.name === lap.driver : false;
    }

    return (
        <tr className={"lap-row " + ( highlightDriversLap() ? 'drivers-lap' : '' )}>
            <td>
                <Truncator id={"track_" + lap._id} value={lap.track} max={20}/>
            </td>
            <td className="lap-car-cell">
                <Truncator id={"car_" + lap._id} value={lap.car} max={25}/>
            </td>
            <td className="lap-replay-cell">
            {
                lap.replay &&
                <span>
                    <a href={lap.replay} target="_" data-tip="Launch Replay" data-for={"replay_" + lap._id}>
                        <img className="lap-replay-icon" src={replayIcon} alt="replay"></img>
                    </a>
                    <ReactTooltip id={"replay_" + lap._id} place="left" effect="solid"/>
                </span>
            }
            </td>
            <td>
                <Laptime lap={lap} />
            </td>
            <td>{lap.driver}</td>
            <td className="sub-item">{lap.gearbox === 'Manual' ? 'Manual' : 'Auto'}</td>
            <td className="sub-item">{lap.traction}</td>
            <td className="sub-item">{lap.stability}</td>
            <td className="lap-date-cell"><AcDate date={lap.date}/></td>
            <td className="lap-notes-cell sub-item">
            {
                lap.notes &&
                <span>
                    <span data-tip={lap.notes} data-for={"notes_" + lap._id}>
                        <img className="lap-notes-icon" src={notesIcon} alt="notes"></img>
                    </span>
                    <ReactTooltip id={"notes_" + lap._id} place="left" effect="solid"/>
                </span>
            }
            </td>
            <td className="lap-row-actions sub-item">
                <LapActions sessionDriver={session?.driver}
                    lap={lap}
                    deleteLap={props.deleteLap} />
            </td>
        </tr>
    );
}

export default LapItem