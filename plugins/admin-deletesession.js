//Plugin by Elixir & Punisher & 888 Staff






import { existsSync, promises as fsPromises } from 'fs';
import path from 'path';

const handler = async (message, { conn, usedPrefix }) => {
  if (global.conn.user.jid !== conn.user.jid) {
    return conn.sendMessage(message.chat, {
      text: "*Utilizza questo comando direttamente nel numero del bot.*"
    }, { quoted: message });
  }

  await conn.sendMessage(message.chat, {
    text: "Ripristino delle sessioni in corso..."
  }, { quoted: message });

  try {
    const sessionFolder = "./333BotSession/";

    if (!existsSync(sessionFolder)) {
      return await conn.sendMessage(message.chat, {
        text: "*La cartella delle sessioni e vuota o non esiste.*"
      }, { quoted: message });
    }

    const sessionFiles = await fsPromises.readdir(sessionFolder);
    let deletedCount = 0;

    for (const file of sessionFiles) {
      if (file !== "creds.json") {
        await fsPromises.unlink(path.join(sessionFolder, file));
        deletedCount++;
      }
    }

    const responseText = deletedCount === 0
      ? "Le sessioni sono vuote!"
      : `Sono eliminati ${deletedCount} archivi delle sessioni!`;

    await conn.sendMessage(message.chat, { text: responseText }, { quoted: message });

  } catch (error) {
    console.error('Errore:', error);
    await conn.sendMessage(message.chat, { text: "Errore di eliminazione!" }, { quoted: message });
  }

  const botName = global.db.data.nomedelbot || "ELIXIR BOT";
  const quotedMessage = {
    key: {
      participants: "0@s.whatsapp.net",
      fromMe: false,
      id: 'Halo'
    },
    message: {
      locationMessage: {
        name: botName,
        jpegThumbnail: await (await fetch("https://qu.ax/cSqEs.jpg")).buffer(),
        vcard: "BEGIN:VCARD\nVERSION:3.0\nN:;Elixir;;;\nFN:Elixir\nORG:Elixir\nTITLE:\nitem1.TEL;waid=19709001746:+1 (970) 900-1746\nitem1.X-ABLabel:Elixir\nX-WA-BIZ-DESCRIPTION:ofc\nX-WA-BIZ-NAME:Elixir\nEND:VCARD"
      }
    },
    participant: '0@s.whatsapp.net'
  };

  await conn.sendMessage(message.chat, {
    text: "Sessioni ripristinate e bot velocizzato"
  }, { quoted: quotedMessage });
};

handler.help = ['.ds'];
handler.tags = ["admin"];
handler.command = /^(deletession|ds|clearallsession)$/i;
handler.admin = true;

export default handler;
