const translations = {
    "id": {
        "nav_home": "Beranda",
        "nav_features": "Fitur Kami",
        "nav_login": "Login",
        "nav_register": "Register",
        "hero_badge": "SOLUSI KEUANGAN CERDAS",
        "hero_title": "Kendalikan Arus Kasmu, Hentikan Bocor Halus.",
        "hero_desc": "Pantau setiap rupiah dengan presisi tingkat institusi. Analisis pengeluaran otomatis untuk masa depan finansial yang lebih stabil.",
        "hero_cta": "Mulai Sekarang",
        "feature_title": "Mengapa Memilih FINTRACK?",
        "feature_1_title": "Keamanan Bank-Grade",
        "feature_1_desc": "Enkripsi end-to-end 256-bit memastikan data finansial Anda tetap rahasia dan aman.",
        "feature_2_title": "Analitik AI",
        "feature_2_desc": "Algoritma kami mendeteksi pola pengeluaran buruk dan memberikan rekomendasi penghematan.",
        "feature_3_title": "Otomatisasi Laporan",
        "feature_3_desc": "Dapatkan laporan laba rugi pribadi secara otomatis setiap akhir bulan.",
        "settings_lang": "Bahasa Aplikasi",
        "settings_lang_desc": "Pilih bahasa untuk antarmuka pengguna.",
        "sidebar_dashboard": "Dashboard",
        "sidebar_transaksi": "Transaksi",
        "sidebar_kategori": "Kategori",
        "sidebar_analitik": "Analitik",
        "sidebar_pengaturan": "Pengaturan",
        "sidebar_support": "Support",
        "sidebar_logout": "Logout",
        "navbar_search": "Cari transaksi..."
    },
    "en": {
        "nav_home": "Home",
        "nav_features": "Our Features",
        "nav_login": "Login",
        "nav_register": "Register",
        "hero_badge": "SMART FINANCIAL SOLUTION",
        "hero_title": "Control Your Cash Flow, Stop Subtle Leaks.",
        "hero_desc": "Track every penny with institutional-grade precision. Automated expense analysis for a more stable financial future.",
        "hero_cta": "Get Started",
        "feature_title": "Why Choose FINTRACK?",
        "feature_1_title": "Bank-Grade Security",
        "feature_1_desc": "256-bit end-to-end encryption ensures your financial data remains confidential and secure.",
        "feature_2_title": "AI Analytics",
        "feature_2_desc": "Our algorithms detect poor spending patterns and provide savings recommendations.",
        "feature_3_title": "Automated Reports",
        "feature_3_desc": "Get your personal profit and loss report automatically at the end of every month.",
        "settings_lang": "App Language",
        "settings_lang_desc": "Change the application interface language.",
        "sidebar_dashboard": "Dashboard",
        "sidebar_transaksi": "Transactions",
        "sidebar_kategori": "Categories",
        "sidebar_analitik": "Analytics",
        "sidebar_pengaturan": "Settings",
        "sidebar_support": "Support",
        "sidebar_logout": "Logout",
        "navbar_search": "Search transactions..."
    },
    "zh": {
        "nav_home": "首页",
        "nav_features": "我们的功能",
        "nav_login": "登录",
        "nav_register": "注册",
        "hero_badge": "智能财务解决方案",
        "hero_title": "控制现金流，阻止隐形流失。",
        "hero_desc": "以机构级精度跟踪每一分钱。自动支出分析，共创更稳定的财务未来。",
        "hero_cta": "立即开始",
        "feature_title": "为什么选择 FINTRACK？",
        "feature_1_title": "银行级安全",
        "feature_1_desc": "256位端到端加密确保您的财务数据保密且安全。",
        "feature_2_title": "AI 数据分析",
        "feature_2_desc": "我们的算法检测不良支出模式并提供节省建议。",
        "feature_3_title": "自动生成报告",
        "feature_3_desc": "每月月底自动获取您的个人盈亏报告。",
        "settings_lang": "应用语言",
        "settings_lang_desc": "更改应用程序界面语言。",
        "sidebar_dashboard": "仪表板",
        "sidebar_transaksi": "交易记录",
        "sidebar_kategori": "分类",
        "sidebar_analitik": "数据分析",
        "sidebar_pengaturan": "设置",
        "sidebar_support": "支持帮助",
        "sidebar_logout": "退出登录",
        "navbar_search": "搜索交易..."
    }
};

function changeLanguage(langCode) {
    if (!translations[langCode]) langCode = "id";
    
    // Save to local storage
    localStorage.setItem('fintrack_lang', langCode);
    
    // Find all elements with data-i18n attribute
    const elements = document.querySelectorAll('[data-i18n]');
    
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[langCode][key]) {
            el.textContent = translations[langCode][key];
        }
    });

    // Update language selectors if they exist
    const selectors = document.querySelectorAll('.lang-selector');
    selectors.forEach(sel => sel.value = langCode);
}

// Auto-initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('fintrack_lang') || 'id';
    changeLanguage(savedLang);
});
