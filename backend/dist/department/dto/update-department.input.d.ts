declare class UpdateDepartmentSubDepartmentInput {
    id?: number;
    name: string;
}
export declare class UpdateDepartmentInput {
    id: number;
    name: string;
    subDepartments?: UpdateDepartmentSubDepartmentInput[];
}
export {};
