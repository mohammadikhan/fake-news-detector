import nodemailer from "nodemailer";

export const sendVerificationEmail = async (email, code) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.USER_EMAIL,
            pass: process.env.PASS_EMAIL,
        },
    });

    await transporter.sendMail({
        from: `"VeriNews - AI Fake News Detector" <${process.env.USER_EMAIL}>`,
        to: email,
        subject: "Verify your E-Mail",
        text: `Thanks for creating your VeriNews account! Your verification code is ${code}. Your code expires in 15 minutes.`,
        html: `<p> Thanks for creating your VeriNews account! Your verification code is: <b>${code}</b></p>
               <p> Your code expires in 15 minutes</b>.</p>`,   
    });
};
