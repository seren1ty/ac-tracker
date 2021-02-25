export type AcTrackerState = {
    game: string | null;
    driver: Driver | null;
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

export type Lap = {
    _id: string;
    game: string;
    track: string;
    car: string;
    driver: string;
    laptime: string;
    gearbox: string;
    traction: string;
    stability: string;
    date: Date;
    replay: string;
    notes: string;

    isLapRecord?: boolean;
    isLapRecordForCar?: boolean;
    isPersonalLapRecordForCar?: boolean;
    laptimeDetails?: string;
}

export type HoveredLap = {
    _id: string;
    type: string;
    data: string;
}

export type Track = {
    _id: string;
    game: string;
    name: string;
    hasLaps?: boolean;
}

export type Car = {
    _id: string;
    game: string;
    name: string;
    hasLaps?: boolean;
}

export type Driver = {
    _id: string;
    name: string;
    isAdmin: boolean;
    hasLaps?: boolean;
}

export type Game = {
    _id: string;
    name: string;
    code: string;
    hasLaps?: boolean;
};