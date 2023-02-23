import nodemailer from 'nodemailer';
import {registrationTemplate} from './templates/registration.template';
import {recoveryTemplate} from './templates/recovery.template';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: "smtp.gmail.com",
  auth: {
    user: 'denis.zaiarnyi@gmail.com',
    pass: 'dcqmqhrwbfdlhzai',
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
  },
  async recoveryPassword(to: string, code: string){
    const html = recoveryTemplate.replace(/\{\{code}}/, code);
    const result = await transporter.sendMail({
      from: `Incubator courses`,
      subject: 'Password Recovery',
      to,
      html
    });
    return result?.messageId;
  }
}
