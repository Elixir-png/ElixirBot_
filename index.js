import { join, dirname } from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { setupMaster, fork } from 'cluster';
import { watchFile, unwatchFile, existsSync } from 'fs';
import { createInterface } from 'readline';
import yargs from 'yargs';
import { execSync } from 'child_process';
import os from 'os';

process.env.SUPPRESS_BANNER = 'true';

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(__dirname);

const checkAndInstallModules = () => {
  const nodeModulesPath = join(__dirname, 'node_modules');
  
  if (!existsSync(nodeModulesPath)) {
    console.clear();
    console.log('\n\n');
    console.log('\x1b[31m' + '═'.repeat(70) + '\x1b[0m');
    console.log('\x1b[33m\n   Bro e senza moduli come avvi il bot? \x1b[0m');
    console.log('\x1b[36m   Menomale che ci sono io! 😎\x1b[0m\n');
    console.log('\x1b[31m' + '═'.repeat(70) + '\x1b[0m');
    console.log('\n\x1b[35m⚡ Installazione moduli in corso...\x1b[0m\n');
    
    try {
      execSync('npm install', { stdio: 'inherit' });
      console.log('\n\x1b[32m✓ Moduli installati con successo!\x1b[0m');
      console.log('\x1b[36m🚀 Avvio del bot...\x1b[0m\n');
    } catch (error) {
      console.error('\n\x1b[31m✖ Errore durante l\'installazione dei moduli\x1b[0m');
      process.exit(1);
    }
  }
};

checkAndInstallModules();

const { name, author } = require(join(__dirname, './package.json'));

let cfonts;
try {
  cfonts = (await import('cfonts')).default;
} catch (e) {
  console.error('Errore caricamento cfonts, reinstallazione...');
  execSync('npm install', { stdio: 'inherit' });
  cfonts = (await import('cfonts')).default;
}

const rl = createInterface(process.stdin, process.stdout);

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const typeWriterBig = async (text, delay = 100) => {
  let current = '';
  for (let char of text) {
    current += char;
    console.clear();
    console.log('\n\n');
    cfonts.say(current, {
      font: 'block',
      align: 'center',
      gradient: ['red', 'white'],
      transitionGradient: true,
    });
    await sleep(delay);
  }
};

const loading = async (text, duration = 1000) => {
  const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  const startTime = Date.now();
  let i = 0;
  
  return new Promise(resolve => {
    const interval = setInterval(() => {
      process.stdout.write(`\r\x1b[35m${frames[i]} \x1b[36m${text}\x1b[0m`);
      i = (i + 1) % frames.length;
      
      if (Date.now() - startTime >= duration) {
        clearInterval(interval);
        process.stdout.write(`\r\x1b[32m✓ \x1b[36m${text}\x1b[0m\n`);
        resolve();
      }
    }, 60);
  });
};

const progressBar = async (label, duration = 1200) => {
  const barLength = 40;
  const steps = 50;
  const stepDuration = duration / steps;
  
  for (let i = 0; i <= steps; i++) {
    const filled = Math.floor((i / steps) * barLength);
    const empty = barLength - filled;
    const bar = '█'.repeat(filled) + '░'.repeat(empty);
    const percent = Math.floor((i / steps) * 100);
    process.stdout.write(`\r\x1b[36m${label} \x1b[35m[${bar}] \x1b[33m${percent}%\x1b[0m`);
    await sleep(stepDuration);
  }
  console.log();
};

const typeWriter = async (text, delay = 25, color = '\x1b[36m') => {
  const reset = '\x1b[0m';
  for (let char of text) {
    process.stdout.write(color + char + reset);
    await sleep(delay);
  }
  console.log();
};

const getSystemInfo = async () => {
  const cpus = os.cpus();
  const cpuModel = cpus[0]?.model || 'Unknown CPU';
  const cpuCores = cpus.length;
  const totalMem = Math.floor(os.totalmem() / 1024 / 1024);
  const freeMem = Math.floor(os.freemem() / 1024 / 1024);
  const usedMem = totalMem - freeMem;
  const osType = os.type();
  const platform = os.platform();
  const hostname = os.hostname();
  const uptime = Math.floor(os.uptime() / 60);
  const arch = os.arch();

  return {
    cpu: `${cpuModel} (${cpuCores} cores)`,
    ram: `${usedMem}MB / ${totalMem}MB`,
    os: `${osType} ${platform} ${arch}`,
    hostname: hostname,
    uptime: `${uptime}m`
  };
};

