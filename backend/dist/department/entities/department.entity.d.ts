import { SubDepartment } from '../../sub-department/entities/sub-department.entity';
export declare class Department {
    id: number;
    name: string;
    subDepartments: SubDepartment[];
    createdAt: Date;
    updatedAt: Date;
}
