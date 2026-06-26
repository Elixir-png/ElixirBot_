const logAdminAction = async (chatId, adminJid, actionKey, amount = 1) => {
    if (typeof global.logAdmin?.increment === 'function') {
        await global.logAdmin.increment(chatId, adminJid, actionKey, amount)
    } else {
        global.logAdminQueue = global.logAdminQueue || []
        global.logAdminQueue.push({ chatId, adminJid, actionKey, amount })
    }
}

async function handler(m, { isBotAdmin, conn }) {
    if (!isBotAdmin) {
        return m.reply('ⓘ Cfr. Config: Devo essere amministratore per eseguire questa azione.')
    }

    const mention = m.mentionedJid?.[0] || m.quoted?.sender || null
    if (!mention) {
        return m.reply("ⓘ Errore: Menziona l'utente da rimuovere o rispondi a un suo messaggio.")
    }

    const normalize = jid => jid && conn.decodeJid ? conn.decodeJid(jid) : jid
    const target = normalize(mention)
    const sender = normalize(m.sender)
    const botJid = normalize(conn.user?.jid || conn.user?.id)

    if (target === sender || target === botJid) {
        return m.reply("⚠️ Azione non valida: Impossibile rimuovere te stesso o il bot.")
    }

    const groupMetadata = conn.chats?.[m.chat]?.metadata || await conn.groupMetadata(m.chat).catch(() => null)
    const participants = groupMetadata?.participants || []

    const utente = participants.find(u => 
        normalize(u.id) === target || 
        normalize(u.jid) === target || 
        normalize(u.lid) === target
    )

    if (!utente) {
        return m.reply("⚠️ Target fallito: L'utente non è presente in questo gruppo.")
    }

    const owner = utente.admin === 'superadmin'
    const admin = utente.admin === 'admin' || utente.admin === true

    if (owner || admin) {
        return m.reply('⚠️ Permessi insufficienti: Impossibile rimuovere lo staff del gruppo.')
    }

    const gifUrl = 'https://giphy.com'
    
    await conn.sendMessage(m.chat, { 
        video: { url: gifUrl }, 
        gifPlayback: true, 
        caption: `🚨 *SISTEMA DI SICUREZZA ATTIVATO* 🚨\nAnalisi target in corso...` 
    }).catch(() => null)

    const targetUser = mention.split('@')[0]
    const baseText = `╭────────────────────────╮\n│   🚨 ALLERTA SICUREZZA 🚨  │\n╰────────────────────────╯\n\n➔ *SOGGETTO:* @${targetUser}\n➔ *STATO:* Rilevato nel sistema\n\n`
    
    let currentMsg = await conn.sendMessage(m.chat, {
        text: `${baseText}\`[▢▢▢▢▢▢▢▢▢▢] 0%\`\n⚠️ *Inizializzazione protocollo...*`,
        mentions: [mention]
    })

    const frames = [
        { bar: '`[████▢▢▢▢▢▢] 40%`', status: '🔒 *Generazione credenziali di espulsione...*' },
        { bar: '`[████████▢▢] 80%`', status: '📡 *Sincronizzazione con il server...*' },
        { bar: '`[██████████] 100%`', status: '💥 *PROTOCOLLO ESEGUITO!*' }
    ]

    for (const frame of frames) {
        await new Promise(resolve => setTimeout(resolve, 1000))
        await conn.sendMessage(m.chat, {
            text: `${baseText}${frame.bar}\n${frame.status}`,
            mentions: [mention],
            edit: currentMsg.key
        }).catch(() => null)
    }

    try {
        await conn.groupParticipantsUpdate(m.chat, [mention], 'remove')
        
        const senderUser = m.sender.split('@')[0]
        const finalLayout = `╭────────────────────────╮\n│   🛡️ ESPULSIONE COMPLETATA 🛡️ │\n╰────────────────────────╯\n\n✅ *Sicurezza ripristinata con successo.*\n\n👮 _Azione autorizzata da:_ @${senderUser}`

        await conn.sendMessage(m.chat, {
            text: finalLayout,
            mentions: [m.sender]
        })

        await logAdminAction(m.chat, m.sender, 'removes')
    } catch (error) {
        console.error(error)
        return m.reply("❌ *Errore critico:* Rimozione fallita. Verifica i permessi di amministrazione del bot.")
    }
}

handler.help = ['antipedo @utente']
handler.tags = ['admin']
handler.command = /^antipedo$/i
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler
