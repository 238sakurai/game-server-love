// ========================================
// サーバー崩壊ラプソディ
// "ランダム先生" - 同じパターンは二度と出さない
// ========================================

class RandomMaster {
    // ランダム先生: 乱数の神
    static range(min, max) {
        return Math.random() * (max - min) + min;
    }
    
    static int(min, max) {
        return Math.floor(this.range(min, max + 1));
    }
    
    static pick(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }
    
    static shuffle(arr) {
        const result = [...arr];
        for (let i = result.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [result[i], result[j]] = [result[j], result[i]];
        }
        return result;
    }
    
    static chance(percent) {
        return Math.random() * 100 < percent;
    }
    
    static gaussian() {
        // より自然なランダム分布
        let u = 0, v = 0;
        while(u === 0) u = Math.random();
        while(v === 0) v = Math.random();
        return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    }
}

// ========================================
// 8bitサウンドジェネレーター
// ========================================
class SoundGenerator {
    constructor() {
        this.ctx = null;
        this.enabled = true;
    }
    
    init() {
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        } catch(e) {
            this.enabled = false;
        }
    }
    
    play(type, freq, duration, volume = 0.3) {
        if (!this.enabled || !this.ctx) return;
        
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            
            osc.type = type;
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
            
            gain.gain.setValueAtTime(volume, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
            
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            
            osc.start();
            osc.stop(this.ctx.currentTime + duration);
        } catch(e) {}
    }
    
    // タップ音（毎回微妙に違う）
    tap() {
        const freq = RandomMaster.range(200, 400);
        const type = RandomMaster.pick(['square', 'sawtooth', 'triangle']);
        this.play(type, freq, 0.05, 0.2);
    }
    
    // ストレス上昇音
    stress(level) {
        const freq = 100 + level * 5;
        this.play('square', freq, 0.02, 0.1);
    }
    
    // 警告音
    warning() {
        const patterns = [
            () => {
                this.play('square', 440, 0.1, 0.3);
                setTimeout(() => this.play('square', 440, 0.1, 0.3), 150);
            },
            () => {
                this.play('sawtooth', 880, 0.2, 0.2);
            },
            () => {
                for(let i = 0; i < 3; i++) {
                    setTimeout(() => this.play('square', 660, 0.05, 0.2), i * 100);
                }
            }
        ];
        RandomMaster.pick(patterns)();
    }
    
    // 爆発音（毎回違う）
    explosion() {
        const duration = RandomMaster.range(0.3, 0.8);
        const baseFreq = RandomMaster.range(50, 150);
        
        // ノイズ的な爆発
        for(let i = 0; i < 10; i++) {
            const freq = baseFreq + RandomMaster.range(-50, 50);
            const delay = i * 0.03;
            setTimeout(() => {
                this.play('sawtooth', freq, duration / 10, 0.3 - i * 0.02);
            }, delay * 1000);
        }
    }
    
    // ビープ音
    beep() {
        this.play('square', RandomMaster.pick([440, 880, 1760]), 0.5, 0.2);
    }
    
    // 死の静寂（無音）
    silence() {
        // 意図的に何もしない - これも演出
    }
    
    // ランダムクラッシュサウンド
    crashSound() {
        const sounds = ['explosion', 'beep', 'silence', 'glitch'];
        const choice = RandomMaster.pick(sounds);
        
        switch(choice) {
            case 'explosion':
                this.explosion();
                break;
            case 'beep':
                this.beep();
                break;
            case 'silence':
                this.silence();
                break;
            case 'glitch':
                for(let i = 0; i < 5; i++) {
                    setTimeout(() => {
                        this.play(
                            RandomMaster.pick(['square', 'sawtooth']),
                            RandomMaster.range(100, 2000),
                            0.05,
                            0.2
                        );
                    }, i * 50);
                }
                break;
        }
    }
}

