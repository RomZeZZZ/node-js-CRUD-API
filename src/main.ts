import createWorkerServer from './utils/server';
import { env } from 'node:process';
import dotenv from 'dotenv';

dotenv.config();

createWorkerServer(env.HOST_NAME, Number(env.PORT));