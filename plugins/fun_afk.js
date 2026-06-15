// Plugin by Elixir, Punisher & 888 staff
import fs from 'fs'
    import path from 'path'

    const filePath = path.join(process.cwd(), 'afk.json')

    function getAfkData() {
        try {
            if (fs.existsSync(filePath)) {
                const raw = fs.readFileSync(filePath, 'utf-8')
                return JSON.parse(raw)
            }
        } catch (e) {
            console.error('[afk-system] Errore lettura afk.json:', e.message)
        }
        return {}
    }

    function saveAfkData(data) {
        try {
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
        } catch (e) {
            console.error('[afk-system] Errore scrittura afk.json:', e.message)
        }
    }

    let handler = async (m, { text }) => {
        let afkData = getAfkData()
        let reason = text || 'Nessun motivo specificato'
        
        afkData[m.sender] = {
            reason: reason,
            since: Date.now()
        }
        
        saveAfkData(afkData)
        
        let label = `\`── 🛰️ MODALITÀ AFK ──\`\n\n` +
                    `\`[👤] Utente:\` @${m.sender.split('@')[0]}\n` +
                    `\`[📝] Stato:\` *ATTIVO*\n` +
                    `\`[💡] Motivo:\` _${reason}_\n\n` +
                    `\`[⚡] 888 SYSTEM\``
                    
        await m.reply(label, null, { mentions: [m.sender] })
        console.log(`[afk-system] Utente +${m.sender.split('@')[0]} impostato in AFK.`)
    }

    handler.before = async (m, { conn }) => {
        let afkData = getAfkData()
        
        if (afkData[m.sender]) {
            let afkTime = afkData[m.sender].since
            let duration = Date.now() - afkTime
            let seconds = Math.floor((duration / 1000) % 60)
            let minutes = Math.floor((duration / (1000 * 60)) % 60)
            let hours = Math.floor((duration / (1000 * 60 * 60)) % 24)
            
            let timeStr = `${hours > 0 ? hours + 'h ' : ''}${minutes > 0 ? minutes + 'm ' : ''}${seconds}s`
            
            delete afkData[m.sender]
            saveAfkData(afkData)
            
            await m.reply(`\`── 👋 BENTORNATO ──\`\n\nSei stato assente per: *${timeStr}*.\nLa modalità AFK è stata disattivata.`)
            console.log(`[afk-system] Rimosso stato AFK per +${m.sender.split('@')[0]}.`)
        }
        
        let mentioned = m.mentionedJid || []
        if (m.quoted && m.quoted.sender) mentioned.push(m.quoted.sender)
        
        for (let jid of mentioned) {
            if (afkData[jid]) {
                let data = afkData[jid]
                let afkTime = data.since
                let duration = Date.now() - afkTime
                let seconds = Math.floor((duration / 1000) % 60)
                let minutes = Math.floor((duration / (1000 * 60)) % 60)
                let hours = Math.floor((duration / (1000 * 60 * 60)) % 24)
                let timeStr = `${hours > 0 ? hours + 'h ' : ''}${minutes > 0 ? minutes + 'm ' : ''}${seconds}s`
                
                let targetName = await conn.getName(jid)
                await m.reply(`⚠️ *${targetName}* è attualmente AFK da *${timeStr}*.\n💡 *Motivo:* _${data.reason}_`)
            }
        }
        return true
    }

    handler.help = ['afk']
    handler.tags = ['strumenti']
    handler.command = /^(afk)$/i

    export default handler
