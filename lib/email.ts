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
    serviceName?: string;
}

// Service name translations for different languages
const serviceNameTranslations = {
    // Czech service names - used as keys
    "Služby": {
        en: "Services",
        de: "Dienstleistungen", 
        sk: "Služby",
        cs: "Služby"
    },
    "Vymáhání pohledávek": {
        en: "Debt Collection",
        de: "Forderungseintreibung", 
        sk: "Vymáhanie pohľadávok",
        cs: "Vymáhání pohledávek"
    },
    "Správa firemních pohledávek": {
        en: "Corporate Receivables Management",
        de: "Verwaltung von Unternehmensforderungen", 
        sk: "Správa firemných pohľadávok",
        cs: "Správa firemních pohledávek"
    },
    "Odkup a prodej pohledávek": {
        en: "Purchase and Sale of Receivables",
        de: "Ankauf und Verkauf von Forderungen", 
        sk: "Odkúp a predaj pohľadávok",
        cs: "Odkup a prodej pohledávek"
    },
    "Odkup firem": {
        en: "Company Acquisition",
        de: "Unternehmensübernahme", 
        sk: "Odkúp firiem",
        cs: "Odkup firem"
    },
    "Likvidace firem": {
        en: "Company Liquidation",
        de: "Unternehmensliquidation", 
        sk: "Likvidácia firiem",
        cs: "Likvidace firem"
    },
    "Krizový management": {
        en: "Crisis Management",
        de: "Krisenmanagement", 
        sk: "Krízový manažment",
        cs: "Krizový management"
    },
    "Odkup směnek": {
        en: "Purchase of Promissory Notes",
        de: "Ankauf von Wechseln", 
        sk: "Odkúp zmeniek",
        cs: "Odkup směnek"
    }
};

