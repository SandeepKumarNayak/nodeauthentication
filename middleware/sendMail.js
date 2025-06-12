import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export const transPort = nodemailer.createTransport({
    service:'gmail',
    host:'smtp.gmail.com',
    port:465,
    auth:{
        user:process.env.NODE_CODE_SENDING_EMAIL_ADDRESS,
        pass:process.env.NODE_CODE_SENDING_EMAIL_PASSWORD
    }
})

