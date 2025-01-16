import nodemailer from 'nodemailer';
import { config } from '../../config/config';

export const sendEmail = async(to: string, subject: string, text: string) => {
    console.log('send email', to)
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth:{
            user: config.mailer.EMAIL_USER,
            pass: config.mailer.EMAIL_PASS
        },
        tls:{
            rejectUnauthorized: false,
        }
    })

    await transporter.sendMail({from : config.mailer.EMAIL_USER, to: config.mailer.EMAIL_USER , subject, text})
}