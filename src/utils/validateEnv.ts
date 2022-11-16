import {
  cleanEnv, port, str,
} from 'envalid';

function validateEnv() {
  cleanEnv(process.env, {
    DATABASE: str(),
    MONGO_PATH: str(),
    PORT: port(),
  });
}

export default validateEnv;
