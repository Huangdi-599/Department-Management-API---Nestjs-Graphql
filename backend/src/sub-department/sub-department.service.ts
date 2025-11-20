import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubDepartment } from './entities/sub-department.entity';
import { Department } from '../department/entities/department.entity';
import { CreateSubDepartmentInput } from './dto/create-sub-department.input';
import { UpdateSubDepartmentInput } from './dto/update-sub-department.input';

@Injectable()
export class SubDepartmentService {
  constructor(
    @InjectRepository(SubDepartment)
    private subDepartmentRepository: Repository<SubDepartment>,
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
  ) {}

  async create(createSubDepartmentInput: CreateSubDepartmentInput): Promise<SubDepartment> {
    const { name, departmentId } = createSubDepartmentInput;

    // Verify department exists
    const department = await this.departmentRepository.findOne({
      where: { id: departmentId },
    });

    if (!department) {
      throw new NotFoundException(`Department with ID ${departmentId} not found`);
    }

    const subDepartment = this.subDepartmentRepository.create({
      name,
      department,
    });

    return this.subDepartmentRepository.save(subDepartment);
  }

  async findAll(): Promise<SubDepartment[]> {
    return this.subDepartmentRepository.find({
      relations: ['department'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<SubDepartment> {
    const subDepartment = await this.subDepartmentRepository.findOne({
      where: { id },
      relations: ['department'],
    });

    if (!subDepartment) {
      throw new NotFoundException(`SubDepartment with ID ${id} not found`);
    }

    return subDepartment;
  }

  async update(updateSubDepartmentInput: UpdateSubDepartmentInput): Promise<SubDepartment> {
    const { id, name } = updateSubDepartmentInput;

    const subDepartment = await this.findOne(id);
    subDepartment.name = name;

    return this.subDepartmentRepository.save(subDepartment);
  }

  async remove(id: number): Promise<boolean> {
    const subDepartment = await this.findOne(id);
    await this.subDepartmentRepository.remove(subDepartment);
    return true;
  }
}

