// Test-Umgebungsvariablen – überschreiben .env für Tests
process.env.NODE_ENV = 'test';
process.env.BACKEND_PORT = '3002';
process.env.JWT_SECRET = 'test-secret-do-not-use-in-production-min-64-chars-xxxxxxxxxxxxxxxxxxx';
process.env.DB_HOST = 'localhost';
process.env.DB_PORT = '5432';
process.env.DB_NAME = 'floorforge_test';
process.env.DB_USER = 'floorforge';
process.env.DB_PASSWORD = 'test';
process.env.REDIS_URL = 'redis://localhost:6379';
