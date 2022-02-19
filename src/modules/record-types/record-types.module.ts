import { Module } from '@nestjs/common';
import { RecordTypesController } from './record-types.controller';
import { RecordTypesService } from './record-types.service';

@Module({
  providers: [RecordTypesService],
  controllers: [RecordTypesController],
  exports: [RecordTypesService],
})
export class RecordTypesModule {}
