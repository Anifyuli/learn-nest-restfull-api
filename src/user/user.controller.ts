import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Patch,
    Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
    LoginUserRequest,
    RegisterUserRequest,
    UpdateUserRequest,
    UserResponse,
} from 'src/model/user.model';
import { WebResponse } from 'src/model/web.model';
import { Auth } from 'src/common/auth/auth.decorator';
import { User } from '@prisma/client';

@Controller('/api/users')
export class UserController {
    constructor(private userService: UserService) {}

    @Post()
    @HttpCode(200)
    async register(
        @Body() request: RegisterUserRequest,
    ): Promise<WebResponse<UserResponse>> {
        const result = await this.userService.register(request);
        return {
            data: result,
        };
    }

    @Post('/login')
    @HttpCode(200)
    async login(
        @Body() request: LoginUserRequest,
    ): Promise<WebResponse<UserResponse>> {
        const result = await this.userService.login(request);
        return {
            data: result,
        };
    }

    @Get('/current')
    @HttpCode(200)
    async get(@Auth() user: User): Promise<WebResponse<UserResponse>> {
        const result = await this.userService.get(user);
        return {
            data: result,
        };
    }

    @Patch('/current')
    @HttpCode(200)
    async update(
        @Auth() user: User,
        @Body() request: UpdateUserRequest,
    ): Promise<WebResponse<UserResponse>> {
        const result = await this.userService.update(user, request);
        return {
            data: result,
        };
    }

    @Delete('/current')
    @HttpCode(200)
    async logout(@Auth() user: User): Promise<WebResponse<boolean>> {
        await this.userService.logout(user);
        return {
            data: true,
        };
    }
}
