export const runtime = "nodejs";

import nodemailer, { type Transporter } from "nodemailer";
import { readFile } from "node:fs/promises";
import path from "node:path";

let cachedLogo: Buffer | null = null;
async function getLogo(): Promise<Buffer | null> {
    if (cachedLogo) return cachedLogo;
    try {
        const logoPath = path.join(process.cwd(), "public", "email-logo.png");
        cachedLogo = await readFile(logoPath);
        return cachedLogo;
    } catch (err) {
        console.error("logo read error", err);
        return null;
    }
}

let cachedTransporter: Transporter | null = null;
function getTransporter(): Transporter {
    if (cachedTransporter) return cachedTransporter;
    const port = Number(process.env.SMTP_PORT ?? 465);
    cachedTransporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port,
        secure: port === 465,
        pool: true,
        maxConnections: 2,
        maxMessages: 50,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
    return cachedTransporter;
}

export async function POST(req: Request) {
    try {
        const { name, email, message } = await req.json();

        if (!email || !message) {
            return Response.json({ ok: false, error: "Missing fields" }, { status: 400 });
        }

        const transporter = getTransporter();
        const sender = process.env.SMTP_FROM ?? process.env.SMTP_USER;
        const recipient = process.env.CONTACT_TO ?? process.env.SMTP_USER;
        const logo = await getLogo();

        const adminMail = transporter.sendMail({
            from: `"Formularz Analytica" <${sender}>`,
            to: recipient,
            replyTo: email,
            subject: `Nowa wiadomość od ${name ?? "klienta"}`,
            html: `
                <p><b>Wiadomość z formularza:</b></p>
                <p><b>Imię:</b> ${name ?? "-"}</p>
                <p><b>Email:</b> ${email}</p>
                <p><b>Treść:</b><br>${message}</p>
            `,
        });

        const clientMail = transporter.sendMail({
            from: `"Analytica (no-reply)" <${sender}>`,
            to: email,
            replyTo: recipient,
            subject: "Otrzymaliśmy Twoją wiadomość",
            attachments: logo
                ? [
                      {
                          filename: "email-logo.png",
                          content: logo,
                          cid: "logo@analytica",
                          contentDisposition: "inline",
                      },
                  ]
                : undefined,
            html: `
                <div style="font-family:Arial,Helvetica,sans-serif;color:#1a1a1a;max-width:560px;margin:0 auto;padding:24px;border:1px solid #eee;border-radius:12px;background:#fff">
                    ${logo ? `<div style="text-align:center;margin-bottom:16px"><img src="cid:logo@analytica" alt="Analytica" width="96" height="96" style="display:inline-block;border:0;outline:none;text-decoration:none;border-radius:16px"></div>` : ""}
                    <h2 style="margin:0 0 12px;font-size:20px;text-align:center">Dziękujemy za kontakt!</h2>
                    <p style="margin:0 0 12px">Cześć${name ? ` <b>${name}</b>` : ""},</p>
                    <p style="margin:0 0 12px">Potwierdzamy, że otrzymaliśmy Twoją wiadomość. Odpowiemy w ciągu <b>24 godzin</b>.</p>
                    <div style="background:#f6f7f9;border-left:3px solid #1a1a1a;padding:12px 16px;margin:16px 0;border-radius:6px">
                        <p style="margin:0 0 6px;font-size:13px;color:#555"><b>Treść Twojej wiadomości:</b></p>
                        <p style="margin:0;white-space:pre-wrap">${message}</p>
                    </div>
                    <hr style="border:none;border-top:1px solid #eee;margin:20px 0">
                    <p style="font-size:12px;color:#888;margin:0">
                        To wiadomość wygenerowana automatycznie — prosimy na nią nie odpowiadać.
                        Jeśli chcesz uzupełnić zgłoszenie, napisz bezpośrednio na
                        <a href="mailto:${recipient}" style="color:#555">${recipient}</a>.
                    </p>
                </div>
            `,
        });

        const [adminRes, clientRes] = await Promise.allSettled([adminMail, clientMail]);

        if (adminRes.status === "rejected") {
            console.error("admin mail error", adminRes.reason);
            return Response.json({ ok: false }, { status: 500 });
        }
        if (clientRes.status === "rejected") {
            console.error("client confirmation mail error", clientRes.reason);
        }

        return Response.json({ ok: true });
    } catch (err) {
        console.error("contact mail error", err);
        return Response.json({ ok: false }, { status: 500 });
    }
}
