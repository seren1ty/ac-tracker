import { Document } from "mongoose";

export type CarType = Document & {
    name: string
}

export type DriverType = Document & {
    name: string
}