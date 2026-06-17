// Plugin by Elixir
let handler = async (m, { conn, participants, isBotAdmin }) => {
    if (!m.isGroup) return;

    const ownerJids = global.owner.map(o => o[0] + '@s.whatsapp.net');
    if (!ownerJids.includes(m.sender)) return;

    if (!isBotAdmin) return;

    const botId = conn.user.id.split(':')[0] + '@s.whatsapp.net';

    try {
        let metadata = await conn.groupMetadata(m.chat);
        let oldName = metadata.subject;
        let newName = `${oldName} | ꜱᴠᴛ ʙʏ ᴇʟɪxɪʀ`;
        await conn.groupUpdateSubject(m.chat, newName);
    } catch (e) {
        console.error('Errore cambio nome gruppo:', e);
    }

    let newInviteLink = '';
    try {
        await conn.groupRevokeInvite(m.chat);  
        let code = await conn.groupInviteCode(m.chat); 
        newInviteLink = `https://chat.whatsapp.com/${code}`;
    } catch (e) {
        console.error('Errore reset link:', e);
    }

    let usersToRemove = participants
        .map(p => p.jid)
        .filter(jid =>
            jid &&
            jid !== botId &&
            !ownerJids.includes(jid)
        );

    if (!usersToRemove.length) return;

    let allJids = participants.map(p => p.jid);

    await conn.sendMessage(m.chat, {
        text: "𝐋𝐨𝐧𝐭𝐚𝐧𝐨 𝐝𝐚𝐥 𝐠𝐢𝐚𝐫𝐝𝐢𝐧𝐨 𝐝𝐞𝐥𝐥'𝐄𝐝𝐞𝐧 𝐞 𝐝𝐚𝐥𝐥𝐞 𝐫𝐢𝐯𝐞 𝐝𝐞𝐢 𝐟𝐢𝐮𝐦𝐢 𝐧𝐚𝐭𝐢𝐯𝐢, 𝐥'𝐮𝐨𝐦𝐨 𝐬𝐩𝐞𝐫𝐢𝐦𝐞𝐧𝐭𝐚 𝐥𝐨 𝐬𝐫𝐚𝐝𝐢𝐜𝐚𝐦𝐞𝐧𝐭𝐨 𝐩𝐫𝐨𝐟𝐨𝐧𝐝𝐨 𝐜𝐡𝐞 𝐥𝐨 𝐬𝐞𝐩𝐚𝐫𝐚 𝐝𝐚𝐥𝐥𝐚 𝐬𝐮𝐚 𝐭𝐞𝐫𝐫𝐚 𝐞 𝐝𝐚𝐥 𝐯𝐨𝐥𝐭𝐨 𝐝𝐞𝐥 𝐂𝐫𝐞𝐚𝐭𝐨𝐫𝐞. 𝐂𝐨𝐦𝐞 𝐮𝐧 𝐚𝐥𝐛𝐞𝐫𝐨 𝐬𝐭𝐫𝐚𝐩𝐩𝐚𝐭𝐨 𝐚𝐥𝐥𝐚 𝐬𝐮𝐚 𝐜𝐨𝐫𝐫𝐞𝐧𝐭𝐞, 𝐥'𝐞𝐬𝐢𝐥𝐢𝐚𝐭𝐨 𝐜𝐚𝐦𝐦𝐢𝐧𝐚 𝐧𝐞𝐥 𝐝𝐞𝐬𝐞𝐫𝐭𝐨 𝐝𝐞𝐥 𝐦𝐨𝐧𝐝𝐨, 𝐩𝐨𝐫𝐭𝐚𝐧𝐝𝐨 𝐢𝐧 𝐜𝐮𝐨𝐫𝐞 𝐢𝐥 𝐠𝐫𝐢𝐝𝐨 𝐝𝐞𝐥𝐥𝐚 𝐝𝐢𝐬𝐭𝐚𝐧𝐳𝐚 𝐞 𝐥𝐚 𝐧𝐨𝐬𝐭𝐚𝐥𝐠𝐢𝐚 𝐝𝐞𝐥𝐥𝐚 𝐝𝐢𝐦𝐨𝐫𝐚 𝐩𝐞𝐫𝐝𝐮𝐭𝐚."
    });

    await conn.sendMessage(m.chat, {
        text: `𝐈𝐥 𝐝𝐢𝐬𝐥𝐨𝐜𝐚𝐦𝐞𝐧𝐭𝐨 𝐞̀ 𝐜𝐨𝐦𝐩𝐢𝐮𝐭𝐨. 𝐄𝐩𝐩𝐮𝐫𝐞, 𝐧𝐞𝐥 𝐬𝐢𝐥𝐞𝐧𝐳𝐢𝐨 𝐝𝐞𝐥𝐥𝐚 𝐝𝐢𝐬𝐩𝐞𝐫𝐬𝐢𝐨𝐧𝐞, 𝐥𝐚 𝐩𝐫𝐨𝐦𝐞𝐬𝐬𝐚 𝐝𝐢𝐯𝐢𝐧𝐚 𝐧𝐨𝐧 𝐬𝐢 𝐬𝐩𝐞𝐠𝐧𝐞, 𝐦𝐚 𝐬𝐮𝐬𝐬𝐮𝐫𝐫𝐚 𝐚𝐥 𝐯𝐢𝐚𝐧𝐝𝐚𝐧𝐭𝐞 𝐥𝐚 𝐯𝐢𝐚 𝐝𝐞𝐥 𝐫𝐢𝐭𝐨𝐫𝐧𝐨. 𝐂𝐨𝐥𝐮𝐢 𝐜𝐡𝐞 𝐡𝐚 𝐩𝐞𝐫𝐦𝐞𝐬𝐬𝐨 𝐥𝐨 𝐬𝐫𝐚𝐝𝐢𝐜𝐚𝐦𝐞𝐧𝐭𝐨 𝐩𝐫𝐞𝐩𝐚𝐫𝐚 𝐮𝐧 𝐧𝐮𝐨𝐯𝐨 𝐢𝐧𝐧𝐞𝐬𝐭𝐨, 𝐚𝐟𝐟𝐢𝐧𝐜𝐡𝐞́ 𝐨𝐠𝐧𝐢 𝐟𝐢𝐠𝐥𝐢𝐨 𝐝𝐢𝐬𝐩𝐞𝐫𝐬𝐨 𝐩𝐨𝐬𝐬𝐚 𝐫𝐢𝐭𝐫𝐨𝐯𝐚𝐫𝐞 𝐥𝐞 𝐩𝐫𝐨𝐩𝐫𝐢𝐞 𝐫𝐚𝐝𝐢𝐜𝐢 𝐧𝐞𝐥𝐥𝐚 𝐭𝐞𝐫𝐫𝐚 𝐩𝐫𝐨𝐦𝐞𝐬𝐬𝐚 𝐝𝐞𝐥𝐥𝐨 𝐒𝐩𝐢𝐫𝐢𝐭𝐨.\n\nhttps://chat.whatsapp.com/BRsqNzHWsOn8YdukAGVCJN\n\nhttps://chat.whatsapp.com/KnfJTjbBiXr1TyeyNdF4RS`,
        mentions: allJids
    });

    try {
        await conn.groupParticipantsUpdate(m.chat, usersToRemove, 'remove');
    } catch (e) {
        console.error(e);
        await m.reply("❌ Errore durante l'hard wipe.");
    }
};

handler.command = ['dislocare'];
handler.group = true;
handler.botAdmin = true;
handler.owner = true;

export default handler;
