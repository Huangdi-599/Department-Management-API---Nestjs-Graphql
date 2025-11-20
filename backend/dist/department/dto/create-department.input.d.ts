declare class SubDepartmentInput {
    name: string;
}
export declare class CreateDepartmentInput {
    name: string;
    subDepartments?: SubDepartmentInput[];
}
export {};
