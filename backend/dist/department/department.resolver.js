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
exports.DepartmentResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const department_service_1 = require("./department.service");
const department_entity_1 = require("./entities/department.entity");
const create_department_input_1 = require("./dto/create-department.input");
const update_department_input_1 = require("./dto/update-department.input");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let DepartmentResolver = class DepartmentResolver {
    constructor(departmentService) {
        this.departmentService = departmentService;
    }
    async createDepartment(createDepartmentInput) {
        return this.departmentService.create(createDepartmentInput);
    }
    async getDepartments() {
        return this.departmentService.findAll();
    }
    async getDepartment(id) {
        return this.departmentService.findOne(id);
    }
    async updateDepartment(updateDepartmentInput) {
        return this.departmentService.update(updateDepartmentInput);
    }
    async deleteDepartment(id) {
        return this.departmentService.remove(id);
    }
};
exports.DepartmentResolver = DepartmentResolver;
__decorate([
    (0, graphql_1.Mutation)(() => department_entity_1.Department),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_department_input_1.CreateDepartmentInput]),
    __metadata("design:returntype", Promise)
], DepartmentResolver.prototype, "createDepartment", null);
__decorate([
    (0, graphql_1.Query)(() => [department_entity_1.Department], { name: 'getDepartments' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DepartmentResolver.prototype, "getDepartments", null);
__decorate([
    (0, graphql_1.Query)(() => department_entity_1.Department, { name: 'getDepartment' }),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], DepartmentResolver.prototype, "getDepartment", null);
__decorate([
    (0, graphql_1.Mutation)(() => department_entity_1.Department),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_department_input_1.UpdateDepartmentInput]),
    __metadata("design:returntype", Promise)
], DepartmentResolver.prototype, "updateDepartment", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], DepartmentResolver.prototype, "deleteDepartment", null);
exports.DepartmentResolver = DepartmentResolver = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, graphql_1.Resolver)(() => department_entity_1.Department),
    __metadata("design:paramtypes", [department_service_1.DepartmentService])
], DepartmentResolver);
//# sourceMappingURL=department.resolver.js.map