// ========================================
// サーバードット絵レンダラー
// ========================================
class ServerRenderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        
        // 8色パレット
        this.colors = {
            black: '#0f0f0f',
            dark: '#1a1a2e',
            gray: '#4a4a6a',
            light: '#8a8aaa',
            white: '#e0e0e0',
            red: '#ff4444',
            green: '#44ff44',
            cyan: '#44ffff'
        };
        
        this.serverState = {
            shakeX: 0,
            shakeY: 0,
            glitchOffset: 0,
            ledBlink: 0,
            smokeParticles: [],
            fragments: []
        };
    }
    
    clear() {
        this.ctx.fillStyle = this.colors.black;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }
    
    // メインサーバー描画
    drawServer(stress, state = 'normal') {
        this.clear();
        
        const centerX = this.width / 2;
        const centerY = this.height / 2;
        
        // ストレスレベルに応じた振動
        if (stress > 50) {
            this.serverState.shakeX = RandomMaster.range(-stress/25, stress/25);
            this.serverState.shakeY = RandomMaster.range(-stress/30, stress/30);
        } else {
            this.serverState.shakeX = 0;
            this.serverState.shakeY = 0;
        }
        
        const sx = centerX + this.serverState.shakeX;
        const sy = centerY + this.serverState.shakeY;
        
        // サーバーラック
        this.drawServerRack(sx, sy, stress);
        
        // LED点滅
        this.drawLEDs(sx, sy, stress);
        
        // ストレスエフェクト
        if (stress > 70) {
            this.drawSmokeParticles(sx, sy);
        }
        
        // グリッチエフェクト
        if (stress > 85) {
            this.applyGlitch();
        }
    }
    
    drawServerRack(x, y, stress) {
        const ctx = this.ctx;
        const rackWidth = 80;
        const rackHeight = 120;
        
        // 影
        ctx.fillStyle = this.colors.black;
        ctx.fillRect(x - rackWidth/2 + 4, y - rackHeight/2 + 4, rackWidth, rackHeight);
        
        // メインボディ
        const bodyColor = stress > 80 ? this.colors.red : 
                         stress > 50 ? this.colors.gray : this.colors.dark;
        ctx.fillStyle = bodyColor;
        ctx.fillRect(x - rackWidth/2, y - rackHeight/2, rackWidth, rackHeight);
        
        // 枠
        ctx.strokeStyle = this.colors.light;
        ctx.lineWidth = 2;
        ctx.strokeRect(x - rackWidth/2, y - rackHeight/2, rackWidth, rackHeight);
        
        // サーバーユニット（3段）
        for (let i = 0; i < 3; i++) {
            const unitY = y - rackHeight/2 + 15 + i * 35;
            
            // ユニット本体
            ctx.fillStyle = this.colors.gray;
            ctx.fillRect(x - rackWidth/2 + 8, unitY, rackWidth - 16, 28);
            
            // 通気口（ドット）
            ctx.fillStyle = this.colors.dark;
            for (let j = 0; j < 8; j++) {
                for (let k = 0; k < 3; k++) {
                    ctx.fillRect(
                        x - rackWidth/2 + 12 + j * 7,
                        unitY + 4 + k * 8,
                        4, 4
                    );
                }
            }
        }
        
        // 電源ボタン
        ctx.fillStyle = stress > 0 ? this.colors.green : this.colors.dark;
        ctx.fillRect(x + rackWidth/2 - 16, y + rackHeight/2 - 16, 8, 8);
    }
    
    drawLEDs(x, y, stress) {
        const ctx = this.ctx;
        const rackWidth = 80;
        const rackHeight = 120;
        
        this.serverState.ledBlink++;
        
        for (let i = 0; i < 3; i++) {
            const unitY = y - rackHeight/2 + 15 + i * 35;
            
            // ステータスLED
            const ledColors = [];
            
            if (stress > 30 + i * 20) {
                // 警告状態
                ledColors.push(
                    (this.serverState.ledBlink + i * 3) % 10 < 5 ? 
                    this.colors.red : this.colors.dark
                );
            } else {
                ledColors.push(this.colors.green);
            }
            
            // アクティビティLED（ランダム点滅）
            ledColors.push(
                RandomMaster.chance(30 + stress) ? 
                this.colors.cyan : this.colors.dark
            );
            
            // 描画
            ledColors.forEach((color, j) => {
                ctx.fillStyle = color;
                ctx.fillRect(
                    x + rackWidth/2 - 14 - j * 10,
                    unitY + 10,
                    6, 6
                );
            });
        }
    }
    
    drawSmokeParticles(x, y) {
        // パーティクル追加
        if (RandomMaster.chance(30)) {
            this.serverState.smokeParticles.push({
                x: x + RandomMaster.range(-30, 30),
                y: y - 60,
                vx: RandomMaster.range(-1, 1),
                vy: RandomMaster.range(-2, -0.5),
                life: 30,
                size: RandomMaster.int(2, 6)
            });
        }
        
        // パーティクル更新・描画
        this.serverState.smokeParticles = this.serverState.smokeParticles.filter(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.life--;
            
            if (p.life > 0) {
                const alpha = p.life / 30;
                this.ctx.fillStyle = `rgba(138, 138, 170, ${alpha})`;
                this.ctx.fillRect(p.x, p.y, p.size, p.size);
                return true;
            }
            return false;
        });
    }
    
    applyGlitch() {
        // ランダムな水平ラインのずれ
        const numGlitches = RandomMaster.int(1, 5);
        
        for (let i = 0; i < numGlitches; i++) {
            const y = RandomMaster.int(0, this.height);
            const h = RandomMaster.int(2, 20);
            const offset = RandomMaster.int(-20, 20);
            
            const imageData = this.ctx.getImageData(0, y, this.width, h);
            this.ctx.putImageData(imageData, offset, y);
        }
    }
    
    // 崩壊エフェクト
    drawCrashEffect(type, progress) {
        switch(type) {
            case 'explosion':
                this.drawExplosion(progress);
                break;
            case 'freeze':
                this.drawFreeze(progress);
                break;
            case 'scatter':
                this.drawScatter(progress);
                break;
            case 'bsod':
                this.drawBSOD(progress);
                break;
            case 'vanish':
                this.drawVanish(progress);
                break;
            case 'meltdown':
                this.drawMeltdown(progress);
                break;
        }
    }
    
    drawExplosion(progress) {
        this.clear();
        
        const centerX = this.width / 2;
        const centerY = this.height / 2;
        const radius = progress * 150;
        
        // 爆発の輪
        for (let i = 0; i < 20; i++) {
            const angle = (Math.PI * 2 / 20) * i + progress * 5;
            const dist = radius + RandomMaster.range(-20, 20);
            const x = centerX + Math.cos(angle) * dist;
            const y = centerY + Math.sin(angle) * dist;
            const size = RandomMaster.int(4, 16);
            
            this.ctx.fillStyle = RandomMaster.pick([
                this.colors.red, this.colors.cyan, this.colors.white
            ]);
            this.ctx.fillRect(x, y, size, size);
        }
        
        // 破片
        if (this.serverState.fragments.length === 0) {
            for (let i = 0; i < 30; i++) {
                this.serverState.fragments.push({
                    x: centerX,
                    y: centerY,
                    vx: RandomMaster.range(-10, 10),
                    vy: RandomMaster.range(-10, 10),
                    size: RandomMaster.int(4, 12),
                    color: RandomMaster.pick(Object.values(this.colors))
                });
            }
        }
        
        this.serverState.fragments.forEach(f => {
            f.x += f.vx;
            f.y += f.vy;
            f.vy += 0.3; // 重力
            
            this.ctx.fillStyle = f.color;
            this.ctx.fillRect(f.x, f.y, f.size, f.size);
        });
    }
    
    drawFreeze(progress) {
        // 最後のフレームをそのまま保持（何も描画しない）
        // フリーズ = 動かない
        if (progress < 0.1) {
            this.drawServer(100);
        }
        
        // ノイズを少し追加
        for (let i = 0; i < 10; i++) {
            const x = RandomMaster.int(0, this.width);
            const y = RandomMaster.int(0, this.height);
            this.ctx.fillStyle = RandomMaster.pick([
                this.colors.white, this.colors.gray
            ]);
            this.ctx.fillRect(x, y, 2, 2);
        }
    }
    
    drawScatter(progress) {
        this.clear();
        
        if (this.serverState.fragments.length === 0) {
            // サーバーをピクセル単位で分解
            for (let x = 0; x < 80; x += 4) {
                for (let y = 0; y < 120; y += 4) {
                    this.serverState.fragments.push({
                        x: this.width/2 - 40 + x,
                        y: this.height/2 - 60 + y,
                        vx: RandomMaster.range(-3, 3),
                        vy: RandomMaster.range(-5, 2),
                        color: RandomMaster.pick([
                            this.colors.gray, this.colors.dark, 
                            this.colors.light, this.colors.cyan
                        ])
                    });
                }
            }
        }
        
        this.serverState.fragments.forEach(f => {
            f.x += f.vx;
            f.y += f.vy;
            f.vy += 0.2;
            
            this.ctx.fillStyle = f.color;
            this.ctx.fillRect(f.x, f.y, 4, 4);
        });
    }
    
    drawBSOD(progress) {
        // 青い画面
        this.ctx.fillStyle = '#0000aa';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        this.ctx.fillStyle = this.colors.white;
        this.ctx.font = '10px monospace';
        this.ctx.textAlign = 'center';
        
        const messages = [
            'A problem has been detected',
            'and the server has been',
            'shut down to prevent damage.',
            '',
            'CRITICAL_PROCESS_DIED',
            '',
            '*** STOP: 0x000000EF'
        ];
        
        messages.forEach((msg, i) => {
            if (progress > i * 0.1) {
                this.ctx.fillText(msg, this.width/2, 40 + i * 20);
            }
        });
    }
    
    drawVanish(progress) {
        this.clear();
        
        // 徐々に消える
        const alpha = 1 - progress;
        this.ctx.globalAlpha = alpha;
        this.drawServer(50);
        this.ctx.globalAlpha = 1;
        
        // 最後は完全に消える
        if (progress > 0.9) {
            this.clear();
        }
    }
    
    drawMeltdown(progress) {
        this.clear();
        
        const centerX = this.width / 2;
        const centerY = this.height / 2;
        
        // 溶けるエフェクト
        for (let x = -40; x < 40; x += 4) {
            const meltY = progress * 100 * (1 + Math.sin(x * 0.2) * 0.5);
            const height = Math.max(0, 120 - meltY);
            
            this.ctx.fillStyle = RandomMaster.pick([
                this.colors.gray, this.colors.red, this.colors.dark
            ]);
            this.ctx.fillRect(
                centerX + x,
                centerY - 60 + meltY,
                4,
                height
            );
        }
        
        // 溶けた部分
        this.ctx.fillStyle = this.colors.dark;
        this.ctx.fillRect(
            centerX - 50,
            centerY + 60,
            100,
            progress * 40
        );
    }
    
    reset() {
        this.serverState.fragments = [];
        this.serverState.smokeParticles = [];
    }
}

