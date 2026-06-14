//Plugin by Elixir, Punisher & 888 staff
import { loadImage, createCanvas, registerFont } from 'canvas';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const iconeDir = path.join(__dirname, '..', 'icone');

const time = async (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

async function generateCard(type, userName, warnCount, reason, senderName) {
  const width = 700;
  const height = 340;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  const pad = 30;
  const radius = 16;

  ctx.fillStyle = '#12131a';
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = type === 'warn' ? '#f59e0b' : '#10b981';
  ctx.fillRect(0, 0, width, 4);

  roundRect(ctx, pad, 60, width - pad * 2, height - 90, radius);
  ctx.fillStyle = '#1a1c26';
  ctx.fill();

  roundRect(ctx, pad, 60, width - pad * 2, height - 90, radius);
  ctx.fillStyle = 'rgba(255,255,255,0.02)';
  ctx.fill();

  let iconImg = null;
  try {
    iconImg = await loadImage(path.join(iconeDir, `${type}.png`));
  } catch (_) {
    console.log('[warn-system] Icona non trovata per', type);
  }
  if (iconImg) {
    const iconSize = 70;
    const ix = pad + 35;
    const iy = 60 + 40;
    roundRect(ctx, ix, iy, iconSize, iconSize, 12);
    ctx.save();
    ctx.clip();
    ctx.drawImage(iconImg, ix, iy, iconSize, iconSize);
    ctx.restore();
  }

  const badgeLabel = type === 'warn' ? 'AMMONIMENTO' : 'RIMOSSO';
  const badgeColor = type === 'warn' ? '#f59e0b' : '#10b981';
  const badgeBg = type === 'warn' ? 'rgba(245,158,11,0.12)' : 'rgba(16,185,129,0.12)';

  ctx.font = '600 13px "Segoe UI", "Helvetica Neue", Arial, sans-serif';
  const badgeW = ctx.measureText(badgeLabel).width + 24;
  const badgeX = width - pad - badgeW - 10;
  const badgeY = 75;

  roundRect(ctx, badgeX, badgeY, badgeW, 28, 14);
  ctx.fillStyle = badgeBg;
  ctx.fill();

  ctx.fillStyle = badgeColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(badgeLabel, badgeX + badgeW / 2, badgeY + 14);

  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';

  const titleX = pad + 130;
  let titleY = 60 + 35;

  ctx.font = '700 22px "Segoe UI", "Helvetica Neue", Arial, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('Warn System', titleX, titleY);

  titleY += 40;
  ctx.font = '400 15px "Segoe UI", "Helvetica Neue", Arial, sans-serif';
  ctx.fillStyle = '#9ca3af';
  ctx.fillText('Utente', titleX, titleY);

  titleY += 22;
  ctx.font = '700 20px "Segoe UI", "Helvetica Neue", Arial, sans-serif';
  ctx.fillStyle = '#f1f5f9';
  const displayName = userName.length > 18 ? userName.slice(0, 16) + '…' : userName;
  ctx.fillText(displayName, titleX, titleY);

  const warnLabel = `Warn: ${warnCount} / 3`;
  ctx.font = '600 14px "Segoe UI", "Helvetica Neue", Arial, sans-serif';
  const warnPillW = ctx.measureText(warnLabel).width + 24;
  const warnPillX = width - pad - warnPillW - 10;
  const warnPillY = 140;

  roundRect(ctx, warnPillX, warnPillY, warnPillW, 30, 15);
  ctx.fillStyle = 'rgba(255,255,255,0.05)';
  ctx.fill();

  ctx.fillStyle = '#94a3b8';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(warnLabel, warnPillX + warnPillW / 2, warnPillY + 15);

  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  const reasonY = titleY + 50;
  ctx.font = '400 13px "Segoe UI", "Helvetica Neue", Arial, sans-serif';
  ctx.fillStyle = '#6b7280';
  ctx.fillText('Motivo', titleX, reasonY);

  ctx.font = '500 16px "Segoe UI", "Helvetica Neue", Arial, sans-serif';
  ctx.fillStyle = '#e2e8f0';
  const shortReason = reason.length > 40 ? reason.slice(0, 38) + '…' : reason;
  ctx.fillText(shortReason, titleX, reasonY + 22);

  ctx.font = '500 12px "Segoe UI", "Helvetica Neue", Arial, sans-serif';
  ctx.fillStyle = '#4b5563';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';
  ctx.fillText('888 BOT · Warn System', width / 2, height - 14);

  return canvas.toBuffer('image/jpeg', { quality: 0.92 });
}

let handler = async (m, { conn, text, args, groupMetadata, usedPrefix, command }) => {
  let reason = args.slice(1).join(' ') || 'Non specificato';

  if (command == 'warn' || command == 'ammonisci') {
    let mention = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : m.quoted;
    if (!mention) return m.reply('ⓘ 𝐌𝐞𝐧𝐳𝐢𝐨𝐧𝐚 𝐥𝐚 𝐩𝐞𝐫𝐬𝐨𝐧𝐚 𝐝𝐚 𝐰𝐚𝐫𝐧𝐚𝐫𝐞');
    let war = 2;
    let who;
    if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : true;
    else who = m.chat;
    if (!who) return;
    if (!(who in global.db.data.users)) {
      global.db.data.users[who] = { warn: 0 };
    }
    let user = global.db.data.users[who];
    let warn = user.warn;
    let userName = (groupMetadata && groupMetadata.participants)
      ? ((groupMetadata.participants.find(p => p.id === who) || {}).pushName || 'Utente')
      : 'Utente';

    let cardBuffer;
    try {
      cardBuffer = await generateCard('warn', userName, warn + 1, reason, m.pushName || 'Admin');
    } catch (err) {
      console.log('[warn-system] Errore generazione card:', err.message);
      cardBuffer = null;
    }

    if (cardBuffer) {
      await conn.sendMessage(m.chat, {
        image: cardBuffer,
        caption: `┃ @${mention.split`@`[0]} — 𝘩𝘢𝘪 𝘳𝘪𝘤𝘦𝘷𝘶𝘵𝘰 𝘶𝘯 𝘸𝘢𝘳𝘯`
      }, { mentions: [mention] });
    }

    if (warn < war) {
      global.db.data.users[who].warn += 1;
      console.log('[warn-system] Warn assegnato a', who, '— totale:', user.warn + 1);
      if (!cardBuffer) {
        conn.reply(m.chat, `╭─────────╮
┃ @${mention.split`@`[0]}\n┃ 𝐡𝐚𝐢 𝐫𝐢𝐜𝐞𝐯𝐮𝐭𝐨 𝐮𝐧 𝐰𝐚𝐫𝐧 𝐝𝐚\n┃ @${m.sender.split`@`[0]}
┃━━━━━━━━━━━━━━
┃➣ 𝐖𝐚𝐫𝐧: ${user.warn} / 3
┃➣ 𝐌𝐨𝐭𝐢𝐯𝐨: ${reason}
┃━━━━━━━━━━━━━━
> 𝐀𝐭𝐭𝐞𝐧𝐳𝐢𝐨𝐧𝐞! 𝐀 𝟑 𝐰𝐚𝐫𝐧 𝐯𝐞𝐫𝐫𝐚𝐢 𝐞𝐬𝐩𝐮𝐥𝐬𝐨 𝐝𝐚𝐥 𝐠𝐫𝐮𝐩𝐩𝐨.
╰─────────╯`, false, { mentions: [mention, m.sender] });
      }
    } else if (warn == war) {
      global.db.data.users[who].warn = 0;
      console.log('[warn-system] Utente rimosso dopo 3 warn —', who);
      if (!cardBuffer) {
        conn.reply(m.chat, `𝐔𝐭𝐞𝐧𝐭𝐞 𝐫𝐢𝐦𝐨𝐬𝐬𝐨 𝐝𝐨𝐩𝐨 𝟑 𝐚𝐯𝐯𝐞𝐫𝐭𝐢𝐦𝐞𝐧𝐭𝐢`, false);
      }
      await time(1000);
      await conn.groupParticipantsUpdate(m.chat, [who], 'remove');
    }
  }

  if (command == 'unwarn' || command == 'delwarn') {
    let mention = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : null;
    if (!mention) return m.reply('ⓘ 𝐌𝐞𝐧𝐳𝐢𝐨𝐧𝐚 𝐥𝐚 𝐩𝐞𝐫𝐬𝐨𝐧𝐚 𝐚 𝐜𝐮𝐢 𝐭𝐨𝐠𝐥𝐢𝐞𝐫𝐞 𝐢𝐥 𝐰𝐚𝐫𝐧');
    let who = mention;
    if (!(who in global.db.data.users)) {
      global.db.data.users[who] = { warn: 0 };
    }
    let user = global.db.data.users[who];
    if (user.warn > 0) {
      user.warn -= 1;
      console.log('[warn-system] Warn rimosso a', who, '— rimanenti:', user.warn);
      let userName = (groupMetadata && groupMetadata.participants)
        ? ((groupMetadata.participants.find(p => p.id === who) || {}).pushName || 'Utente')
        : 'Utente';

      let cardBuffer;
      try {
        cardBuffer = await generateCard('unwarn', userName, user.warn, reason, m.pushName || 'Admin');
      } catch (err) {
        console.log('[warn-system] Errore generazione card:', err.message);
        cardBuffer = null;
      }

      if (cardBuffer) {
        await conn.sendMessage(m.chat, {
          image: cardBuffer,
          caption: `┃ @${who.split('@')[0]} — 𝘵𝘪 𝘦̀ 𝘴𝘵𝘢𝘵𝘰 𝘵𝘰𝘭𝘵𝘰 𝘶𝘯 𝘸𝘢𝘳𝘯`
        }, { mentions: [who] });
      } else {
        conn.reply(m.chat, `╭─────────╮
┃ @${who.split('@')[0]},\n┃ 𝐭𝐢 𝐞̀ 𝐬𝐭𝐚𝐭𝐨 𝐭𝐨𝐥𝐭𝐨 𝐮𝐧 𝐰𝐚𝐫𝐧 𝐝𝐚\n┃ @${m.sender.split('@')[0]},\n┃ 𝐫𝐢𝐧𝐠𝐫𝐚𝐳𝐢𝐚!
┃━━━━━━━━━━━━━━
┃➣ 𝐖𝐚𝐫𝐧: ${user.warn} / 3
┃━━━━━━━━━━━━━━
> 𝟖𝟖𝟖 𝐁𝐎𝐓
╰─────────╯`, false, { mentions: [who, m.sender] });
      }
    } else {
      m.reply('ⓘ 𝐐𝐮𝐞𝐬𝐭𝐨 𝐮𝐭𝐞𝐧𝐭𝐞 𝐧𝐨𝐧 𝐡𝐚 𝐰𝐚𝐫𝐧');
    }
  }
};

handler.command = ['warn', 'ammonisci', 'unwarn', 'delwarn'];
handler.group = true;
handler.admin = true;
handler.botAdmin = true;
export default handler;
