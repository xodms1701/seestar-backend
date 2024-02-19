import { Module } from '@nestjs/common';
import { BatchService } from './batch.service';
import { PrismaService } from '../prisma.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule.register({
      timeout: 10000,
      maxRedirects: 5,
    }),
  ],
  providers: [BatchService, PrismaService],
})
export class BatchModule {}
