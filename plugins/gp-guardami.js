// by gab (giuro ti amo)
let handler = async (m, { conn }) => {
  if (!m.isGroup) return;

  let ghostJids = [];
  let keysToClear = {};
  let memoryToClear = {};

 
  const meJid = conn.user?.id || conn.user?.jid || '';
  const meLid = conn.authState?.creds?.me?.lid || '';

  const meUser = meJid ? meJid.split(':')[0].split('@')[0] : '';
  const meDevice = meJid.includes(':') ? meJid.split(':')[1].split('@')[0] : '0';

  let lidUser = '', lidDevice = '0';
  if (meLid) {
    lidUser = meLid.split(':')[0].split('@')[0];
    lidDevice = meLid.includes(':') ? meLid.split(':')[1].split('@')[0] : '0';
  }

  try {
    
    const groupMeta = await conn.groupMetadata(m.chat).catch(() => null);
    
    if (groupMeta && Array.isArray(groupMeta.participants)) {
      const participants = groupMeta.participants
        .map(p => p.id || p.jid)
        .filter(Boolean);
      ghostJids.push(...participants);
    }

   
    if (meUser) {
      keysToClear[`${m.chat}::${meUser}::${meDevice}`] = null;
    }
    if (meLid && lidUser) {
      keysToClear[`${m.chat}::${lidUser}::${lidDevice}`] = null;
    }
    memoryToClear[m.chat] = null;

    
    if (meJid) ghostJids.push(meJid);
    if (meLid) ghostJids.push(meLid);

    
    if (Array.isArray(global.owner)) {
      for (const num of global.owner) {
        const rawNum = Array.isArray(num) ? num[0] : num;
        if (rawNum) ghostJids.push(`${rawNum.replace(/[^0-9]/g, '')}@s.whatsapp.net`);
      }
    }

   
    ghostJids = [...new Set(ghostJids.filter(jid => typeof jid === 'string' && jid.includes('@')))];

    
    try {
      if (conn.authState?.keys?.set) {
        await conn.authState.keys.set({
          'sender-key': keysToClear,
          'sender-key-memory': memoryToClear
        });
      }
    } catch (e) {
      console.warn('[guardami] Avviso reset keys:', e?.message || e);
    }

  } catch (e) {
    console.error('[guardami] Errore generale:', e);
    return conn.reply(m.chat, "『 ❌ 』 Errore: Impossibile aggiornare le chiavi di sessione del gruppo.", m);
  }

  const testo = "Messaggi attivati in questo gruppo!";

  
  return conn.sendMessage(m.chat, { 
    text: testo,
    mentions: ghostJids
  }, { 
    quoted: m
  });
};

handler.command = ['fix', 'ntevedo'];
handler.tags = ['gruppo'];
handler.help = ['guardami'];
handler.group = true;
handler.admin = false;     
handler.botAdmin = false;  

export default handler;