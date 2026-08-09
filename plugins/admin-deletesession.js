//Plugin by Elixir, Punisher & 888 staff
import { existsSync, promises as fsPromises } from 'fs';
import path from 'path';

const handler = async (message, { conn }) => {
  // 1. Controllo se è il bot principale
  if (global.conn.user.jid !== conn.user.jid) {
    const errorFrame = 
`╭━━━〔 🚨 𝐀𝐕𝐕𝐈𝐒𝐎 〕━━━┈
┃ 
┃ Utilizzi questo comando 
┃ direttamente nel numero 
┃ del bot.
┃ 
╰━━━━━━━━━━━━━━━━━━━━━━━┈`;
    await conn.sendMessage(message.chat, { text: errorFrame }, { quoted: message });
    return true;
  }

  const sessionFolder = "./888BotSession/";
  let deletedCount = 0;
  let statusContent = "";

  
  try {
    if (!existsSync(sessionFolder)) {
      statusContent = "❌ La cartella delle sessioni\n│ è vuota o non esiste.";
    } else {
      const sessionFiles = await fsPromises.readdir(sessionFolder);

      for (const file of sessionFiles) {
        if (file !== "creds.json") {
          await fsPromises.unlink(path.join(sessionFolder, file));
          deletedCount++;
        }
      }

      statusContent = deletedCount === 0
        ? "❗ Le sessioni erano già vuote!"
        : `🔥 Eliminati ${deletedCount} archivi!\n│ 🚀 Sessioni ripristinate e\n│ bot velocizzato!`;
    }
  } catch (error) {
    console.error('⚠️ Errore durante l\'eliminazione:', error);
    statusContent = "❌ Errore durante l'eliminazione\n│ delle sessioni!";
  }

  
  let imgBuffer = null;
  try {
    const res = await fetch("https://qu.ax/cSqEs.jpg");
    const arrayBuffer = await res.arrayBuffer();
    imgBuffer = Buffer.from(arrayBuffer);
  } catch (e) {
    imgBuffer = Buffer.alloc(0);
  }

  
  const finalMessage = 
`╭━━━〔 ⚡ 𝐒𝐄𝐒𝐒𝐈𝐎𝐍𝐈 ⚡ 〕━━━┈
┃
┃ ${statusContent}
┃
╰━━━━━━━━━━━━━━━━━━━━━━━┈`;

  
  const botName = global.db?.data?.nomedelbot || "𝟴𝟴𝟴 𝗕𝗢𝗧";
  const quotedMessage = {
    key: {
      participants: "0@s.whatsapp.net",
      fromMe: false,
      id: 'Halo'
    },
    message: {
      locationMessage: {
        name: botName,
        jpegThumbnail: imgBuffer,
        vcard: "BEGIN:VCARD\nVERSION:3.0\nN:;Unlimited;;;\nFN:Unlimited\nORG:Unlimited\nTITLE:\nitem1.TEL;waid=19709001746:+1 (970) 900-1746\nitem1.X-ABLabel:Unlimited\nX-WA-BIZ-DESCRIPTION:ofc\nX-WA-BIZ-NAME:Unlimited\nEND:VCARD"
      }
    },
    participant: '0@s.whatsapp.net'
  };

  
  await conn.sendMessage(message.chat, { text: finalMessage }, { quoted: quotedMessage });

  return true;
};

handler.help = ['.𝐝𝐬'];
handler.tags = ["admin"];
handler.command = /^(deletession|ds|clearallsession)$/i;
handler.admin = true;

export default handler;
