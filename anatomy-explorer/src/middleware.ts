import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware((context, next) => {
  const url = new URL(context.request.url);

  if (url.pathname.startsWith('/preview')) {
    const expectedPassword = import.meta.env.PREVIEW_PASSWORD;
    const isLocal = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);

    if (!expectedPassword && isLocal) {
      return next();
    }

    if (!expectedPassword) {
      return new Response('Preview unavailable: PREVIEW_PASSWORD is not configured.', {
        status: 503,
      });
    }

    const authHeader = context.request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Basic ')) {
      return new Response('Authentication Required', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Clinician Preview Area"',
        },
      });
    }

    const base64Credentials = authHeader.split(' ')[1];
    const [user, pwd] = Buffer.from(base64Credentials, 'base64').toString('utf-8').split(':');

    if (user !== 'clinician' || pwd !== expectedPassword) {
      return new Response('Unauthorized', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Clinician Preview Area"',
        },
      });
    }
  }

  return next();
});
