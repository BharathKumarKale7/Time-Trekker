import nodemailer from "nodemailer";

// Function to send an email using nodemailer
export default async function sendEmail({ to, subject, html }) {
    // Create a transporter object using SMTP configuration from environment variables
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST, // SMTP host (e.g., smtp.gmail.com)
        port: Number(process.env.EMAIL_PORT), // SMTP port (e.g., 465 for SSL or 587 for TLS)
        secure: process.env.EMAIL_PORT == 465, // Use SSL if port is 465
        auth: {
            user: process.env.EMAIL_USER, // SMTP username
            pass: process.env.EMAIL_PASS, // SMTP password
        },
    });

    // Define the email options
    const mailOptions = {
        from: `"TimeTrekker" <${process.env.SMTP_USER}>`, // Sender address with display name
        to, // Recipient address
        subject, // Subject of the email
        html, // HTML content of the email
    };

    // Send the email using the transporter
    await transporter.sendMail(mailOptions);
}
