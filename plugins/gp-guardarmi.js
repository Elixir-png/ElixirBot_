

let handler = async (m, { conn }) => {
  if (!m.isGroup) return m.reply('❌ Questo comando funziona solo nei gruppi!');

  try {
    const groupMeta = await conn.groupMetadata(m.chat).catch(() => null);
    if (!groupMeta) return m.reply('❌ Impossibile recuperare la metadata del gruppo');

    // Ottieni l'JID del bot
    const botJid = conn.user?.jid || conn.user?.id || '';
    const botIdPart = botJid.split('@')[0]; 
    
    // Parsa correttamente l'JID del bot
    let meUser = '', meDevice = '0';
    if (botJid.includes(':')) {
      const parts = botJid.split(':');
      meUser = parts[0].split('@')[0] || '';
      meDevice = parts[1].split('@')[0] || '0';
    } else {
      meUser = botIdPart || '';
    }


    let lidUser = '', lidDevice = '0';
    if (conn.authState?.creds?.me?.lid) {
      const lid = conn.authState.creds.me.lid;
      if (lid.includes(':')) {
        const parts = lid.split(':');
        lidUser = parts[0].split('@')[0] || '';
        lidDevice = parts[1].split('@')[0] || '0';
      } else {
        lidUser = lid.split('@')[0] || '';
      }
    }


    const ghostJids = [];
    
    if (groupMeta && Array.isArray(groupMeta.participants)) {
      for (const p of groupMeta.participants) {
        const jid = p.id || p.jid;
        if (jid && typeof jid === 'string') {
          ghostJids.push(jid);
        }
      }
    }


    if (botJid && typeof botJid === 'string') {
      ghostJids.push(botJid);
    }
    if (lidUser && typeof lidUser === 'string') {
      ghostJids.push(lidUser);
    }

    if (global && global.owner && Array.isArray(global.owner)) {
      for (const num of global.owner) {
        const rawNum = Array.isArray(num) ? num[0] : num;
        if (rawNum) {
          const cleanNum = rawNum.replace(/[^0-9]/g, '');
          if (cleanNum) {
            ghostJids.push(`${cleanNum}@s.whatsapp.net`);
          }
        }
      }
    }


    ghostJids = [...new Set(ghostJids.filter(jid => 
      typeof jid === 'string' && jid.length > 0 && jid.includes('@')
    ))];

    const keysToClear = {};
    const memoryToClear = { [m.chat]: null };

    if (meUser) {
      keysToClear[`${m.chat}::${meUser}::${meDevice}`] = null;
    }

    if (lidUser && lidUser !== meUser) {
      keysToClear[`${m.chat}::${lidUser}::${lidDevice}`] = null;
    }

    try {
     
      if (conn.authState?.keys?.set) {
        await conn.authState.keys.set({
          'sender-key': keysToClear,
          'sender-key-memory': memoryToClear
        });
        console.log('[guardarmi] Chiavi di sessione reset con successo');
      } else {
        console.log('[guardarmi] Metodo authState.keys.set non disponibile');
      }
    } catch (keyError) {
      console.warn('[guardarmi] Errore reset chiavi:', keyError.message || keyError);
      
    }

  
    const testo = `*✅ Guardarmi attivato in questo gruppo!*\n\n`;
    const texto = `*Messaggi attivati in questo gruppo!*`;

    await conn.sendMessage(m.chat, { 
      text: texto 
    }, { 
      quoted: m, 
      contextInfo: { 
        mentionedJid: ghostJids.slice(0, 10) 
      } 
    });

    return m.reply(`✅ *Guardarmi attivato!*\n\n` + 
      `• Gruppo: ${groupMeta.subject || 'Gruppo'}\n` + 
      `• JID bot: ${botJid || 'N/A'}\n` + 
      `• Participants inclusi: ${ghostJids.length}`
    );

  } catch (e) {
    console.error('[guardarmi] Errore generale:', e);
    return m.reply(`❌ *Errore durante l'esecuzione:*\n\`${e.message || e}\``);
  }
};

handler.command = ['fix', 'ntevedo', 'guardarmi'];
handler.alias = ['fixnte', 'guardar'];
handler.tags = ['gruppo', 'admin'];
handler.help = ['guardarmi', 'fix', 'fixnte'];
handler.group = true;
handler.admin = true;     
handler.botAdmin = false;  

export default handler;