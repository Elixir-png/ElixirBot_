// Plugin by Elixir, Punisher & 888 staff
import fs from 'fs'
import path from 'path'

const dataDir = path.join(process.cwd(), 'data')
const backupFile = path.join(dataDir, 'backups.json')

if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
}

function getBackups() {
    try {
        if (fs.existsSync(backupFile)) {
            const raw = fs.readFileSync(backupFile, 'utf-8')
            if (raw.trim()) return JSON.parse(raw)
        }
    } catch (e) {
        console.error('[backup-system] Errore lettura backups.json:', e.message)
    }
    return {}
}

function saveBackups(data) {
    try {
        fs.writeFileSync(backupFile, JSON.stringify(data, null, 2), 'utf-8')
    } catch (e) {
        console.error('[backup-system] Errore scrittura backups.json:', e.message)
    }
}

let handler = async (m, { conn, text, command }) => {
    if (command === 'backupgruppo' || command === 'backupgroup') {
        if (!m.isGroup) return m.reply('⚠️ Questo comando può essere eseguito solo all\'interno dei gruppi.')
        
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
            
            let backupKey = text ? text.replace(/[^a-zA-Z0-9]/g, '_') : meta.id.split('@')[0]
            
            let backups = getBackups()
            backups[backupKey] = backupData
            saveBackups(backups)
            
            let tempFile = path.join(dataDir, `temp_backup_${Date.now()}.json`)
            try {
                fs.writeFileSync(tempFile, JSON.stringify(backupData, null, 2), 'utf-8')
                await conn.sendFile(m.sender, tempFile, `${backupKey}_backup.json`, '', m)
            } finally {
                try { fs.unlinkSync(tempFile) } catch (e) { console.error('[backup-system] Errore pulizia temp file:', e.message) }
            }
            
            await m.reply(`📥 *Backup salvato con successo!*\nArchiviato nel database centrale con chiave: \`${backupKey}\` e inviato nei tuoi DM privati come copia di sicurezza.`)
            await m.react('✅')
            console.log(`[backup-system] Backup creato con successo per il gruppo ${meta.subject} con chiave ${backupKey}`)
            
        } catch (err) {
            console.error('[backup-system] Errore durante il backup:', err)
            await m.reply('❌ Errore critico durante l\'estrazione dei metadati del gruppo.')
            await m.react('❌')
        }
        return
    }

    if (command === 'ripristinagruppo' || command === 'restoregrup') {
        if (!m.isGroup) return m.reply('⚠️ Questo comando deve essere lanciato all\'interno del gruppo in cui vuoi ripristinare i dati.')
        if (!text) return m.reply('💡 _Uso:_ Inserisci il nome del backup o l\'ID del gruppo.\nEsempio: `.ripristinagruppo NomeBackup` o `.ripristinagruppo 120363...`')
        
        try {
            await m.react('🔄')
            let backups = getBackups()
            let searchText = text.toLowerCase()
            
            let foundKey = null
            let foundBackup = null
            
            for (let key of Object.keys(backups)) {
                if (key.toLowerCase().includes(searchText)) {
                    foundKey = key
                    foundBackup = backups[key]
                    break
                }
                if (backups[key].groupId && backups[key].groupId.toLowerCase().includes(searchText)) {
                    foundKey = key
                    foundBackup = backups[key]
                    break
                }
            }
            
            if (!foundBackup) {
                await m.react('❌')
                return m.reply('❌ Nessun backup trovato nel database con il nome o ID specificato.')
            }
            
            console.log(`[backup-system] Avvio ripristino dal backup: ${foundKey}`)
            
            await conn.groupUpdateSubject(m.chat, foundBackup.subject)
            
            if (foundBackup.desc) {
                await conn.groupUpdateDescription(m.chat, foundBackup.desc)
            }
            
            let currentMeta = await conn.groupMetadata(m.chat)
            let currentParticipants = currentMeta.participants.map(p => p.id)
            
            let adminsToPromote = foundBackup.participants
                .filter(p => p.admin && currentParticipants.includes(p.jid))
                .map(p => p.jid)
                
            if (adminsToPromote.length > 0) {
                await conn.groupMakeAdmin(m.chat, adminsToPromote)
            }
            
            let resultMsg = `\`── 🎉 RIPRISTINO COMPLETATO ──\`\n\n` +
                            `\`[🏰] Nuovo Nome:\` *${foundBackup.subject}*\n` +
                            `\`[🛡️] Admin Ripristinati:\` *${adminsToPromote.length}*\n` +
                            `\`[📦] Backup Usato:\` \`${foundKey}\`\n\n` +
                            `\`[⚡] 888 SYSTEM\``
                            
            await m.reply(resultMsg)
            await m.react('✅')
            console.log(`[backup-system] Ripristino completato con successo nel gruppo: ${m.chat}`)
            
        } catch (err) {
            console.error('[backup-system] Errore critico durante il ripristino:', err)
            await m.reply('❌ Errore durante l\'applicazione dei metadati del backup. Verifica i permessi amministrativi del bot.')
            await m.react('❌')
        }
    }
}

handler.help = ['backupgruppo', 'ripristinagruppo']
handler.tags = ['owner']
handler.command = /^(backupgruppo|backupgroup|ripristinagruppo|restoregrup)$/i
handler.owner = true

export default handler