// ========================================
// ログメッセージジェネレーター
// ========================================
class LogGenerator {
    constructor() {
        this.templates = {
            normal: [
                '[INFO] System running...',
                '[DEBUG] Heartbeat: OK',
                '[INFO] Request processed',
                '[DEBUG] Memory allocated',
                '[INFO] Connection established',
                '[TRACE] Loop iteration: {n}',
                '[DEBUG] Cache hit',
                '[INFO] Task queued',
            ],
            warning: [
                '[WARN] High memory usage: {mem}MB',
                '[WARN] CPU spike detected: {cpu}%',
                '[WARN] Slow response: {ms}ms',
                '[WARN] Connection pool exhausted',
                '[WARN] Disk I/O high',
                '[WARN] Too many open files',
                '[WARN] GC taking too long',
                '[WARN] Rate limit approaching',
            ],
            error: [
                '[ERROR] Connection refused',
                '[ERROR] Timeout after {ms}ms',
                '[ERROR] Out of memory',
                '[FATAL] Segmentation fault (core dumped)',
                '[ERROR] Stack overflow',
                '[FATAL] Kernel panic',
                '[ERROR] Disk full',
                '[ERROR] null pointer exception',
            ],
            crash: [
                'Segmentation fault (core dumped)',
                'It works on my machine',
                'Retrying... (∞)',
                '想定外の想定外',
                '原因は後で調べます',
                'TODO: fix this later',
                '// なぜか動いてた',
                'Exception in thread "main"',
                'Unhandled promise rejection',
                '504 Gateway Time-out',
                'SIGSEGV',
                'Bus error',
                'Killed',
                'OOMKiller invoked',
                'panic: runtime error',
                'java.lang.OutOfMemoryError',
                'Cannot allocate memory',
                'Connection reset by peer',
                'Too many open files',
                'No space left on device',
                '/* これ消したら動かなくなる */',
                '// 触らないでください',
                '$ sudo rm -rf / # oops',
                'undefined is not a function',
                'Maximum call stack exceeded',
                'Error: ENOENT',
                'Error: EACCES',
                'SSL_ERROR_HANDSHAKE',
                'EPERM: operation not permitted',
                'Error: listen EADDRINUSE',
            ]
        };
    }
    
