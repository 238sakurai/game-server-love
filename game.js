/**
 * サーバー崩壊ラプソディ
 * ~ Server Crash Rhapsody ~
 * 
 * 設計思想: 同じパターンは二度と出さない
 * すべてをランダムパラメータの組み合わせで生成
 */

// ===== ランダム先生 =====
const RandomSensei = {
    // 基本乱数
    random: () => Math.random(),
    
    // 範囲内の整数
    int: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
    
    // 範囲内の小数
    float: (min, max) => Math.random() * (max - min) + min,
    
    // 配列からランダム選択
    pick: (arr) => arr[Math.floor(Math.random() * arr.length)],
    
    // 確率判定
    chance: (percent) => Math.random() * 100 < percent,
    
    // 複数選択（重複なし）
    pickMultiple: (arr, count) => {
        const shuffled = [...arr].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, Math.min(count, arr.length));
    },
    
    // ガウス分布風の乱数
    gaussian: () => {
        let u = 0, v = 0;
        while (u === 0) u = Math.random();
        while (v === 0) v = Math.random();
        return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    }
};

// ===== 定数・設定 =====
const CONFIG = {
    // 崩壊しきい値（ランダムに変動）
    getThreshold: () => ({
        cpu: RandomSensei.int(150, 300),
        memory: RandomSensei.int(16000, 32000),
        network: RandomSensei.int(2000, 5000),
        disk: RandomSensei.int(80, 100)
    }),
    
    // 負荷増加量（タップごと）
    getLoadIncrease: () => ({
        cpu: RandomSensei.float(5, 25),
        memory: RandomSensei.int(64, 512),
        network: RandomSensei.int(10, 200),
        disk: RandomSensei.float(0.5, 3)
    }),
    
    // 自然減衰
    getDecay: () => ({
        cpu: RandomSensei.float(0.5, 2),
        memory: RandomSensei.int(8, 32),
        network: RandomSensei.int(5, 20),
        disk: RandomSensei.float(0.1, 0.5)
    })
};

// ===== ログメッセージ集 =====
const LOG_MESSAGES = {
    normal: [
        '[INFO] Server is running...',
        '[DEBUG] Heartbeat OK',
        '[INFO] Connection accepted',
        '[DEBUG] Cache hit ratio: ' + RandomSensei.int(60, 99) + '%',
        '[INFO] Request processed',
        '[DEBUG] Memory allocated',
        '[INFO] Worker spawned',
        '[DEBUG] GC completed'
    ],
    
    warning: [
        '[WARN] High CPU usage detected',
        '[WARN] Memory pressure increasing',
        '[WARN] Slow query detected',
        '[WARN] Connection pool exhausted',
        '[WARN] Disk I/O bottleneck',
        '[WARN] Too many open files',
        '[WARN] Cache eviction started',
        '[WARN] Thread pool saturated',
        '[WARN] なんかヤバい気がする',
        '[WARN] 嫌な予感がする...'
    ],
    
    error: [
        '[ERROR] Segmentation fault (core dumped)',
        '[ERROR] Out of memory',
        '[ERROR] Connection timeout',
        '[ERROR] Disk full',
        '[ERROR] Stack overflow',
        '[ERROR] Null pointer exception',
        '[ERROR] Division by zero',
        '[ERROR] Buffer overflow detected',
        '[FATAL] Kernel panic',
        '[ERROR] It works on my machine',
        '[ERROR] 想定外の想定外',
        '[ERROR] 原因は後で調べます',
        '[ERROR] Retrying... (∞)',
        '[PANIC] 誰かー！！',
        '[ERROR] rm -rf / を実行中...',
        '[FATAL] sudo: command not found',
        '[ERROR] Exception in exception handler',
        '[CRITICAL] 退職届.docx not found'
    ],
    
    crash: [
        'KERNEL PANIC - not syncing: VFS: Unable to mount root fs',
        'Fatal exception: divide error',
        'General protection fault in module NTOSKRNL.EXE',
        'BUG: unable to handle kernel NULL pointer dereference',
        '*** STOP: 0x0000007E (0xC0000005, 0x00000000)',
        'Guru Meditation #00000004.0000AAC0',
        'Software Failure. Press left mouse button to continue.',
        'lp0 on fire',
        'PC LOAD LETTER',
        'Abort, Retry, Fail?',
        '418 I\'m a teapot',
        'ERROR: Reality not found',
        '原因: たぶん宇宙線',
        '犯人: 金曜日のデプロイ',
        '推定死亡時刻: さっき'
    ]
};

