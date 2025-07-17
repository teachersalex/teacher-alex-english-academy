// ===== SISTEMA DE CSS MODULAR - CARREGAMENTO INTELIGENTE =====

class CSSModuleLoader {
    constructor() {
        this.loadedModules = new Set();
        this.baseLoaded = false;
        this.loadBase();
    }

    // Carrega CSS base (sempre necessário)
    loadBase() {
        if (this.baseLoaded) return;
        
        const baseCss = `
            /* CORE VARIABLES */
            :root {
                --dark: #1f1f20; --blue-dark: #2b4c7e; --blue-medium: #567ebb;
                --blue-gray: #606d80; --light-gray: #dce0e6; --success: #10b981;
                --error: #ef4444; --warning: #f59e0b; --radius: 8px; --radius-large: 12px;
                --shadow: 0 4px 6px rgba(0, 0, 0, 0.1); --transition: 0.3s ease;
            }
            
            /* UNIVERSAL LAYOUT */
            body { background: linear-gradient(135deg, var(--light-gray), #f8fafc); min-height: 100vh; }
            .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
            
            /* HEADERS */
            .header { background: white; border-radius: var(--radius-large); padding: 30px; margin-bottom: 30px; box-shadow: var(--shadow); text-align: center; }
            .logo { background: linear-gradient(45deg, var(--blue-dark), var(--blue-medium)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 2.2rem; font-weight: 800; margin-bottom: 10px; }
            
            /* UNIVERSAL BUTTONS */
            .btn { background: linear-gradient(45deg, var(--blue-dark), var(--blue-medium)); color: white; border: none; padding: 12px 20px; border-radius: var(--radius); font-weight: 600; cursor: pointer; transition: var(--transition); text-decoration: none; display: inline-block; text-align: center; }
            .btn:hover { transform: translateY(-2px); box-shadow: var(--shadow); }
            .btn-secondary { background: var(--blue-gray); }
            
            /* UNIVERSAL CARDS */
            .card { background: white; border-radius: var(--radius-large); padding: 25px; box-shadow: var(--shadow); transition: var(--transition); cursor: pointer; }
            .card:hover { transform: translateY(-4px); box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15); }
            
            /* USER WIDGET */
            .user-widget { position: fixed; top: 20px; right: 20px; background: white; padding: 12px 20px; border-radius: 25px; box-shadow: var(--shadow); display: flex; align-items: center; gap: 12px; z-index: 1000; }
            .user-avatar { width: 35px; height: 35px; background: linear-gradient(45deg, var(--blue-dark), var(--blue-medium)); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; }
            .logout-btn { background: var(--error); color: white; border: none; padding: 6px 12px; border-radius: var(--radius); cursor: pointer; transition: var(--transition); }
            
            /* MOBILE */
            @media (max-width: 768px) {
                .container { padding: 15px; }
                .logo { font-size: 1.8rem; }
                .user-widget { position: relative; top: auto; right: auto; margin-bottom: 20px; }
            }
        `;
        
        this.injectCSS(baseCss, 'css-base');
        this.baseLoaded = true;
        console.log('✅ CSS Base carregado');
    }

    // Carrega módulo de Dashboard (só index.html)
    loadDashboard() {
        if (this.loadedModules.has('dashboard')) return;
        
        const dashboardCss = `
            .stats-dashboard { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 25px; margin-bottom: 50px; }
            .stat-card { background: white; border-radius: var(--radius-large); padding: 30px 25px; box-shadow: var(--shadow); display: flex; align-items: center; gap: 20px; transition: var(--transition); }
            .stat-card:hover { transform: translateY(-8px); }
            .stat-number { font-size: 2.8rem; font-weight: 900; background: linear-gradient(45deg, var(--blue-dark), var(--blue-medium)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
            .stat-icon { font-size: 3rem; opacity: 0.9; }
            .stat-label { color: var(--blue-gray); font-size: 1rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px; }
            
            @media (max-width: 768px) {
                .stats-dashboard { grid-template-columns: repeat(2, 1fr); gap: 20px; }
                .stat-card { flex-direction: column; text-align: center; }
            }
        `;
        
        this.injectCSS(dashboardCss, 'css-dashboard');
        this.loadedModules.add('dashboard');
        console.log('✅ CSS Dashboard carregado');
    }

