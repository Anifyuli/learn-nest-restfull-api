import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    ParseIntPipe,
    Post,
    Put,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { Auth } from 'src/common/auth/auth.decorator';
import {
    ContactResponse,
    CreateContactRequest,
    UpdateContactRequest,
} from 'src/model/contact.model';
import { WebResponse } from 'src/model/web.model';
import { ContactService } from './contact.service';

@Controller('/api/contacts')
export class ContactController {
    constructor(private contactService: ContactService) {}

    @Post()
    @HttpCode(200)
    async create(
        @Auth() user: User,
        @Body() request: CreateContactRequest,
    ): Promise<WebResponse<ContactResponse>> {
        const result = await this.contactService.create(user, request);

        return {
            data: result,
        };
    }

    @Get('/:contactId')
    @HttpCode(200)
    async get(
        @Auth() user: User,
        @Param('contactId', ParseIntPipe) contactId: number,
    ): Promise<WebResponse<ContactResponse>> {
        const result = await this.contactService.get(user, contactId);

        return {
            data: result,
        };
    }

    @Put('/:contactId')
    @HttpCode(200)
    async update(
        @Auth() user: User,
        @Param('contactId', ParseIntPipe) contactId: number,
        @Body()
        request: UpdateContactRequest,
    ): Promise<WebResponse<ContactResponse>> {
        request.id = contactId;
        const result = await this.contactService.update(user, request);

        return {
            data: result,
        };
    }

    @Delete('/:contactId')
    @HttpCode(200)
    async remove(
        @Auth() user: User,
        @Param('contactId', ParseIntPipe) contactId: number,
    ): Promise<WebResponse<boolean>> {
        await this.contactService.remove(user, contactId);

        return {
            data: true,
        };
    }
}