// ===== 崩壊タイプ =====
const CRASH_TYPES = {
    explosion: {
        name: '爆発',
        weight: 25,
        execute: (game) => game.crashExplosion()
    },
    freeze: {
        name: 'フリーズ',
        weight: 20,
        execute: (game) => game.crashFreeze()
    },
    scatter: {
        name: 'ドット散乱',
        weight: 20,
        execute: (game) => game.crashScatter()
    },
    bsod: {
        name: 'ブルースクリーン',
        weight: 15,
        execute: (game) => game.crashBSOD()
    },
    silent: {
        name: '無言消滅',
        weight: 10,
        execute: (game) => game.crashSilent()
    },
    glitch: {
        name: 'グリッチ',
        weight: 10,
        execute: (game) => game.crashGlitch()
    }
};

// ===== 8bit サウンドジェネレーター =====
class SoundGenerator {
    constructor() {
        this.audioContext = null;
        this.enabled = true;
    }
    
    init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Web Audio API not supported');
            this.enabled = false;
        }
    }
    
    resume() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }
    
    // 8bit風のビープ音
    beep(frequency = 440, duration = 0.1, type = 'square') {
        if (!this.enabled || !this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = type;
        
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }
    
    // タップ音（ランダム）
    tap() {
        const freq = RandomSensei.int(200, 600);
        const duration = RandomSensei.float(0.03, 0.08);
        this.beep(freq, duration, RandomSensei.pick(['square', 'sawtooth']));
    }
    
    // 警告音
    warning() {
        const freq = RandomSensei.int(300, 500);
        this.beep(freq, 0.15, 'square');
        setTimeout(() => this.beep(freq * 1.2, 0.15, 'square'), 150);
    }
    
    // 爆発音
    explosion() {
        if (!this.enabled || !this.audioContext) return;
        
        const duration = RandomSensei.float(0.3, 0.6);
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        
        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(RandomSensei.int(100, 200), this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(20, this.audioContext.currentTime + duration);
        
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1000, this.audioContext.currentTime);
        filter.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + duration);
        
        gainNode.gain.setValueAtTime(0.5, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }
    
    // ノイズ
    noise(duration = 0.5) {
        if (!this.enabled || !this.audioContext) return;
        
        const bufferSize = this.audioContext.sampleRate * duration;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        
        const source = this.audioContext.createBufferSource();
        const gainNode = this.audioContext.createGain();
        
        source.buffer = buffer;
        source.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        
        source.start();
    }
    
    // 無音（演出として）
    silence() {
        // 何もしない - これも演出
    }
    
    // ランダム崩壊音
    crashSound() {
        const sounds = ['explosion', 'noise', 'silence'];
        const weights = [50, 35, 15];
        
        let total = 0;
        const random = RandomSensei.random() * weights.reduce((a, b) => a + b, 0);
        
        for (let i = 0; i < sounds.length; i++) {
            total += weights[i];
            if (random < total) {
                this[sounds[i]]();
                return;
            }
        }
    }
}

