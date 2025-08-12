import nodemailer from "nodemailer";

export default async function sendEmail({ to, subject, html }) {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        secure: process.env.EMAIL_PORT == 465, // true for 465
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
    const mailOptions = {
        from: `"TimeTrekker" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html,
    };

  await transporter.sendMail(mailOptions);
}
