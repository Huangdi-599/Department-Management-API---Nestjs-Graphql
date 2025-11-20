import { DepartmentService } from './department.service';
import { Department } from './entities/department.entity';
import { CreateDepartmentInput } from './dto/create-department.input';
import { UpdateDepartmentInput } from './dto/update-department.input';
export declare class DepartmentResolver {
    private departmentService;
    constructor(departmentService: DepartmentService);
    createDepartment(createDepartmentInput: CreateDepartmentInput): Promise<Department>;
    getDepartments(): Promise<Department[]>;
    getDepartment(id: number): Promise<Department>;
    updateDepartment(updateDepartmentInput: UpdateDepartmentInput): Promise<Department>;
    deleteDepartment(id: number): Promise<boolean>;
}
