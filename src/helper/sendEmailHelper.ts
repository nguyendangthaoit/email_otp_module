import * as nodemailer from 'nodemailer';

export async function SendEmailHelper(emailTo: string, subject: string, content: string, contentHtml: string, attachments: Array<any>) {

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_SEND,
            pass: process.env.EMAIL_PASS
        },
    });

    let mailOptions = {
        from: process.env.EMAIL_SEND,
        to: emailTo,
        subject: subject,
        text: content,
        html: contentHtml,
        attachments: attachments
    };
    return await transporter.sendMail(mailOptions);
}