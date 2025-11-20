import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { Department } from './entities/department.entity';
import { CreateDepartmentInput } from './dto/create-department.input';
import { UpdateDepartmentInput } from './dto/update-department.input';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Resolver(() => Department)
export class DepartmentResolver {
  constructor(private departmentService: DepartmentService) {}

  @Mutation(() => Department)
  async createDepartment(
    @Args('input') createDepartmentInput: CreateDepartmentInput,
  ): Promise<Department> {
    return this.departmentService.create(createDepartmentInput);
  }

  @Query(() => [Department], { name: 'getDepartments' })
  async getDepartments(): Promise<Department[]> {
    return this.departmentService.findAll();
  }

  @Query(() => Department, { name: 'getDepartment' })
  async getDepartment(
    @Args('id', { type: () => ID }) id: number,
  ): Promise<Department> {
    return this.departmentService.findOne(id);
  }

  @Mutation(() => Department)
  async updateDepartment(
    @Args('input') updateDepartmentInput: UpdateDepartmentInput,
  ): Promise<Department> {
    return this.departmentService.update(updateDepartmentInput);
  }

  @Mutation(() => Boolean)
  async deleteDepartment(
    @Args('id', { type: () => ID }) id: number,
  ): Promise<boolean> {
    return this.departmentService.remove(id);
  }
}