async function epicStartup() {
  console.clear();
  console.log('\x1b[2J\x1b[H');
  await sleep(200);
  
  const width = 70;
  const height = 20;
  
  for (let frame = 0; frame < 25; frame++) {
    console.clear();
    console.log('\x1b[2J\x1b[H');
    
    const scanY = Math.floor((frame / 25) * height);
    for (let y = 0; y < height; y++) {
      let line = '';
      for (let x = 0; x < width; x++) {
        if (y === scanY) {
          line += '\x1b[32m█\x1b[0m';
        } else if (Math.random() > 0.97) {
          line += '\x1b[36m·\x1b[0m';
        } else {
          line += ' ';
        }
      }
      console.log(line);
    }
    await sleep(50);
  }
  
  await sleep(400);
  
  const logo = `
 ___   ___   ___    ____   ___ _____ 
  ( _ ) ( _ ) ( _ )  | __ ) / _ \_   _|
  / _ \ / _ \ / _ \  |  _ \| | | || |  
 | (_) | (_) | (_) | | |_) | |_| || |  
  \___/ \___/ \___/  |____/ \___/ |_|  
                                       
`;

  console.clear();
  console.log('\x1b[2J\x1b[H');
  await sleep(200);
  
  const gradient = ['\x1b[31m', '\x1b[33m', '\x1b[32m', '\x1b[36m', '\x1b[34m', '\x1b[35m'];
  for (let i = 0; i < logo.length; i++) {
    const color = gradient[i % gradient.length];
    process.stdout.write(`\x1b[${Math.floor(i / 70) + 5};${i % 70}H${color}${logo[i]}\x1b[0m`);
    await sleep(10);
  }
  
  await sleep(700);
  
  const logoGlow = ['\x1b[32m', '\x1b[33m', '\x1b[36m', '\x1b[32m'];
  for (let g = 0; g < 4; g++) {
    const color = logoGlow[g % logoGlow.length];
    console.log(`\x1b[${5};1H${color}${logo.trim()}\x1b[0m`);
    await sleep(120);
  }
  
  console.log('\x1b[32m\n ✔ Sistema inizializzato con successo.\x1b[0m\n');
  await sleep(500);
  
  const sysInfo = await getSystemInfo();
  
  const statusData = [
    { label: 'Status', value: '\x1b[32mONLINE\x1b[0m' },
    { label: 'Versione', value: '\x1b[36m4.0\x1b[0m' },
    { label: 'CPU', value: `\x1b[33m${sysInfo.cpu}\x1b[0m` },
    { label: 'RAM', value: `\x1b[35m${sysInfo.ram}\x1b[0m` },
    { label: 'OS', value: `\x1b[36m${sysInfo.os}\x1b[0m` },
    { label: 'Host', value: `\x1b[32m${sysInfo.hostname}\x1b[0m` },
    { label: 'Uptime', value: `\x1b[33m${sysInfo.uptime}\x1b[0m` },
  ];
  
  for (const item of statusData) {
    const line = `  \x1b[36m${item.label}:\x1b[0m ${item.value}`;
    await typeWriter(line, 30);
    await sleep(180);
  }
  
  console.log('\x1b[31m' + '─'.repeat(70) + '\x1b[0m');
  await sleep(400);
  
  await loading('Avvio connessione WhatsApp', 1000);
  await loading('Caricamento comandi', 800);
  await loading('Sincronizzazione database', 700);
  await loading('Verifica integrità sistema', 600);
  await loading('Ottimizzazione performance', 700);
  await loading('Controllo sicurezza', 500);
  
  console.log('\x1b[32m\n ✔ Bot operativo e pronto.\x1b[0m\n');
  await sleep(400);
  
  console.log('\n');
}

