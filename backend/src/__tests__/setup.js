// Test-Umgebungsvariablen – per echter env var überschreibbar (z.B. CI-Services
// oder lokale Docker-Container mit abweichendem Host/Passwort)
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET ??= 'test-secret-key-minimum-32-characters-long';
process.env.DB_HOST ??= 'localhost';
process.env.DB_PORT ??= '5432';
process.env.DB_NAME ??= 'openfloorball_test';
process.env.DB_USER ??= 'openfloorball';
process.env.DB_PASSWORD ??= 'test';
process.env.REDIS_HOST ??= 'localhost';
process.env.REDIS_PORT ??= '6379';
process.env.REDIS_PASSWORD ??= 'test';
process.env.CORS_ORIGIN ??= 'http://localhost:5173';
