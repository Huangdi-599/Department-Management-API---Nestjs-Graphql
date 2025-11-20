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
exports.SubDepartmentResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const sub_department_service_1 = require("./sub-department.service");
const sub_department_entity_1 = require("./entities/sub-department.entity");
const create_sub_department_input_1 = require("./dto/create-sub-department.input");
const update_sub_department_input_1 = require("./dto/update-sub-department.input");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let SubDepartmentResolver = class SubDepartmentResolver {
    constructor(subDepartmentService) {
        this.subDepartmentService = subDepartmentService;
    }
    async createSubDepartment(createSubDepartmentInput) {
        return this.subDepartmentService.create(createSubDepartmentInput);
    }
    async getSubDepartments() {
        return this.subDepartmentService.findAll();
    }
    async getSubDepartment(id) {
        return this.subDepartmentService.findOne(id);
    }
    async updateSubDepartment(updateSubDepartmentInput) {
        return this.subDepartmentService.update(updateSubDepartmentInput);
    }
    async deleteSubDepartment(id) {
        return this.subDepartmentService.remove(id);
    }
};
exports.SubDepartmentResolver = SubDepartmentResolver;
__decorate([
    (0, graphql_1.Mutation)(() => sub_department_entity_1.SubDepartment),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_sub_department_input_1.CreateSubDepartmentInput]),
    __metadata("design:returntype", Promise)
], SubDepartmentResolver.prototype, "createSubDepartment", null);
__decorate([
    (0, graphql_1.Query)(() => [sub_department_entity_1.SubDepartment], { name: 'getSubDepartments' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SubDepartmentResolver.prototype, "getSubDepartments", null);
__decorate([
    (0, graphql_1.Query)(() => sub_department_entity_1.SubDepartment, { name: 'getSubDepartment' }),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SubDepartmentResolver.prototype, "getSubDepartment", null);
__decorate([
    (0, graphql_1.Mutation)(() => sub_department_entity_1.SubDepartment),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_sub_department_input_1.UpdateSubDepartmentInput]),
    __metadata("design:returntype", Promise)
], SubDepartmentResolver.prototype, "updateSubDepartment", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SubDepartmentResolver.prototype, "deleteSubDepartment", null);
exports.SubDepartmentResolver = SubDepartmentResolver = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, graphql_1.Resolver)(() => sub_department_entity_1.SubDepartment),
    __metadata("design:paramtypes", [sub_department_service_1.SubDepartmentService])
], SubDepartmentResolver);
//# sourceMappingURL=sub-department.resolver.js.map