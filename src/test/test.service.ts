import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Contact, User } from '@prisma/client';

@Injectable()
export class TestService {
    constructor(private prismaService: PrismaService) {}

    async getContact(): Promise<Contact> {
        return this.prismaService.contact.findFirst({
            where: {
                username: 'test',
            },
        });
    }

    async createContact() {
        await this.prismaService.contact.create({
            data: {
                username: 'test',
                first_name: 'test',
                last_name: 'testing',
                email: 'testing@mail.com',
                phone: '+6281000111222',
            },
        });
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
