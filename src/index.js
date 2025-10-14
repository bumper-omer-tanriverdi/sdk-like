// Basit varsayılan görseller (tema farkını göstermek için inline SVG)
const LIGHT_IMAGE_DATA = 'https://genel-amacli-kova.s3.eu-north-1.amazonaws.com/bnpl_light.webp';
const DARK_IMAGE_DATA  = 'https://genel-amacli-kova.s3.eu-north-1.amazonaws.com/bnpl_dark.webp';

// Bazı varsayılanlar
const DEFAULTS = {
  targetId: 'myAppWrapper',
  theme: 'dark', // 'light' | 'dark'
  linkHref: 'https://www.bumper.co/',
  images: {
    light: LIGHT_IMAGE_DATA,
    dark: DARK_IMAGE_DATA
  }
};

// Build helper: iframe’in içeriğini oluşturur
function buildIframeHTML(theme, href, imgSrc) {
  const bg = theme === 'dark' ? 'transparent' : 'transparent';
  const color = theme === 'dark' ? '#eee' : '#111';
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    html,body{margin:0;padding:0;background:${bg};color:${color};}
    .wrap{display:flex}
    a{display:inline-block;text-decoration:none;outline:none;}
    img{display:block;max-width:100%;height:auto;}
  </style>
</head>
<body>
  <div class="wrap">
    <a href="${href}" target="_blank" rel="noopener noreferrer">
      <img src="${imgSrc}" alt="MyApp">
    </a>
  </div>
</body>
</html>`;
}

// DOM hazır değilse beklemek için
function onReady(cb) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', cb, { once: true });
  } else {
    cb();
  }
}

// SDK_VERSION yoksa fallback
const __SDK_VERSION__ = typeof SDK_VERSION !== 'undefined' ? SDK_VERSION : '1.0.0';

const SDK = {
  version: __SDK_VERSION__,

  init(options = {}) {
    const cfg = {
      ...DEFAULTS,
      ...options,
      images: { ...DEFAULTS.images, ...(options.images || {}) }
    };

    const theme = cfg.theme === 'dark' ? 'dark' : 'light';
    const desiredId = cfg.targetId || DEFAULTS.targetId;

    const run = () => {
      let container = document.getElementById(desiredId);

      if (!container) {
        // Belirtilen id yoksa myAppWrapper’a düş
        if (desiredId !== DEFAULTS.targetId) {
          console.warn(`[MyApp SDK] targetId="${desiredId}" bulunamadı. "${DEFAULTS.targetId}" oluşturuluyor.`);
        }
        container = document.getElementById(DEFAULTS.targetId);
        if (!container) {
          container = document.createElement('div');
          container.id = DEFAULTS.targetId;
          document.body.appendChild(container);
        }
      }

      // Önceki içeriği temizle
      container.innerHTML = '';

      // iframe oluştur
      const iframe = document.createElement('iframe');
      iframe.title = 'MyApp Widget';
      iframe.setAttribute('aria-label', 'MyApp Widget');
      iframe.style.border = '0';
      iframe.style.width = '320px';
      iframe.style.display = 'block';
      iframe.style.height = '100px'; // ilk yükseklik; load sonrası ayarlanacak
      // Linkin yeni sekmede açılabilmesi için sandbox'ı gevşetiyoruz (isteğe bağlı)
      iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox');


      const imgSrc = (cfg.images && cfg.images[theme]) || DEFAULTS.images[theme];
      iframe.srcdoc = buildIframeHTML(theme, cfg.linkHref, imgSrc);

      iframe.addEventListener('load', () => {
        try {
          const doc = iframe.contentDocument;
          if (doc && doc.body) {
            const h = doc.body.scrollHeight;
            iframe.style.height = Math.max(60, Math.min(h, 600)) + 'px';
          }
        } catch (_) {
          // srcdoc olduğu için normalde buraya düşmez
        }
      });

      container.appendChild(iframe);

      console.log(`MyApp SDK v${__SDK_VERSION__} initialized`, {
        targetId: container.id,
        theme
      });
    };

    onReady(run);
  }
};

export default SDK;