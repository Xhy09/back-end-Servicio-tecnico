import * as nodemailer from 'nodemailer';

export class MailService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: Number(process.env.SMTP_PORT) || 587,
            secure: false,
            auth: {
                user: process.env.SMTP_USER || 'test@example.com',
                pass: process.env.SMTP_PASS || 'testpassword',
            },
        });
    }

    async sendVerificationEmail(to: string, token: string) {
        const verificationUrl = `${process.env.APP_URL || 'http://localhost:3000'}/api/auth/verify-email?token=${token}`;
        await this.transporter.sendMail({
            from: process.env.SMTP_FROM || 'no-reply@tedics.com',
            to,
            subject: 'Verifica tu correo electrónico',
            html: `<p>Por favor verifica tu correo haciendo clic en el siguiente enlace:</p><a href="${verificationUrl}">${verificationUrl}</a>`
        });
    }
}
