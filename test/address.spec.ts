import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TestService } from 'src/test/test.service';
import { TestModule } from 'src/test/test.module';

describe('AddressController', () => {
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

    describe('POST /api/contacts/:contactId/addresses', () => {
        beforeEach(async () => {
            await testService.deleteAll();
            await testService.createUser();
            await testService.createContact();
        }, 1000);

        it('should be rejected if request is invalid', async () => {
            const contact = await testService.getContact();
            const response = await request(app.getHttpServer())
                .post(`/api/contacts/${contact.id}/addresses`)
                .set('Authorization', 'test')
                .send({
                    street: '',
                    city: '',
                    province: '',
                    country: '',
                    postal_code: '',
                });

            logger.info(response.body);

            expect(response.status).toBe(400);
            expect(response.body.errors).toBeDefined();
        });

        it('should be able to create address', async () => {
            const contact = await testService.getContact();
            const response = await request(app.getHttpServer())
                .post(`/api/contacts/${contact.id}/addresses`)
                .set('Authorization', 'test')
                .send({
                    street: 'street test',
                    city: 'city test',
                    province: 'province testing',
                    country: 'country test',
                    postal_code: '12233',
                });

            logger.info(response.body);

            expect(response.status).toBe(200);
            expect(response.body.data.id).toBeDefined();
            expect(response.body.data.street).toBe('street test');
            expect(response.body.data.city).toBe('city test');
            expect(response.body.data.province).toBe('province testing');
            expect(response.body.data.country).toBe('country test');
            expect(response.body.data.postal_code).toBe('12233');
        });
    });

    describe('GET /api/contacts/:contactId/addresses/:addressId', () => {
        beforeEach(async () => {
            await testService.deleteAll();
            await testService.createUser();
            await testService.createContact();
            await testService.createAddress();
        }, 1000);

        it('should be rejected if address is not found', async () => {
            const contact = await testService.getContact();
            const address = await testService.getAddress();
            const response = await request(app.getHttpServer())
                .get(`/api/contacts/${contact.id}/addresses/${address.id + 1}`)
                .set('Authorization', 'test');

            logger.info(response.body);

            expect(response.status).toBe(404);
            expect(response.body.errors).toBeDefined();
        });

        it('should be able to get address', async () => {
            const contact = await testService.getContact();
            const address = await testService.getAddress();
            const response = await request(app.getHttpServer())
                .get(`/api/contacts/${contact.id}/addresses/${address.id}`)
                .set('Authorization', 'test');

            logger.info(response.body);

            expect(response.status).toBe(200);
            expect(response.body.data.id).toBeDefined();
            expect(response.body.data.street).toBe('street test');
            expect(response.body.data.city).toBe('city test');
            expect(response.body.data.province).toBe('province testing');
            expect(response.body.data.country).toBe('country test');
            expect(response.body.data.postal_code).toBe('12233');
        });
    });

    describe('PUT /api/contacts/:contactId/addresses/:addressId', () => {
        beforeEach(async () => {
            await testService.deleteAll();
            await testService.createUser();
            await testService.createContact();
            await testService.createAddress();
        }, 1000);

        it('should be rejected if request is invalid', async () => {
            const contact = await testService.getContact();
            const address = await testService.getAddress();
            const response = await request(app.getHttpServer())
                .put(`/api/contacts/${contact.id}/addresses/${address.id}`)
                .set('Authorization', 'test')
                .send({
                    street: '',
                    city: '',
                    province: '',
                    country: '',
                    postal_code: '',
                });

            logger.info(response.body);

            expect(response.status).toBe(400);
            expect(response.body.errors).toBeDefined();
        });

        it('should be rejected if contact is not found', async () => {
            const contact = await testService.getContact();
            const address = await testService.getAddress();
            const response = await request(app.getHttpServer())
                .put(`/api/contacts/${contact.id + 1}/addresses/${address.id}`)
                .set('Authorization', 'test')
                .send({
                    street: 'street test',
                    city: 'city test',
                    province: 'province testing',
                    country: 'country test',
                    postal_code: '12233',
                });

            logger.info(response.body);

            expect(response.status).toBe(404);
            expect(response.body.errors).toBeDefined();
        });

        it('should be rejected if address is not found', async () => {
            const contact = await testService.getContact();
            const address = await testService.getAddress();
            const response = await request(app.getHttpServer())
                .put(`/api/contacts/${contact.id}/addresses/${address.id + 1}`)
                .set('Authorization', 'test')
                .send({
                    street: 'street test',
                    city: 'city test',
                    province: 'province testing',
                    country: 'country test',
                    postal_code: '12233',
                });

            logger.info(response.body);

            expect(response.status).toBe(404);
            expect(response.body.errors).toBeDefined();
        });

        it('should be able to update address', async () => {
            const contact = await testService.getContact();
            const address = await testService.getAddress();
            const response = await request(app.getHttpServer())
                .put(`/api/contacts/${contact.id}/addresses/${address.id}`)
                .set('Authorization', 'test')
                .send({
                    street: 'street test',
                    city: 'city test',
                    province: 'province testing',
                    country: 'country test',
                    postal_code: '12233',
                });

            logger.info(response.body);

            expect(response.status).toBe(200);
            expect(response.body.data.id).toBeDefined();
            expect(response.body.data.street).toBe('street test');
            expect(response.body.data.city).toBe('city test');
            expect(response.body.data.province).toBe('province testing');
            expect(response.body.data.country).toBe('country test');
            expect(response.body.data.postal_code).toBe('12233');
        });
    });

    describe('DELETE /api/contacts/:contactId/addresses/:addressId', () => {
        beforeEach(async () => {
            await testService.deleteAll();
            await testService.createUser();
            await testService.createContact();
            await testService.createAddress();
        }, 1000);

        it('should be rejected if address is not found', async () => {
            const contact = await testService.getContact();
            const address = await testService.getAddress();
            const response = await request(app.getHttpServer())
                .delete(
                    `/api/contacts/${contact.id}/addresses/${address.id + 1}`,
                )
                .set('Authorization', 'test');

            logger.info(response.body);

            expect(response.status).toBe(404);
            expect(response.body.errors).toBeDefined();
        });

        it('should be able to delete address', async () => {
            const contact = await testService.getContact();
            const address = await testService.getAddress();
            const response = await request(app.getHttpServer())
                .delete(`/api/contacts/${contact.id}/addresses/${address.id}`)
                .set('Authorization', 'test');

            logger.info(response.body);

            expect(response.status).toBe(200);
            expect(response.body.data).toBe(true);

            const addressResult = await testService.getAddress();
            expect(addressResult).toBeNull();
        });
    });

    describe('GET /api/contacts/:contactId/addresses', () => {
        beforeEach(async () => {
            await testService.deleteAll();
            await testService.createUser();
            await testService.createContact();
            await testService.createAddress();
        }, 1000);

        it('should be rejected if contact is not found', async () => {
            const contact = await testService.getContact();
            const response = await request(app.getHttpServer())
                .get(`/api/contacts/${contact.id + 1}/addresses`)
                .set('Authorization', 'test');

            logger.info(response.body);

            expect(response.status).toBe(404);
            expect(response.body.errors).toBeDefined();
        });

        it('should be able to list address', async () => {
            const contact = await testService.getContact();
            const response = await request(app.getHttpServer())
                .get(`/api/contacts/${contact.id}/addresses`)
                .set('Authorization', 'test');

            logger.info(response.body);

            expect(response.status).toBe(200);
            expect(response.body.data.length).toBe(1);
            expect(response.body.data[0].id).toBeDefined();
            expect(response.body.data[0].street).toBe('street test');
            expect(response.body.data[0].city).toBe('city test');
            expect(response.body.data[0].province).toBe('province testing');
            expect(response.body.data[0].country).toBe('country test');
            expect(response.body.data[0].postal_code).toBe('12233');
        });
    });
});
