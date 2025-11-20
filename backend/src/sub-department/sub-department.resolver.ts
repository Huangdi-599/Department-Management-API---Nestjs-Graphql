import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { SubDepartmentService } from './sub-department.service';
import { SubDepartment } from './entities/sub-department.entity';
import { CreateSubDepartmentInput } from './dto/create-sub-department.input';
import { UpdateSubDepartmentInput } from './dto/update-sub-department.input';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Resolver(() => SubDepartment)
export class SubDepartmentResolver {
  constructor(private subDepartmentService: SubDepartmentService) {}

  @Mutation(() => SubDepartment)
  async createSubDepartment(
    @Args('input') createSubDepartmentInput: CreateSubDepartmentInput,
  ): Promise<SubDepartment> {
    return this.subDepartmentService.create(createSubDepartmentInput);
  }

  @Query(() => [SubDepartment], { name: 'getSubDepartments' })
  async getSubDepartments(): Promise<SubDepartment[]> {
    return this.subDepartmentService.findAll();
  }

  @Query(() => SubDepartment, { name: 'getSubDepartment' })
  async getSubDepartment(@Args('id', { type: () => ID }) id: number): Promise<SubDepartment> {
    return this.subDepartmentService.findOne(id);
  }

  @Mutation(() => SubDepartment)
  async updateSubDepartment(
    @Args('input') updateSubDepartmentInput: UpdateSubDepartmentInput,
  ): Promise<SubDepartment> {
    return this.subDepartmentService.update(updateSubDepartmentInput);
  }

  @Mutation(() => Boolean)
  async deleteSubDepartment(@Args('id', { type: () => ID }) id: number): Promise<boolean> {
    return this.subDepartmentService.remove(id);
  }
}

