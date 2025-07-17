// ===== 🎧 SPEED CONTROLS UNIVERSAL - CORE SCRIPT =====
// Arquivo: src/scripts/core/speed-controls.js
// Versão: 1.0 - Auto-inicialização inteligente

(function() {
    'use strict';
    
    // ===== CSS AUTO-INJECTION =====
    function injectCSS() {
        const cssId = 'teacher-alex-speed-controls';
        if (document.getElementById(cssId)) return; // Já injetado
        
        const css = `
            /* 🎧 TEACHER ALEX - SPEED CONTROLS UNIVERSAL */
            .speed-controls {
                display: flex;
                justify-content: center;
                gap: 0.75rem;
                flex-wrap: wrap;
                margin-top: 1rem;
                padding: 0.5rem;
                background: rgba(255, 255, 255, 0.03);
                border-radius: 12px;
                border: 1px solid rgba(86, 126, 187, 0.1);
            }
            
            .speed-btn {
                padding: 0.5rem 1rem;
                border: 2px solid var(--gray-200, #e5e7eb);
                border-radius: var(--radius, 8px);
                background: white;
                color: var(--blue-gray, #606d80);
                font-weight: 600;
                font-size: 0.85rem;
                cursor: pointer;
                transition: all 0.3s ease;
                min-width: 60px;
                text-align: center;
                user-select: none;
                position: relative;
                overflow: hidden;
            }
            
            .speed-btn::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
                transition: left 0.5s;
            }
            
            .speed-btn.active,
            .speed-btn:hover {
                border-color: var(--blue-medium, #567ebb);
                background: var(--blue-medium, #567ebb);
                color: white;
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(86, 126, 187, 0.4);
            }
            
            .speed-btn.active::before,
            .speed-btn:hover::before {
                left: 100%;
            }
            
            .speed-btn:active {
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(86, 126, 187, 0.3);
            }
            
            .speed-feedback {
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, var(--blue-medium, #567ebb), var(--blue-dark, #2b4c7e));
                color: white;
                padding: 10px 20px;
                border-radius: 25px;
                font-weight: 700;
                font-size: 0.9rem;
                z-index: 10000;
                animation: speedFeedbackAnimation 2s ease-out forwards;
                box-shadow: 0 8px 25px rgba(43, 76, 126, 0.4);
                backdrop-filter: blur(10px);
            }
            
            @keyframes speedFeedbackAnimation {
                0% { 
                    opacity: 0; 
                    transform: translateX(100px) scale(0.8); 
                }
                15% { 
                    opacity: 1; 
                    transform: translateX(0) scale(1.1); 
                }
                85% { 
                    opacity: 1; 
                    transform: translateX(0) scale(1); 
                }
                100% { 
                    opacity: 0; 
                    transform: translateX(-50px) scale(0.9); 
                }
            }
            
            @media (max-width: 768px) {
                .speed-controls {
                    gap: 0.5rem;
                    padding: 0.3rem;
                }
                
                .speed-btn {
                    min-width: 50px;
                    padding: 0.4rem 0.8rem;
                    font-size: 0.8rem;
                }
                
                .speed-feedback {
                    top: 10px;
                    right: 10px;
                    padding: 8px 16px;
                    font-size: 0.8rem;
                }
            }
        `;
        
        const style = document.createElement('style');
        style.id = cssId;
        style.textContent = css;
        document.head.appendChild(style);
        
        console.log('🎨 Speed Controls CSS injetado!');
    }
    
    // ===== SPEED CONTROLS MANAGER =====
    class SpeedControlsManager {
        constructor() {
            this.audioElement = null;
            this.currentSpeed = 1;
            this.initialized = false;
            this.init();
        }
        
        init() {
            // Procura elemento de áudio automaticamente
            this.audioElement = document.getElementById('mainAudio') || 
                               document.querySelector('audio') ||
                               document.querySelector('[id*="audio"]');
            
            if (!this.audioElement) {
                console.warn('⚠️ Nenhum elemento de áudio encontrado para speed controls');
                return;
            }
            
            this.createSpeedControls();
            this.attachEventListeners();
            this.initialized = true;
            
            console.log('🎧 Speed Controls Universal inicializados!', {
                audioElement: this.audioElement.id || 'audio-element',
                currentSpeed: this.currentSpeed
            });
        }
        
        createSpeedControls() {
            // Procura container ideal para inserir controles
            const targetContainer = this.findInsertionPoint();
            
            if (!targetContainer) {
                console.warn('⚠️ Container para speed controls não encontrado');
                return;
            }
            
            // Verifica se já existem speed controls
            if (document.querySelector('.speed-controls')) {
                console.log('✅ Speed controls já existem na página');
                return;
            }
            
            // Cria HTML dos speed controls
            const speedControlsHTML = `
                <div class="speed-controls" role="toolbar" aria-label="Controles de Velocidade do Áudio">
                    <button class="speed-btn" data-speed="0.75" aria-label="Velocidade 0.75x">0.75x</button>
                    <button class="speed-btn active" data-speed="1" aria-label="Velocidade normal">1x</button>
                    <button class="speed-btn" data-speed="1.25" aria-label="Velocidade 1.25x">1.25x</button>
                    <button class="speed-btn" data-speed="1.5" aria-label="Velocidade 1.5x">1.5x</button>
                    <button class="speed-btn" data-speed="2" aria-label="Velocidade 2x">2x</button>
                </div>
            `;
            
            // Insere no local ideal
            targetContainer.insertAdjacentHTML('afterend', speedControlsHTML);
            
            console.log('✅ Speed controls HTML criados');
        }
        
        findInsertionPoint() {
            // Prioridade de locais para inserir os controles
            const selectors = [
                '.play-buttons',
                '.audio-controls', 
                '.controls',
                '.chapter-controls',
                'audio + div',
                'audio'
            ];
            
            for (const selector of selectors) {
                const element = document.querySelector(selector);
                if (element) {
                    console.log(`📍 Container encontrado: ${selector}`);
                    return element;
                }
            }
            
            // Fallback: insere após o audio element
            return this.audioElement;
        }
        
        attachEventListeners() {
            // Event delegation para performance
            document.addEventListener('click', (event) => {
                if (event.target.matches('.speed-btn')) {
                    event.preventDefault();
                    const speed = parseFloat(event.target.dataset.speed);
                    this.changeSpeed(speed, event.target);
                }
            });
        }
        
        changeSpeed(speed, buttonElement) {
            if (!this.audioElement) return;
            
            // Atualiza velocidade do áudio
            this.audioElement.playbackRate = speed;
            this.currentSpeed = speed;
            
            // Atualiza UI
            document.querySelectorAll('.speed-btn').forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-pressed', 'false');
            });
            
            buttonElement.classList.add('active');
            buttonElement.setAttribute('aria-pressed', 'true');
            
            // Feedback visual
            this.showSpeedFeedback(speed);
            
            // Log para debug
            console.log(`🎧 Velocidade alterada para: ${speed}x`);
            
            // Dispatch custom event para outras partes do sistema
            window.dispatchEvent(new CustomEvent('speedChanged', { 
                detail: { speed, audioElement: this.audioElement } 
            }));
        }
        
        showSpeedFeedback(speed) {
            // Remove feedback anterior
            const existingFeedback = document.querySelector('.speed-feedback');
            if (existingFeedback) {
                existingFeedback.remove();
            }
            
            // Cria novo feedback
            const feedback = document.createElement('div');
            feedback.className = 'speed-feedback';
            feedback.textContent = `${speed}x`;
            feedback.setAttribute('role', 'status');
            feedback.setAttribute('aria-live', 'polite');
            
            document.body.appendChild(feedback);
            
            // Remove automaticamente
            setTimeout(() => {
                if (feedback.parentNode) {
                    feedback.parentNode.removeChild(feedback);
                }
            }, 2000);
        }
        
        // ===== API PÚBLICA =====
        setSpeed(speed) {
            const button = document.querySelector(`[data-speed="${speed}"]`);
            if (button) {
                this.changeSpeed(speed, button);
                return true;
            }
            return false;
        }
        
        getCurrentSpeed() {
            return this.currentSpeed;
        }
        
        destroy() {
            const speedControls = document.querySelector('.speed-controls');
            if (speedControls) {
                speedControls.remove();
                console.log('🗑️ Speed controls removidos');
            }
        }
        
        reinitialize() {
            this.destroy();
            this.init();
        }
    }
    
    // ===== AUTO INITIALIZATION =====
    function autoInit() {
        // Injeta CSS
        injectCSS();
        
        // Aguarda DOM estar pronto
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initSpeedControls);
        } else {
            initSpeedControls();
        }
    }
    
    function initSpeedControls() {
        // Aguarda um pouco para garantir que outros scripts carregaram
        setTimeout(() => {
            window.TeacherAlexSpeedControls = new SpeedControlsManager();
        }, 500);
    }
    
    // ===== GLOBAL API =====
    window.SpeedControlsManager = SpeedControlsManager;
    
    // Helper functions globais
    window.addSpeedControls = () => {
        if (!window.TeacherAlexSpeedControls) {
            injectCSS();
            window.TeacherAlexSpeedControls = new SpeedControlsManager();
        }
    };
    
    window.removeSpeedControls = () => {
        if (window.TeacherAlexSpeedControls) {
            window.TeacherAlexSpeedControls.destroy();
            window.TeacherAlexSpeedControls = null;
        }
    };
    
    // ===== INICIALIZAÇÃO AUTOMÁTICA =====
    autoInit();
    
    console.log('🎓 Teacher Alex Speed Controls Universal carregado!');
    console.log('📖 Uso: Apenas incluir o script - funciona automaticamente!');
    console.log('🔧 API: window.TeacherAlexSpeedControls.setSpeed(1.5)');
    
})();