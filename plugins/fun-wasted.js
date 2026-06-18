import fetch from 'node-fetch';
import ffmpeg from 'fluent-ffmpeg';
import { promises as fs } from 'fs';
import { join } from 'path';

const WASTED_URL = 'https://pinimg.com';

let handler = async (m, { conn }) => {
    let who = m.quoted ? m.quoted.sender : m.mentionedJid?.[0] ? m.mentionedJid[0] : m.sender;
    
    let pathUserImg;
    let pathWastedImg;
    let pathOutImg;

    try {
        const pp = await conn.profilePictureUrl(who, 'image').catch(() => null);
        if (!pp) {
            const notification = who === m.sender ? 
                'non hai una foto profilo 🤕' : 
                `@${who.split('@')[0]} non ha una foto profilo 🤕`;
            return m.reply(notification, null, { mentions: [who] });
        }

        await m.reply('⏳ Recupero la foto profilo ed elaboro...');

        const resProfile = await fetch(pp);
        if (!resProfile.ok) throw new Error('Impossibile scaricare la foto profilo.');
        const bufProfile = Buffer.from(await resProfile.arrayBuffer());

        const resWasted = await fetch(WASTED_URL);
        if (!resWasted.ok) throw new Error('Impossibile scaricare la grafica Wasted.');
        const bufWasted = Buffer.from(await resWasted.arrayBuffer());

        const timestamp = Date.now();
        pathUserImg = join('temp', `user_${timestamp}.jpg`);
        pathWastedImg = join('temp', `wasted_${timestamp}.jpg`);
        pathOutImg = join('temp', `out_${timestamp}.png`);

        await fs.writeFile(pathUserImg, bufProfile);
        await fs.writeFile(pathWastedImg, bufWasted);

        await new Promise((resolve, reject) => {
            ffmpeg(pathUserImg)
                .input(pathWastedImg)
                .complexFilter([
                    '[0:v]scale=512:512,hue=s=0,drawbox=y=(ih-120)/2:h=120:color=black@0.5:t=fill[bg]',
                    '[1:v]scale=340:-1[logo]',
                    '[bg][logo]overlay=(W-w)/2:(H-h)/2[out]'
                ])
                .outputOptions(['-map', '[out]', '-frames:v', '1'])
                .output(pathOutImg)
                .on('end', resolve)
                .on('error', (err) => reject(new Error(`FFmpeg error: ${err.message}`)))
                .run();
        });

        const resultBuf = await fs.readFile(pathOutImg);
        await conn.sendMessage(m.chat, { image: resultBuf, caption: '💀 *W A S T E D*', mentions: [who] }, { quoted: m });

    } catch (e) {
        console.error('Errore wasted:', e);
        m.reply('❌ Si è verificato un errore durante l\'elaborazione dell\'immagine.');
    } finally {
        if (pathUserImg) { try { await fs.unlink(pathUserImg); } catch {} }
        if (pathWastedImg) { try { await fs.unlink(pathWastedImg); } catch {} }
        if (pathOutImg) { try { await fs.unlink(pathOutImg); } catch {} }
    }
};

handler.help = ['wasted'];
handler.tags = ['giochi'];
handler.command = /^(wasted)$/i;

export default handler;
