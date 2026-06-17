/**
 * FINTRACK — Demo Mode Banner
 * Include script ini di semua halaman untuk menampilkan
 * watermark & notifikasi bahwa ini adalah versi demo/portofolio.
 * Mencegah orang mengira ini adalah produk live yang bisa digunakan.
 */

(function () {
    // ── Config ──────────────────────────────────────────────────
    const DEMO_MODE = true; // Set false untuk menonaktifkan banner
    const GITHUB_URL = 'https://github.com/'; // Ganti dengan URL repo Anda

    if (!DEMO_MODE) return;

    // ── Inject CSS ───────────────────────────────────────────────
    const style = document.createElement('style');
    style.textContent = `
        #demo-banner {
            position: fixed;
            bottom: 0; left: 0; right: 0;
            z-index: 9999;
            background: linear-gradient(90deg, #0F172A 0%, #1E293B 100%);
            border-top: 1px solid rgba(245,158,11,0.3);
            padding: 10px 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            font-family: 'Public Sans', sans-serif;
            font-size: 12px;
            color: #94A3B8;
            box-shadow: 0 -4px 30px rgba(0,0,0,0.5);
            backdrop-filter: blur(12px);
            animation: slideUpBanner 0.5s ease forwards;
        }
        @keyframes slideUpBanner {
            from { transform: translateY(100%); opacity: 0; }
            to   { transform: translateY(0);    opacity: 1; }
        }
        #demo-banner .demo-left {
            display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
        }
        #demo-banner .demo-pill {
            background: rgba(245,158,11,0.15);
            border: 1px solid rgba(245,158,11,0.4);
            color: #F59E0B;
            font-weight: 800;
            font-size: 9px;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            padding: 3px 10px;
            border-radius: 999px;
        }
        #demo-banner a.demo-link {
            color: #38BDF8;
            font-weight: 700;
            text-decoration: none;
            transition: color 0.2s;
        }
        #demo-banner a.demo-link:hover { color: #7DD3FC; text-decoration: underline; }
        #demo-banner .demo-close {
            background: none; border: none;
            color: #475569; cursor: pointer; font-size: 16px;
            padding: 4px; line-height: 1;
            transition: color 0.2s; flex-shrink: 0;
        }
        #demo-banner .demo-close:hover { color: #fff; }

        #demo-watermark {
            position: fixed;
            bottom: 60px; right: 20px;
            z-index: 9998;
            opacity: 0.04;
            font-size: 11px;
            font-weight: 900;
            letter-spacing: 0.2em;
            text-transform: uppercase;
            color: #fff;
            pointer-events: none;
            writing-mode: vertical-rl;
            user-select: none;
        }
    `;
    document.head.appendChild(style);

    // ── Inject Banner HTML ────────────────────────────────────────
    function injectBanner() {
        if (document.getElementById('demo-banner')) return;

        const banner = document.createElement('div');
        banner.id = 'demo-banner';
        banner.innerHTML = `
            <div class="demo-left">
                <span class="demo-pill">🔒 Demo Mode</span>
                <span>
                    Ini adalah versi <strong style="color:#F1F5F9">portofolio/demo</strong> dari FINTRACK.
                    Data bersifat contoh dan tidak mewakili data nyata.
                </span>
                <a href="${GITHUB_URL}" target="_blank" rel="noopener" class="demo-link">
                    ★ Lihat Source Code di GitHub →
                </a>
            </div>
            <button class="demo-close" onclick="document.getElementById('demo-banner').remove()" title="Tutup">✕</button>
        `;
        document.body.appendChild(banner);

        // Watermark
        const watermark = document.createElement('div');
        watermark.id = 'demo-watermark';
        watermark.textContent = 'FINTRACK DEMO';
        document.body.appendChild(watermark);
    }

    // Run after DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectBanner);
    } else {
        injectBanner();
    }
})();
