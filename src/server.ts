require('dotenv').config();
import App from './app';
import validateEnv from './utils/validateEnv';
import AccountController from './controllers/account.controller';


validateEnv();
const app = new App(
  [
    new AccountController()
  ],
);
app.listen();
