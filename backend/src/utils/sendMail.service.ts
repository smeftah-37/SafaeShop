import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
@Injectable()
export class NodemailerService {


    private transporter: nodemailer.Transporter;
    constructor(){
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT, 10),
            secure:false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
              },
            });
    }
    async sendMail(to: string, subject: string, text: string, html?: string): Promise<void> {
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: to, 
            subject: subject, 
            text: text, 
            html: html, 
        };
    
        try {
          const info = await this.transporter.sendMail(mailOptions);
        } catch (error) {
        } 
      }
}