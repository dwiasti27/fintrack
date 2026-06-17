// Theme Engine for FINTRACK

const themes = {
    'theme-dark': {
        name: 'Default Dark',
        type: 'free',
        css: '' // No override needed, this is the default Tailwind design
    },
    'theme-light': {
        name: 'Clean Light',
        type: 'free',
        css: `
            body.theme-light { background-color: #F8FAFC !important; color: #0F172A !important; }
            body.theme-light .bg-deep-blue, body.theme-light .bg-deep-blue\\/95 { background-color: #FFFFFF !important; }
            body.theme-light .text-white { color: #0F172A !important; }
            body.theme-light .text-slate-400 { color: #64748B !important; }
            body.theme-light .bg-white\\/5, body.theme-light .bg-slate-800 { background-color: #F1F5F9 !important; border-color: #E2E8F0 !important; }
            body.theme-light .border-white\\/10, body.theme-light .border-white\\/5 { border-color: #E2E8F0 !important; }
            body.theme-light .bg-black\\/20, body.theme-light .bg-black\\/40 { background-color: #E2E8F0 !important; }
            body.theme-light aside { background-color: #FFFFFF !important; border-right: 1px solid #E2E8F0 !important; }
            body.theme-light nav { background-color: rgba(255, 255, 255, 0.95) !important; border-bottom: 1px solid #E2E8F0 !important; }
            body.theme-light .text-primary { color: #0284C7 !important; } /* Change primary to a nice corporate blue */
            body.theme-light .bg-primary { background-color: #0284C7 !important; color: #FFF !important; }
            body.theme-light .border-primary\\/30 { border-color: #0284C7 !important; }
            body.theme-light .hover\\:text-white:hover { color: #0284C7 !important; }
            body.theme-light .hover\\:bg-white\\/5:hover { background-color: #F1F5F9 !important; }
        `
    },
    'theme-neon': {
        name: 'Neon Pink',
        type: 'free',
        css: `
            body.theme-neon .text-primary { color: #FF00FF !important; }
            body.theme-neon .bg-primary { background-color: #FF00FF !important; color: #FFF !important; }
            body.theme-neon .bg-primary\\/10 { background-color: rgba(255, 0, 255, 0.1) !important; }
            body.theme-neon .border-primary\\/30 { border-color: rgba(255, 0, 255, 0.3) !important; }
            body.theme-neon .shadow-\\[0_0_15px_rgba\\(0\\,240\\,255\\,0\\.1\\)\\] { box-shadow: 0 0 15px rgba(255, 0, 255, 0.2) !important; }
            body.theme-neon .from-primary\\/10 { --tw-gradient-from: rgba(255, 0, 255, 0.1) !important; }
            body.theme-neon .via-primary { --tw-gradient-stops: var(--tw-gradient-from), #FF00FF, var(--tw-gradient-to) !important; }
        `
    },
    'theme-cake': {
        name: 'Theme Cake (Premium)',
        type: 'premium',
        css: `
            /* Cake Theme: Pink/Cream background, highly rounded buttons, sweet colors */
            body.theme-cake { background-color: #FFF0F5 !important; color: #5C3A21 !important; }
            body.theme-cake .bg-deep-blue, body.theme-cake .bg-deep-blue\\/95 { background-color: #FFF0F5 !important; }
            
            /* Text Colors */
            body.theme-cake .text-white { color: #4A2E1B !important; } /* Darker brown for high contrast */
            body.theme-cake .text-slate-400, body.theme-cake .text-slate-300 { color: #8B5A2B !important; font-weight: 500 !important; } /* Bolder for legibility */
            body.theme-cake .text-slate-500 { color: #A0522D !important; }
            
            /* Cards & Inputs */
            body.theme-cake .bg-white\\/5, body.theme-cake .bg-slate-800 { 
                background-color: #FFFFFF !important; 
                border-color: #FFB6C1 !important; 
                border-radius: 24px !important;
                box-shadow: 0 8px 20px rgba(255, 182, 193, 0.3) !important;
            }
            body.theme-cake .bg-slate-900 {
                background-color: #FFF8DC !important; /* Cornsilk for inputs so they are distinct but light */
                border-color: #FFC0CB !important;
                color: #4A2E1B !important;
            }
            body.theme-cake .border-white\\/10, body.theme-cake .border-white\\/5 { border-color: #FFC0CB !important; }
            
            /* Layout */
            body.theme-cake aside { background-color: #FFE4E1 !important; border-right: 2px dashed #FFB6C1 !important; }
            body.theme-cake nav { background-color: rgba(255, 240, 245, 0.95) !important; border-bottom: 2px dashed #FFB6C1 !important; }
            
            /* Primary Accents (Hot Pink / Strawberry) */
            body.theme-cake .text-primary { color: #E75480 !important; } /* Darker pink for text contrast */
            body.theme-cake .bg-primary { background-color: #FF69B4 !important; color: #FFF !important; }
            body.theme-cake .bg-primary\\/10, body.theme-cake .bg-primary\\/5 { background-color: #FFE4E1 !important; }
            body.theme-cake .border-primary\\/30 { border-color: #FF69B4 !important; }
            
            /* Extreme Rounding for Cake Theme */
            body.theme-cake button, body.theme-cake a.rounded-lg, body.theme-cake .rounded-full, body.theme-cake input, body.theme-cake select, body.theme-cake textarea {
                border-radius: 9999px !important; /* Pill shaped everything */
            }
            body.theme-cake .rounded-xl, body.theme-cake .rounded-2xl {
                border-radius: 32px !important; /* Soften standard cards */
            }

            /* Custom Background Decoration */
            body.theme-cake {
                background-image: radial-gradient(#FFB6C1 1.5px, transparent 1.5px);
                background-size: 30px 30px;
            }
        `
    }
};