// ===== サーバードット絵描画 =====
class ServerRenderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        this.pixelSize = 4;
        this.frame = 0;
        this.stress = 0;
        this.ledState = [true, true, true];
        this.smokeParticles = [];
    }
    
    // サーバーの基本形状を描画
    drawServer() {
        const ctx = this.ctx;
        const ps = this.pixelSize;
        const centerX = this.width / 2;
        const serverWidth = 120;
        const serverHeight = 200;
        const startX = centerX - serverWidth / 2;
        const startY = 40;
        
        // サーバー本体（ラック風）
        ctx.fillStyle = '#2a2a2a';
        this.drawRect(startX, startY, serverWidth, serverHeight);
        
        // フレーム
        ctx.fillStyle = '#1a1a1a';
        this.drawRect(startX, startY, serverWidth, 8);
        this.drawRect(startX, startY + serverHeight - 8, serverWidth, 8);
        this.drawRect(startX, startY, 8, serverHeight);
        this.drawRect(startX + serverWidth - 8, startY, 8, serverHeight);
        
        // ユニット（3段）
        for (let i = 0; i < 3; i++) {
            const unitY = startY + 20 + i * 60;
            
            // ユニット背景
            ctx.fillStyle = '#1a1a1a';
            this.drawRect(startX + 12, unitY, serverWidth - 24, 50);
            
            // 通気孔（ストレスで色変化）
            const holeColor = this.stress > 70 ? '#ff3300' : 
                             this.stress > 40 ? '#ffaa00' : '#333333';
            ctx.fillStyle = holeColor;
            for (let j = 0; j < 8; j++) {
                for (let k = 0; k < 3; k++) {
                    if ((j + k + this.frame) % 3 !== 0 || this.stress < 30) {
                        this.drawRect(startX + 20 + j * 10, unitY + 8 + k * 12, 6, 8);
                    }
                }
            }
            
            // LED（ランダムに点滅）
            if (this.frame % RandomSensei.int(5, 15) === 0) {
                this.ledState[i] = RandomSensei.chance(this.stress > 50 ? 30 : 90);
            }
            
            const ledColors = this.stress > 80 
                ? ['#ff0000', '#ff3300', '#ff0000']
                : this.stress > 50 
                    ? ['#ffaa00', '#00ff00', '#ffaa00']
                    : ['#00ff00', '#00ff00', '#00ff00'];
            
            ctx.fillStyle = this.ledState[i] ? ledColors[i] : '#333333';
            this.drawRect(startX + serverWidth - 28, unitY + 8, 8, 8);
            
            // HDD LED
            if (RandomSensei.chance(this.stress + 20)) {
                ctx.fillStyle = '#ff6600';
            } else {
                ctx.fillStyle = '#333333';
            }
            this.drawRect(startX + serverWidth - 28, unitY + 20, 8, 4);
        }
        
        // ケーブル
        ctx.fillStyle = '#0066ff';
        this.drawRect(startX + serverWidth - 4, startY + 100, 12, 4);
        ctx.fillStyle = '#00ff00';
        this.drawRect(startX + serverWidth - 4, startY + 110, 16, 4);
        ctx.fillStyle = '#ff6600';
        this.drawRect(startX + serverWidth - 4, startY + 120, 8, 4);
    }
    
    // ストレスエフェクト
    drawStressEffects() {
        const ctx = this.ctx;
        
        // 煙パーティクル
        if (this.stress > 60 && RandomSensei.chance(this.stress - 50)) {
            this.smokeParticles.push({
                x: this.width / 2 + RandomSensei.int(-40, 40),
                y: 40,
                vx: RandomSensei.float(-0.5, 0.5),
                vy: RandomSensei.float(-1, -2),
                life: RandomSensei.int(20, 40),
                size: RandomSensei.int(4, 12)
            });
        }
        
        // パーティクル更新・描画
        this.smokeParticles = this.smokeParticles.filter(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.life--;
            
            if (p.life > 0) {
                const alpha = p.life / 40;
                ctx.fillStyle = `rgba(100, 100, 100, ${alpha})`;
                this.drawRect(p.x, p.y, p.size, p.size);
                return true;
            }
            return false;
        });
        
        // シェイク効果
        if (this.stress > 80) {
            const shakeX = RandomSensei.int(-2, 2) * this.pixelSize;
            const shakeY = RandomSensei.int(-2, 2) * this.pixelSize;
            ctx.translate(shakeX, shakeY);
        }
        
        // グリッチライン
        if (this.stress > 70 && RandomSensei.chance(30)) {
            const y = RandomSensei.int(0, this.height);
            const h = RandomSensei.int(2, 8);
            ctx.fillStyle = RandomSensei.pick(['#ff0000', '#00ff00', '#0000ff']);
            ctx.globalAlpha = 0.5;
            this.drawRect(0, y, this.width, h);
            ctx.globalAlpha = 1;
        }
    }
    
    // ピクセル単位の矩形描画
    drawRect(x, y, w, h) {
        const ps = this.pixelSize;
        const px = Math.floor(x / ps) * ps;
        const py = Math.floor(y / ps) * ps;
        const pw = Math.floor(w / ps) * ps;
        const ph = Math.floor(h / ps) * ps;
        this.ctx.fillRect(px, py, pw, ph);
    }
    
    // 描画更新
    render(stress = 0) {
        this.stress = stress;
        this.frame++;
        
        this.ctx.save();
        this.ctx.fillStyle = '#0a0a0a';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        this.drawStressEffects();
        this.drawServer();
        
        this.ctx.restore();
    }
    
    // キャンバスのピクセルデータを取得（散乱用）
    getPixelData() {
        return this.ctx.getImageData(0, 0, this.width, this.height);
    }
    
    // クリア
    clear() {
        this.ctx.fillStyle = '#0a0a0a';
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.smokeParticles = [];
    }
}

