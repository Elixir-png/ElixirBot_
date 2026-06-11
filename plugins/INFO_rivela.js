// Plugin by Elixir, Punisher & 888 staff
import { downloadMediaMessage } from '@whiskeysockets/baileys'

let handler = async (m, { conn }) => {
    try {
        if (!m.quoted) {
            throw '『 ⚠️ 』- `Rispondi a un contenuto visualizzabile una volta`'
        }

        let type = m.quoted.mtype
        let msg = m.quoted.message

        if (type === 'viewOnceMessage' || type === 'viewOnceMessageV2') {
            msg = msg[type].message
            type = Object.keys(msg)[0]
        }

        const isVo = m.quoted.viewOnce || m.quoted.message?.[m.quoted.mtype]?.viewOnce || msg?.[type]?.viewOnce
        if (!isVo) {
            throw '『 ⚠️ 』- `Questo non è un contenuto visualizzabile una volta`'
        }

        let buffer
        try {
            buffer = await downloadMediaMessage(m.quoted, 'buffer', {})
        } catch (err) {
            console.warn('Metodo nativo fallito, provo download alternativo:', err.message)
            buffer = await m.quoted.download().catch(() => null)
        }

        if (!buffer || buffer.length === 0) {
            throw '❌ Impossibile scaricare o decifrare il contenuto View Once'
        }

        const caption = msg?.[type]?.caption || m.quoted?.caption || ''
        
        if (/videoMessage/.test(type)) {
            await conn.sendFile(m.chat, buffer, 'video.mp4', caption, m)
        } else if (/imageMessage/.test(type)) {
            await conn.sendFile(m.chat, buffer, 'image.jpg', caption, m)
        } else if (/audioMessage/.test(type)) {
            await conn.sendFile(m.chat, buffer, 'audio.mp4', '', m, false, {
                mimetype: 'audio/mp4',
                ptt: msg?.[type]?.ptt || m.quoted?.ptt || false
            })
        } else {
            throw '❌ Formato non supportato o non è un View Once valido'
        }

    } catch (e) {
        console.error('Errore nel rivelare view once:', e)
        const errorMessage = typeof e === 'string' ? e : '❌ Si è verificato un errore nel download del View Once.'
        await m.reply(errorMessage)
    }
}

handler.help = ['rivela']
handler.tags = ['strumenti']
handler.command = ['readviewonce', 'rivela', 'viewonce']
handler.group = true
handler.admin = true

export default handler
