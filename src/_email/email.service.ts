import nodemailer from 'nodemailer';
import {registrationTemplate} from './templates/registration.template';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: "smtp.gmail.com",
  auth: {
    user: 'denis.zaiarnyi@gmail.com',
    pass: process.env.NODEMAILER_PASSWORD as string,
  }
});

export const emailService = {
  async registrationEmail(to: string, code: string){
    try {
      const html = registrationTemplate.replace(/\{\{code}}/, code);
      const result = await transporter.sendMail({
        from: 'Incubator school <denis.zaiarnyi@gmail.com>',
        subject: 'Registration User',
        to,
        html
      });
      return result.accepted[0] === to;
    }catch (e) {
      return false;
    }
  }
}
