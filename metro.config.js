const { getDefaultConfig } = require('expo/metro-config');
const http = require('http');

const config = getDefaultConfig(__dirname);

/**
 * Proxy /api/* dan /storage/* dari Metro (8081) → Laravel (8000).
 * HP fisik bisa akses API & gambar lewat satu port (8081).
 */
config.server = {
  ...config.server,
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      const url = req.url?.split('?')[0] ?? '';
      const shouldProxy = url.startsWith('/api') || url.startsWith('/storage');
      if (!shouldProxy) {
        return middleware(req, res, next);
      }

      const options = {
        hostname: '127.0.0.1',
        port: 8000,
        path: req.url,
        method: req.method,
        headers: {
          ...req.headers,
          host: '127.0.0.1:8000',
        },
      };

      const proxyReq = http.request(options, (proxyRes) => {
        res.writeHead(proxyRes.statusCode ?? 502, proxyRes.headers);
        proxyRes.pipe(res);
      });

      proxyReq.on('error', (err) => {
        console.error('[Metro proxy] Laravel error:', err.message);
        res.writeHead(502, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({
            status: 'error',
            message:
              'Backend tidak terjangkau. Jalankan: cd backend && php artisan serve --host=0.0.0.0 --port=8000',
          }),
        );
      });

      const chunks = [];
      req.on('data', (chunk) => chunks.push(chunk));
      req.on('end', () => {
        const body = Buffer.concat(chunks);
        if (body.length > 0) {
          proxyReq.write(body);
        }
        proxyReq.end();
      });
    };
  },
};

module.exports = config;
