import { Module } from '@nestjs/common';
import { NonCompliancesController } from './non-compliances.controller';
import { NonCompliancesService } from './non-compliances.service';

@Module({
  providers: [NonCompliancesService],
  controllers: [NonCompliancesController],
  exports: [NonCompliancesService],
})
export class NonCompliancesModule {}
