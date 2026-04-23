export const emailBaseTemplate = (title: string, content: string, lang: string, frontendUrl: string): string => `
<!doctype html>
<html lang="${lang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https:/css2?family=Google+Sans+Flex:opsz,wght@6..144,100..1000&display=swap" rel="stylesheet">
    <style>
        body, table, td, h1, p, span, a {
            font-family: 'Google Sans Flex', 'Helvetica Neue', Helvetica, Roboto, Arial, sans-serif !important;
        }
    </head>
<body style="margin:0; padding:0; background-color:#faf9ff; -webkit-font-smoothing: antialiased;">
    <table align="center" width="100%" cellpadding="0" cellspacing="0" border="0"
           style="max-width: 600px; margin: 40px auto; background-color:#ffffff; border:1px solid #c1c6d7; border-radius: 24px; border-collapse: separate;">
        
        <tr>
            <td style="padding: 48px 48px 24px 48px;">
                <div style="background-color: #d9e2ff; display: inline-block; padding: 6px 12px; border-radius: 8px; margin-bottom: 24px;">
                    <span style="color: #001944; font-weight: 700; font-size: 11px; letter-spacing: 0.8px; text-transform: uppercase;">
                        Edital Certo
                    </div>
                <h1 style="font-size: 32px; font-weight: 800; margin: 0; color: #191b23; letter-spacing: -1px; line-height: 1.1;">
                    ${title}
                </tr>

        <tr>
            <td style="padding: 0 48px 40px 48px;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0" 
                       style="background-color: #f2f3fd; border-radius: 20px;">
                    <tr>
                        <td style="padding: 32px; font-size: 16px; color:#44474f; line-height: 1.6; text-align: center;">
                            ${content}
                        </tr>

        <tr>
            <td style="padding: 0 48px;">
                <div style="border-top: 1px solid #c1c6d7; width: 100%;"></tr>

        <tr>
            <td style="padding: 32px 48px 48px 48px; font-size: 12px; color: #757780;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                        <td>
                            <p style="margin: 0; font-weight: 700; color: #191b23; font-size: 13px; letter-spacing: 0.2px;">Edital Certo AI Studio</p>
                            <p style="margin: 4px 0 0 0;">© ${new Date().getFullYear()} — Florianópolis, SC.</td>
                        <td align="right" style="vertical-align: bottom;">
                            <a href="${frontendUrl}/suporte" style="color: #0058c9; text-decoration: none; font-weight: 600;">Suporte</html>
`;