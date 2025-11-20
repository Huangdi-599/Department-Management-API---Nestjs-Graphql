import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubDepartmentService } from './sub-department.service';
import { SubDepartmentResolver } from './sub-department.resolver';
import { SubDepartment } from './entities/sub-department.entity';
import { Department } from '../department/entities/department.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SubDepartment, Department])],
  providers: [SubDepartmentService, SubDepartmentResolver],
  exports: [SubDepartmentService],
})
export class SubDepartmentModule {}