    generate(type, params = {}) {
        const templates = this.templates[type] || this.templates.normal;
        let msg = RandomMaster.pick(templates);
        
        // パラメータ置換
        msg = msg.replace('{n}', RandomMaster.int(1, 99999));
        msg = msg.replace('{mem}', params.mem || RandomMaster.int(100, 32000));
        msg = msg.replace('{cpu}', params.cpu || RandomMaster.int(80, 300));
        msg = msg.replace('{ms}', params.ms || RandomMaster.int(100, 5000));
        
        return msg;
    }
    
    generateCrashDump() {
        // クラッシュ時のダンプ（毎回違う）
        const lines = [];
        const numLines = RandomMaster.int(3, 8);
        
        for (let i = 0; i < numLines; i++) {
            lines.push(this.generate('crash'));
        }
        
        return lines.join('\n');
    }
}

// ========================================
// メインゲームクラス
// ========================================
class ServerCollapseGame {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.renderer = new ServerRenderer(this.canvas);
        this.sound = new SoundGenerator();
        this.log = new LogGenerator();
        
        // ゲーム状態
        this.state = 'ready'; // ready, playing, crashing, crashed
        this.stress = 0;
        this.tapCount = 0;
        this.startTime = 0;
        this.crashCount = parseInt(localStorage.getItem('crashCount') || '0');
        
