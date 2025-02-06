import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';
import { TestModule } from './test/test.module';
import { ContactModule } from './contact/contact.module';

@Module({
    imports: [CommonModule, UserModule, TestModule, ContactModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
