export type AcTrackerState = {
    game: string | null;
    driver: string | null;

    trackType: string;
    carType: string;
    driverType: string;
    sortType: string;

    currentLapToEdit: any | null;

    newLapDefaultTrack: string;
    newLapDefaultCar: string;
    newLapDefaultGearbox: string;
    newLapDefaultTraction: string;
    newLapDefaultStability: string;
    newLapDefaultNotes: string;
}

export const getAcTrackerState = (): AcTrackerState => {
    const stateStr = localStorage.getItem('acTracker');

    if (!stateStr) {
        let newState = {
            game: 'Assetto Corsa',
            driver: null,

            trackType: 'ALL',
            carType: 'ALL',
            driverType: 'ALL',
            sortType: 'DATE',

            currentLapToEdit: null,

            newLapDefaultTrack: '',
            newLapDefaultCar: '',
            newLapDefaultGearbox: 'Automatic',
            newLapDefaultTraction: 'Factory',
            newLapDefaultStability: 'Factory',
            newLapDefaultNotes: ''
        };

        setAcTrackerState(newState);

        return newState;
    }

    return JSON.parse(stateStr);
}

export const setAcTrackerState = (state: AcTrackerState): void => {
    localStorage.setItem('acTracker', JSON.stringify(state));
}
