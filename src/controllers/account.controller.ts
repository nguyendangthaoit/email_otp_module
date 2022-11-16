import Controller from "interfaces/controller.interface";
import * as express from 'express';
import { STATUS_EMAIL_OK, STATUS_OTP_OK } from "../utils/constans";
import EmailOTPModule from './../helper/otpEmailHelper';


class AccountController implements Controller {

    public router = express.Router();
    public path = '/account';
    public emailOtpModule = new EmailOTPModule();
    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router
            .get(this.path + '/generateOtpEmail', this.generateOtpEmail)
            .get(this.path + '/checkOtp', this.checkOtp)
    }


    private generateOtpEmail = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const email = request.query.email.toString();
        try {
            await this.emailOtpModule.generateOTPEmail(email);
            response.send({
                status: STATUS_EMAIL_OK,
            });
        } catch (error) {
            next(error);
        }
    }

    private checkOtp = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const query = request.query;
        try {
            await this.emailOtpModule.checkOtp(query.email.toString(), query.otp.toString());
            response.send({
                status: STATUS_OTP_OK,
            });
        } catch (error) {
            next(error);
        }
    }

}
export default AccountController;