// ===== メインゲームクラス =====
class ServerCrashGame {
    constructor() {
        // DOM要素
        this.screens = {
            title: document.getElementById('title-screen'),
            game: document.getElementById('game-screen'),
            crash: document.getElementById('crash-screen'),
            bsod: document.getElementById('bsod-screen')
        };
        
        this.elements = {
            startBtn: document.getElementById('start-btn'),
            restartBtn: document.getElementById('restart-btn'),
            bsodRestartBtn: document.getElementById('bsod-restart-btn'),
            canvas: document.getElementById('server-canvas'),
            tapEffect: document.getElementById('tap-effect'),
            logContent: document.getElementById('log-content'),
            loadCount: document.getElementById('load-count'),
            cpuValue: document.getElementById('cpu-value'),
            memValue: document.getElementById('mem-value'),
            netValue: document.getElementById('net-value'),
            diskValue: document.getElementById('disk-value'),
            cpuBar: document.getElementById('cpu-bar'),
            memBar: document.getElementById('mem-bar'),
            netBar: document.getElementById('net-bar'),
            diskBar: document.getElementById('disk-bar'),
            crashTitle: document.getElementById('crash-title'),
            crashLog: document.getElementById('crash-log'),
            crashEffect: document.getElementById('crash-effect'),
            timeScore: document.getElementById('time-score'),
            crashIndicators: document.getElementById('crash-indicators'),
            artScore: document.getElementById('art-score'),
            bsodError: document.getElementById('bsod-error'),
            bsodPercent: document.getElementById('bsod-percent')
        };
        
        // ゲーム状態
        this.state = {
            cpu: 0,
            memory: 0,
            network: 0,
            disk: 0,
            tapCount: 0,
            startTime: 0,
            isRunning: false,
            threshold: CONFIG.getThreshold(),
            suddenDeathTaps: RandomSensei.int(50, 200), // 突然死タップ数
            mysteryCrashTime: RandomSensei.int(30, 120) // 謎のクラッシュ時間
        };
        
        // サブシステム
        this.sound = new SoundGenerator();
        this.renderer = new ServerRenderer(this.elements.canvas);
        
        // イベント設定
        this.setupEvents();
        
        // ゲームループ
        this.lastTime = 0;
        this.logTimer = 0;
    }
    
