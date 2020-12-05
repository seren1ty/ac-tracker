declare global {
    namespace NodeJS {
        interface ProcessEnv {
            MONGODB_URI: string,
            PORT: number,
            GOOGLE_PRIVATE_KEY: string,
            FRONT_END_URL: string,
            JWT_PRIVATE_KEY: string
        }
    }
}

export {}