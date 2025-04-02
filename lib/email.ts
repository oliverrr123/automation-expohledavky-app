"use server";

import nodemailer from "nodemailer";

interface EmailData {
    name: string;
    email: string;
    subject: string;
    message: string;
    phone?: string;
    amount?: string;
    language?: string;
}

const emailTemplates = {
    cs: {
        subject: "Vaši poptávku jsme přijali",
        greeting: "Dobrý den,",
        body: "Přijali jsme Vaši poptávku a budeme Vás kontaktovat co nejdříve to bude možné.",
        copy: "Zde je kopie Vaší poptávky:",
        amount: "Výše pohledávky:",
        message: "Zpráva:",
        closing: "S pozdravem,",
        signature: "Tým EX Pohledávky"
    },
    en: {
        subject: "We have received your inquiry",
        greeting: "Hello,",
        body: "We have received your inquiry and will contact you as soon as possible.",
        copy: "Here is a copy of your inquiry:",
        amount: "Receivable amount:",
        message: "Message:",
        closing: "Best regards,",
        signature: "EX Receivables Team"
    },
    de: {
        subject: "Wir haben Ihre Anfrage erhalten",
        greeting: "Guten Tag,",
        body: "Wir haben Ihre Anfrage erhalten und werden uns so schnell wie möglich bei Ihnen melden.",
        copy: "Hier ist eine Kopie Ihrer Anfrage:",
        amount: "Forderungsbetrag:",
        message: "Nachricht:",
        closing: "Mit freundlichen Grüßen,",
        signature: "EX Forderungen Team"
    },
    sk: {
        subject: "Vašu požiadavku sme prijali",
        greeting: "Dobrý deň,",
        body: "Prijali sme vašu požiadavku a budeme vás kontaktovať čo najskôr.",
        copy: "Tu je kópia vašej požiadavky:",
        amount: "Výška pohľadávky:",
        message: "Správa:",
        closing: "S pozdravom,",
        signature: "Tím EX Pohľadávky"
    }
};

const emailConfigs = {
    cs: {
        host: "smtp.seznam.cz",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER_CS,
            pass: process.env.EMAIL_PASSWORD_CS,
        },
    },
    sk: {
        host: "smtp.seznam.cz",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER_SK,
            pass: process.env.EMAIL_PASSWORD_SK,
        },
    },
    en: {
        host: "smtp.seznam.cz",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER_EN,
            pass: process.env.EMAIL_PASSWORD_EN,
        },
    },
    de: {
        host: "smtp.seznam.cz",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER_DE,
            pass: process.env.EMAIL_PASSWORD_DE,
        },
    }
};

export async function sendEmail(data: EmailData) {
    const language = data.language || 'en';
    const template = emailTemplates[language as keyof typeof emailTemplates] || emailTemplates.cs;
    const emailConfig = emailConfigs[language as keyof typeof emailConfigs] || emailConfigs.cs;

    const transporter = nodemailer.createTransport(emailConfig);

    try {
        await transporter.sendMail({
            from: emailConfig.auth.user,
            to: data.email,
            subject: template.subject,
            html: `
        <h2>${template.subject}</h2>
        <p>${template.greeting}</p>
        <p>${template.body}</p>
        <p>${template.copy}</p>
        ${data.amount ? `<p><strong>${template.amount}</strong> ${data.amount}</p>` : ''}
        <p><strong>${template.message}</strong></p>
        <p>${data.message.replace(/\n/g, "<br>")}</p>
        <br>
        <p>${template.closing}</p>
        <p>${template.signature}</p>
      `,
        });

        await transporter.sendMail({
            from: emailConfig.auth.user,
            to: emailConfig.auth.user,
            subject: `${template.subject} od ${data.name}`,
            html: `
        <h2>${template.subject} od ${data.name}</h2>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Telefon:</strong> ${data.phone || 'Neuvedeno'}</p>
        ${data.amount ? `<p><strong>${template.amount}</strong> ${data.amount}</p>` : ''}
        <p><strong>${template.message}</strong></p>
        <p>${data.message.replace(/\n/g, "<br>")}</p>
      `,
        });

        return { success: true };
    } catch (error) {
        console.error("Failed to send email:", error);
        return { success: false, error: "Failed to send email. Please try again." };
    }
} 