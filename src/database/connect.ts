import config from '../config';
import { connect, connection } from 'mongoose';

const mongoConnect = async (): Promise<void> => {
    await connect(
        `mongodb+srv://${config.mongo.username}:${config.mongo.password}@${config.mongo.host}/`
    );
    process.on('exit', function () {
        connection.close();
    });
};

export default mongoConnect;
