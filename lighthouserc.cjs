// Lighthouse CI: mide rendimiento, accesibilidad, buenas prácticas y SEO sobre dist/.
// Si alguna categoría baja del mínimo, la comprobación falla y no se publica.
module.exports = {
  ci: {
    collect: {
      staticDistDir: './dist',
      url: [
        'http://localhost/index.html',
        'http://localhost/lab-bank.html',
        'http://localhost/lab-windows-blue-team.html',
        'http://localhost/proyecto-observatorio.html',
        'http://localhost/etiqueta-web.html',
      ],
      numberOfRuns: 1,
      settings: {
        chromeFlags: '--no-sandbox --headless=new',
        ...(process.env.CHROME_PATH ? { chromePath: process.env.CHROME_PATH } : {}),
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 1 }],
        'categories:best-practices': ['error', { minScore: 0.95 }],
        'categories:seo': ['error', { minScore: 1 }],
      },
    },
    upload: { target: 'filesystem', outputDir: './.lighthouseci/reports' },
  },
};
