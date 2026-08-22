/*
  AVISO CUANDO ALGUIEN CONFIRMA (opcional)
  =========================================
  Esto te avisa cada vez que alguien le da a "Asistir", lo quita, o marca
  o desmarca su +1. Elige UNO de los dos métodos rellenando su sección
  y poniendo method en "telegram" o "email". No hace falta plugin ni
  servidor propio: se manda directo desde la web.

  Si dejas enabled en false, la web funciona exactamente igual, solo que
  no manda ningún aviso. No rompe nada.


  ─────────────────────────────────────────
  OPCIÓN A: TELEGRAM (mensaje instantáneo al móvil, gratis, sin límite)
  ─────────────────────────────────────────
  1. Abre Telegram y busca el usuario @BotFather.
  2. Escríbele /newbot y sigue los pasos (te pedirá un nombre para el bot).
     Al final te da un TOKEN parecido a esto:
     123456789:AAExampleTokenNoEsElTuyo
  3. Busca en Telegram tu bot recién creado y dale a "Iniciar" / mándale
     cualquier mensaje, ej: "hola".
  4. Para saber tu CHAT ID, abre en el navegador esta URL (cambia TOKEN
     por el tuyo) justo después de escribirle al bot:
     https://api.telegram.org/botTOKEN/getUpdates
     Ahí verás un número en "chat":{"id": 123456789 ...} — ese es tu chat id.
  5. Rellena telegramBotToken y telegramChatId ahí abajo.

  NOTA: el token queda visible en el código fuente de la página (al ser
  una web estática no hay forma de esconderlo del todo). Para una
  invitación privada no es un problema real; ese token solo puede
  escribir en ese bot concreto, no puede leer nada tuyo.


  ─────────────────────────────────────────
  OPCIÓN B: EMAIL (con EmailJS, gratis hasta 200 emails/mes)
  ─────────────────────────────────────────
  1. Crea una cuenta gratis en https://www.emailjs.com
  2. En "Email Services" conecta tu Gmail (u otro correo). Te da un
     SERVICE ID (ej: service_abc1234).
  3. En "Email Templates" crea una plantilla nueva. Usa estas variables
     en el asunto/cuerpo, tal cual (EmailJS las rellena solas):
       {{guest_name}}   -> nombre del invitado
       {{list_name}}    -> Silvia o Bea
       {{action}}       -> qué ha hecho (confirma / quita confirmación...)
       {{message}}      -> la frase ya montada, lista para usar
     Te da un TEMPLATE ID (ej: template_xyz789).
  4. En "Account" > "General" copia tu PUBLIC KEY.
  5. Rellena emailjsServiceId, emailjsTemplateId y emailjsPublicKey abajo.
  6. En tu plantilla de EmailJS, en el campo "To email", pon tu propio
     correo (el sitio donde quieres recibir el aviso) — eso se configura
     ahí, no en este archivo.

  NOTA: la public key de EmailJS está pensada para ir en el navegador,
  es segura de mostrar (puedes además restringir desde qué dominios se
  puede usar, en los ajustes de tu cuenta EmailJS).
*/

window.NOTIFY_CONFIG = {
  enabled: false,
  method: "telegram",   // "telegram" o "email"

  // ---- Opción A: Telegram ----
  telegramBotToken: "TU_TOKEN_AQUI",
  telegramChatId: "TU_CHAT_ID_AQUI",

  // ---- Opción B: Email (EmailJS) ----
  emailjsPublicKey: "TU_PUBLIC_KEY_AQUI",
  emailjsServiceId: "TU_SERVICE_ID_AQUI",
  emailjsTemplateId: "TU_TEMPLATE_ID_AQUI"
};
