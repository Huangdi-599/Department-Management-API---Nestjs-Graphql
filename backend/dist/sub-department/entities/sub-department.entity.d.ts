import { Department } from '../../department/entities/department.entity';
export declare class SubDepartment {
    id: number;
    name: string;
    departmentId: number;
    department: Department;
    createdAt: Date;
    updatedAt: Date;
}
