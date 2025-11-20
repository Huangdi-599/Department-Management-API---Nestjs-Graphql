import { Repository } from 'typeorm';
import { Department } from './entities/department.entity';
import { SubDepartment } from '../sub-department/entities/sub-department.entity';
import { CreateDepartmentInput } from './dto/create-department.input';
import { UpdateDepartmentInput } from './dto/update-department.input';
export declare class DepartmentService {
    private departmentRepository;
    private subDepartmentRepository;
    constructor(departmentRepository: Repository<Department>, subDepartmentRepository: Repository<SubDepartment>);
    create(createDepartmentInput: CreateDepartmentInput): Promise<Department>;
    findAll(): Promise<Department[]>;
    findOne(id: number): Promise<Department>;
    update(updateDepartmentInput: UpdateDepartmentInput): Promise<Department>;
    remove(id: number): Promise<boolean>;
}
