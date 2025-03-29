import nodemailer, { SendMailOptions } from 'nodemailer';
import fs from 'node:fs';
import path from 'node:path';
import { settings } from '../config/settings';

const mode = {
    registration: 'registration.html',
    forgot_password: 'forgot_password.html',
    resendOTP: 'resend_otp.html',
}

export type template = keyof typeof mode;

export type params = {
    registration: { otp: string, firstname: string, username: string, password: string };
    forgot_password: { otp: string, firstname: string };
    resendOTP: { otp: string, firstname: string };
};

type mail = {
    to: string;
    template: template;
} & params[template];

const sendMail = async ({ to, template, ...props }: mail) => {
    try {
        const htmlFilePath = path.join(process.cwd(), 'public', 'templates', mode[template]);
        const htmlContent = fs.readFileSync(htmlFilePath, 'utf8');

        let updatedHtmlContent = Object.entries(props).reduce(
            (content, [key, value]) => content.replace(new RegExp(`{{${key.toUpperCase()}}}`, 'g'), value), htmlContent
        );

        const mailOptions: SendMailOptions = {
            from: {
                name: 'SubManager',
                address: "noreply@sayble",
            },
            to,
            subject: `${(template === 'registration') ? "Thank You For Registering" : (template === 'forgot_password') ? "Reset Password" : "Resend OTP"}`,
            html: updatedHtmlContent,
            date: new Date(),
            encoding: 'utf8',
            watchHtml: updatedHtmlContent,
        };

        const transporter = await nodemailer.createTransport({
            host: settings.mail.host,
            port: settings.mail.port,
            secure: false,
            auth: {
                user: settings.mail.auth.user,
                pass: settings.mail.auth.pass,
            },
        });

        const info = await transporter.sendMail(mailOptions);
    } catch (error) {
        throw new Error(error);
    }
}

export { sendMail };