        // 負荷パラメータ（毎回ランダム）
        this.params = this.generateParams();
        
        // 崩壊条件（毎回ランダム）
        this.crashCondition = this.generateCrashCondition();
        
        // UI要素
        this.elements = {
            cpuMeter: document.getElementById('cpu-meter'),
            memMeter: document.getElementById('mem-meter'),
            netMeter: document.getElementById('net-meter'),
            diskMeter: document.getElementById('disk-meter'),
            cpuValue: document.getElementById('cpu-value'),
            memValue: document.getElementById('mem-value'),
            netValue: document.getElementById('net-value'),
            diskValue: document.getElementById('disk-value'),
            logContent: document.getElementById('log-content'),
            timeScore: document.getElementById('time-score'),
            crashCountEl: document.getElementById('crash-count'),
            artScore: document.getElementById('art-score'),
            crashOverlay: document.getElementById('crash-overlay'),
            crashTitle: document.getElementById('crash-title'),
            crashMessage: document.getElementById('crash-message'),
            crashStats: document.getElementById('crash-stats'),
            restartBtn: document.getElementById('restart-btn'),
            tapHint: document.getElementById('tap-hint')
        };
        
        this.elements.crashCountEl.textContent = this.crashCount;
        
        this.init();
    }
    
    generateParams() {
        // 毎回違う初期パラメータ
        return {
            cpuBase: RandomMaster.range(5, 20),
            cpuMultiplier: RandomMaster.range(0.5, 2.0),
            memBase: RandomMaster.range(50, 200),
            memMultiplier: RandomMaster.range(0.3, 1.5),
            netBase: RandomMaster.range(10, 50),
            netMultiplier: RandomMaster.range(0.5, 3.0),
            netSpike: RandomMaster.chance(30), // たまに突然スパイクする
            diskStability: RandomMaster.range(0.7, 1.0),
            decayRate: RandomMaster.range(0.1, 0.5),
            stressPerTap: RandomMaster.range(2, 8),
            maxStress: RandomMaster.range(80, 120),
        };
    }
    
    generateCrashCondition() {
        // 崩壊条件をランダムに決定
        const conditions = [
            { type: 'stress', threshold: RandomMaster.range(75, 100) },
            { type: 'cpu_mem', cpuThreshold: RandomMaster.range(150, 250), memThreshold: RandomMaster.range(8000, 20000) },
            { type: 'net_spike', threshold: RandomMaster.range(2000, 4000) },
            { type: 'tap_count', count: RandomMaster.int(20, 80) },
            { type: 'random_death', chance: RandomMaster.range(0.1, 0.5) }, // なぜか今落ちた
            { type: 'time_bomb', time: RandomMaster.range(15, 45) },
        ];
        
        return RandomMaster.pick(conditions);
    }
    
    init() {
        // サウンド初期化（ユーザーインタラクション後）
        const initSound = () => {
            this.sound.init();
            document.removeEventListener('click', initSound);
            document.removeEventListener('touchstart', initSound);
        };
        document.addEventListener('click', initSound);
        document.addEventListener('touchstart', initSound);
        
        // イベントリスナー
        this.canvas.addEventListener('click', (e) => this.onTap(e));
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.onTap(e);
        });
        
        document.getElementById('server-area').addEventListener('click', (e) => {
            if (e.target === document.getElementById('server-area')) {
                this.onTap(e);
            }
        });
        
        this.elements.restartBtn.addEventListener('click', () => this.restart());
        
        // ゲームループ開始
        this.lastTime = performance.now();
        this.gameLoop();
        
        // 初期ログ
        this.addLog('[BOOT] Server initializing...', 'info');
        setTimeout(() => this.addLog('[BOOT] System ready', 'info'), 500);
    }
    
    onTap(e) {
        if (this.state === 'crashed' || this.state === 'crashing') return;
        
        if (this.state === 'ready') {
            this.state = 'playing';
            this.startTime = performance.now();
            this.elements.tapHint.style.display = 'none';
        }
        
        // 負荷追加
        this.stress += this.params.stressPerTap * (1 + RandomMaster.range(-0.3, 0.3));
        this.tapCount++;
        
        // サウンド
        this.sound.tap();
        
        // ログ追加（確率）
        if (RandomMaster.chance(20)) {
            this.addLog(this.log.generate('normal'), 'info');
        }
        
        // 崩壊チェック
        this.checkCrash();
    }
    
    checkCrash() {
        const cond = this.crashCondition;
        let shouldCrash = false;
        
        switch(cond.type) {
            case 'stress':
                shouldCrash = this.stress >= cond.threshold;
                break;
            case 'cpu_mem':
                const cpu = this.params.cpuBase + this.stress * this.params.cpuMultiplier;
                const mem = this.params.memBase + this.stress * this.params.memMultiplier * 100;
                shouldCrash = cpu >= cond.cpuThreshold && mem >= cond.memThreshold;
                break;
            case 'net_spike':
                const net = this.params.netBase + this.stress * this.params.netMultiplier * 10;
                shouldCrash = net >= cond.threshold;
                break;
            case 'tap_count':
                shouldCrash = this.tapCount >= cond.count;
                break;
            case 'random_death':
                shouldCrash = this.stress > 30 && RandomMaster.chance(cond.chance);
                break;
            case 'time_bomb':
                const elapsed = (performance.now() - this.startTime) / 1000;
                shouldCrash = elapsed >= cond.time && this.stress > 20;
                break;
        }
        
        if (shouldCrash) {
            this.triggerCrash();
        }
    }
    
    triggerCrash() {
        this.state = 'crashing';
        
        // クラッシュタイプ選択
        const crashTypes = ['explosion', 'freeze', 'scatter', 'bsod', 'vanish', 'meltdown'];
        this.crashType = RandomMaster.pick(crashTypes);
        this.crashProgress = 0;
        
        // エラーログ連発
        for (let i = 0; i < RandomMaster.int(3, 6); i++) {
            setTimeout(() => {
                this.addLog(this.log.generate('error'), 'error');
            }, i * 100);
        }
        
        // 警告音 or 無音
        if (RandomMaster.chance(70)) {
            this.sound.warning();
        }
        
        // 少し遅れてクラッシュサウンド
        setTimeout(() => {
            this.sound.crashSound();
        }, 300);
        
        // クラッシュアニメーション後にオーバーレイ表示
        setTimeout(() => this.showCrashScreen(), 1500);
    }
    
    showCrashScreen() {
        this.state = 'crashed';
        this.crashCount++;
        localStorage.setItem('crashCount', this.crashCount.toString());
        this.elements.crashCountEl.textContent = this.crashCount;
        
        // クラッシュタイトル
        const titles = [
            'SERVER DOWN',
            '*** CRASH ***',
            'SYSTEM FAILURE',
            'FATAL ERROR',
            'KERNEL PANIC',
            'GOODBYE',
            '(´;ω;`)',
            'お疲れ様でした',
            'また会おう',
            'ERROR 500',
        ];
        this.elements.crashTitle.textContent = RandomMaster.pick(titles);
        
        // クラッシュメッセージ
        this.elements.crashMessage.textContent = this.log.generateCrashDump();
        
        // スコア計算
        const elapsed = ((performance.now() - this.startTime) / 1000).toFixed(1);
        const indicators = this.countDangerIndicators();
        const artScore = RandomMaster.int(0, 999);
        
        this.elements.crashStats.innerHTML = `
            SURVIVAL: ${elapsed}s<br>
            DANGER INDICATORS: ${indicators}<br>
            ART SCORE: ${artScore}
        `;
        this.elements.artScore.textContent = artScore;
        
        // オーバーレイ表示
        this.elements.crashOverlay.classList.remove('hidden');
        
        // BSOD特殊演出
        if (this.crashType === 'bsod') {
            this.elements.crashOverlay.classList.add('bsod');
        } else {
            this.elements.crashOverlay.classList.remove('bsod');
        }
    }
    
    countDangerIndicators() {
        let count = 0;
        if (this.stress > 50) count++;
        if (this.stress > 70) count++;
        if (this.stress > 90) count++;
        if (this.tapCount > 30) count++;
        return count;
    }
    
    restart() {
        // 状態リセット
        this.state = 'ready';
        this.stress = 0;
        this.tapCount = 0;
        this.crashProgress = 0;
        
        // 新しいパラメータ
        this.params = this.generateParams();
        this.crashCondition = this.generateCrashCondition();
        
        // レンダラーリセット
        this.renderer.reset();
        
        // UI リセット
        this.elements.crashOverlay.classList.add('hidden');
        this.elements.tapHint.style.display = 'block';
        this.elements.logContent.innerHTML = '';
        this.elements.timeScore.textContent = '0.0s';
        
        // 初期ログ
        this.addLog('[REBOOT] Initializing...', 'info');
        setTimeout(() => this.addLog('[BOOT] System ready', 'info'), 500);
    }
    
    addLog(message, type = 'info') {
        const line = document.createElement('div');
        line.className = `log-line ${type}`;
        line.textContent = `${this.getTimestamp()} ${message}`;
        this.elements.logContent.appendChild(line);
        this.elements.logContent.scrollTop = this.elements.logContent.scrollHeight;
        
        // 古いログを削除
        while (this.elements.logContent.children.length > 50) {
            this.elements.logContent.removeChild(this.elements.logContent.firstChild);
        }
    }
    
    getTimestamp() {
        const now = new Date();
        return `[${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}]`;
    }
    
    updateMeters() {
        // CPU
        const cpu = Math.min(300, this.params.cpuBase + this.stress * this.params.cpuMultiplier);
        const cpuPercent = Math.min(100, cpu / 3);
        this.updateMeter('cpu', cpuPercent, `${Math.round(cpu)}%`);
        
        // Memory
        const mem = Math.min(32000, this.params.memBase + this.stress * this.params.memMultiplier * 100);
        const memPercent = Math.min(100, (mem / 32000) * 100);
        const memDisplay = mem > 1000 ? `${(mem/1000).toFixed(1)}GB` : `${Math.round(mem)}MB`;
        this.updateMeter('mem', memPercent, memDisplay);
        
        // Network（たまにスパイク）
        let net = this.params.netBase + this.stress * this.params.netMultiplier * 10;
        if (this.params.netSpike && this.stress > 50 && RandomMaster.chance(5)) {
            net += RandomMaster.range(1000, 3000);
        }
        net = Math.min(5000, net);
        const netPercent = Math.min(100, (net / 5000) * 100);
        this.updateMeter('net', netPercent, `${Math.round(net)}ms`);
        
        // Disk（不安定）
        let diskStatus = 'OK';
        let diskPercent = 20 + this.stress * 0.5;
        
        if (this.stress > 60 && RandomMaster.chance(10)) {
            diskStatus = RandomMaster.pick(['BUSY', 'SLOW', '???', 'ERR']);
            diskPercent = RandomMaster.range(60, 100);
        }
        this.updateMeter('disk', Math.min(100, diskPercent), diskStatus);
    }
    
    updateMeter(name, percent, value) {
        const meter = this.elements[`${name}Meter`];
        const valueEl = this.elements[`${name}Value`];
        
        meter.style.width = `${percent}%`;
        valueEl.textContent = value;
        
        // 色クラス
        meter.classList.remove('warning', 'danger');
        valueEl.classList.remove('warning', 'danger');
        
        if (percent > 80) {
            meter.classList.add('danger');
            valueEl.classList.add('danger');
        } else if (percent > 50) {
            meter.classList.add('warning');
            valueEl.classList.add('warning');
        }
    }
    
    gameLoop() {
        const now = performance.now();
        const delta = (now - this.lastTime) / 1000;
        this.lastTime = now;
        
        if (this.state === 'playing') {
            // ストレス減衰
            this.stress = Math.max(0, this.stress - this.params.decayRate * delta * 10);
            
            // メーター更新
            this.updateMeters();
            
            // 時間スコア
            const elapsed = ((now - this.startTime) / 1000).toFixed(1);
            this.elements.timeScore.textContent = `${elapsed}s`;
            
            // ランダムログ
            if (RandomMaster.chance(0.5)) {
                const logType = this.stress > 70 ? 'warning' : 
                               this.stress > 50 ? (RandomMaster.chance(50) ? 'warning' : 'normal') :
                               'normal';
                this.addLog(this.log.generate(logType, {
                    cpu: Math.round(this.params.cpuBase + this.stress * this.params.cpuMultiplier),
                    mem: Math.round(this.params.memBase + this.stress * this.params.memMultiplier * 100)
                }), logType === 'warning' ? 'warn' : 'info');
            }
            
            // サーバー描画
            this.renderer.drawServer(this.stress);
            
            // 警告音
            if (this.stress > 80 && RandomMaster.chance(2)) {
                this.sound.warning();
            }
            
            // ストレス上昇時のサウンド
            if (this.stress > 50) {
                this.sound.stress(this.stress);
            }
            
        } else if (this.state === 'crashing') {
            // クラッシュアニメーション
            this.crashProgress = Math.min(1, this.crashProgress + delta);
            this.renderer.drawCrashEffect(this.crashType, this.crashProgress);
            
        } else if (this.state === 'ready') {
            // 待機中
            this.renderer.drawServer(0);
        }
        
        requestAnimationFrame(() => this.gameLoop());
    }
}

// ゲーム開始
window.addEventListener('DOMContentLoaded', () => {
    new ServerCollapseGame();
});