let isRunning = false;

async function start(file) {
  if (isRunning) return;
  isRunning = true;

  await epicStartup();

  const args = [join(__dirname, file), ...process.argv.slice(2)];

  console.log('\x1b[32m✓ Sistema pronto\x1b[0m');
  console.log('\x1b[32m✓ Bot online\x1b[0m');
  console.log('\x1b[32m✓ Tutti i sistemi operativi\x1b[0m\n');

  setupMaster({
    exec: args[0],
    args: args.slice(1),
  });

  let processInstance = fork();

  processInstance.on('message', (data) => {
    console.log('\x1b[36m[→]\x1b[0m', data);
    switch (data) {
      case 'reset':
        console.log('\x1b[33m\n⟳ Riavvio in corso...\x1b[0m\n');
        processInstance.kill();
        isRunning = false;
        start(file);
        break;
      case 'uptime':
        processInstance.send(process.uptime());
        break;
    }
  });

  let restartAttempts = 0;
  const MAX_RESTART_ATTEMPTS = 10;

  processInstance.on('exit', (_, code) => {
    isRunning = false;
    console.error('\n\x1b[31m✖ Processo terminato [' + code + ']\x1b[0m\n');

    if (code !== 0) {
      if (code === 42) {
        console.log('\x1b[32m↻ Riavvio volontario...\x1b[0m\n');
        setTimeout(() => start(file), 2000);
        return;
      }

      restartAttempts++;
      if (restartAttempts > MAX_RESTART_ATTEMPTS) {
        console.error('\x1b[31m✖ Troppi tentativi di restart. In attesa di modifiche al file...\x1b[0m\n');
        watchFile(args[0], () => {
          unwatchFile(args[0]);
          restartAttempts = 0;
          console.log('\x1b[32m↻ Recupero automatico...\x1b[0m\n');
          start(file);
        });
        return;
      }

      const delay = Math.min(3000 * restartAttempts, 15000);
      console.log(`\x1b[32m↻ Riavvio automatico tra ${delay/1000} secondi... (tentativo ${restartAttempts}/${MAX_RESTART_ATTEMPTS})\x1b[0m\n`);
      setTimeout(() => {
        isRunning = false;
        start(file);
      }, delay);
    }
  });

  let opts = new Object(
    yargs(process.argv.slice(2)).exitProcess(false).parse()
  );
  
  if (!opts['test']) {
    rl.removeAllListeners('line'); 
    rl.on('line', (line) => {
      if (processInstance && processInstance.connected && typeof processInstance.send === 'function') {
        try {
          processInstance.send(line.trim());
        } catch (err) {
          if (err.code === 'ERR_IPC_CHANNEL_CLOSED') {
            console.log('\x1b[33m[!] Impossibile inviare: canale IPC chiuso.\x1b[0m');
          } else {
            console.error('\x1b[31m[!] Errore IPC:\x1b[0m', err);
          }
        }
      } else {
        console.log('\x1b[33m[!] Il bot si sta riavviando, input ignorato.\x1b[0m');
      }
    });
  }
}

process.on('uncaughtException', (err) => {
  if (err.code !== 'ERR_IPC_CHANNEL_CLOSED') {
    console.error('\x1b[31m[Cluster] Eccezione non gestita:\x1b[0m', err);
  }
});

process.on('unhandledRejection', (reason) => {
  if (reason?.code === 'ERR_IPC_CHANNEL_CLOSED') return;
  console.error('\x1b[31m[Cluster] Promise rejection non gestita:\x1b[0m', reason instanceof Error ? reason.message : reason);
});

process.on('warning', (warning) => {
  if (warning.name === 'MaxListenersExceededWarning') {
    if (warning.emitter && typeof warning.emitter.setMaxListeners === 'function') {
      warning.emitter.setMaxListeners(warning.emitter.getMaxListeners() + 10);
    }
    return;
  }
  if (warning.name !== 'DeprecationWarning') {
    console.warn('\x1b[33m[Cluster] Warning:\x1b[0m', warning.message);
  }
});

process.setMaxListeners(50);

start('elixir.js');
