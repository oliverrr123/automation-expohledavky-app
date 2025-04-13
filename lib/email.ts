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
        phone: "Telefon:"
    },
    en: {
        subject: "We have received your inquiry",
        greeting: "Hello,",
        body: "We have received your inquiry and will contact you as soon as possible.",
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
        phone: "Phone:"
    },
    de: {
        subject: "Wir haben Ihre Anfrage erhalten",
        greeting: "Guten Tag,",
        body: "Wir haben Ihre Anfrage erhalten und werden uns so schnell wie möglich bei Ihnen melden.",
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
        phone: "Telefon:"
    },
    sk: {
        subject: "Vašu požiadavku sme prijali",
        greeting: "Dobrý deň,",
        body: "Prijali sme vašu požiadavku a budeme vás kontaktovať čo najskôr.",
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
        phone: "Telefón:"
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
  </style>
</head>
<body>
  <div class="wrap">
    <div class="header">
      <img src="https://i.ibb.co/1Y4zj16q/expohledavky.png" style="display: block; line-height: 1; height: 24px; width: auto;" />
    </div>
    <div class="title">${template.subject}</div>
    <div class="main">
      <p>${template.greeting}</p>
      <p>${template.body}</p>
      <p>${template.copy}</p>
      
      <table style="width: 100%;">
        <tbody>
          <tr><td class="field">${data.name ? template.name : ''}</td><td>${data.name || ''}</td></tr>
          <tr><td class="field">${data.email ? template.email : ''}</td><td>${data.email ? `<a href="mailto:${data.email}">${data.email}</a>` : ''}</td></tr>
          <tr><td class="field">${data.phone ? template.phone : ''}</td><td>${data.phone ? `<a href="tel:${data.phone}">${data.phone}</a>` : ''}</td></tr>
          ${data.amount ? `<tr><td class="field">${data.serviceName === 'Odkup směnek' ? 'Nominální hodnota směnky:' : template.amount}</td><td>${data.amount}</td></tr>` : ''}
          <tr><td class="pt-12 field" valign="top">${template.message}</td><td class="pt-12">${data.message.replace(/\n/g, "<br>")}</td></tr>
        </tbody>
      </table>
    </div>
    <div class="footer">
      <div>${template.closing}</div>
      <div>${template.signature}</div>
    </div>
  </div>
</body>
</html>
            `,
        });

        // Email to admin
        await transporter.sendMail({
            from: emailConfig.auth.user,
            // to: emailConfig.auth.user,
            to: data.email,
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
      font-size: 1.75rem;
      font-weight: 700;
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