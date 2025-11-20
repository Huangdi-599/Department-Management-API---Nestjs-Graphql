"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepartmentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const department_entity_1 = require("./entities/department.entity");
const sub_department_entity_1 = require("../sub-department/entities/sub-department.entity");
let DepartmentService = class DepartmentService {
    constructor(departmentRepository, subDepartmentRepository) {
        this.departmentRepository = departmentRepository;
        this.subDepartmentRepository = subDepartmentRepository;
    }
    async create(createDepartmentInput) {
        const { name, subDepartments } = createDepartmentInput;
        const department = this.departmentRepository.create({ name });
        const savedDepartment = await this.departmentRepository.save(department);
        if (subDepartments && subDepartments.length > 0) {
            const subDeptEntities = subDepartments.map((subDept) => this.subDepartmentRepository.create({
                name: subDept.name,
                departmentId: savedDepartment.id,
                department: savedDepartment,
            }));
            savedDepartment.subDepartments =
                await this.subDepartmentRepository.save(subDeptEntities);
        }
        else {
            savedDepartment.subDepartments = [];
        }
        return savedDepartment;
    }
    async findAll() {
        return this.departmentRepository.find({
            relations: ['subDepartments'],
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const department = await this.departmentRepository.findOne({
            where: { id },
            relations: ['subDepartments'],
        });
        if (!department) {
            throw new common_1.NotFoundException(`Department with ID ${id} not found`);
        }
        return department;
    }
    async update(updateDepartmentInput) {
        const { id, name, subDepartments } = updateDepartmentInput;
        const department = await this.findOne(id);
        department.name = name;
        const savedDepartment = await this.departmentRepository.save(department);
        if (subDepartments !== undefined) {
            const existingSubDepts = department.subDepartments || [];
            const subDeptIdsToKeep = subDepartments
                .map((sd) => sd.id)
                .filter((subDeptId) => subDeptId !== undefined);
            const subDeptsToDelete = existingSubDepts.filter((existing) => !subDeptIdsToKeep.includes(existing.id));
            if (subDeptsToDelete.length > 0) {
                await this.subDepartmentRepository.remove(subDeptsToDelete);
            }
            const subDeptPromises = subDepartments.map(async (subDeptInput) => {
                if (subDeptInput.id) {
                    const existingSubDept = existingSubDepts.find((sd) => sd.id === subDeptInput.id);
                    if (existingSubDept) {
                        existingSubDept.name = subDeptInput.name;
                        return this.subDepartmentRepository.save(existingSubDept);
                    }
                }
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
        return this.findOne(savedDepartment.id);
    }
    async remove(id) {
        const department = await this.findOne(id);
        await this.departmentRepository.remove(department);
        return true;
    }
};
exports.DepartmentService = DepartmentService;
exports.DepartmentService = DepartmentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(department_entity_1.Department)),
    __param(1, (0, typeorm_1.InjectRepository)(sub_department_entity_1.SubDepartment)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], DepartmentService);
//# sourceMappingURL=department.service.js.map