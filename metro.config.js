const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');
const http = require('http');

const config = getDefaultConfig(__dirname);

const stubNotificationsPath = path.resolve(
  __dirname,
  'utils/expo-notifications-stub.ts',
);

const useRealNotifications =
  process.env.EXPO_PUBLIC_USE_NOTIFICATIONS === '1';

const defaultResolveRequest = config.resolver.resolveRequest;

/**
 * Expo Go SDK 53+: expo-notifications asli memicu crash "Something went wrong".
 * Aliaskan ke stub kecuali build production dengan EXPO_PUBLIC_USE_NOTIFICATIONS=1.
 */
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (
    !useRealNotifications &&
    (moduleName === 'expo-notifications' ||
      moduleName.startsWith('expo-notifications/'))
  ) {
    return {
      filePath: stubNotificationsPath,
      type: 'sourceFile',
    };
  }

  if (defaultResolveRequest) {
    return defaultResolveRequest(context, moduleName, platform);
  }

  return context.resolveRequest(context, moduleName, platform);
};

/**
 * Proxy /api/* dan /storage/* dari Metro (8081) → Laravel (8000).
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

      const forwardHeaders = {};
      const passThrough = [
        'accept',
        'authorization',
        'content-type',
        'content-length',
      ];
      for (const key of passThrough) {
        if (req.headers[key]) forwardHeaders[key] = req.headers[key];
      }

      const options = {
        hostname: '127.0.0.1',
        port: 8000,
        path: req.url,
        method: req.method,
        headers: {
          ...forwardHeaders,
          host: '127.0.0.1:8000',
          connection: 'close',
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

      const method = (req.method ?? 'GET').toUpperCase();
      if (method === 'GET' || method === 'HEAD') {
        proxyReq.end();
        return;
      }

      const chunks = [];
      req.on('data', (chunk) => chunks.push(chunk));
      req.on('end', () => {
        const body = Buffer.concat(chunks);
        if (body.length > 0) {
          proxyReq.write(body);
        }
        proxyReq.end();
      });
      req.on('error', () => {
        proxyReq.destroy();
        if (!res.headersSent) {
          res.writeHead(502, { 'Content-Type': 'application/json' });
          res.end(
            JSON.stringify({ status: 'error', message: 'Proxy request error' }),
          );
        }
      });
    };
  },
};

module.exports = config;