function applyTheme(themeName) {
    if (!themes[themeName]) themeName = 'theme-dark';
    
    // Save to local storage
    localStorage.setItem('fintrack_theme', themeName);
    
    // Remove all existing theme classes from body
    document.body.classList.remove('theme-dark', 'theme-light', 'theme-neon', 'theme-cake');
    
    // Add new theme class
    document.body.classList.add(themeName);
}

// Inject CSS overrides into the head on load
function injectThemeStyles() {
    const styleEl = document.createElement('style');
    styleEl.id = 'fintrack-theme-styles';
    
    let combinedCSS = '';
    for (const [key, value] of Object.entries(themes)) {
        if (value.css) {
            combinedCSS += value.css + '\\n';
        }
    }
    
    styleEl.textContent = combinedCSS;
    document.head.appendChild(styleEl);
}

// Initialize on script load
(function() {
    // Only inject once
    if (!document.getElementById('fintrack-theme-styles')) {
        injectThemeStyles();
    }
    
    // Apply saved theme or default
    const savedTheme = localStorage.getItem('fintrack_theme') || 'theme-dark';
    
    function initGlobalFeatures() {
        applyTheme(savedTheme);
        
        // Inject Global AI Modal
        if (!document.getElementById('aiComingSoonModal')) {
            const modalHTML = `
            <div id="aiComingSoonModal" class="fixed inset-0 bg-black/80 z-[100] hidden items-center justify-center backdrop-blur-sm opacity-0 transition-opacity duration-300">
                <div class="bg-slate-900 border border-white/10 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden transform scale-95 transition-transform duration-300" id="aiComingSoonModalContent">
                    <!-- Decorative Header -->
                    <div class="h-32 bg-gradient-to-br from-primary/30 to-purple-600/30 relative flex items-center justify-center overflow-hidden">
                        <span class="material-symbols-outlined absolute text-[120px] text-white/5 transform -rotate-12">auto_awesome</span>
                        <div class="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-2xl relative z-10">
                            <span class="material-symbols-outlined text-4xl text-white">smart_toy</span>
                        </div>
                    </div>
                    
                    <div class="p-8 text-center relative">
                        <h3 class="text-2xl font-black text-white mb-2 tracking-tight">Tanya with AI</h3>
                        <span class="inline-block px-3 py-1 bg-primary/20 text-primary text-[10px] font-bold rounded-full uppercase tracking-widest mb-6">Coming Soon</span>
                        
                        <p class="text-sm text-slate-400 mb-6 leading-relaxed">
                            Asisten cerdas berbasis AI kami sedang berlatih untuk membantu Anda! Ke depannya, AI ini akan mampu melakukan:
                        </p>
                        
                        <div class="space-y-3 text-left mb-8">
                            <div class="flex items-start gap-3">
                                <span class="material-symbols-outlined text-primary text-[20px]">insights</span>
                                <p class="text-xs text-slate-300"><strong>Analisis Cerdas:</strong> Membedah kebocoran halus pada pola pengeluaran bulanan Anda.</p>
                            </div>
                            <div class="flex items-start gap-3">
                                <span class="material-symbols-outlined text-primary text-[20px]">psychology</span>
                                <p class="text-xs text-slate-300"><strong>Strategi Keuangan:</strong> Rekomendasi otomatis persentase tabungan dan investasi yang ideal untuk profil Anda.</p>
                            </div>
                            <div class="flex items-start gap-3">
                                <span class="material-symbols-outlined text-primary text-[20px]">chat</span>
                                <p class="text-xs text-slate-300"><strong>Konsultasi Interaktif:</strong> Konsultasikan perencanaan keuangan seperti Anda mengobrol dengan penasihat keuangan profesional.</p>
                            </div>
                        </div>
                        
                        <button onclick="closeAiComingSoonModal()" class="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-xl transition-all">
                            Tutup & Nantikan Kehadirannya
                        </button>
                    </div>
                </div>
            </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHTML);
        }
    }
    
    // Global Window Functions for Modal
    window.openAiComingSoonModal = function(e) {
        if(e) e.preventDefault();
        const modal = document.getElementById('aiComingSoonModal');
        const content = document.getElementById('aiComingSoonModalContent');
        if(!modal) return;
        
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        setTimeout(() => {
            modal.classList.remove('opacity-0');
            content.classList.remove('scale-95');
        }, 10);
    };

    window.closeAiComingSoonModal = function() {
        const modal = document.getElementById('aiComingSoonModal');
        const content = document.getElementById('aiComingSoonModalContent');
        if(!modal) return;
        
        modal.classList.add('opacity-0');
        content.classList.add('scale-95');
        setTimeout(() => {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }, 300);
    };

    // Wait for body to exist if script is loaded in head
    if (document.body) {
        initGlobalFeatures();
    } else {
        document.addEventListener('DOMContentLoaded', initGlobalFeatures);
    }
})();
