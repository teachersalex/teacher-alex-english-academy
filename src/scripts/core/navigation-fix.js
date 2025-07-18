// ===== ✨ TEACHER ALEX - NAVIGATION FIX COMPLETO =====
// 📁 src/scripts/core/navigation-fix.js
// 🎯 Solução universal para travamento de botões + navegação

(function() {
    'use strict';
    
    console.log('✨ Navigation Fix v2.0 carregando...');
    
    // ===== RESET AUTOMÁTICO =====
    function smartReset() {
        let fixed = 0;
        
        // Reseta botões travados
        document.querySelectorAll('button, .btn').forEach(btn => {
            if (btn.textContent.includes('Carregando') || btn.disabled && !btn.hasAttribute('data-permanently-disabled')) {
                const card = btn.closest('.story-card, .chapter-card, .reading-card');
                
                if (card) {
                    const title = card.querySelector('.story-title, h3, h4')?.textContent || '';
                    
                    // Auto-detecta texto original
                    let originalText = 'Continuar';
                    if (title.includes('Foundation')) originalText = 'Começar Foundation';
                    else if (title.includes('Beginner') || title.includes('Personal Introduction')) originalText = 'Começar Beginner';
                    else if (title.includes('Intermediate') || title.includes('Advanced Conversations')) originalText = 'Começar Intermediate';
                    else if (title.includes('Advanced') || title.includes('Professional English')) originalText = 'Começar Advanced';
                    else if (title.includes('Roommate')) originalText = 'Começar História';
                    else if (title.includes('Neighbor')) originalText = 'Começar Leitura';
                    else if (btn.textContent !== 'Carregando...') return; // Não mexe se não for botão carregando
                    
                    btn.textContent = originalText;
                    btn.disabled = false;
                    fixed++;
                }
            }
        });
        
        // Reseta opacity dos cards
        document.querySelectorAll('.story-card, .chapter-card, .reading-card').forEach(card => {
            if (parseFloat(getComputedStyle(card).opacity) < 1) {
                card.style.opacity = '1';
                fixed++;
            }
        });
        
        if (fixed > 0) {
            console.log(`✅ Navigation Fix: ${fixed} elementos resetados`);
        }
        
        return fixed;
    }
    
    // ===== NAVEGAÇÃO UNIVERSAL =====
    window.navigateToStory = function(storyId) {
        const card = event.currentTarget;
        const button = card.querySelector('.story-button, button');
        if (!button) return;
        
        const originalText = button.textContent;
        console.log(`🎯 Navegando para: ${storyId}`);
        
        // Loading state
        button.textContent = 'Carregando...';
        button.disabled = true;
        card.style.opacity = '0.7';
        
        // Determina URL de destino
        let targetUrl = '';
        if (storyId === 'foundation') targetUrl = '../listening/foundation.html';
        else if (storyId === 'beginner') targetUrl = '../listening/beginner.html';
        else if (storyId === 'intermediate') targetUrl = '../listening/intermediate.html';
        else if (storyId === 'advanced') targetUrl = '../listening/advanced.html';
        else if (storyId === 'roommate') targetUrl = '../reading/graded/roommate.html';
        else if (storyId === 'neighbor') targetUrl = '../reading/graded/neighbor.html';
        else {
            // Reset se URL inválida
            button.textContent = originalText;
            button.disabled = false;
            card.style.opacity = '1';
            alert('🚀 Página não encontrada!');
            return;
        }
        
        // Timer de segurança
        const resetTimer = setTimeout(() => {
            button.textContent = originalText;
            button.disabled = false;
            card.style.opacity = '1';
        }, 3000);
        
        // Navegação
        setTimeout(() => {
            clearTimeout(resetTimer);
            window.location.href = targetUrl;
        }, 300);
    };
    
    // ===== LISTENERS ESSENCIAIS =====
    
    // 1. Página restaurada do cache (botão voltar)
    window.addEventListener('pageshow', function(event) {
        if (event.persisted) {
            console.log('🔄 Página restaurada do cache');
            setTimeout(smartReset, 50);
        }
    });
    
    // 2. Página recebe foco
    window.addEventListener('focus', function() {
        console.log('👁️ Página recebeu foco');
        setTimeout(smartReset, 100);
    });
    
    // 3. Navegação com popstate
    window.addEventListener('popstate', function() {
        console.log('⬅️ Navegação detectada');
        setTimeout(smartReset, 50);
    });
    
    // 4. Visibilidade da aba muda
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            console.log('👀 Aba visível');
            setTimeout(smartReset, 100);
        }
    });
    
    // ===== PROTEÇÃO DURANTE CLIQUES =====
    document.addEventListener('click', function(event) {
        const btn = event.target.closest('button, .btn');
        if (btn && btn.textContent.includes('Começar') && !btn.disabled) {
            // Proteção: se botão não resetar em 4 segundos, força reset
            setTimeout(() => {
                if (btn.textContent === 'Carregando...') {
                    console.log('⚠️ Forçando reset de botão travado');
                    smartReset();
                }
            }, 4000);
        }
    });
    
    // ===== RESET INICIAL =====
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(smartReset, 200);
    });
    
    // ===== API GLOBAL =====
    window.resetNavigation = smartReset;
    
    console.log('✅ Navigation Fix v2.0 ativo - Navegação + Reset universal');
    
})();
