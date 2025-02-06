import { HttpException, Inject, Injectable } from '@nestjs/common';
import { Contact, User } from '@prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { ValidationService } from 'src/common/validation/validation.service';
import {
    ContactResponse,
    CreateContactRequest,
    SearchContactRequest,
    UpdateContactRequest,
} from 'src/model/contact.model';
import { Logger } from 'winston';
import { ContactValidation } from './contact.validation';
import { WebResponse } from 'src/model/web.model';

@Injectable()
export class ContactService {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
        private prismaService: PrismaService,
        private validationService: ValidationService,
    ) {}

    toContactResponse(contact: Contact): ContactResponse {
        return {
            id: contact.id,
            first_name: contact.first_name,
            last_name: contact.last_name,
            email: contact.email,
            phone: contact.phone,
        };
    }

    async contactIsExists(
        username: string,
        contactId: number,
    ): Promise<Contact> {
        const contact = await this.prismaService.contact.findFirst({
            where: {
                id: contactId,
                username: username,
            },
        });

        console.log('Contact found:', contact);

        if (!contact) {
            throw new HttpException('Contact not found', 404);
        }

        return contact;
    }

    async create(
        user: User,
        request: CreateContactRequest,
    ): Promise<ContactResponse> {
        this.logger.debug(
            `ContactService create(${JSON.stringify(user)}, ${JSON.stringify(request)})`,
        );
        const createRequest: CreateContactRequest =
            this.validationService.validate(ContactValidation.CREATE, request);
        const contact = await this.prismaService.contact.create({
            data: {
                ...createRequest,
                ...{ username: user.username },
            },
        });

        return this.toContactResponse(contact);
    }

    async get(user: User, contactId: number): Promise<ContactResponse> {
        const contact = await this.contactIsExists(user.username, contactId);

        return this.toContactResponse(contact);
    }

    async update(
        user: User,
        request: UpdateContactRequest,
    ): Promise<ContactResponse> {
        const updateRequest = this.validationService.validate(
            ContactValidation.UPDATE,
            request,
        );
        let contact = await this.contactIsExists(
            user.username,
            updateRequest.id,
        );

        contact = await this.prismaService.contact.update({
            where: {
                id: contact.id,
            },
            data: updateRequest,
        });

        return this.toContactResponse(contact);
    }

    async remove(user: User, contactId: number): Promise<ContactResponse> {
        await this.contactIsExists(user.username, contactId);

        const contact = await this.prismaService.contact.delete({
            where: {
                id: contactId,
                username: user.username,
            },
        });

        return this.toContactResponse(contact);
    }

    async search(
        user: User,
        request: SearchContactRequest,
    ): Promise<WebResponse<ContactResponse[]>> {
        const searchRequest: SearchContactRequest =
            this.validationService.validate(ContactValidation.SEARCH, request);

        const filters = [];

        if (searchRequest.name) {
            filters.push({
                OR: [
                    {
                        first_name: {
                            contains: searchRequest.name,
                        },
                    },
                    {
                        last_name: {
                            contains: searchRequest.name,
                        },
                    },
                ],
            });
        }

        if (searchRequest.email) {
            filters.push({
                email: {
                    contains: searchRequest.email,
                },
            });
        }

        if (searchRequest.phone) {
            filters.push({
                phone: {
                    contains: searchRequest.phone,
                },
            });
        }

        const skip = (searchRequest.page - 1) * searchRequest.size;

        const contacts = await this.prismaService.contact.findMany({
            where: {
                username: user.username,
                AND: filters,
            },
            take: searchRequest.size,
            skip: skip,
        });

        const total = await this.prismaService.contact.count({
            where: {
                username: user.username,
                AND: filters,
            },
        });

        return {
            data: contacts.map((contact) => this.toContactResponse(contact)),
            paging: {
                current_page: searchRequest.page,
                size: searchRequest.size,
                total_page: Math.ceil(total / searchRequest.size),
            },
        };
    }
}
