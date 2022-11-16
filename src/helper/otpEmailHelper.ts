// # Email OTP module task

// ## Task
// 1. To implement an email OTP module that can be used for our enterprise application. You are free to use any standard library from the language which you choose to implement the test.
// 2. Do document any assumptions that you make.
// 3. Describe how you would test your module.

import { EMAIL_SENT_OTP_SUBJECT, STATUS_EMAIL_FAIL, STATUS_EMAIL_INVALID, STATUS_OTP_FAIL, STATUS_OTP_TIMEOUT } from "../utils/constans";
import HttpException from '../exceptions/httpException';
import { SendEmailHelper } from "./sendEmailHelper";
import * as bcrypt from 'bcrypt';
const redis = require('redis');
const util = require('util');

class EmailOTPModule {
    private redisClient: any;
    constructor() {
        this.start();
    }
    /* start can be called after an instance of Email OTP is constructed. Can be used to initialise variables.
     */
    start() {
        this.redisClient = redis.createClient(6379, '127.0.0.2');
        this.redisClient.on('connect', () => { console.log('Redis 127.0.0.2:6379 Connected!'); });
        this.redisClient.on("error", (error: any) => console.error(`Error : ${error}`));
        this.redisClient.set = util.promisify(this.redisClient.set)
        this.redisClient.get = util.promisify(this.redisClient.get);
    }


    /* close can be called after an instance of Email OTP is to be remove from the application.
     */
    async close(key: string) {
        await this.redisClient.del(key);
    }

    /*
    @func generate_OTP_email sends a new 6 digit random OTP code to the given email address input by the users. Only emails from the ".dso.org.sg" domain should be allowed to receive an OTP code.
    You can assume a function send_email(email_address, email_body) is implemented. 
    Email body to the user should be in this format "You OTP Code is 123456. The code is valid for 1 minute"
    
    @param user_email is an email address entered by the user. 
    
    @returns the following status code (assume implemented as constants)
    STATUS_EMAIL_OK: email containing OTP has been sent successfully.
    STATUS_EMAIL_FAIL: email address does not exist or sending to the email has failed.
    STATUS_EMAIL_INVALID: email address is invalid.
    */
    async generateOTPEmail(email: string) {
        // if (!email || !email.endsWith('dso.org.sg')) {
        //     throw new HttpException(STATUS_EMAIL_INVALID, `Email address is invalid.`);
        // }
        const otp = this.generateOtp();
        const hashedOtp = await bcrypt.hash(otp.toString(), 10);
        await this.sendEmail(email, otp);
        await this.redisClient.set(email, this.generateEmailObjStr(email, hashedOtp));
    }

    generateOtp() {
        return Math.floor(100000 + Math.random() * 900000);
    }

    generateEmailObjStr(email: string, hashedOtp: string) {
        const minExp = 1;  // 1 minuthes
        return JSON.stringify({
            email,
            expired_At: new Date(new Date().getTime() + minExp * 60000).getTime(),
            hashedOtp,
            totalEnterOtp: 0
        });
    }

    sendEmail = async (email: string, otp: number) => {
        try {

            let sendString = `
                <div style="width: 70%">

                    <h4>Hi</h4>

                    <p> You OTP Code is ${otp}. The code is valid for 1 minute </p>
                    <p>&nbsp;</p>
                   
                    <p>Thank you and best regards</p>
                    <p>DSO</p>
                </div>
             `
            await SendEmailHelper(email, EMAIL_SENT_OTP_SUBJECT, '', sendString, null);

        } catch (error) {
            throw new HttpException(STATUS_EMAIL_FAIL, `Sending email has failed.`);
        }
    }
    /*
    @func check_OTP reads the input stream for user input of the OTP. The OTP to match is the current OTP generated by a send
    allows user 10 tries to enter the valid OTP. check_OTP should return after 1min if the user does not give a valid OTP. 
     
    @param input is a generic IOstream. It implements input.readOTP() which waits and returns the 6 digit entered by the user. this function call is blocking so you might need to wrap it in a timeout.
     
    @returns the following status code (assume implemented as constants)
    STATUS_OTP_OK: OTP is valid and checked
    STATUS_OTP_FAIL: OTP is wrong after 10 tries
    STATUS_OTP_TIMEOUT: timeout after 1 min
    */
    async checkOtp(email: string, otp: string) {
        const objstr = await this.redisClient.get(email);
        const obj = JSON.parse(objstr);
        if (!obj) {
            throw new HttpException(STATUS_EMAIL_FAIL, `Email  does not exist.`);
        } else {
            if (obj.expired_At < new Date().getTime()) {
                this.close(email);
                throw new HttpException(STATUS_OTP_TIMEOUT, `OTP is expried, please get new one.`);
            }
            if (obj.totalEnterOtp > 9) {
                this.close(email);
                throw new HttpException(STATUS_OTP_FAIL, `OTP is wrong after 10 tries.`);
            }
            const isOtpMatching = await bcrypt.compare(otp, obj.hashedOtp);
            if (isOtpMatching) {
                this.close(email);
            }
            else {
                const newObj = { ...obj, totalEnterOtp: obj.totalEnterOtp + 1 };
                await this.redisClient.set(email, JSON.stringify(newObj));
                throw new HttpException(STATUS_OTP_FAIL, `OTP is incorrect.`);
            }
        }
    }

}

export default EmailOTPModule

