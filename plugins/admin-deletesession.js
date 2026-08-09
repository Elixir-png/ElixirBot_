// Plugin by Elixir, Punisher & 888 staff
import { existsSync, promises as fsPromises } from 'fs';
import path from 'path';

const handler = async (message, { conn }) => {
  if (global.conn.user.jid !== conn.user.jid) return true;

  const sessionFolder = "./888BotSession/";
  let deletedCount = 0;
  let statusContent = "";

  try {
    if (!existsSync(sessionFolder)) {
      statusContent = "Directory sessioni non trovata.";
    } else {
      const sessionFiles = await fsPromises.readdir(sessionFolder);

      for (const file of sessionFiles) {
        if (file !== "creds.json") {
          await fsPromises.unlink(path.join(sessionFolder, file));
          deletedCount++;
        }
      }

      statusContent = deletedCount === 0
        ? "Cache già pulita."
        : Svuotati ${deletedCount} archivi temporanei.;
    }
  } catch (error) {
    statusContent = "Errore di esecuzione.";
  }

  let imgBuffer = null;
  try {
    imgBuffer = Buffer.from(await (await fetch("https://qu.ax")).arrayBuffer());
  } catch (e) {
    imgBuffer = Buffer.alloc(0);
  }

  const botName = global.db?.data?.nomedelbot || "𝟴𝟴𝟴 𝗕𝗢𝗧";
  const quotedMessage = {
    key: { participants: "0@s.whatsapp.net", fromMe: false, id: 'Halo' },
    message: { locationMessage: { name: botName, jpegThumbnail: imgBuffer, vcard: "BEGIN:VCARD\nVERSION:3.0\nN:;Unlimited;;;\nFN:Unlimited\nORG:Unlimited\nTITLE:\nitem1.TEL;waid=19709001746:+1 (970) 900-1746\nitem1.X-ABLabel:Unlimited\nX-WA-BIZ-DESCRIPTION:ofc\nX-WA-BIZ-NAME:Unlimited\nEND:VCARD" }},
    participant: '0@s.whatsapp.net'
  };

  await conn.sendMessage(message.chat, { text: ⚙️ ${botName} v1.2: ${statusContent} }, { quoted: quotedMessage });
  return true;
};

handler.help = ['.ds'];
handler.tags = ["admin"];
handler.command = /^(deletession|ds|clearallsession)$/i;
handler.admin = true;

export default handler;
