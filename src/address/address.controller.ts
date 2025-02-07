import {
    Body,
    Controller,
    Get,
    HttpCode,
    Param,
    ParseIntPipe,
    Post,
    Put,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { User } from '@prisma/client';
import { Auth } from 'src/common/auth/auth.decorator';
import {
    AddressResponse,
    CreateAddressRequest,
    GetAddressRequest,
    UpdateAddressRequest,
} from 'src/model/address.model';
import { WebResponse } from 'src/model/web.model';

@Controller('/api/contacts/:contactId/addresses')
export class AddressController {
    constructor(private addressService: AddressService) {}

    @Post()
    @HttpCode(200)
    async create(
        @Auth() user: User,
        @Param('contactId', ParseIntPipe) contactId: number,
        @Body() request: CreateAddressRequest,
    ): Promise<WebResponse<AddressResponse>> {
        request.contact_id = contactId;

        const result = await this.addressService.create(user, request);
        return {
            data: result,
        };
    }

    @Get('/:addressId')
    @HttpCode(200)
    async get(
        @Auth() user: User,
        @Param('contactId', ParseIntPipe) contactId: number,
        @Param('addressId', ParseIntPipe) addressId: number,
    ): Promise<WebResponse<AddressResponse>> {
        const request: GetAddressRequest = {
            contact_id: contactId,
            address_id: addressId,
        };

        const result = await this.addressService.get(user, request);
        return {
            data: result,
        };
    }

    @Put('/:addressId')
    @HttpCode(200)
    async update(
        @Auth() user: User,
        @Param('contactId', ParseIntPipe) contactId: number,
        @Param('addressId', ParseIntPipe) addressId: number,
        @Body() request: UpdateAddressRequest,
    ): Promise<WebResponse<AddressResponse>> {
        request.contact_id = contactId;
        request.id = addressId;
        const result = await this.addressService.update(user, request);
        return {
            data: result,
        };
    }
}
