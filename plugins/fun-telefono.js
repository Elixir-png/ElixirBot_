let handler = async (m, { text }) => {
  if (!text) return m.reply("📱 Scrivi il tuo telefono\n> es: .telefono iphone 13")

  let t = text.toLowerCase()
  let telefoniValidi = ["iphone", "samsung", "xiaomi", "huawei", "oppo", "realme", "motorola", "pixel", "oneplus", "nothing", "honor", "poco", "vivo", "rog", "redmagic"]
  let valido = telefoniValidi.some(v => t.includes(v))

  if (!valido) return m.reply("❌ Quello non è un telefono, coglione.")

  const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)]

  const db = {
    iphone: [
      "💸 Hai speso uno stipendio intero per un telefono che fa le stesse cose di quello dell’anno scorso, ma hey… la fotocamera è *leggermente* migliore.",
      "📸 Vivi per le storie Instagram. Se non hai postato, non è mai successo davvero.",
      "🔋 La batteria è il tuo peggior nemico. Vivi con l’ansia del 20% come fosse un countdown nucleare.",
      "🧠 Usi la parola 'ecosistema' per justify qualsiasi scelta discutibile.",
      "😎 Ti senti superiore… senza un vero motivo valido, ma funziona lo stesso.",
      "🎧 Hai perso almeno un AirPods e hai fatto finta di niente.",
      "📦 Cambi iPhone ogni anno ma non sapresti dire cosa è cambiato.",
      "💳 Stai pagando rate infinite, ma almeno il telefono è lucido.",
      "🪫 Spegni il telefono al 5% come se stai salvando la tua vita.",
      "📱 Se cade, piangi. Se si rompe, neghi.",
      "🤡 Compri la cover trasparente da 40 euro della Apple perché 'è originale'.",
      "☁️ Paghi l'iCloud ogni mese perché hai 45.000 foto identiche mai cancellate.",
      "🫠 Usi the cavo Lightning scocciato pur di non comprarne uno nuovo.",
      "🦖 Piangi se un tuo amico con Android ti manda un video sgranato su WhatsApp.",
      "💅 Per te lo smartphone non è tecnologia, è un accessorio di moda.",
      "🎭 Fai i video allo specchio solo per mostrare la mela sul retro.",
      "🥵 Se la percentuale scende al 70% a mezzogiorno entri in modalità panico.",
      "🥱 Passi tre ore a configurare i widget per poi non guardarli mai.",
      "💰 Piuttosto che comprare un caricabatterie compatibile non originale rimani isolato dal mondo.",
      "🤫 Dici che lo usi per 'lavoro' ma l'unica app pesante che apri è TikTok."
    ],
    samsung: [
      "🧠 Sei quello tecnico del gruppo che nessuno ha chiesto, ma che tutti usano.",
      "⚙️ Hai modificato impostazioni che nemmeno Samsung conosce.",
      "📱 Il tuo telefono può fare tutto… ma usi sempre le stesse 3 app.",
      "🔋 Hai la batteria infinita ma comunque lo metti in carica al 40%.",
      "📸 Hai zoomato la luna almeno una volta nella tua vita.",
      "🤓 Leggi specifiche tecniche per divertimento, e un po’ mi preoccupi.",
      "😐 Litighi con gli utenti iPhone come se fosse una guerra personale.",
      "🛠 Ti senti hacker solo perché hai attivato le opzioni sviluppatore.",
      "📊 Sai tutto del telefono, ma non rispondi ai messaggi.",
      "📱 Ogni anno dici: 'questo è quello definitivo'… non è vero.",
      "🖊️ Se hai un Ultra usi la penna tre volte l'anno solo per fare scarabocchi quando ti annoi.",
      "🍿 Guardi i film sul telefono pieghevole convinto che sia meglio della TV di casa.",
      "🥸 Ti vanti della modalità DeX ma non l'hai mai collegata a un monitor vero.",
      "🤮 Hai ancora i traumi dell'interfaccia TouchWiz di dieci anni fa.",
      "⏳ Passi la vita ad aspettare l'aggiornamento della One UI sperando non rovini le animazioni.",
      "🧙‍♂️ Spieghi alla gente cos'è il 'multitasking avanzato' mentre compri il pane.",
      "💼 Ti senti un manager in carriera solo perché hai lo schermo gigante.",
      "💔 Vivi nel terrore costante che la piega al centro dello schermo si spezzi.",
      "🛒 Compri i Galaxy Buds solo perché erano in bundle gratuito col telefono.",
      "🦾 Pensi che il tuo processore Exynos o Snapdragon possa controllare i satelliti della NASA."
    ],
    xiaomi: [
      "💰 Hai speso poco e lo dici a tutti come fosse una missione.",
      "📊 Hai visto 47 recensioni prima di comprarlo. Nessuna fiducia nel mondo.",
      "🔧 Hai già modificato qualcosa entro le prime 24 ore.",
      "📱 Il rapporto qualità/prezzo è la tua religione ufficiale.",
      "😎 Ti senti più intelligente degli altri… e onestamente, forse sì.",
      "⚡ È veloce, ma ogni tanto fa cose strane e tu fingi sia normale.",
      "📉 Le pubblicità nelle app ti hanno temprato come guerriero.",
      "🧠 Sai più tu del telefono che chi lo ha progettato.",
      "📦 Hai aspettato offerte, sconti, cashback… rispetto.",
      "💀 Ogni aggiornamento è un salto nel vuoto.",
      "📡 Il sensore di prossimità non funziona e mandi audio WhatsApp vuoti da tre anni.",
      "🌪️ Entri nei forum a insultare chi critica la MIUI o HyperOS.",
      "🛌 Hai almeno altri 12 prodotti Xiaomi in camera, inclusi lo spazzolino e il bollitore.",
      "🤡 Dici che fa foto migliori dell'iPhone solo perché ha 200 megapixel di plastica.",
      "🪪 La tua parola preferita nella vita è 'Sottocosto'.",
      "🥶 Lagga il launcher di sistema ma dai la colpa al caldo estivo.",
      "🦿 Passi i pomeriggi a sbloccare il bootloader per cambiare ROM.",
      "🦊 Ti senti un paladino del risparmio e critichi chi spende più di 300 euro.",
      "🌋 Scalda così tanto d'estate che potresti usarlo per cuocere una piadina.",
      "🎰 Apri il file manager e ti ritrovi la pubblicità di un casinò online in faccia."
    ],
    huawei: [
      "🚫 Vivi senza Google e ormai è una scelta di vita.",
      "📸 Fai foto assurde, ma poi non puoi condividerle facilmente.",
      "😐 Ogni app è una piccola battaglia personale.",
      "🧠 Hai sviluppato una resilienza che pochi capiscono.",
      "📱 Ottimo telefono… in un universo parallelo.",
      "💀 Installi apk strani come se fosse normale.",
      "🔧 Hai trovato workaround per tutto. Sei sopravvissuto.",
      "😎 Hai fatto una scelta coraggiosa, o forse ti sei complicato la vita.",
      "📦 Lo difendi anche quando non dovresti.",
      "⚠️ Il Play Store è un ricordo lontano.",
      "🧗‍♂️ Usare GBox o GSpace per aprire YouTube è diventato il tuo sport estremo.",
      "🏺 Il tuo telefono è letteralmente un pezzo di storia della guerra commerciale geopolitica.",
      "🛸 HarmonyOS è fluido, peccato che non ci sia nessuno sviluppatore sopra.",
      "🧬 Hai sviluppato una laurea ad honorem in informatica solo per sincronizzare i contatti.",
      "🕯️ Ogni sera preghi che il ban americano venga revocato.",
      "🩸 Lo tieni stretto perché sai che la fotocamera Leica spacca ancora i culi.",
      "🕵️‍♂️ Sei convinto che l'FBI ti stia spiando la galleria delle foto.",
      "🥀 Ti manca il 2019, l'anno in cui Huawei stava per dominare il mondo.",
      "🧩 Ormai scarichi le app da store cinesi di cui non sai pronunciare il nome.",
      "🎭 Quando la gente ti chiede 'ma ha Google?' rispondi 'sì, si può mettere' mentendo a te stesso."
    ],
       opporealme: [
      "⚡ Il tuo telefono si ricarica in 12 minuti ma si scarica quasi altrettanto velocemente.",
      "🎨 L'interfaccia grafica sembra un cartone animato fluo, ma ti piace così.",
      "👤 Sei la scelta di chi è entrato in negozio e ha detto 'voglio spendere il giusto'.",
      "🛍️ Il brand investe tutto in pubblicità con i calciatori ma tu non sai manco chi sono.",
      "📱 Praticamente hai uno Xiaomi ma con un nome diverso sul retro.",
      "💅 Il design della scocca posteriore brilla così tanto che accechi la gente al sole.",
      "🧬 ColorOS o RealmeUI: cambi tema ogni mezz'ora perché ti annoi subito.",
      "🪄 Ti vanti della ricarica SuperVOOC come se l'avessi inventata tu.",
      "🧊 Lo tieni in mano e sembra solido, poi scopri che è tutto policarbonato riciclato.",
      "🤠 Sei il re della fascia media. Nessuno ti nota, nessuno ti critica.",
      "📦 La scatola include ancora alimentatore, cover e pellicola. Ti senti un re rispetto ad Apple.",
      "🔮 La fotocamera macro da 2 megapixel serve solo a fotografare i peli del tuo braccio.",
      "👾 Compri la versione speciale in collaborazione con gli anime per sentirti otaku.",
      "🕳️ Il sensore d'impronte sotto lo schermo funziona una volta su tre, ma hai pazienza.",
      "🧩 Hai comprato questo brand solo perché lo consigliava uno YouTuber da 5000 iscritti.",
      "🥴 Non sai mai se riceverai Android 15 o se sarai abbandonato al tuo destino.",
      "🦚 Le scocche colorate servono solo a nascondere le impronte delle tue dita unte.",
      "💨 Va velocissimo i primi tre mesi, poi inizia a chiedere pietà.",
      "🎰 Sei caduto nella trappola del marketing dei megapixel.",
      "🤖 Ti piace l'ingegneria cinese ma non volevi la MIUI. Scelta di ripiego."
    ],
    pixeloneplus: [
      "🤓 Sei un purista di Android. Disprezzi le personalizzazioni e ami il codice pulito.",
      "📸 Google Pixel: fai foto pazzesche ai muri di casa grazie all'intelligenza artificiale.",
      "💨 OnePlus: la fluidità è tutto, anche se il brand ha perso la sua vera anima da anni.",
      "🤖 Parli con Google Assistant come se fosse il tuo migliore amico.",
      "🎢 Vivi per gli aggiornamenti in anteprima, anche se ti distruggono la stabilità.",
      "🦖 Ricordi i tempi del 'Never Settle' e piangi ricordando i vecchi prezzi convenienti.",
      "🧠 Compri the Pixel solo per l'algoritmo fotografico e la Gomma Magica.",
      "☕ Ti senti superiore a tutti i possessori di smartphone commerciali di massa.",
      "🛠️ Hai installato la versione Beta del sistema operativo e ora non ti funziona la tastiera.",
      "📱 OnePlus: lo slider laterale per il silenzioso è l'unica cosa che ti tiene in vita.",
      "🧊 Il processore Tensor scalda così tanto in tasca che ti sembra di avere uno scaldino.",
      "🧙‍♂️ Spieghi alla gente cos'è il 'Material You' mentre loro vogliono solo guardare Instagram.",
      "💔 OnePlus ora è praticamente Oppo, e questa cosa ti spezza il cuore ogni giorno.",
      "🕵️‍♂️ Il tuo Pixel elabora le foto per 4 secondi dopo lo scatto. Ansia pura.",
      "👾 Ti lamenti dei bug sui forum ufficiali ma non passereste mai a un altro brand.",
      "💼 Sei l'equivalente Android del cliente Apple: compri tutto a scatola chiusa.",
      "🔋 La batteria del Pixel dura sei ore se lo tieni in modalità aereo.",
      "🦕 Compri OnePlus solo perché ricordi quando faceva i 'Flagship Killer'.",
      "🕶️ Hai rimosso gli oggetti dallo sfondo di ogni foto che hai scattato nell'ultimo mese.",
      "🤖 Credi davvero che l'AI di Google risolverà i tuoi problemi di vita."
    ],
    gamingmoto: [
      "🎮 Telefono da Gaming (ROG/RedMagic): ventole integrate rumorose e luci LED tamarre.",
      "🦖 Motorola: compri telefoni stabili che non si rompono mai, praticamente sei un nonno indurito.",
      "🕹️ Giochi a Call of Duty Mobile con i grilletti dorsali simulando di essere un pro-player.",
      "🔋 La batteria del tuo telefono pesa mezzo chilo e puoi usarlo come arma da difesa personale.",
      "🦋 Motorola: la gesture del martello per accendere la torcia è la tua unica gioia quotidiana.",
      "🥵 Il tuo telefono da gaming ha un sistema di raffreddamento a liquido che consuma più della tua auto.",
      "👤 Non compri un Motorola da dieci anni, ma hai scoperto che la serie Edge fa ancora cose decenti.",
      "👾 Esteticamente il tuo telefono da gaming sembra un'astronave Transformers venuta male.",
      "👑 Motorola: ricevi un aggiornamento di sistema ogni morte di papa.",
      "🎰 Hai 16GB di RAM sul telefono ma ci fai girare solo Subway Surfers.",
      "🦿 Il tuo smartphone ha un'interfaccia talmente stock che sembra quasi vuota.",
      "🔊 Le casse stereo del tuo telefono da gaming svegliano tutto il condominio alle tre di notte.",
      "🛡️ Lo schermo ha una frequenza di aggiornamento a 165Hz così vedi i lag più fluidamente.",
      "🧓 Compri Motorola perché ti ricorda il vecchio e glorioso Razr a conchiglia.",
      "🔋 Giri con un mattone in tasca che deforma tutti i tuoi jeans.",
      "🏎️ Modalità prestazioni attivata fissa anche per scorrere la rubrica telefonica.",
      "🤐 Le foto fanno schifo su entrambi i brand, ma tu dici che 'non ti interessa la fotocamera'.",
      "🤖 Le macro impostate sui tasti fisici servono solo a sbagliare a digitare i messaggi.",
      "🤠 Sei l'outsider del gruppo. Nessuno capisce le tue scelte tecnologiche.",
      "🧼 Motorola: interfaccia pulita, peccato per il design che sembra un telecomando."
    ],
    nothinghonor: [
      "✨ Nothing Phone: hai i LED sul retro solo per far vedere alla gente quando ti arriva uno spam.",
      "📱 Honor: provi a convincere tutti che non sei Huawei, ma dentro sei esattamente identico.",
      "💡 Passi le serate a guardare i glifi luminosi del Nothing Phone che lampeggiano a ritmo di suoneria.",
      "🎭 Honor: hai ancora i servizi Google ufficiali e lo urli al mondo come un trofeo di caccia.",
      "🧠 Compri Nothing solo perché ti piace l'estetica hipster e minimale trasparente.",
      "🔮 I widget monocromatici del Nothing Phone ti fanno sentire dentro un film di fantascienza anni '80.",
      "🛍️ Honor Magic: spendi 1000 euro per un top di gamma ma la gente pensa comunque sia un sottomarca.",
      "🎨 Carl Pei è il tuo nuovo messia e compri qualsiasi cosa lui progetti.",
      "🦖 Il software Honor sembra rimasto fermo alla grafica cinese del 2018.",
      "🕶️ Compri il Nothing Phone per distinguerti dalla massa, diventando parte di un'altra massa.",
      "🦾 Honor fa ottimi display protettivi perché sa che sei un danno ambulante.",
      "🪫 I LED sul retro del Nothing consumano più batteria dello schermo stesso.",
      "🦚 Ti vanti dello zoom della fotocamera Honor ma trema così tanto che vedi tutto sfocato.",
      "🎰 Sei cascato nella trappola del marketing estetico londinese di Nothing.",
      "🧩 Honor: compri la fascia media perché era in sconto con l'abbonamento Wi-Fi di casa.",
      "🧊 Lo smartphone trasparente si riempie di polvere dentro se lo guardi troppo intensamente.",
      "👻 L'interfaccia Honor ha delle icone giganti adatte a persone con problemi di vista gravi.",
      "🤫 Spegni i LED di Nothing dopo tre giorni perché ti danno fastidio agli occhi di notte.",
      "🦅 Honor: la fotocamera posteriore ha un cerchio così grande che sembra l'oblò di una lavatrice.",
      "🎭 Fai il sofisticato con il font a punti di Nothing ma non riesci a leggere l'orario."
    ],
    altri: [
      "👤 Nessuno sa che telefono hai, nemmeno tu a volte.",
      "📱 Probabilmente lagga, ma ti sei abituato.",
      "💀 Esiste ancora quel modello? Impressionante.",
      "🧓 Sembra uscito da un museo della tecnologia.",
      "📦 L’hai trovato in offerta o per disperazione.",
      "😐 Funziona… più o meno… nei giorni buoni.",
      "🔋 La batteria dura tanto perché lo usi poco.",
      "🤨 Nome del modello impronunciabile.",
      "📉 Supporto ufficiale? Mai sentito.",
      "🗿 È praticamente un reperto storico.",
      "🛒 Lo hai comprato all'Eurospin o in un cesto delle offerte a 49 euro.",
      "🦖 Schermo LCD che vira al blu non appena lo inclini di due gradi.",
      "🤐 Ha ancora la porta Micro-USB e usi i cavi dei vecchi controller PS4.",
      "🔌 Ci mette quattro ore a ricaricarsi completamente e scotta come un ferro da stiro.",
      "🎭 Apri la fotocamera e sembra di guardare un video registrato nel 2007.",
      "🫠 Ha 16GB di memoria interna, bastano tre sticker su WhatsApp per bloccarlo.",
      "🪵 La scocca scricchiola se provi a premere leggermente sul retro.",
      "🎪 Non riceve patch di sicurezza dal triennio precedente.",
      "🧗‍♂️ Lo tieni senza cover perché tanto non vale la pena proteggerlo.",
      "🧩 Quando la gente ti chiede il numero fai finta di avere la batteria scarica per non cacciare questo scempio."
    ]
  }

  let frase = ""
  if (t.includes("iphone")) frase = pickRandom(db.iphone)
  else if (t.includes("samsung")) frase = pickRandom(db.samsung)
  else if (t.includes("xiaomi") || t.includes("poco")) frase = pickRandom(db.xiaomi)
  else if (t.includes("huawei")) frase = pickRandom(db.huawei)
  else if (t.includes("oppo") || t.includes("realme") || t.includes("vivo")) frase = pickRandom(db.opporealme)
  else if (t.includes("pixel") || t.includes("oneplus")) frase = pickRandom(db.pixeloneplus)
  else if (t.includes("motorola") || t.includes("rog") || t.includes("redmagic")) frase = pickRandom(db.gamingmoto)
  else if (t.includes("nothing") || t.includes("honor")) frase = pickRandom(db.nothinghonor)
  else frase = pickRandom(db.altri)

  let voto = Math.floor(Math.random() * 10) + 1
  
  let risposta = "╭━ 📱 *ANALISI TELEFONO* ━╮\n\n" +
                 `📲 *Dispositivo:*\n➤ ${text}\n\n` +
                 `🧠 *Profilo utente:*\n➤ ${frase}\n\n` +
                 `📊 *Valutazione:*\n➤ ${voto}/10\n\n` +
                 "╰━━━━━━━━━━━━╯\n> *BY 888 BOT*"
   m.reply(risposta.trim())
}

handler.command = ['telefono']
export default handler
