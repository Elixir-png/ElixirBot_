// Plugin by Elixir & 888 staff
import yts from 'yt-search';
import fetch from 'node-fetch';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`⚡ *888 𝚩𝚯𝐓*\n\n💡 _Scrivi:_ ${usedPrefix + command} nome canzone`);

  try {
    const search = await yts(text);
    const vid = search.videos[0];
    if (!vid) return m.reply('⚠️ *Risultato non trovato.*');

    const url = vid.url;

    if (command === 'play') {
      let infoMsg = `┏━━━━━━━━━━━━━━━━━━━┓\n` +
                    `   🎧  *Play 888 𝚩𝚯𝐓* 🎧\n` +
                    `┗━━━━━━━━━━━━━━━━━━━┛\n\n` +
                    `◈ 📌 *Titolo:* ${vid.title}\n` +
                    `◈ ⏱️ *Durata:* ${vid.timestamp}\n`;

      return await conn.sendMessage(m.chat, {
        image: { url: vid.thumbnail },
        caption: infoMsg,
        footer: '\n888 𝚩𝚯𝐓',
        buttons: [
          { buttonId: `${usedPrefix}playaud ${url}`, buttonText: { displayText: '🎵 AUDIO (MP3)' }, type: 1 },
          { buttonId: `${usedPrefix}playvid ${url}`, buttonText: { displayText: '🎬 VIDEO (MP4)' }, type: 1 }
        ],
        headerType: 4
      }, { quoted: m });
    }

    await conn.sendMessage(m.chat, { react: { text: "🎵", key: m.key } });

    const isAudio = command === 'playaud';
    let downloadUrl = null;

    const methods = [
      async () => {
        let api = isAudio ? 'ytmp3' : 'ytmp4';
        let res = await fetch(`https://vreden.my.id/api/${api}?url=${url}`);
        let json = await res.json();
        return json.result?.download?.url || json.result?.url;
      },
      async () => {
        let api = isAudio ? 'ytmp3' : 'ytmp4';
        let res = await fetch(`https://anya.biz.id/api/${api}?url=${url}`);
        let json = await res.json();
        return json.result?.download?.url || json.result?.url;
      },
      async () => {
        let api = isAudio ? 'ytmp3' : 'ytmp4';
        let res = await fetch(`https://tio.my.id/api/${api}?url=${url}`);
        let json = await res.json();
        return json.result?.download?.url || json.result?.url;
      },
      async () => {
        const tmpDir = os.tmpdir();
        const outFile = path.join(tmpDir, `dlp_${Date.now()}_${isAudio ? 'mp3' : 'mp4'}`);
        await new Promise((resolve, reject) => {
          exec(
            `yt-dlp --no-warnings --force-overwrites -f ${isAudio ? 'bestaudio' : 'best'} -o "${outFile}" "${url}"`,
            (err) => {
              if (err) reject(err);
              else resolve();
            }
          );
        });
        if (fs.existsSync(outFile)) return outFile;
        throw new Error('yt-dlp failed');
      }
    ];

    for (const method of methods) {
      if (downloadUrl) break;
      try {
        downloadUrl = await method();
        if (downloadUrl) break;
      } catch (e) {
        console.log(`Method failed: ${e.message}`);
      }
    }

    if (!downloadUrl) throw new Error('All download methods failed');

    const tmpDir = os.tmpdir();
    const fileName = `file_${Date.now()}`;
    const inputPath = path.join(tmpDir, `${fileName}.${isAudio ? 'mp3' : 'mp4'}`);

    if (typeof downloadUrl === 'string' && (downloadUrl.startsWith('http://') || downloadUrl.startsWith('https://'))) {
      const response = await fetch(downloadUrl);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const arrayBuffer = await response.arrayBuffer();
      fs.writeFileSync(inputPath, Buffer.from(arrayBuffer));
    } else if (typeof downloadUrl === 'string' && fs.existsSync(downloadUrl)) {
      fs.renameSync(downloadUrl, inputPath);
    }

    if (isAudio) {
      const voicePath = path.join(tmpDir, `${fileName}.ogg`);
      await new Promise((resolve, reject) => {
        exec(
          `ffmpeg -hide_banner -loglevel error -y -i "${inputPath}" -map_metadata -1 -vn -ar 48000 -ac 1 -c:a libopus -b:a 64k -application voip -f ogg "${voicePath}"`,
          (err) => {
            if (err) reject(err);
            else resolve();
          }
        );
      });
      await conn.sendMessage(m.chat, {
        audio: fs.readFileSync(voicePath),
        mimetype: 'audio/ogg; codecs=opus',
        ptt: true
      }, { quoted: m });
      if (fs.existsSync(voicePath)) fs.unlinkSync(voicePath);
    } else {
      await conn.sendMessage(m.chat, {
        video: fs.readFileSync(inputPath),
        mimetype: 'video/mp4',
        caption: `✅ *Scaricato da 888 𝚩𝚯𝐓*`
      }, { quoted: m });
    }

    if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

  } catch (e) {
    console.error("Handler Error:", e.message);
    m.reply('🚀 *Play Error:* Al momento i server di download sono sovraccarichi. Riprova tra poco.');
  }
};

handler.help = ['play'];
handler.tags = ['downloader'];
handler.command = /^(play|playaud|playvid)$/i;

export default handler;
