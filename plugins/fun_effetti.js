// Plugin by Elixir, Punisher & 888 staff
import fetch from 'node-fetch'
import ffmpeg from 'fluent-ffmpeg'
import { promises as fs } from 'fs'
import { join } from 'path'

let dailyUsage = {}

const apis = {
    sra: 'https://some-random-api.com',
    popcat: 'https://popcat.xyz',
}

const effetti = {
    triggered: { api: 'sra', path: 'overlay/triggered', isGif: true },
    jail: { api: 'sra', path: 'overlay/jail' },
    comunista: { api: 'sra', path: 'overlay/comrade' },
    passed: { api: 'sra', path: 'overlay/passed' },
    wasted: { api: 'sra', path: 'overlay/wasted' },
    pixelate: { api: 'sra', path: 'filter/pixelate' },
    simpcard: { api: 'sra', path: 'misc/simpcard' },
    horny: { api: 'sra', path: 'misc/horny' },
    lolice: { api: 'sra', path: 'misc/lolice' },
    blur: { api: 'sra', path: 'filter/blur' },
    blurple: { api: 'sra', path: 'filter/blurple' },
    bisex: { api: 'sra', path: 'misc/bisexual' },
    heart: { api: 'sra', path: 'misc/heart' },
    love: { api: 'sra', path: 'misc/heart' },
    lgbt: { api: 'sra', path: 'misc/lgbt' },
    nonbinary: { api: 'sra', path: 'misc/nonbinary' },
    tonikawa: { api: 'sra', path: 'misc/tonikawa' },
    dog: { api: 'sra', path: 'misc/its-so-stupid', needsText: true, textHint: 'un testo qualsiasi', textParam: 'dog' },
    lied: { api: 'sra', path: 'misc/lied', textParam: 'username', useAuthorName: true },
    namecard: { api: 'sra', path: 'misc/namecard', needsText: true, textHint: 'Compleanno (es: 01/01/2000)', textParam: 'birthday', useAuthorName: true, defaultText: '01/01/2000' },
    ytc: { api: 'sra', path: 'misc/youtube-comment', needsText: true, textHint: 'un commento', textParam: 'comment', useAuthorName: true },
    petpet: { api: 'popcat', path: 'pet', isGif: true, avatarParam: 'image' },
    wanted: { api: 'popcat', path: 'wanted', avatarParam: 'image' }
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
    const effect = command.toLowerCase()
    const config = effetti[effect]

    if (!config) return m.reply('🤕 Effetto non trovato o non supportato.')

    let who = m.quoted ? m.quoted.sender : m.mentionedJid?.[0] ? m.mentionedJid[0] : m.sender
    if (!who) {
        return m.reply(`⭔ \`Tagga qualcuno o rispondi a un messaggio\`\n\n*\`Esempio:\`* *${usedPrefix + command} @user*`)
    }

    if (effect === 'wanted') {
        let today = new Date().toDateString()
        let userId = m.sender
        if (!dailyUsage[today]) dailyUsage[today] = {}
        if (!dailyUsage[today][userId]) dailyUsage[today][userId] = 0
        if (dailyUsage[today][userId] >= 2) {
            return m.reply('🤕 Nuh uh, niente piu wanted per te, torna domani.')
        }
    }

    if (config.needsText && (!text || !text.trim())) {
        return m.reply(`🤕 Serve ${config.textHint} per l'effetto ${effect}.\nEsempio: ${usedPrefix + command} [testo] @user`)
    }

    let tempg
    let tempw

    try {
        const pp = await conn.profilePictureUrl(who, 'image').catch(() => null)
        if (!pp) {
            const notification = who === m.sender ? 
                'non hai una foto profilo 🤕' : 
                `@${who.split('@')[0]} non ha una foto profilo 🤕`
            return m.reply(notification, null, { mentions: [who] })
        }

        const name = await conn.getName(who) || 'User'
        const apiBase = apis[config.api]
        const url = new URL(config.path, apiBase)
        const avatarParam = config.avatarParam || 'avatar'
        url.searchParams.set(avatarParam, pp)

        if (config.textParam) {
            let textValue = ''
            if (config.useAuthorName && !config.needsText) {
                textValue = name
            } else if (config.needsText) {
                textValue = (text || '').replace(/@\d+/g, '').trim() || config.defaultText || ''
            }
            if (textValue) url.searchParams.set(config.textParam, textValue)
            if (config.useAuthorName) url.searchParams.set('username', name)
        }

        console.log(`[effetti] Richiesta API: ${url.toString()}`)
        let res
        try {
            res = await fetch(url.toString())
        } catch (fetchErr) {
            console.error(`[effetti] Errore di rete per '${effect}':`, fetchErr.message)
            const isNetworkError = fetchErr.message && (
                fetchErr.message.includes('ENOTFOUND') ||
                fetchErr.message.includes('ECONNREFUSED') ||
                fetchErr.message.includes('ECONNRESET') ||
                fetchErr.message.includes('ENETUNREACH') ||
                fetchErr.message.includes('request failed') ||
                fetchErr.message.includes('network')
            )
            if (isNetworkError) {
                throw `⚠️ Il server degli effetti è momentaneamente offline, riprova più tardi.`
            }
            throw fetchErr
        }

        if (!res.ok) {
            console.error(`[effetti] API error ${res.status} per effetto '${effect}' su ${url.toString()}`)
            throw `Errore API [${res.status}] per l'effetto '${effect}'`
        }

        const arrayBuffer = await res.arrayBuffer()
        if (!arrayBuffer || arrayBuffer.byteLength < 100) {
            console.error(`[effetti] Risposta troppo piccola (${arrayBuffer?.byteLength || 0} bytes) per effetto '${effect}'`)
            throw 'Risposta API non valida o file corrotto.'
        }
        const buf = Buffer.from(arrayBuffer)

        if (config.isGif) {
            const timestamp = Date.now()
            tempg = join('temp', `${timestamp}.gif`)
            tempw = join('temp', `${timestamp}.webp`)

            await fs.writeFile(tempg, buf)
            console.log(`[effetti] GIF salvata (${buf.length} bytes), conversione in WebP...`)

            await new Promise((resolve, reject) => {
                ffmpeg(tempg)
                    .outputOptions([
                        '-vcodec', 'libwebp',
                        '-vf', 'scale=512:512:force_original_aspect_ratio=decrease',
                    ])
                    .toFormat('webp')
                    .save(tempw)
                    .on('end', () => {
                        console.log(`[effetti] WebP generato per '${effect}'`)
                        resolve()
                    })
                    .on('error', (err) => reject(new Error(err.message)))
            })

            const webpBuffer = await fs.readFile(tempw)
            await conn.sendMessage(m.chat, { sticker: webpBuffer }, { quoted: m })
        } else if (effect === 'wanted') {
            let today = new Date().toDateString()
            let userId = m.sender
            dailyUsage[today][userId]++

            let bounty = Math.floor(Math.random() * 1000000000)
            let formattedBounty = bounty.toLocaleString('it-IT')
            let groupName = m.isGroup ? (await conn.groupMetadata(m.chat)).subject : 'Chat Privata'

            let caption = `『 👤 』 \`Nome:\` *${name}*\n『 💰 』 \`Taglia:\` *${formattedBounty}B*\n『 📍 』 \`avvistato in:\` *${groupName}*`

            await conn.sendMessage(m.chat, { 
                image: buf, 
                caption: caption, 
                mentions: [who],
                contextInfo: {
                    mentionedJid: [who],
                    externalAdReply: {
                        title: '🏴‍☠️ RICERCATO: ' + name,
                        body: `taglia di ${formattedBounty} Berry`,
                        thumbnailUrl: pp,
                        sourceUrl: global.gruppo || '',
                        mediaType: 1,
                        renderLargerThumbnail: false
                    }
                }
            }, { quoted: m })
        } else {
            await conn.sendMessage(m.chat, { image: buf, caption: '', mentions: [who] }, { quoted: m })
        }

    } catch (e) {
        console.error(`[effetti] ERRORE per comando '${command}':`, e)
        const errorMessage = typeof e === 'string' ? e : (global.errore || '❌ Si è verificato un errore durante l\'elaborazione dell\'effetto.')
        await m.reply(errorMessage)
    } finally {
        if (tempg) await fs.unlink(tempg).catch(() => null)
        if (tempw) await fs.unlink(tempw).catch(() => null)
    }
}

handler.help = ['wasted', 'wanted','triggered', 'jail', 'comunista', 'passed', 'pixelate', 'simpcard', 'horny', 'lolice', 'blur', 'blurple', 'bisex', 'love', 'heart', 'dog', 'lgbt', 'lied', 'namecard', 'nonbinary', 'tonikawa', 'ytc', 'petpet']
handler.tags = ['giochi']
handler.command = /^(wanted|wasted|triggered|jail|comunista|passed|pixelate|simpcard|horny|lolice|blur|blurple|bisex|love|heart|dog|lgbt|lied|namecard|nonbinary|tonikawa|ytc|petpet)$/i

export default handler
