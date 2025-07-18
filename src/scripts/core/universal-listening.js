// ===== UNIVERSAL LISTENING SYSTEM FIX =====
// 🔧 Adicione este código no INÍCIO do JavaScript de TODOS os arquivos listening
// (beginner.html, intermediate.html, advanced.html)

// ===== UNIVERSAL PROGRESS SYSTEM - GARANTIA DE ESTRUTURA =====
class UniversalStudentProgress {
    constructor() {
        this.studentId = sessionStorage.getItem('studentUsername') || 'student';
        this.progressKey = `progress_${this.studentId}`;
        this.init();
    }

    init() {
        this.loadProgress();
        this.ensureAllStructures();  // 🔥 CRÍTICO: Garante estruturas sempre
        console.log('✅ Universal Progress System initialized for:', this.studentId);
    }

    loadProgress() {
        const saved = localStorage.getItem(this.progressKey);
        if (saved) {
            try {
                this.data = JSON.parse(saved);
            } catch (e) {
                console.error('❌ Error parsing progress data:', e);
                this.data = {};
            }
        } else {
            this.data = {};
        }
    }

    ensureAllStructures() {
        // 🔥 CRÍTICO: Cria TODAS as estruturas necessárias
        let updated = false;

        // Estrutura base universal
        if (!this.data.listening) {
            this.data.listening = {
                lessonsCompleted: [],
                bestScores: {},
                badges: [],
                lastAccessed: Date.now()
            };
            updated = true;
        }

        // Estruturas específicas para cada nível
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

        // Estrutura específica para Advanced (que tem formato diferente)
        if (!this.data.listening.advancedLessons) {
            this.data.listening.advancedLessons = {
                completed: [],
                scores: {},
                badges: []
            };
            updated = true;
        }

        // Outras estruturas necessárias
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

        // Campos globais
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
            console.log('✅ Progress structures created/updated');
        }
    }

    saveProgress() {
        try {
            localStorage.setItem(this.progressKey, JSON.stringify(this.data));
            console.log('💾 Progress saved successfully');
        } catch (e) {
            console.error('❌ Error saving progress:', e);
        }
    }

    // 🔥 MÉTODO UNIVERSAL PARA LISTENING COMPLETION
    completeListeningLesson(level, lessonNumber, score, timeSpent = 0) {
        const lessonId = `${level}_lesson_${lessonNumber}`;
        
        // Adiciona à lista geral
        if (!this.data.listening.lessonsCompleted.includes(lessonId)) {
            this.data.listening.lessonsCompleted.push(lessonId);
        }
        
        // Atualiza melhor pontuação geral
        this.data.listening.bestScores[lessonId] = Math.max(
            this.data.listening.bestScores[lessonId] || 0, 
            score
        );
        
        // Estrutura específica por nível
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
        
        // Tempo de estudo
        this.data.totalStudyTime += timeSpent;
        
        // Badges
        this.checkListeningBadges(level, lessonNumber, score);
        
        this.saveProgress();
        
        // Atualiza UI se função existir
        if (typeof updateLessonCards === 'function') {
            updateLessonCards();
        }
        
        console.log(`✅ Lesson completed: ${lessonId} - Score: ${score}`);
    }

    checkListeningBadges(level, lessonNumber, score) {
        const badges = this.data.listening.badges;
        
        // Badge primeira lição
        if (!badges.includes('first_listening_lesson')) {
            badges.push('first_listening_lesson');
            this.showBadgeNotification('🎯 First Lesson!', 'Primeira lição de listening dominada!');
        }
        
        // Badge pontuação perfeita
        if (score === 5 && !badges.includes('perfect_listening_lesson')) {
            badges.push('perfect_listening_lesson');
            this.showBadgeNotification('🏆 Perfect Score!', 'Pontuação perfeita no listening!');
        }
        
        // Badges específicos por nível
        const levelBadgeId = `${level}_master`;
        const levelCompleted = this.data.listening.lessonsCompleted.filter(l => l.startsWith(level)).length;
        
        if (levelCompleted >= 3 && !badges.includes(levelBadgeId)) {
            badges.push(levelBadgeId);
            this.showBadgeNotification(`🔥 ${level.charAt(0).toUpperCase() + level.slice(1)} Master!`, `Nível ${level} dominado!`);
        }
    }

    showBadgeNotification(title, message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            background: linear-gradient(45deg, var(--blue-dark), var(--blue-medium)); color: white;
            padding: 25px 35px; border-radius: 20px; z-index: 10000; text-align: center;
            box-shadow: 0 15px 40px rgba(0,0,0,0.3); backdrop-filter: blur(10px);
        `;
        notification.innerHTML = `<div style="font-size: 1.8em; font-weight: bold; margin-bottom: 15px;">${title}</div><div style="font-size: 1.1em;">${message}</div>`;
        document.body.appendChild(notification);
        setTimeout(() => { 
            if (document.body.contains(notification)) {
                document.body.removeChild(notification); 
            }
        }, 3000);
    }

    // 🔥 MÉTODO DE DEBUG UNIVERSAL
    debugProgress() {
        console.log('🔍 UNIVERSAL PROGRESS DEBUG:');
        console.log('Student:', this.studentId);
        console.log('Progress Key:', this.progressKey);
        console.log('Data Structure:', this.data);
        console.log('Listening Lessons:', this.data.listening?.lessonsCompleted || []);
        console.log('Listening Scores:', this.data.listening?.bestScores || {});
        return this.data;
    }
}

// ===== FUNÇÃO DE QUESTÕES UNIVERSAL =====
function ensureQuestionsLoad(questionsData, currentLesson) {
    // 🔥 GARANTIA: Verifica se questões existem antes de carregar
    if (!questionsData) {
        console.error('❌ CRITICAL: Questions data is undefined!');
        return false;
    }
    
    if (!questionsData[currentLesson]) {
        console.error(`❌ CRITICAL: Lesson ${currentLesson} not found in questions!`);
        return false;
    }
    
    if (!questionsData[currentLesson].questions) {
        console.error(`❌ CRITICAL: Questions missing for lesson ${currentLesson}!`);
        return false;
    }
    
    console.log(`✅ Questions verified for lesson ${currentLesson}`);
    return true;
}

// ===== FUNÇÃO DE INICIALIZAÇÃO UNIVERSAL =====
function initializeUniversalListening(levelName, questionsData) {
    console.log(`🎧 Initializing Universal Listening System for: ${levelName}`);
    
    // 1. Verificar auth
    if (sessionStorage.getItem('studentLoggedIn') !== 'true') {
        window.location.href = '../auth/login.html';
        return;
    }
    
    // 2. Criar progress system universal
    window.studentProgress = new UniversalStudentProgress();
    
    // 3. Verificar questões
    if (!questionsData) {
        console.error('❌ CRITICAL: No questions data provided!');
        alert('Erro: Dados das questões não encontrados. Por favor, recarregue a página.');
        return;
    }
    
    // 4. Atualizar UI básica
    const studentName = sessionStorage.getItem('studentUsername') || 'Student';
    document.getElementById('userName').textContent = studentName.charAt(0).toUpperCase() + studentName.slice(1).toLowerCase();
    document.getElementById('userAvatar').textContent = studentName.charAt(0).toUpperCase();
    
    console.log(`✅ Universal Listening System initialized for ${levelName}`);
    console.log('✅ Student:', studentName);
    console.log('✅ Questions data verified');
    console.log('✅ Progress system ready');
    
    return true;
}

// ===== EXEMPLO DE USO NO BEGINNER.HTML =====
/*
// No início do JavaScript do beginner.html, ANTES de qualquer coisa:

// 1. Inicializar sistema universal
const initialized = initializeUniversalListening('beginner', beginnerLessons);
if (!initialized) {
    throw new Error('Failed to initialize listening system');
}

// 2. Usar o progress system universal
function saveProgress(lessonNumber, score) {
    const timeSpent = Date.now() - lessonStartTime;
    studentProgress.completeListeningLesson('beginner', lessonNumber, score, timeSpent);
}

// 3. Verificar questões antes de carregar
function loadLesson(lessonNumber) {
    if (!ensureQuestionsLoad(beginnerLessons, lessonNumber)) {
        alert('Erro ao carregar a lição. Por favor, recarregue a página.');
        return;
    }
    
    const lesson = beginnerLessons[lessonNumber];
    // ... resto da função
}
*/

// ===== FUNÇÃO DE DEBUG GLOBAL =====
window.debugListening = function() {
    if (window.studentProgress) {
        return window.studentProgress.debugProgress();
    } else {
        console.error('❌ StudentProgress not initialized!');
        return null;
    }
};

console.log('🔧 Universal Listening Bug Fix loaded!');
console.log('💡 Usage: Call initializeUniversalListening(levelName, questionsData) at start of each level');
console.log('🐛 Debug: Use debugListening() in console to check progress state');