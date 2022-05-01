import * as dotenv from 'dotenv';
dotenv.config();

export const config = {
    port: process.env.PORT,
    jwtSectet: process.env.JWT_SECRET,
    databaseUrl: process.env.DATABASE_URL,
  };
