import express, { Application, json } from 'express';

import config from './config';
import mongoConnect from './database/connect';
import routes from './routes';
import { initWorkers } from './utils/reporter';

mongoConnect();
// initWorkers();

const app: Application = express();
const port: number = config.app.port as number;

app.use(json());

app.use('/api/v1', routes);

app.listen(port, () => {
    console.log(`The server is running on port ${port}...`);
});

export default app;
