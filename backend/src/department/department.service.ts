import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from './entities/department.entity';
import { SubDepartment } from '../sub-department/entities/sub-department.entity';
import { CreateDepartmentInput } from './dto/create-department.input';
import { UpdateDepartmentInput } from './dto/update-department.input';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
    @InjectRepository(SubDepartment)
    private subDepartmentRepository: Repository<SubDepartment>,
  ) {}

  async create(
    createDepartmentInput: CreateDepartmentInput,
  ): Promise<Department> {
    const { name, subDepartments } = createDepartmentInput;

    // Create and save department first to get the ID
    const department = this.departmentRepository.create({ name });
    const savedDepartment = await this.departmentRepository.save(department);

    // If sub-departments are provided, create them with the department ID
    if (subDepartments && subDepartments.length > 0) {
      const subDeptEntities = subDepartments.map((subDept) =>
        this.subDepartmentRepository.create({
          name: subDept.name,
          departmentId: savedDepartment.id,
          department: savedDepartment,
        }),
      );
      savedDepartment.subDepartments =
        await this.subDepartmentRepository.save(subDeptEntities);
    } else {
      savedDepartment.subDepartments = [];
    }

    return savedDepartment;
  }

  async findAll(): Promise<Department[]> {
    return this.departmentRepository.find({
      relations: ['subDepartments'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Department> {
    const department = await this.departmentRepository.findOne({
      where: { id },
      relations: ['subDepartments'],
    });

    if (!department) {
      throw new NotFoundException(`Department with ID ${id} not found`);
    }

    return department;
  }

  async update(
    updateDepartmentInput: UpdateDepartmentInput,
  ): Promise<Department> {
    const { id, name, subDepartments } = updateDepartmentInput;

    const department = await this.findOne(id);
    department.name = name;

    // Save the department first
    const savedDepartment = await this.departmentRepository.save(department);

    // Handle sub-departments if provided
    if (subDepartments !== undefined) {
      // Get existing sub-departments
      const existingSubDepts = department.subDepartments || [];

      // Extract IDs of sub-departments to keep (those with IDs in the input)
      const subDeptIdsToKeep = subDepartments
        .map((sd) => sd.id)
        .filter((subDeptId): subDeptId is number => subDeptId !== undefined);

      // Delete sub-departments that are not in the new list
      const subDeptsToDelete = existingSubDepts.filter(
        (existing) => !subDeptIdsToKeep.includes(existing.id),
      );
      if (subDeptsToDelete.length > 0) {
        await this.subDepartmentRepository.remove(subDeptsToDelete);
      }

      // Update or create sub-departments
      const subDeptPromises = subDepartments.map(async (subDeptInput) => {
        if (subDeptInput.id) {
          // Update existing sub-department
          const existingSubDept = existingSubDepts.find(
            (sd) => sd.id === subDeptInput.id,
          );
          if (existingSubDept) {
            existingSubDept.name = subDeptInput.name;
            return this.subDepartmentRepository.save(existingSubDept);
          }
          // If ID provided but not found in this department's sub-departments,
          // treat it as a new sub-department (ID might be invalid or belong to another department)
        }
        // Create new sub-department (either no ID or invalid ID)
        const newSubDept = this.subDepartmentRepository.create({
          name: subDeptInput.name,
          departmentId: savedDepartment.id,
          department: savedDepartment,
        });
        return this.subDepartmentRepository.save(newSubDept);
      });

      const updatedSubDepts = await Promise.all(subDeptPromises);
      savedDepartment.subDepartments = updatedSubDepts;
    }

    // Reload to get the latest sub-departments
    return this.findOne(savedDepartment.id);
  }

  async remove(id: number): Promise<boolean> {
    const department = await this.findOne(id);

    // Cascade delete will automatically delete sub-departments
    await this.departmentRepository.remove(department);

    return true;
  }
}
