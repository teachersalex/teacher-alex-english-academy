// ===== ✨ TEACHER ALEX - ELEGANT NAVIGATION FIX =====
// 📁 src/scripts/core/navigation-fix.js
// 🎯 Previne travamento de botões - Solução universal elegante

(function() {
    'use strict';
    
    // ===== RESET AUTOMÁTICO =====
    function smartReset() {
        // Reseta botões travados
        document.querySelectorAll('button, .btn').forEach(btn => {
            if (btn.textContent.includes('Carregando') || btn.disabled) {
                const card = btn.closest('.story-card, .chapter-card, .reading-card');
                const isStoryButton = btn.classList.contains('story-button') || btn.closest('.story-card');
                
                if (isStoryButton && card) {
                    const title = card.querySelector('.story-title, h3')?.textContent || '';
                    btn.textContent = title.includes('Foundation') ? 'Começar Foundation' :
                                    title.includes('Beginner') ? 'Começar Beginner' :
                                    title.includes('Intermediate') ? 'Começar Intermediate' :
                                    title.includes('Advanced') ? 'Começar Advanced' :
                                    title.includes('Roommate') ? 'Começar História' :
                                    title.includes('Neighbor') ? 'Começar Leitura' : 'Continuar';
                    btn.disabled = false;
                }
            }
        });
        
        // Reseta opacity dos cards
        document.querySelectorAll('.story-card, .chapter-card, .reading-card').forEach(card => {
            if (parseFloat(getComputedStyle(card).opacity) < 1) {
                card.style.opacity = '1';
            }
        });
    }
    
    // ===== LISTENERS ESSENCIAIS =====
    window.addEventListener('pageshow', e => e.persisted && setTimeout(smartReset, 50));
    window.addEventListener('focus', () => setTimeout(smartReset, 100));
    
    // ===== PROTEÇÃO DURANTE NAVEGAÇÃO =====
    let navigationTimeout;
    document.addEventListener('click', e => {
        const btn = e.target.closest('button, .btn');
        if (btn && btn.textContent.includes('Começar')) {
            clearTimeout(navigationTimeout);
            navigationTimeout = setTimeout(() => {
                if (btn.textContent === 'Carregando...') smartReset();
            }, 3000);
        }
    });
    
    // ===== API GLOBAL MINIMALISTA =====
    window.resetNavigation = smartReset;
    
    console.log('✨ Navigation Fix ativo');
})();