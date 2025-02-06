import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TestService } from 'src/test/test.service';
import { TestModule } from 'src/test/test.module';

describe('ContactController', () => {
    let app: INestApplication;
    let logger: Logger;
    let testService: TestService;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule, TestModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        logger = app.get(WINSTON_MODULE_PROVIDER);
        testService = app.get(TestService);
    });

    afterEach(async () => {
        await app.close();
    });

    describe('POST /api/contacts', () => {
        beforeEach(async () => {
            await testService.deleteContact();
            await testService.deleteUser();
            await testService.createUser();
            await testService.createContact();
        });

        it('should be rejected if request is invalid', async () => {
            const response = await request(app.getHttpServer())
                .post('/api/contacts')
                .set('Authorization', 'test')
                .send({
                    first_name: '',
                    last_name: '',
                    email: 'wrong mail',
                    phone: '',
                });

            logger.info(response.body);

            expect(response.status).toBe(400);
            expect(response.body.errors).toBeDefined();
        });

        it('should be able to create contact', async () => {
            const response = await request(app.getHttpServer())
                .post('/api/contacts')
                .set('Authorization', 'test')
                .send({
                    first_name: 'test',
                    last_name: 'testing',
                    email: 'testing@mail.com',
                    phone: '+6281000111222',
                });

            logger.info(response.body);

            expect(response.status).toBe(200);
            expect(response.body.data.id).toBeDefined();
            expect(response.body.data.first_name).toBe('test');
            expect(response.body.data.last_name).toBe('testing');
            expect(response.body.data.email).toBe('testing@mail.com');
            expect(response.body.data.phone).toBe('+6281000111222');
        });
    });

    describe('GET /api/contacts/:contactId', () => {
        beforeEach(async () => {
            await testService.deleteContact();
            await testService.deleteUser();
            await testService.createUser();
            await testService.createContact();
        });

        it('should be rejected if contact is not found', async () => {
            const contact = await testService.getContact();
            const response = await request(app.getHttpServer())
                .get(`/api/contacts/${contact.id + 1}`)
                .set('Authorization', 'test');

            logger.info(response.body);

            expect(response.status).toBe(404);
            expect(response.body.errors).toBeDefined();
        });

        it('should be able to get contact', async () => {
            const user = await testService.getUser();
            const contact = await testService.getContact();

            console.log('Test User:', user);
            console.log('Test Contact:', contact);

            const response = await request(app.getHttpServer())
                .get(`/api/contacts/${contact.id}`)
                .set('Authorization', 'test');

            logger.info(response.body);

            expect(response.status).toBe(200);
            expect(response.body.data.id).toBeDefined();
            expect(response.body.data.first_name).toBe('test');
            expect(response.body.data.last_name).toBe('testing');
            expect(response.body.data.email).toBe('testing@mail.com');
            expect(response.body.data.phone).toBe('+6281000111222');
        });
    });

    describe('PUT /api/contacts/:contactId', () => {
        beforeEach(async () => {
            await testService.deleteContact();
            await testService.deleteUser();
            await testService.createUser();
            await testService.createContact();
        });

        it('should be rejected if request is invalid', async () => {
            const contact = await testService.getContact();
            const response = await request(app.getHttpServer())
                .put(`/api/contacts/${contact.id}`)
                .set('Authorization', 'test')
                .send({
                    first_name: '',
                    last_name: '',
                    email: 'wrong mail',
                    phone: '',
                });

            logger.info(response.body);

            expect(response.status).toBe(400);
            expect(response.body.errors).toBeDefined();
        });

        it('should be rejected if contact is not found', async () => {
            const contact = await testService.getContact();
            const response = await request(app.getHttpServer())
                .put(`/api/contacts/${contact.id + 1}`)
                .set('Authorization', 'test')
                .send({
                    first_name: 'test',
                    last_name: 'testing',
                    email: 'testing@mail.com',
                    phone: '+6281000111222',
                });

            logger.info(response.body);

            expect(response.status).toBe(404);
            expect(response.body.errors).toBeDefined();
        });

        it('should be able to update contact', async () => {
            const contact = await testService.getContact();
            const response = await request(app.getHttpServer())
                .put(`/api/contacts/${contact.id}`)
                .set('Authorization', 'test')
                .send({
                    first_name: 'test update',
                    last_name: 'testing update',
                    email: 'testingupdated@mail.com',
                    phone: '+6281111222333',
                });

            logger.info(response.body);

            expect(response.status).toBe(200);
            expect(response.body.data.id).toBeDefined();
            expect(response.body.data.first_name).toBe('test update');
            expect(response.body.data.last_name).toBe('testing update');
            expect(response.body.data.email).toBe('testingupdated@mail.com');
            expect(response.body.data.phone).toBe('+6281111222333');
        });
    });

    describe('DELETE /api/contacts/:contactId', () => {
        beforeEach(async () => {
            await testService.deleteContact();
            await testService.deleteUser();
            await testService.createUser();
            await testService.createContact();
        });

        it('should be rejected if contact is not found', async () => {
            const contact = await testService.getContact();
            const response = await request(app.getHttpServer())
                .delete(`/api/contacts/${contact.id + 1}`)
                .set('Authorization', 'test');

            logger.info(response.body);

            expect(response.status).toBe(404);
            expect(response.body.errors).toBeDefined();
        });

        it('should be able to remove contact', async () => {
            const user = await testService.getUser();
            const contact = await testService.getContact();

            console.log('Test User:', user);
            console.log('Test Contact:', contact);

            const response = await request(app.getHttpServer())
                .delete(`/api/contacts/${contact.id}`)
                .set('Authorization', 'test');

            logger.info(response.body);

            expect(response.status).toBe(200);
            expect(response.body.data).toBe(true);
        });
    });
});
