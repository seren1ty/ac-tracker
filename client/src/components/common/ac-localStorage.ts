export type AcTrackerState = {
    game: string | null;
    driver: string | null;
}

export type AcTrackerGameState = {
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
            driver: null
        };

        setAcTrackerState(newState);

        return newState;
    }

    return JSON.parse(stateStr);
}

export const setAcTrackerState = (state: AcTrackerState): void => {
    localStorage.setItem('acTracker', JSON.stringify(state));
}

export const getAcTrackerGameState = (game: string | null | undefined): AcTrackerGameState => {
    let currGame = game;
    if (!currGame)
        currGame = getAcTrackerState().game;

    const stateStr = localStorage.getItem('acTracker_' + currGame);

    if (!stateStr) {
        let newState = {
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

        setAcTrackerGameState(currGame, newState);

        return newState;
    }

    return JSON.parse(stateStr);
}

export const setAcTrackerGameState = (game: string | null | undefined, state: AcTrackerGameState): void => {
    let currGame = game;
    if (!currGame)
        currGame = getAcTrackerState().game;

    localStorage.setItem('acTracker_' + currGame, JSON.stringify(state));
}
