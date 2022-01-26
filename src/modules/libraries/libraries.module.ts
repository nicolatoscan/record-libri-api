import { Module } from '@nestjs/common';
import { LibrariesController } from './libraries.controller';
import { LibrariesService } from './libraries.service';

@Module({
  providers: [LibrariesService],
  controllers: [LibrariesController],
  exports: [LibrariesService],
})
export class LibrariesModule {}
