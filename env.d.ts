declare namespace NodeJS {
  interface ProcessEnv {
    BETTER_AUTH_SECRET: string
    BETTER_AUTH_URL: string
    API_ENTRY_POINT_URL: string
    SESSION_SECRET: string
    NODE_ENV: 'development' | 'production' | 'test'
  }
}
