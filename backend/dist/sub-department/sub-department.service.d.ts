import { Repository } from 'typeorm';
import { SubDepartment } from './entities/sub-department.entity';
import { Department } from '../department/entities/department.entity';
import { CreateSubDepartmentInput } from './dto/create-sub-department.input';
import { UpdateSubDepartmentInput } from './dto/update-sub-department.input';
export declare class SubDepartmentService {
    private subDepartmentRepository;
    private departmentRepository;
    constructor(subDepartmentRepository: Repository<SubDepartment>, departmentRepository: Repository<Department>);
    create(createSubDepartmentInput: CreateSubDepartmentInput): Promise<SubDepartment>;
    findAll(): Promise<SubDepartment[]>;
    findOne(id: number): Promise<SubDepartment>;
    update(updateSubDepartmentInput: UpdateSubDepartmentInput): Promise<SubDepartment>;
    remove(id: number): Promise<boolean>;
}