    setupEvents() {
        // タイトル画面のスタートボタン
        this.elements.startBtn.addEventListener('click', () => this.startGame());
        this.elements.startBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.startGame();
        });
        
        // リスタートボタン
        this.elements.restartBtn.addEventListener('click', () => this.restart());
        this.elements.restartBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.restart();
        });
        
        this.elements.bsodRestartBtn.addEventListener('click', () => this.restart());
        this.elements.bsodRestartBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.restart();
        });
        
        // サーバーへのタップ/クリック
        this.elements.canvas.addEventListener('click', (e) => this.onTap(e));
        this.elements.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.onTap(e.touches[0]);
        });
    }
    
    showScreen(screenName) {
        Object.values(this.screens).forEach(s => s.classList.remove('active'));
        this.screens[screenName].classList.add('active');
    }
    
    startGame() {
        this.sound.init();
        this.sound.resume();
        
        // 状態リセット
        this.state = {
            cpu: RandomSensei.int(5, 15),
            memory: RandomSensei.int(128, 512),
            network: RandomSensei.int(1, 20),
            disk: RandomSensei.int(5, 15),
            tapCount: 0,
            startTime: Date.now(),
            isRunning: true,
            threshold: CONFIG.getThreshold(),
            suddenDeathTaps: RandomSensei.int(50, 200),
            mysteryCrashTime: RandomSensei.int(30, 120)
        };
        
        this.elements.logContent.innerHTML = '';
        this.elements.loadCount.textContent = '0';
        this.renderer.clear();
        
        this.showScreen('game');
        this.addLog('info', '[BOOT] System starting...');
        this.addLog('info', '[INIT] Server online');
        
        // ゲームループ開始
        this.lastTime = performance.now();
        this.gameLoop();
    }
    
    onTap(e) {
        if (!this.state.isRunning) return;
        
        this.sound.resume();
        this.sound.tap();
        
        // 負荷増加
        const increase = CONFIG.getLoadIncrease();
        this.state.cpu += increase.cpu;
        this.state.memory += increase.memory;
        this.state.network += increase.network;
        this.state.disk += increase.disk;
        this.state.tapCount++;
        
        this.elements.loadCount.textContent = this.state.tapCount;
        
        // タップエフェクト
        this.createTapEffect(e);
        
        // ランダムログ
        if (RandomSensei.chance(30)) {
            this.addRandomLog();
        }
        
        // 突然死チェック
        if (this.state.tapCount >= this.state.suddenDeathTaps && RandomSensei.chance(10)) {
            this.addLog('error', '[FATAL] SUDDEN DEATH TRIGGERED');
            this.triggerCrash('特定タップ数到達による突然死');
        }
    }
    
    createTapEffect(e) {
        const rect = this.elements.canvas.getBoundingClientRect();
        const x = (e.clientX || e.pageX) - rect.left;
        const y = (e.clientY || e.pageY) - rect.top;
        
        const ripple = document.createElement('div');
        ripple.className = 'tap-ripple';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.borderColor = RandomSensei.pick(['#ff6600', '#00ff00', '#ff0040', '#00ffff']);
        
        this.elements.tapEffect.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 400);
    }
    
    addLog(type, message) {
        const line = document.createElement('div');
        line.className = `log-line ${type}`;
        line.textContent = message;
        
        this.elements.logContent.appendChild(line);
        
        // 古いログを削除
        while (this.elements.logContent.children.length > 8) {
            this.elements.logContent.removeChild(this.elements.logContent.firstChild);
        }
        
        this.elements.logContent.scrollTop = this.elements.logContent.scrollHeight;
    }
    
    addRandomLog() {
        const stress = this.calculateStress();
        let type, messages;
        
        if (stress > 70) {
            type = RandomSensei.chance(60) ? 'error' : 'warning';
            messages = type === 'error' ? LOG_MESSAGES.error : LOG_MESSAGES.warning;
        } else if (stress > 40) {
            type = RandomSensei.chance(40) ? 'warning' : 'info';
            messages = type === 'warning' ? LOG_MESSAGES.warning : LOG_MESSAGES.normal;
        } else {
            type = 'info';
            messages = LOG_MESSAGES.normal;
        }
        
        // メッセージをランダム化
        let message = RandomSensei.pick(messages);
        
        // 追加のランダム要素
        if (RandomSensei.chance(20)) {
            message = message.replace(/\d+/, RandomSensei.int(0, 9999).toString());
        }
        
        this.addLog(type, message);
    }
    
    calculateStress() {
        const th = this.state.threshold;
        const cpuRatio = (this.state.cpu / th.cpu) * 100;
        const memRatio = (this.state.memory / th.memory) * 100;
        const netRatio = (this.state.network / th.network) * 100;
        const diskRatio = (this.state.disk / th.disk) * 100;
        
        return Math.max(cpuRatio, memRatio, netRatio, diskRatio);
    }
    
    updateUI() {
        const th = this.state.threshold;
        
        // CPU
        this.elements.cpuValue.textContent = Math.floor(this.state.cpu) + '%';
        const cpuPercent = Math.min(100, (this.state.cpu / th.cpu) * 100);
        this.elements.cpuBar.style.width = cpuPercent + '%';
        this.updateBarClass(this.elements.cpuBar, cpuPercent);
        
        // メモリ
        const memDisplay = this.state.memory >= 1024 
            ? (this.state.memory / 1024).toFixed(1) + 'GB'
            : Math.floor(this.state.memory) + 'MB';
        this.elements.memValue.textContent = memDisplay;
        const memPercent = Math.min(100, (this.state.memory / th.memory) * 100);
        this.elements.memBar.style.width = memPercent + '%';
        this.updateBarClass(this.elements.memBar, memPercent);
        
        // ネットワーク
        this.elements.netValue.textContent = Math.floor(this.state.network) + 'ms';
        const netPercent = Math.min(100, (this.state.network / th.network) * 100);
        this.elements.netBar.style.width = netPercent + '%';
        this.updateBarClass(this.elements.netBar, netPercent);
        
        // ディスク
        const diskStates = ['OK', 'BUSY', 'SLOW', 'CRITICAL', '???'];
        const diskIndex = Math.min(4, Math.floor(this.state.disk / 25));
        this.elements.diskValue.textContent = diskStates[diskIndex];
        const diskPercent = Math.min(100, (this.state.disk / th.disk) * 100);
        this.elements.diskBar.style.width = diskPercent + '%';
        this.updateBarClass(this.elements.diskBar, diskPercent);
    }
    
    updateBarClass(bar, percent) {
        bar.classList.remove('warning', 'danger');
        if (percent > 80) {
            bar.classList.add('danger');
        } else if (percent > 50) {
            bar.classList.add('warning');
        }
    }
    
    checkCrash() {
        const th = this.state.threshold;
        const elapsed = (Date.now() - this.state.startTime) / 1000;
        
        // CPU + メモリ超過
        if (this.state.cpu >= th.cpu && this.state.memory >= th.memory) {
            this.triggerCrash('CPU + メモリ同時超過');
            return;
        }
        
        // CPU単独超過
        if (this.state.cpu >= th.cpu * 1.2) {
            this.triggerCrash('CPU暴走');
            return;
        }
        
        // メモリ単独超過
        if (this.state.memory >= th.memory * 1.1) {
            this.triggerCrash('OOM Killer発動');
            return;
        }
        
        // ネットワーク遅延暴走
        if (this.state.network >= th.network) {
            this.triggerCrash('ネットワーク遅延による接続断');
            return;
        }
        
        // ディスク枯渇
        if (this.state.disk >= th.disk) {
            this.triggerCrash('ディスク容量枯渇');
            return;
        }
        
        // 謎の時間経過クラッシュ
        if (elapsed >= this.state.mysteryCrashTime && RandomSensei.chance(2)) {
            this.triggerCrash('なぜか今落ちた');
            return;
        }
    }
    
    triggerCrash(reason) {
        this.state.isRunning = false;
        
        // 崩壊タイプをランダム選択（重み付き）
        const types = Object.entries(CRASH_TYPES);
        let totalWeight = types.reduce((sum, [, t]) => sum + t.weight, 0);
        let random = RandomSensei.random() * totalWeight;
        
        let selectedType = types[0][1];
        for (const [, type] of types) {
            random -= type.weight;
            if (random <= 0) {
                selectedType = type;
                break;
            }
        }
        
        console.log(`Crash Type: ${selectedType.name}, Reason: ${reason}`);
        
        // スコア計算
        this.calculateScore(reason);
        
        // 崩壊実行
        selectedType.execute(this);
    }
    
    calculateScore(reason) {
        const elapsed = (Date.now() - this.state.startTime) / 1000;
        const th = this.state.threshold;
        
        // 崩壊指標数
        let indicators = 0;
        if (this.state.cpu >= th.cpu * 0.8) indicators++;
        if (this.state.memory >= th.memory * 0.8) indicators++;
        if (this.state.network >= th.network * 0.8) indicators++;
        if (this.state.disk >= th.disk * 0.8) indicators++;
        
        // 芸術点（完全ランダム）
        const artScores = [
            '神', '芸術', '美', '良', '普通', '微妙', '？？？',
            '∞', 'NaN', 'undefined', '哲学', 'エモい', '草'
        ];
        
        this.score = {
            time: elapsed.toFixed(1),
            indicators: indicators,
            art: RandomSensei.pick(artScores),
            reason: reason
        };
    }
    
    // ===== 崩壊演出 =====
    
    crashExplosion() {
        this.sound.explosion();
        
        const container = document.getElementById('game-container');
        container.classList.add('screen-shake');
        
        // パーティクル生成
        const rect = this.elements.canvas.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < RandomSensei.int(30, 60); i++) {
            const particle = document.createElement('div');
            particle.className = 'explosion-particle';
            particle.style.left = centerX + 'px';
            particle.style.top = centerY + 'px';
            particle.style.background = RandomSensei.pick(['#ff6600', '#ff0040', '#ffff00', '#00ff00']);
            particle.style.width = RandomSensei.int(4, 16) + 'px';
            particle.style.height = RandomSensei.int(4, 16) + 'px';
            
            const angle = RandomSensei.float(0, Math.PI * 2);
            const velocity = RandomSensei.float(5, 20);
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;
            
            document.body.appendChild(particle);
            
            let frame = 0;
            const animate = () => {
                frame++;
                const x = parseFloat(particle.style.left) + vx;
                const y = parseFloat(particle.style.top) + vy + frame * 0.5;
                particle.style.left = x + 'px';
                particle.style.top = y + 'px';
                particle.style.opacity = 1 - frame / 30;
                
                if (frame < 30) {
                    requestAnimationFrame(animate);
                } else {
                    particle.remove();
                }
            };
            requestAnimationFrame(animate);
        }
        
        setTimeout(() => {
            container.classList.remove('screen-shake');
            this.showCrashScreen();
        }, 500);
    }
    
    crashFreeze() {
        // フリーズは音なし（または静かなノイズ）
        if (RandomSensei.chance(30)) {
            this.sound.noise(0.2);
        }
        
        const overlay = document.createElement('div');
        overlay.className = 'freeze-overlay';
        this.screens.game.appendChild(overlay);
        
        // 数秒フリーズしてから崩壊画面
        setTimeout(() => {
            overlay.remove();
            this.showCrashScreen();
        }, RandomSensei.int(1500, 3000));
    }
    
    crashScatter() {
        this.sound.noise(0.3);
        
        const canvas = this.elements.canvas;
        const rect = canvas.getBoundingClientRect();
        const pixelData = this.renderer.getPixelData();
        
        // キャンバスをクリア
        this.renderer.clear();
        
        // ピクセルを散らばらせる
        const pixelSize = 8;
        for (let y = 0; y < canvas.height; y += pixelSize) {
            for (let x = 0; x < canvas.width; x += pixelSize) {
                const i = (y * canvas.width + x) * 4;
                const r = pixelData.data[i];
                const g = pixelData.data[i + 1];
                const b = pixelData.data[i + 2];
                const a = pixelData.data[i + 3];
                
                if (a > 50 && (r > 20 || g > 20 || b > 20)) {
                    const pixel = document.createElement('div');
                    pixel.className = 'scatter-pixel';
                    pixel.style.left = (rect.left + x) + 'px';
                    pixel.style.top = (rect.top + y) + 'px';
                    pixel.style.width = pixelSize + 'px';
                    pixel.style.height = pixelSize + 'px';
                    pixel.style.background = `rgb(${r},${g},${b})`;
                    
                    document.body.appendChild(pixel);
                    
                    const vx = RandomSensei.float(-5, 5);
                    const vy = RandomSensei.float(-10, 5);
                    let frame = 0;
                    
                    const animate = () => {
                        frame++;
                        const currentX = parseFloat(pixel.style.left) + vx;
                        const currentY = parseFloat(pixel.style.top) + vy + frame * 0.8;
                        pixel.style.left = currentX + 'px';
                        pixel.style.top = currentY + 'px';
                        pixel.style.opacity = 1 - frame / 60;
                        
                        if (frame < 60) {
                            requestAnimationFrame(animate);
                        } else {
                            pixel.remove();
                        }
                    };
                    
                    setTimeout(() => requestAnimationFrame(animate), RandomSensei.int(0, 200));
                }
            }
        }
        
        setTimeout(() => this.showCrashScreen(), 1500);
    }
    
    crashBSOD() {
        this.sound.beep(800, 0.5, 'square');
        
        // BSODエラーコードをランダム生成
        const errorCodes = [
            'IRQL_NOT_LESS_OR_EQUAL',
            'PAGE_FAULT_IN_NONPAGED_AREA',
            'SYSTEM_SERVICE_EXCEPTION',
            'KERNEL_DATA_INPAGE_ERROR',
            'UNEXPECTED_KERNEL_MODE_TRAP',
            'KMODE_EXCEPTION_NOT_HANDLED',
            'DRIVER_OVERRAN_STACK_BUFFER',
            'WHEA_UNCORRECTABLE_ERROR',
            'CLOCK_WATCHDOG_TIMEOUT',
            'CRITICAL_PROCESS_DIED'
        ];
        
        this.elements.bsodError.textContent = 
            `Stop code: ${RandomSensei.pick(errorCodes)}`;
        
        this.showScreen('bsod');
        
        // パーセント表示アニメーション
        let percent = 0;
        const targetPercent = RandomSensei.int(0, 100);
        const interval = setInterval(() => {
            percent += RandomSensei.int(1, 5);
            if (percent >= targetPercent) {
                percent = targetPercent;
                clearInterval(interval);
            }
            this.elements.bsodPercent.textContent = percent + '% complete';
        }, RandomSensei.int(100, 500));
    }
    
    crashSilent() {
        // 無音で消える（一番怖いやつ）
        this.sound.silence();
        
        this.elements.canvas.style.transition = 'opacity 0.5s';
        this.elements.canvas.style.opacity = '0';
        
        setTimeout(() => {
            this.elements.canvas.style.transition = '';
            this.elements.canvas.style.opacity = '1';
            this.showCrashScreen();
        }, 1000);
    }
    
    crashGlitch() {
        this.sound.noise(0.5);
        
        const container = document.getElementById('game-container');
        let glitchCount = 0;
        const maxGlitches = RandomSensei.int(5, 15);
        
        const glitchInterval = setInterval(() => {
            glitchCount++;
            
            // ランダムなグリッチ効果
            container.style.filter = RandomSensei.pick([
                'hue-rotate(90deg)',
                'invert(1)',
                'saturate(5)',
                'contrast(2)',
                'brightness(2)',
                ''
            ]);
            
            container.style.transform = `translate(${RandomSensei.int(-10, 10)}px, ${RandomSensei.int(-10, 10)}px)`;
            
            if (glitchCount >= maxGlitches) {
                clearInterval(glitchInterval);
                container.style.filter = '';
                container.style.transform = '';
                this.showCrashScreen();
            }
        }, RandomSensei.int(50, 150));
    }
    
    showCrashScreen() {
        // 崩壊タイトルをランダム化
        const titles = [
            'SYSTEM FAILURE',
            'FATAL ERROR',
            'KERNEL PANIC',
            '壊れました',
            'お亡くなりになりました',
            'ご臨終です',
            'F',
            '(´・ω・`)',
            'GAME OVER',
            '障害発生',
            '緊急メンテナンス',
            '想定外'
        ];
        this.elements.crashTitle.textContent = RandomSensei.pick(titles);
        
        // 崩壊ログ
        const logs = RandomSensei.pickMultiple(LOG_MESSAGES.crash, RandomSensei.int(3, 6));
        this.elements.crashLog.textContent = logs.join('\n\n');
        
        // スコア表示
        this.elements.timeScore.textContent = this.score.time + 's';
        this.elements.crashIndicators.textContent = this.score.indicators + '/4';
        this.elements.artScore.textContent = this.score.art;
        
        this.showScreen('crash');
    }
    
    restart() {
        // エフェクトクリア
        document.querySelectorAll('.explosion-particle, .scatter-pixel').forEach(el => el.remove());
        
        this.startGame();
    }
    
    gameLoop(currentTime = 0) {
        if (!this.state.isRunning) return;
        
        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;
        
        // 自然減衰
        const decay = CONFIG.getDecay();
        this.state.cpu = Math.max(0, this.state.cpu - decay.cpu * deltaTime);
        this.state.memory = Math.max(0, this.state.memory - decay.memory * deltaTime);
        this.state.network = Math.max(0, this.state.network - decay.network * deltaTime);
        this.state.disk = Math.max(0, this.state.disk - decay.disk * deltaTime);
        
        // UI更新
        this.updateUI();
        
        // サーバー描画
        this.renderer.render(this.calculateStress());
        
        // 定期ログ
        this.logTimer += deltaTime;
        if (this.logTimer > RandomSensei.float(2, 5)) {
            this.logTimer = 0;
            this.addRandomLog();
        }
        
        // 警告音
        const stress = this.calculateStress();
        if (stress > 80 && RandomSensei.chance(5)) {
            this.sound.warning();
        }
        
        // 崩壊チェック
        this.checkCrash();
        
        requestAnimationFrame((t) => this.gameLoop(t));
    }
}

// ===== ゲーム開始 =====
document.addEventListener('DOMContentLoaded', () => {
    window.game = new ServerCrashGame();
});
