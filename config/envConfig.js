import dotEnv from 'dotEnv';
dotEnv.config();

export const envConfig = {
    port:process.env.PORT,
    dbUrl:process.env.DB_URL,
    jwtSecret:process.env.JWT_SECRET,
    expireTime:process.env.EXPIRE_TIME
}