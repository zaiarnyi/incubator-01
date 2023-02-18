import nodemailer from 'nodemailer';
import {registrationTemplate} from './templates/registration.template';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: "smtp.gmail.com",
  auth: {
    user: process.env.NODEMAILER_EMAIL as string,
    pass: process.env.NODEMAILER_PASSWORD as string,
  }
});

export const emailService = {
  async registrationEmail(to: string, code: string){
      const html = registrationTemplate.replace(/\{\{code}}/, code);
      await transporter.sendMail({
        from: `Incubator courses`,
        subject: 'Registration User',
        to,
        html
      });
  }
}
