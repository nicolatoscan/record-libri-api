import * as dotenv from 'dotenv';
dotenv.config();

export const config = {
    port: process.env.PORT,
    jwtSectet: process.env.JWT_SECRET,
    hashPassword: process.env.HASH_PASSWORD,
    databaseUrl: process.env.DATABASE_URL,
  };
