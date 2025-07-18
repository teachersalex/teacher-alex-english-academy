// ===== UNIVERSAL LISTENING SYSTEM - VERSÃO FINAL CORRIGIDA =====
// 📁 Arquivo: src/scripts/core/universal-listening.js
// 🔧 FIXES: Timing + Questões garantidas + Anti-travamento + Debug

(function() {
    'use strict';
    
    console.log('🎓 Universal Listening System v2.1 carregando...');
    
    // ===== UNIVERSAL PROGRESS SYSTEM =====
    class UniversalStudentProgress {
        constructor() {
            this.studentId = sessionStorage.getItem('studentUsername') || 'student';
            this.progressKey = `progress_${this.studentId}`;
            this.init();
        }

        init() {
            console.log('📊 Inicializando sistema de progresso para:', this.studentId);
            this.loadProgress();
            this.ensureAllStructures();
        }

        loadProgress() {
            const saved = localStorage.getItem(this.progressKey);
            if (saved) {
                try {
                    this.data = JSON.parse(saved);
                    console.log('✅ Progresso existente carregado');
                } catch (e) {
                    console.error('❌ Erro ao ler progresso:', e);
                    this.data = {};
                }
            } else {
                this.data = {};
                console.log('🆕 Criando novo progresso');
            }
        }

        ensureAllStructures() {
            let updated = false;

            // ===== LISTENING BASE =====
            if (!this.data.listening) {
                this.data.listening = {
                    lessonsCompleted: [],
                    bestScores: {},
                    badges: [],
                    lastAccessed: Date.now()
                };
                updated = true;
            }

            // ===== ESTRUTURAS POR NÍVEL =====
            const levels = ['foundation', 'beginner', 'intermediate', 'advanced'];
            levels.forEach(level => {
                const key = `${level}Lessons`;
                if (!this.data.listening[key]) {
                    this.data.listening[key] = {
                        completed: [],
                        scores: {},
                        badges: []
                    };
                    updated = true;
                }
            });

            // ===== ADVANCED (formato especial) =====
            if (!this.data.listening.advancedLessons) {
                this.data.listening.advancedLessons = {
                    completed: [],
                    scores: {},
                    badges: []
                };
                updated = true;
            }

            // ===== OUTRAS SEÇÕES =====
            const sections = ['reading', 'roommate', 'neighbor'];
            sections.forEach(section => {
                if (!this.data[section]) {
                    this.data[section] = {
                        chaptersCompleted: [],
                        bestScores: {},
                        badges: [],
                        lastAccessed: Date.now()
                    };
                    updated = true;
                }
            });

            // ===== CAMPOS GLOBAIS =====
            if (!this.data.globalBadges) {
                this.data.globalBadges = [];
                updated = true;
            }

            if (!this.data.totalStudyTime) {
                this.data.totalStudyTime = 0;
                updated = true;
            }

            if (updated) {
                this.saveProgress();
                console.log('✅ Estruturas criadas/atualizadas');
            }
        }

        saveProgress() {
            try {
                localStorage.setItem(this.progressKey, JSON.stringify(this.data));
                console.log('💾 Progresso salvo');
            } catch (e) {
                console.error('❌ Erro ao salvar:', e);
            }
        }

        // ===== COMPLETAR LIÇÃO - MÉTODO UNIVERSAL =====
        completeListeningLesson(level, lessonNumber, score, timeSpent = 0) {
            console.log(`🎯 Salvando: ${level} lição ${lessonNumber}, pontuação: ${score}`);

            // Lista geral
            const generalLessonId = `${level}_lesson_${lessonNumber}`;
            
            if (!this.data.listening.lessonsCompleted.includes(generalLessonId)) {
                this.data.listening.lessonsCompleted.push(generalLessonId);
            }
            
            this.data.listening.bestScores[generalLessonId] = Math.max(
                this.data.listening.bestScores[generalLessonId] || 0, 
                score
            );
            
            // Estrutura específica do nível
            const levelKey = `${level}Lessons`;
            if (this.data.listening[levelKey]) {
                const levelLessonId = `lesson_${lessonNumber}`;
                
                if (!this.data.listening[levelKey].completed.includes(levelLessonId)) {
                    this.data.listening[levelKey].completed.push(levelLessonId);
                }
                
                this.data.listening[levelKey].scores[levelLessonId] = Math.max(
                    this.data.listening[levelKey].scores[levelLessonId] || 0,
                    score
                );
            }

            // Caso especial advanced
            if (level === 'advanced') {
                const advancedLessonId = `advanced_${lessonNumber}`;
                if (!this.data.listening.advancedLessons.completed.includes(advancedLessonId)) {
                    this.data.listening.advancedLessons.completed.push(advancedLessonId);
                }
                this.data.listening.advancedLessons.scores[advancedLessonId] = Math.max(
                    this.data.listening.advancedLessons.scores[advancedLessonId] || 0,
                    score
                );
            }
            
            // Tempo e badges
            this.data.totalStudyTime += timeSpent;
            this.checkListeningBadges(level, lessonNumber, score);
            
            this.saveProgress();
            this.triggerUpdate();
            
            console.log(`✅ Lição salva: ${generalLessonId}`);
        }

        checkListeningBadges(level, lessonNumber, score) {
            const badges = this.data.listening.badges;
            
            // Primeira lição
            if (!badges.includes('first_listening_lesson')) {
                badges.push('first_listening_lesson');
                this.showBadge('🎯 Primeira Lição!', 'Listening desbloqueado!');
            }
            
            // Pontuação perfeita
            if (score === 5 && !badges.includes('perfect_listening_lesson')) {
                badges.push('perfect_listening_lesson');
                this.showBadge('🏆 Pontuação Perfeita!', 'Excelente trabalho!');
            }
            
            // Master do nível
            const levelBadgeId = `${level}_master`;
            const levelCompleted = this.data.listening.lessonsCompleted.filter(l => l.startsWith(level)).length;
            
            if (levelCompleted >= 3 && !badges.includes(levelBadgeId)) {
                badges.push(levelBadgeId);
                this.showBadge(`🔥 ${level.charAt(0).toUpperCase() + level.slice(1)} Master!`, `Nível ${level} dominado!`);
            }
        }

        showBadge(title, message) {
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                background: linear-gradient(45deg, var(--blue-dark), var(--blue-medium)); 
                color: white; padding: 25px 35px; border-radius: 20px; z-index: 10000; 
                text-align: center; box-shadow: 0 15px 40px rgba(0,0,0,0.3);
                animation: badgeShow 3s ease-in-out forwards;
            `;
            notification.innerHTML = `
                <div style="font-size: 1.8em; font-weight: bold; margin-bottom: 15px;">${title}</div>
                <div style="font-size: 1.1em;">${message}</div>
            `;
            document.body.appendChild(notification);
            setTimeout(() => { 
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification); 
                }
            }, 3000);
        }

        triggerUpdate() {
            // Atualiza cards se função existir
            if (typeof window.updateLessonCards === 'function') {
                window.updateLessonCards();
            }
            
            // Evento para dashboard
            window.dispatchEvent(new CustomEvent('progressUpdated', { 
                detail: { section: 'listening', data: this.data } 
            }));
        }

        // ===== DEBUG =====
        debugProgress() {
            console.log('🔍 DEBUG PROGRESSO:');
            console.log('Aluno:', this.studentId);
            console.log('Dados:', this.data);
            console.log('Lições Listening:', this.data.listening?.lessonsCompleted || []);
            return this.data;
        }
    }

    // ===== 🔧 VERIFICAR QUESTÕES - MELHORADO =====
    function ensureQuestionsLoad(questionsData, currentLesson) {
        console.log(`🔍 Verificando questões para lição: ${currentLesson}`);
        
        if (!questionsData) {
            console.error('❌ ERRO: Dados de questões não encontrados!');
            return false;
        }
        
        if (!questionsData[currentLesson]) {
            console.error(`❌ ERRO: Lição ${currentLesson} não existe!`);
            console.log('📋 Lições disponíveis:', Object.keys(questionsData));
            return false;
        }
        
        if (!questionsData[currentLesson].questions) {
            console.error(`❌ ERRO: Questões da lição ${currentLesson} não encontradas!`);
            return false;
        }
        
        console.log(`✅ Questões verificadas para lição ${currentLesson}`);
        return true;
    }

    // ===== 🔧 INICIALIZAR SISTEMA - MELHORADO =====
    function initializeUniversalListening(levelName) {
        console.log(`🎧 Inicializando sistema para: ${levelName}`);
        
        // 1. Verificar login
        if (sessionStorage.getItem('studentLoggedIn') !== 'true') {
            console.error('❌ Usuário não logado');
            window.location.href = '../auth/login.html';
            return false;
        }
        
        // 2. Criar sistema de progresso SE NÃO EXISTIR
        if (!window.studentProgress) {
            window.studentProgress = new UniversalStudentProgress();
            console.log('✅ Sistema de progresso criado');
        } else {
            console.log('✅ Sistema de progresso já existe');
        }
        
        // 3. Atualizar info do usuário
        const studentName = sessionStorage.getItem('studentUsername') || 'Student';
        const userNameEl = document.getElementById('userName') || document.querySelector('[data-user-name]');
        const userAvatarEl = document.getElementById('userAvatar') || document.querySelector('[data-user-avatar]');
        
        if (userNameEl) {
            userNameEl.textContent = studentName.charAt(0).toUpperCase() + studentName.slice(1).toLowerCase();
        }
        if (userAvatarEl) {
            userAvatarEl.textContent = studentName.charAt(0).toUpperCase();
        }
        
        console.log(`✅ Sistema inicializado para ${levelName}`);
        console.log(`👤 Aluno: ${studentName}`);
        
        return true;
    }

    // ===== 🔧 AUTO-INICIALIZAÇÃO INTELIGENTE =====
    function smartAutoStart() {
        // Detecta qual página está carregando
        const path = window.location.pathname;
        let levelName = 'unknown';
        
        if (path.includes('foundation.html')) levelName = 'foundation';
        else if (path.includes('beginner.html')) levelName = 'beginner';
        else if (path.includes('intermediate.html')) levelName = 'intermediate';
        else if (path.includes('advanced.html')) levelName = 'advanced';
        else if (path.includes('listening-hub.html')) levelName = 'hub';
        
        console.log(`🔍 Página detectada: ${levelName} (${path})`);
        
        // Só inicializa em páginas listening ou hub
        if (levelName === 'unknown') {
            console.log('ℹ️ Não é uma página de listening, sistema não será iniciado');
            return;
        }
        
        // Inicializa sistema
        const success = initializeUniversalListening(levelName);
        
        if (success) {
            console.log('🎉 Sistema universal inicializado!');
            
            // Dispara evento de sistema pronto
            window.dispatchEvent(new CustomEvent('universalListeningReady', {
                detail: { level: levelName }
            }));
        } else {
            console.error('❌ Falha na inicialização do sistema');
        }
    }

    // ===== FUNÇÕES GLOBAIS =====
    window.UniversalStudentProgress = UniversalStudentProgress;
    window.ensureQuestionsLoad = ensureQuestionsLoad;
    window.initializeUniversalListening = initializeUniversalListening;
    
    // Função de debug global
    window.debugListening = function() {
        console.log('🔍 SISTEMA UNIVERSAL DEBUG:');
        
        if (window.studentProgress) {
            console.log('✅ Sistema ativo');
            return window.studentProgress.debugProgress();
        } else {
            console.error('❌ Sistema não inicializado!');
            
            console.log('🔍 Verificando questões globais:');
            ['foundationLessons', 'beginnerLessons', 'intermediateLessons', 'advancedLessons'].forEach(varName => {
                console.log(`${varName}:`, window[varName] ? '✅' : '❌');
            });
            
            return null;
        }
    };
    
    // Função para forçar re-inicialização
    window.retryListeningSystem = function() {
        console.log('🔄 Forçando re-inicialização...');
        smartAutoStart();
    };
    
    // ===== CSS para animações =====
    const style = document.createElement('style');
    style.textContent = `
        @keyframes badgeShow {
            0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
            20% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
            80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            100% { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
        }
    `;
    document.head.appendChild(style);
    
    // ===== 🔧 INICIAR AUTOMATICAMENTE - OTIMIZADO =====
    function startWhenReady() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                console.log('📄 DOM carregado, iniciando sistema...');
                setTimeout(smartAutoStart, 100);
            });
        } else {
            console.log('📄 DOM já pronto, iniciando sistema...');
            setTimeout(smartAutoStart, 100);
        }
    }
    
    // Inicia quando script carrega
    startWhenReady();
    
    console.log('🎓 Universal Listening System v2.1 carregado!');
    console.log('🔧 Fixes aplicados: Timing + Anti-travamento + Fallbacks');
    console.log('💾 Sistema de progresso unificado');
    console.log('🎯 Debug: use debugListening() no console');
    console.log('🔄 Retry: use retryListeningSystem() no console');
    
})();
