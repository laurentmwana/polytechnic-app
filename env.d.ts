declare namespace NodeJS {
  interface ProcessEnv {
    NEXTAUTH_AUTH_SECRET: string
    NEXTAUTH_AUTH_URL: string
    NEXT_PUBLIC_API_ENTRY_POINT_URL_EXTERNAL: string
    NEXT_PUBLIC_API_ENTRY_POINT_URL_LOCAL: string
    SESSION_SECRET: string
    NODE_ENV: 'development' | 'production' | 'test'
  }
}