    // Carrega módulo de Hubs (páginas de hub)
    loadHubs() {
        if (this.loadedModules.has('hubs')) return;
        
        const hubsCss = `
            .hubs-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 25px; }
            .hub-card { background: white; border-radius: var(--radius-large); padding: 25px; box-shadow: var(--shadow); transition: var(--transition); cursor: pointer; }
            .hub-card:hover { transform: translateY(-8px); }
            .hub-title-card { color: var(--blue-dark); font-size: 1.4rem; font-weight: 700; margin: 0 0 10px 0; }
            .hub-description { color: var(--blue-gray); font-size: 1rem; line-height: 1.6; }
            .hub-features { list-style: none; padding: 0; margin: 20px 0; }
            .hub-features li { padding: 8px 0; color: var(--dark); position: relative; padding-left: 25px; }
            .hub-features li:before { content: "✓"; position: absolute; left: 0; color: var(--blue-medium); font-weight: bold; }
            .hub-button { width: 100%; background: linear-gradient(45deg, var(--blue-dark), var(--blue-medium)); color: white; border: none; padding: 15px 24px; border-radius: var(--radius); font-weight: 600; cursor: pointer; transition: var(--transition); }
            
            @media (max-width: 768px) {
                .hubs-grid { grid-template-columns: 1fr; }
            }
        `;
        
        this.injectCSS(hubsCss, 'css-hubs');
        this.loadedModules.add('hubs');
        console.log('✅ CSS Hubs carregado');
    }

    // Carrega módulo de Questions (páginas de quiz)
    loadQuestions() {
        if (this.loadedModules.has('questions')) return;
        
        const questionsCss = `
            .question { background: white; border-radius: var(--radius-large); padding: 25px; margin-bottom: 20px; box-shadow: var(--shadow); }
            .question-text { font-size: 1.2rem; color: var(--blue-dark); font-weight: 600; margin-bottom: 20px; }
            .options { display: grid; gap: 10px; }
            .option { display: flex; align-items: center; padding: 15px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: var(--radius); cursor: pointer; transition: var(--transition); }
            .option:hover { border-color: var(--blue-medium); background: white; }
            .option.selected { border-color: var(--blue-dark); background: rgba(30, 58, 138, 0.1); }
            .option.correct-answer { background: rgba(16, 185, 129, 0.1); border-color: var(--success); }
            .option.wrong-answer { background: rgba(239, 68, 68, 0.1); border-color: var(--error); }
            .option label { font-weight: 500; cursor: pointer; flex: 1; }
            .controls { display: flex; justify-content: center; gap: 15px; flex-wrap: wrap; }
            
            @media (max-width: 768px) {
                .controls { flex-direction: column; align-items: center; }
                .btn { width: 100%; max-width: 300px; }
            }
        `;
        
        this.injectCSS(questionsCss, 'css-questions');
        this.loadedModules.add('questions');
        console.log('✅ CSS Questions carregado');
    }

    // Carrega módulo de Chapters (páginas de histórias)
    loadChapters() {
        if (this.loadedModules.has('chapters')) return;
        
        const chaptersCss = `
            .chapter-navigation { background: white; border-radius: var(--radius-large); padding: 25px; margin-bottom: 30px; box-shadow: var(--shadow); }
            .chapter-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; }
            .chapter-card { background: white; border: 2px solid #e2e8f0; border-radius: var(--radius); padding: 20px; cursor: pointer; transition: var(--transition); text-align: center; }
            .chapter-card:hover { transform: translateY(-4px); border-color: var(--blue-medium); }
            .chapter-card.active { background: linear-gradient(135deg, #fefce8, #fef3c7); border-color: var(--warning); }
            .chapter-card.completed { background: linear-gradient(135deg, #f0f9ff, #e0f2fe); border-color: var(--success); }
            .chapter-icon { font-size: 2rem; margin-bottom: 10px; }
            .chapter-number { font-size: 1.1rem; font-weight: 600; color: var(--blue-dark); margin-bottom: 5px; }
            .chapter-name { font-size: 1rem; color: var(--blue-gray); font-weight: 500; }
            
            @media (max-width: 768px) {
                .chapter-cards { grid-template-columns: 1fr; }
            }
        `;
        
        this.injectCSS(chaptersCss, 'css-chapters');
        this.loadedModules.add('chapters');
        console.log('✅ CSS Chapters carregado');
    }

