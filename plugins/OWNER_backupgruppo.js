// Plugin by Elixir, Punisher & 888 staff
import fs from 'fs'
import path from 'path'
import os from 'os'

const dirPath = path.join(process.cwd(), 'data')
const filePath = path.join(dirPath, 'backups.json')

if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
}

function getDatabase() {
    try {
        if (fs.existsSync(filePath)) {
            const raw = fs.readFileSync(filePath, 'utf-8')
            return JSON.parse(raw)
        }
    } catch (e) {
        console.error('[backup-system] Errore lettura backups.json:', e.message)
    }
    return {}
}

function saveDatabase(data) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
    } catch (e) {
        console.error('[backup-system] Errore scrittura backups.json:', e.message)
    }
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (/^(backupgruppo|backupgroup)$/i.test(command)) {
        if (!m.isGroup) return conn.reply(m.chat, '⚠️ Questo comando può essere eseguito solo all\'interno dei gruppi.', m)
        
        try {
            await m.react('📥')
            let meta = await conn.groupMetadata(m.chat)
            let participants = meta.participants.map(p => ({
                jid: p.id,
                admin: p.admin || null
            }))
            
            let backupData = {
                groupId: meta.id,
                subject: meta.subject,
                desc: meta.desc ? meta.desc.toString() : '',
                restrict: meta.restrict,
                announce: meta.announce,
                participants: participants
            }
            
            let db = getDatabase()
            let backupKey = text ? text.trim().replace(/[^a-zA-Z0-9]/g, '_') : meta.subject.replace(/[^a-zA-Z0-9]/g, '_')
            
            db[backupKey] = backupData
            saveDatabase(db)
            
            let tmpFileName = `backup_${backupKey}_${Date.now()}.json`
            let tmpPath = path.join(os.tmpdir(), tmpFileName)
            fs.writeFileSync(tmpPath, JSON.stringify(backupData, null, 2), 'utf-8')
            
            let groupNumber = meta.id.split('@')[0]
            let caption = `\`── ✅ BACKUP CENTRALIZZATO ──\`\n\n` +
                          `\`[🏰] Gruppo:\` *${meta.subject}*\n` +
                          `\`[🔑] Chiave:\` \`${backupKey}\`\n` +
                          `\`[👥] Membri:\` *${participants.length}*\n\n` +
                          `\`[⚡] 888 SYSTEM\``
                          
            await conn.sendFile(m.sender, tmpPath, tmpFileName, caption, m)
            await conn.reply(m.chat, `📥 *Backup centralizzato salvato!*\nRegistrato nel database \`data/backups.json\` sotto la chiave: \`${backupKey}\` e inviato nei tuoi DM privati.`, m)
            await m.react('✅')
            
            if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath)
            
        } catch (err) {
            console.error('[backup-system] Errore durante il backup:', err)
            await conn.reply(m.chat, '❌ Errore critico durante l\'estrazione dei metadati del gruppo.', m)
            await m.react('❌')
        }
        return
    }

    if (/^(ripristinagruppo|restoregrup)$/i.test(command)) {
        if (!m.isGroup) return conn.reply(m.chat, '⚠️ Questo comando deve essere lanciato all\'interno del gruppo in cui vuoi ripristinare i dati.', m)
        if (!text) return conn.reply(m.chat, `💡 _Uso:_ Inserisci il nome del backup o l\'ID del gruppo.\nEsempio: \`${usedPrefix + command} NomeBackup\``, m)
        
        try {
            await m.react('🔄')
            let db = getDatabase()
            let searchKey = text.trim().toLowerCase()
            
            let backupKey = Object.keys(db).find(key => 
                key.toLowerCase() === searchKey || 
                (db[key].groupId && db[key].groupId.toLowerCase().includes(searchKey))
            )
            
            if (!backupKey) {
                await m.react('❌')
                return conn.reply(m.chat, '❌ Nessun backup trovato nel database centrale corrispondente alla ricerca.', m)
            }
            
            let backup = db[backupKey]
            
            await conn.groupUpdateSubject(m.chat, backup.subject)
            
            if (backup.desc) {
                await conn.groupUpdateDescription(m.chat, backup.desc)
            }
            
            let currentMeta = await conn.groupMetadata(m.chat)
            let currentParticipants = currentMeta.participants.map(p => p.id)
            
            let adminsToPromote = backup.participants
                .filter(p => p.admin && currentParticipants.includes(p.jid))
                .map(p => p.jid)
                
            if (adminsToPromote.length > 0) {
                await conn.groupMakeAdmin(m.chat, adminsToPromote)
            }
            
            let resultMsg = `\`── 🎉 RIPRISTINO COMPLETATO ──\`\n\n` +
                            `\`[🏰] Nuovo Nome:\` *${backup.subject}*\n` +
                            `\`[🛡️] Admin Ripristinati:\` *${adminsToPromote.length}*\n` +
                            `\`[🔑] Chiave DB:\` \`${backupKey}\`\n\n` +
                            `\`[⚡] 888 SYSTEM\``
                            
            await conn.reply(m.chat, resultMsg, m)
            await m.react('✅')
            
        } catch (err) {
            console.error('[backup-system] Errore critico durante il ripristino:', err)
            await conn.reply(m.chat, '❌ Errore durante l\'applicazione dei metadati del backup. Verifica i permessi amministrativi del bot.', m)
            await m.react('❌')
        }
    }
}

handler.help = ['backupgruppo', 'ripristinagruppo']
handler.tags = ['owner']
handler.command = /^(backupgruppo|backupgroup|ripristinagruppo|restoregrup)$/i
handler.owner = true

export default handler
