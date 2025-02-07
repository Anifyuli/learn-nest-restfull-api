import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Address, Contact, User } from '@prisma/client';

@Injectable()
export class TestService {
    constructor(private prismaService: PrismaService) {}

    async getAddress(): Promise<Address> {
        return this.prismaService.address.findFirst({
            where: {
                contact: {
                    username: 'test',
                },
            },
        });
    }

    async createAddress() {
        const contact = await this.getContact();
        await this.prismaService.address.create({
            data: {
                contact_id: contact.id,
                street: 'street test',
                city: 'city test',
                province: 'province testing',
                country: 'country test',
                postal_code: '12233',
            },
        });
    }

    async deleteAddress() {
        await this.prismaService.address.deleteMany({
            where: {
                contact: {
                    username: 'test',
                },
            },
        });
    }

    async getContact(): Promise<Contact | null> {
        const contact = await this.prismaService.contact.findFirst({
            where: {
                username: 'test',
            },
        });
        console.log('Fetched Contact:', contact);
        return contact;
    }

    async createContact() {
        const contact = await this.prismaService.contact.create({
            data: {
                username: 'test',
                first_name: 'test',
                last_name: 'testing',
                email: 'testing@mail.com',
                phone: '+6281000111222',
            },
        });
        console.log('Created Contact:', contact);
    }

    async deleteContact() {
        await this.prismaService.contact.deleteMany({
            where: {
                username: 'test',
            },
        });
    }

    async deleteUser() {
        await this.prismaService.user.deleteMany({
            where: {
                username: 'test',
            },
        });
    }

    async getUser(): Promise<User> {
        return this.prismaService.user.findUnique({
            where: {
                username: 'test',
            },
        });
    }

    async createUser() {
        const existingUser = await this.prismaService.user.findUnique({
            where: { username: 'test' },
        });
        if (!existingUser) {
            await this.prismaService.user.create({
                data: {
                    username: 'test',
                    name: 'test',
                    password: await bcrypt.hash('test', 10),
                    token: 'test',
                },
            });
        }
    }
}
