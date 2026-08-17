
let handler = async (m, { conn }) => {
    try {

        const ws = conn?.ws?.socket;
        const readyState = ws?.readyState;

        const stateMap = {
            0: '🔴 DISCONNESSO',
            1: '🟡 CONNESSO (aperto)',
            2: '🟠 CHIUSURA IN CORSO',
            3: '⚫ CHIUSO'
        };

        const wsState = stateMap[readyState] ?? '❓ Stato sconosciuto';
        const connected = readyState === 1;

        const user = conn?.user;
        const jid = user?.id?.split(':')[0] || '-';
        const name = user?.name || user?.verifiedName || '-';

        const statoGenerale = connected
            ? '🟢 Baileys collegato e online'
            : '🔴 Baileys NON connesso (messaggi resteranno in attesa)';

        let risposta =
            `👁️ *STATO BAILEYS*\n\n` +
            `• WebSocket: ${wsState}\n` +
            `• Stato generale: ${statoGenerale}\n` +
            `• Account: ${name} (${jid})\n` +
            `• Sessione file: ${global.authFile || '-'}\n` +
            `• Uptime: ${Math.floor(conn?.uptime || 0)}s\n`;

        if (connected) {
            try {
                const sent = await conn.sendMessage(m.chat, { text: '🧪 *TEST CONSEGNA ACK*\nSe vedi questo messaggio con *doppia spunta*, il delivery funziona!' }, { quoted: m });
                risposta += `\n✅ Test consegna inviato: ${sent?.key?.id ? 'OK' : 'inviato'}\n`;
                risposta += `📌 Controlla se il messaggio qui sopra ha la *doppia spunta* (non un solo ✓).\n`;
                risposta += `Se resta con una spunta sola / "in attesa", Baileys non riceve ACK dal server.\n`;
            } catch (e) {
                risposta += `\n❌ Invio test fallito: ${e?.message || e}\n`;
            }
        } else {
            risposta += `\n⚠️ Impossibile testare la consegna: socket non connesso.\n`;
        }

        await m.reply(risposta);

    } catch (e) {
        console.error(e);
        await m.reply('❌ Errore nel controllo dello stato Baileys.');
    }
};

handler.help = ['guardami', 'testack'];
handler.tags = ['diagnostica'];
handler.command = /^(guardami|testack|stato)$/i;

export default handler;
