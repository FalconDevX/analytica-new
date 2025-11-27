export const runtime = "nodejs";

import nodemailer from "nodemailer";

export async function POST(req: Request) {
    const { email, message } = await req.json();

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.SMTP_USER, // Twój Gmail
            pass: process.env.SMTP_PASS, // Hasło aplikacji
        },
    });

    await transporter.sendMail({
        from: process.env.SMTP_USER, 
        to: process.env.SMTP_USER,   // <-- wiadomość trafi NA TWÓJ EMAIL
        replyTo: email,              // klikniesz “Odpowiedz” → odpowiadasz klientowi
        subject: "Nowa wiadomość z formularza",
        html: `
            <p><b>Wiadomość od klienta:</b></p>
            <p><b>Email:</b> ${email}</p>
            <p><b>Treść:</b><br>${message}</p>
        `,
    });

    return Response.json({ ok: true });
}
