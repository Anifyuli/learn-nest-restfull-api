import { HttpException, Inject, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { ValidationService } from 'src/common/validation/validation.service';
import {
    LoginUserRequest,
    RegisterUserRequest,
    UserResponse,
} from 'src/model/user.model';
import { v4 as uuid } from 'uuid';
import { Logger } from 'winston';
import { UserValidation } from './user.validation';

@Injectable()
export class UserService {
    constructor(
        private validationService: ValidationService,
        @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
        private prismaService: PrismaService,
    ) {}

    async register(request: RegisterUserRequest): Promise<UserResponse> {
        this.logger.info(`Register new user ${JSON.stringify(request)}`);

        const registerRequest = this.validationService.validate(
            UserValidation.REGISTER,
            request,
        );

        const totalUserWithSameUsername = await this.prismaService.user.count({
            where: { username: registerRequest.username },
        });

        if (totalUserWithSameUsername != 0) {
            throw new HttpException('Username already exist.', 400);
        }

        registerRequest.password = await bcrypt.hash(
            registerRequest.password,
            10,
        );

        const user = await this.prismaService.user.create({
            data: {
                ...registerRequest,
                token: uuid(),
            },
        });

        return {
            username: user.username,
            name: user.name,
            token: user.token,
        };
    }

    async login(request: LoginUserRequest): Promise<UserResponse> {
        this.logger.info(`UserService.login(${JSON.stringify(request)})`);

        const loginRequest = this.validationService.validate(
            UserValidation.LOGIN,
            request,
        );

        const user = await this.prismaService.user.findUnique({
            where: { username: loginRequest.username },
        });

        if (!user) {
            throw new HttpException('Username or password is invalid', 401);
        }

        const isPasswordValid = await bcrypt.compare(
            loginRequest.password,
            user.password,
        );

        if (!isPasswordValid) {
            throw new HttpException('Username or password is invalid', 401);
        }

        const updatedUser = await this.prismaService.user.update({
            where: { username: loginRequest.username },
            data: { token: uuid() },
        });

        return {
            username: updatedUser.username,
            name: updatedUser.name,
            token: updatedUser.token,
        };
    }

    async get(user: User): Promise<UserResponse> {
        return {
            username: user.username,
            name: user.name,
        };
    }
}
