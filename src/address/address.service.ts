import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { ValidationService } from 'src/common/validation/validation.service';
import { Address, User } from '@prisma/client';
import {
    AddressResponse,
    CreateAddressRequest,
    GetAddressRequest,
    RemoveAddressRequest,
    UpdateAddressRequest,
} from 'src/model/address.model';
import { AddressValidation } from './address.validation';
import { ContactService } from 'src/contact/contact.service';
import { HttpException, Inject, Injectable } from '@nestjs/common';

@Injectable()
export class AddressService {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
        private prismaService: PrismaService,
        private validationService: ValidationService,
        private contactService: ContactService,
    ) {}

    toAddressResponse(address: Address) {
        return {
            id: address.id,
            street: address.street,
            city: address.city,
            province: address.province,
            country: address.country,
            postal_code: address.postal_code,
        };
    }

    async addressIsExists(
        contact_id: number,
        address_id: number,
    ): Promise<Address> {
        const address = await this.prismaService.address.findFirst({
            where: {
                id: address_id,
                contact_id: contact_id,
            },
        });

        if (!address) {
            throw new HttpException('Address not found', 404);
        }

        return address;
    }

    async create(
        user: User,
        request: CreateAddressRequest,
    ): Promise<AddressResponse> {
        const createRequest: CreateAddressRequest =
            this.validationService.validate(AddressValidation.CREATE, request);

        await this.contactService.contactIsExists(
            user.username,
            createRequest.contact_id,
        );

        const address = await this.prismaService.address.create({
            data: createRequest,
        });

        this.logger.debug(
            `AddressService.create(${JSON.stringify(user)}, ${JSON.stringify(request)})`,
        );

        return this.toAddressResponse(address);
    }

    async get(
        user: User,
        request: GetAddressRequest,
    ): Promise<AddressResponse> {
        const getRequest: GetAddressRequest = this.validationService.validate(
            AddressValidation.GET,
            request,
        );

        await this.contactService.contactIsExists(
            user.username,
            getRequest.contact_id,
        );

        const address = await this.addressIsExists(
            getRequest.contact_id,
            getRequest.address_id,
        );

        return this.toAddressResponse(address);
    }

    async update(
        user: User,
        request: UpdateAddressRequest,
    ): Promise<AddressResponse> {
        const updateRequest: UpdateAddressRequest =
            this.validationService.validate(AddressValidation.UPDATE, request);

        await this.contactService.contactIsExists(
            user.username,
            updateRequest.contact_id,
        );

        let address = await this.addressIsExists(
            updateRequest.contact_id,
            updateRequest.id,
        );

        address = await this.prismaService.address.update({
            where: {
                id: address.id,
                contact_id: address.contact_id,
            },
            data: updateRequest,
        });

        return this.toAddressResponse(address);
    }

    async remove(
        user: User,
        request: RemoveAddressRequest,
    ): Promise<AddressResponse> {
        const removeRequest: RemoveAddressRequest =
            this.validationService.validate(AddressValidation.REMOVE, request);

        await this.contactService.contactIsExists(
            user.username,
            removeRequest.contact_id,
        );

        await this.addressIsExists(
            removeRequest.contact_id,
            removeRequest.address_id,
        );

        const address = await this.prismaService.address.delete({
            where: {
                id: removeRequest.address_id,
                contact_id: removeRequest.contact_id,
            },
        });

        return this.toAddressResponse(address);
    }

    async list(user: User, contact_id: number): Promise<AddressResponse[]> {
        await this.contactService.contactIsExists(user.username, contact_id);

        const addresses = this.prismaService.address.findMany({
            where: {
                contact_id: contact_id,
            },
        });

        return (await addresses).map((address) =>
            this.toAddressResponse(address),
        );
    }
}
