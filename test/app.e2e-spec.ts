import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import cookieParser from 'cookie-parser';

process.env.NODE_ENV = 'test';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }));
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/api')
      .expect(200)
      .expect('Hello World!');
  });

  describe('Auth module (e2e)', () => {
    const testUser = {
      email: `test-${Date.now()}@test.com`,
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
    };
    let authToken = '';

    it('POST /auth/register -> should create a new user', () => {
      return request(app.getHttpServer())
        .post('/api/auth/register')
        .send(testUser)
        .expect(201)
        .then(res => {
          expect(res.body).toBeDefined();
          expect(res.body.email).toEqual(testUser.email);
        });
    });

    it('POST /auth/login -> should fail with wrong password', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: testUser.email, password: 'wrongpassword' })
        .expect(401);
    });

    it('POST /auth/login -> should login and return a cookie', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: testUser.email, password: testUser.password })
        .expect(201)
        .then(res => {
          const cookies = res.headers['set-cookie'];
          expect(cookies).toBeDefined();
          const accessTokenCookie = cookies.find(cookie => cookie.startsWith('access_token'));
          expect(accessTokenCookie).toBeDefined();
          authToken = accessTokenCookie.split(';')[0];
          expect(res.body.email).toEqual(testUser.email);
        });
    });

    it('GET /auth/me -> should return the user with a valid cookie', () => {
      return request(app.getHttpServer())
        .get('/api/auth/me')
        .set('Cookie', authToken)
        .expect(200)
        .then(res => {
          expect(res.body.email).toEqual(testUser.email);
        });
    });

    it('POST /auth/logout -> should clear the cookie', () => {
      return request(app.getHttpServer())
        .post('/api/auth/logout')
        .set('Cookie', authToken)
        .expect(201)
        .then(res => {
          const cookies = res.headers['set-cookie'];
          expect(cookies).toBeDefined();
          const accessTokenCookie = cookies.find(cookie => cookie.startsWith('access_token=;'));
          expect(accessTokenCookie).toBeDefined();
        });
    });

    it('GET /auth/me -> should fail without a cookie', () => {
      return request(app.getHttpServer())
        .get('/api/auth/me')
        .expect(401);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
