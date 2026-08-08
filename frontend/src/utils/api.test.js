import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('axios', () => {
  const interceptorHandlers = { onFulfilled: null, onRejected: null };
  return {
    default: {
      create: () => ({
        interceptors: {
          response: {
            use: (onFulfilled, onRejected) => {
              interceptorHandlers.onFulfilled = onFulfilled;
              interceptorHandlers.onRejected = onRejected;
            },
          },
        },
      }),
    },
    __interceptorHandlers: interceptorHandlers,
  };
});

const originalLocation = window.location;

function makeError(url, status) {
  return { config: { url }, response: { status } };
}

describe('api interceptor (Bugfix: Reload-Loop auf /login und /register)', () => {
  let onRejected;

  beforeEach(async () => {
    delete window.location;
    window.location = { ...originalLocation, pathname: '/boards', href: '' };
    vi.resetModules();
    await import('./api.js');
    onRejected = (await import('axios')).__interceptorHandlers.onRejected;
  });

  afterEach(() => {
    window.location = originalLocation;
  });

  it('leitet bei 401 auf einer geschützten Route zur Login-Seite um', async () => {
    await onRejected(makeError('/boards', 401)).catch(() => {});
    expect(window.location.href).toBe('/login');
  });

  it('leitet bei 401 auf /auth/me NICHT um (Endlosschleife auf /login und /register)', async () => {
    await onRejected(makeError('/auth/me', 401)).catch(() => {});
    expect(window.location.href).toBe('');
  });

  it('leitet bei 401 auf /auth/login NICHT um (falsche Zugangsdaten sind keine abgelaufene Session)', async () => {
    await onRejected(makeError('/auth/login', 401)).catch(() => {});
    expect(window.location.href).toBe('');
  });

  it('leitet bei 401 auf /auth/register NICHT um', async () => {
    await onRejected(makeError('/auth/register', 401)).catch(() => {});
    expect(window.location.href).toBe('');
  });

  it('leitet nicht erneut um, wenn bereits auf /login (verhindert Reload-Loop)', async () => {
    window.location.pathname = '/login';
    await onRejected(makeError('/boards', 401)).catch(() => {});
    expect(window.location.href).toBe('');
  });

  it('leitet bei anderen Fehlercodes (z.B. 429) nicht um', async () => {
    await onRejected(makeError('/boards', 429)).catch(() => {});
    expect(window.location.href).toBe('');
  });
});