const emailTemplates = {
    cs: {
        subject: "Vaši poptávku jsme přijali",
        greeting: "Dobrý den,",
        body: "Přijali jsme Vaši poptávku a budeme Vás kontaktovat co nejdříve to bude možné.",
        caseDocRequest: "Děkujeme za zájem o naše služby.\nZašlete podklady ke své pohledávce v odpovědi na tento mail, následně budou zhodnoceny a kolegové se Vám obratem ozvou.\nPokud chcete zvolit pro první kontakt spíše telefon, volejte naše vymahací specialisty na čísle: 735 500 003.",
        copy: "Zde je kopie Vaší poptávky:",
        amount: "Výše pohledávky:",
        message: "Zpráva:",
        closing: "S pozdravem,",
        signature: `Expohledávky s.r.o.<br>
Na strži 1702/65, 140 00 Praha 4-Nusle<br>
+420 266 710 318 | +420 735 500 003<br>
<a href="mailto:info@expohledavky.cz">info@expohledavky.cz</a>`,
        formMessage: "Zpráva z kontaktního formuláře",
        formSubject: "Zpráva z kontaktního formuláře Expohledavky.cz",
        name: "Jméno:",
        email: "E-mail:",
        phone: "Telefon:",
        docRequestNote: "Podklady zažádány"
    },
    en: {
        subject: "We have received your inquiry",
        greeting: "Hello,",
        body: "We have received your inquiry and will contact you as soon as possible.",
        caseDocRequest: "Thank you for your interest in our services.\nPlease send the documentation related to your receivable in response to this email. Our team will evaluate it and get back to you promptly.\nIf you prefer to discuss by phone first, you can call our collection specialists at: +44 7451 206573.",
        copy: "Here is a copy of your inquiry:",
        amount: "Receivable amount:",
        message: "Message:",
        closing: "Best regards,",
        signature: `Exreceivables Ltd.<br>
71-75 Shelton Street, Covent Garden, London, WC2H 9JQ<br>
+44 7451 206573<br>
<a href="mailto:info@exreceivables.com">info@exreceivables.com</a>`,
        formMessage: "Message from contact form",
        formSubject: "Message from contact form Exreceivables.com",
        name: "Name:",
        email: "Email:",
        phone: "Phone:",
        docRequestNote: "Documentation requested"
    },
    de: {
        subject: "Wir haben Ihre Anfrage erhalten",
        greeting: "Guten Tag,",
        body: "Wir haben Ihre Anfrage erhalten und werden uns so schnell wie möglich bei Ihnen melden.",
        caseDocRequest: "Vielen Dank für Ihr Interesse an unseren Dienstleistungen.\nBitte senden Sie die Unterlagen zu Ihrer Forderung als Antwort auf diese E-Mail. Unser Team wird diese auswerten und sich umgehend bei Ihnen melden.\nWenn Sie zunächst ein Telefongespräch bevorzugen, können Sie unsere Inkasso-Spezialisten unter: +49 1517 0283999 erreichen.",
        copy: "Hier ist eine Kopie Ihrer Anfrage:",
        amount: "Forderungsbetrag:",
        message: "Nachricht:",
        closing: "Mit freundlichen Grüßen,",
        signature: `Exforderungen GmbH<br>
Sonnenhof 3, 94252 Bayerisch Eisenstein, Deutschland<br>
+49 1517 0283999<br>
<a href="mailto:info@exforderungen.de">info@exforderungen.de</a>`,
        formMessage: "Nachricht vom Kontaktformular",
        formSubject: "Nachricht vom Kontaktformular Exforderungen.de",
        name: "Name:",
        email: "E-Mail:",
        phone: "Telefon:",
        docRequestNote: "Unterlagen angefordert"
    },
    sk: {
        subject: "Vašu požiadavku sme prijali",
        greeting: "Dobrý deň,",
        body: "Prijali sme vašu požiadavku a budeme vás kontaktovať čo najskôr.",
        caseDocRequest: "Ďakujeme za záujem o naše služby.\nZašlite podklady k svojej pohľadávke v odpovedi na tento email, následne budú vyhodnotené a kolegovia sa Vám obratom ozvú.\nAk chcete zvoliť pre prvý kontakt radšej telefón, volajte našich vymáhacích špecialistov na čísle: +421 911 696 596.",
        copy: "Tu je kópia vašej požiadavky:",
        amount: "Výška pohľadávky:",
        message: "Správa:",
        closing: "S pozdravom,",
        signature: `Expohľadávky s.r.o.<br>
Betliarska 22, 851 07 Bratislava<br>
+421 911 696 596<br>
<a href="mailto:info@expohladavky.sk">info@expohladavky.sk</a>`,
        formMessage: "Správa z kontaktného formulára",
        formSubject: "Správa z kontaktného formulára Expohladavky.sk",
        name: "Meno:",
        email: "E-mail:",
        phone: "Telefón:",
        docRequestNote: "Podklady vyžiadané"
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
        service: "Gmail",
        host: "smtp.gmail.com",
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
    
    // Get service name to include in the subject, with proper localization
    let serviceNamePart = '';
    if (data.serviceName) {
        // Get translated service name based on language
        const originalServiceName = data.serviceName;
        const serviceTranslations = serviceNameTranslations[originalServiceName as keyof typeof serviceNameTranslations];
        
        // If translation exists for this service and language, use it; otherwise fallback to the original
        const translatedServiceName = serviceTranslations?.[language as keyof typeof serviceTranslations] || originalServiceName;
        serviceNamePart = ` - ${translatedServiceName}`;
    }

    const transporter = nodemailer.createTransport(emailConfig);

    try {
        // Email to customer
        await transporter.sendMail({
            from: emailConfig.auth.user,
            to: data.email,
            subject: template.subject,
            html: `
<!DOCTYPE html>
<html lang="${language}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${template.subject}</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f9f9f9; margin: 0; padding: 0; }
        .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
        .email-header { background-color: #f97316; color: white; padding: 20px 30px; text-align: center; }
        .email-header h1 { margin: 0; font-size: 24px; font-weight: 600; }
        .email-body { padding: 30px; color: #4b5563; }
        .email-body p { margin: 0 0 15px; }
        .amount-box { background-color: #fff7ed; border-left: 4px solid #f97316; padding: 12px 15px; margin: 20px 0; border-radius: 4px; }
        .amount-value { font-size: 22px; font-weight: 600; color: #f97316; }
        .notes-box { background-color: #f9fafb; padding: 15px; border-radius: 4px; border: 1px solid #e5e7eb; margin-top: 20px; white-space: pre-line; }
        .notes-box h3 { margin-top: 0; color: #374151; font-size: 16px; font-weight: 600; }
        .email-footer { padding: 20px 30px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 14px; }
        .email-footer p { margin: 0; line-height: 1.5; }
        .email-footer .website { margin-top: 5px; }
        .signature { margin-top: 20px; font-weight: 600; color: #4b5563; }
        .signature p { margin: 0; line-height: 1.5; }
        .signature p:first-child { font-weight: normal; margin-bottom: 5px; }
        .contact-us { margin-top: 15px; font-style: italic; }
        .contact-signature { margin-top: 30px; padding-top: 15px; border-top: 1px dashed #e5e7eb; }
        .doc-request { background-color: #f3f4f6; padding: 15px; border-radius: 4px; margin: 20px 0; border-left: 4px solid #3b82f6; }
        @media screen and (max-width: 600px) { .email-container { width: 100%; border-radius: 0; } .email-header, .email-body, .email-footer { padding: 15px; } }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <h1>${template.subject}</h1>
        </div>
        <div class="email-body">
            <p>${template.greeting}</p>
            <p>${template.body}</p>
            <div class="doc-request">
                <p>${template.caseDocRequest}</p>
            </div>
            <p>${template.copy}</p>
            <div class="amount-box">
                <strong>${template.amount}</strong>
                <div class="amount-value">${data.amount || '-'}</div>
            </div>
            <div class="notes-box">
                <h3>${template.message}</h3>
                ${data.message.replace(/\n/g, "<br>")}
            </div>
            <div class="contact-signature">
                <p>${template.closing}</p>
                <div class="signature">${template.signature}</div>
            </div>
        </div>
        <div class="email-footer">
            <p>&copy; ${new Date().getFullYear()} ${
                language === 'cs' ? 'Expohledávky s.r.o.' :
                language === 'sk' ? 'Expohľadávky s.r.o.' :
                language === 'de' ? 'Exforderungen GmbH' :
                'Exreceivables Ltd.'
            }</p>
            <p class="website">
                <a href="${
                    language === 'cs' ? 'https://www.expohledavky.cz' :
                    language === 'sk' ? 'https://www.expohladavky.sk' :
                    language === 'de' ? 'https://www.exforderungen.de' :
                    'https://www.exreceivables.com'
                }" style="color: #f97316; text-decoration: none;">
                    ${
                        language === 'cs' ? 'www.expohledavky.cz' :
                        language === 'sk' ? 'www.expohladavky.sk' :
                        language === 'de' ? 'www.exforderungen.de' :
                        'www.exreceivables.com'
                    }
                </a>
            </p>
        </div>
    </div>
</body>
</html>
            `,
        });

        // Email to admin
        await transporter.sendMail({
            from: emailConfig.auth.user,
            to: emailConfig.auth.user,
            subject: `${template.formSubject}${serviceNamePart}`,
            html: `
<!DOCTYPE html>
<html>
<head>
  <meta content="text/html; charset=utf-8" http-equiv="Content-Type"/>
  <style>
    @import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700);
    * { box-sizing: border-box; }
    .wrap {
      background-color: #f2f3f8;
      font-family: "Open Sans", "Verdana", "Tahoma", sans-serif;
      font-size: 12px;
      font-weight: 400;
      line-height: 1.5;
      width: 100%;
      padding: 3rem 0;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    }
    a {
      text-decoration: none;
      color: rgb(13, 110, 253);
    }
    p {
      font-size: 12px;
      line-height: 1.15;
      margin-bottom: 1.75rem;
    }
    strong {
      font-weight: 700;
      color: #a61c00;
    }
    .header {
      width: 600px;
      margin: auto;
      background-color: #143466;
      padding: .75rem 1rem;
      box-shadow: 0px 0px 8px rgba(0, 0, 0, .1);
    }
    .main {
      background-color: white;
      width: 600px;
      padding: 2rem;
      box-shadow: 0px 0px 8px rgba(0, 0, 0, .1);
      margin: auto;
    }
    .footer {
      padding: 2rem;
      width: 600px;
      font-size: 12px;
      color: #888;
      margin: auto;
      text-align: center;
    }
    .title {
      width: 600px;
      margin: auto;
      padding: 1.5rem;
      background-color: #f3f3f3;
      box-shadow: 0px 0px 8px rgba(0, 0, 0, .1);
      font-weight: 700;
      font-size: 1.75rem;
      color: #24578e;
      text-transform: uppercase;
      text-align: center;
    }
    td.field {
      color: #3d85c6;
    }
    td.pt-12 {
      padding-top: 12px;
    }
    .doc-request-note {
      background-color: #fef3c7;
      color: #92400e;
      padding: 8px 12px;
      border-radius: 4px;
      margin: 1rem auto;
      margin-top: 3rem;
      font-weight: 600;
      text-align: center;
      width: fit-content;
    }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="header">
      <img src="https://i.ibb.co/1Y4zj16q/expohledavky.png" style="display: block; line-height: 1; height: 24px; width: auto;" />
    </div>
    <div class="title">${template.formMessage}${serviceNamePart}</div>
    <div class="main">
      <table style="width: 100%;">
        <tbody>
          <tr><td class="field">${template.name}</td><td>${data.name}</td></tr>
          <tr><td class="field">${template.email}</td><td><a href="mailto:${data.email}">${data.email}</a></td></tr>
          <tr><td class="field">${template.phone}</td><td>${data.phone ? `<a href="tel:${data.phone}">${data.phone}</a>` : 'Neuvedeno'}</td></tr>
          ${data.amount ? `<tr><td class="field">${data.serviceName === 'Odkup směnek' ? 'Nominální hodnota směnky:' : template.amount}</td><td>${data.amount}</td></tr>` : ''}
          <tr><td class="pt-12 field" valign="top">${template.message}</td><td class="pt-12">${data.message.replace(/\n/g, "<br>")}</td></tr>
        </tbody>
      </table>
    </div>
    <div class="doc-request-note">📎 ${template.docRequestNote}</div>
    <div class="footer">
      <div>${template.signature}</div>
    </div>
  </div>
</body>
</html>
            `,
        });

        return { success: true };
    } catch (error) {
        console.error("Failed to send email:", error);
        return { success: false, error: "Failed to send email. Please try again." };
    }
} 