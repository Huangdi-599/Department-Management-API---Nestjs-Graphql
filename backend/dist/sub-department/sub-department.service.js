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
exports.SubDepartmentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const sub_department_entity_1 = require("./entities/sub-department.entity");
const department_entity_1 = require("../department/entities/department.entity");
let SubDepartmentService = class SubDepartmentService {
    constructor(subDepartmentRepository, departmentRepository) {
        this.subDepartmentRepository = subDepartmentRepository;
        this.departmentRepository = departmentRepository;
    }
    async create(createSubDepartmentInput) {
        const { name, departmentId } = createSubDepartmentInput;
        const department = await this.departmentRepository.findOne({
            where: { id: departmentId },
        });
        if (!department) {
            throw new common_1.NotFoundException(`Department with ID ${departmentId} not found`);
        }
        const subDepartment = this.subDepartmentRepository.create({
            name,
            department,
        });
        return this.subDepartmentRepository.save(subDepartment);
    }
    async findAll() {
        return this.subDepartmentRepository.find({
            relations: ['department'],
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const subDepartment = await this.subDepartmentRepository.findOne({
            where: { id },
            relations: ['department'],
        });
        if (!subDepartment) {
            throw new common_1.NotFoundException(`SubDepartment with ID ${id} not found`);
        }
        return subDepartment;
    }
    async update(updateSubDepartmentInput) {
        const { id, name } = updateSubDepartmentInput;
        const subDepartment = await this.findOne(id);
        subDepartment.name = name;
        return this.subDepartmentRepository.save(subDepartment);
    }
    async remove(id) {
        const subDepartment = await this.findOne(id);
        await this.subDepartmentRepository.remove(subDepartment);
        return true;
    }
};
exports.SubDepartmentService = SubDepartmentService;
exports.SubDepartmentService = SubDepartmentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(sub_department_entity_1.SubDepartment)),
    __param(1, (0, typeorm_1.InjectRepository)(department_entity_1.Department)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], SubDepartmentService);
//# sourceMappingURL=sub-department.service.js.map