    // Carrega módulo de Progress (badges, progress bars)
    loadProgress() {
        if (this.loadedModules.has('progress')) return;
        
        const progressCss = `
            .progress-bar { width: 100%; height: 10px; background: var(--light-gray); border-radius: var(--radius); overflow: hidden; margin: 15px 0; }
            .progress-fill { height: 100%; background: var(--blue-medium); transition: width 1s ease; }
            .badges { display: flex; justify-content: center; gap: 10px; flex-wrap: wrap; }
            .badge { background: var(--light-gray); border: 1px solid var(--blue-gray); border-radius: 20px; padding: 8px 15px; font-size: 0.9rem; font-weight: 600; transition: var(--transition); }
            .badge.earned { background: var(--success); color: white; border-color: var(--success); }
            .progress-section { background: white; border-radius: var(--radius-large); padding: 20px; margin-bottom: 25px; box-shadow: var(--shadow); }
        `;
        
        this.injectCSS(progressCss, 'css-progress');
        this.loadedModules.add('progress');
        console.log('✅ CSS Progress carregado');
    }

    // Carrega módulo de Audio (controles de áudio)
    loadAudio() {
        if (this.loadedModules.has('audio')) return;
        
        const audioCss = `
            .audio-section { background: white; border-radius: var(--radius-large); padding: 30px; margin-bottom: 25px; box-shadow: var(--shadow); text-align: center; }
            .audio-title { font-size: 1.4rem; color: var(--blue-dark); margin-bottom: 20px; font-weight: 700; }
            .play-buttons { display: flex; justify-content: center; gap: 15px; flex-wrap: wrap; }
            audio { width: 100%; max-width: 500px; margin-bottom: 20px; }
        `;
        
        this.injectCSS(audioCss, 'css-audio');
        this.loadedModules.add('audio');
        console.log('✅ CSS Audio carregado');
    }

    // Injeta CSS no documento
    injectCSS(css, id) {
        const style = document.createElement('style');
        style.id = id;
        style.textContent = css;
        document.head.appendChild(style);
    }

    // Carrega múltiplos módulos
    loadModules(modules) {
        modules.forEach(module => {
            switch(module) {
                case 'dashboard': this.loadDashboard(); break;
                case 'hubs': this.loadHubs(); break;
                case 'questions': this.loadQuestions(); break;
                case 'chapters': this.loadChapters(); break;
                case 'progress': this.loadProgress(); break;
                case 'audio': this.loadAudio(); break;
                default: console.warn(`Módulo desconhecido: ${module}`);
            }
        });
    }
}

// ===== AUTO-DETECT E CARREGAMENTO INTELIGENTE =====
document.addEventListener('DOMContentLoaded', function() {
    const cssLoader = new CSSModuleLoader();
    const modules = [];
    
    // Detecta qual página está carregando
    const path = window.location.pathname;
    
    // Auto-detect baseado no conteúdo da página
    if (document.querySelector('.stats-dashboard')) modules.push('dashboard');
    if (document.querySelector('.hubs-grid')) modules.push('hubs');
    if (document.querySelector('.questions-section')) modules.push('questions');
    if (document.querySelector('.chapter-navigation')) modules.push('chapters');
    if (document.querySelector('.progress-bar, .badges')) modules.push('progress');
    if (document.querySelector('.audio-section')) modules.push('audio');
    
    // Carrega módulos detectados
    if (modules.length > 0) {
        cssLoader.loadModules(modules);
        console.log(`🎯 Módulos carregados: ${modules.join(', ')}`);
    }
    
    // Disponibiliza globalmente para uso manual
    window.cssLoader = cssLoader;
});

// ===== USAGE EXAMPLES =====
// Carregamento manual se necessário:
// window.cssLoader.loadModules(['dashboard', 'hubs']);
// window.cssLoader.loadQuestions();
// window.cssLoader.loadChapters();