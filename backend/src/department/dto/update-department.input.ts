import { InputType, Field, ID } from '@nestjs/graphql';
import {
  IsString,
  MinLength,
  IsInt,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

@InputType()
class UpdateDepartmentSubDepartmentInput {
  @Field(() => ID, { nullable: true })
  @IsOptional()
  @Transform(({ value }) => (value ? parseInt(value, 10) : undefined))
  @IsInt()
  id?: number;

  @Field()
  @IsString()
  @MinLength(2)
  name: string;
}

@InputType()
export class UpdateDepartmentInput {
  @Field(() => ID)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  id: number;

  @Field()
  @IsString()
  @MinLength(2)
  name: string;

  @Field(() => [UpdateDepartmentSubDepartmentInput], { nullable: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateDepartmentSubDepartmentInput)
  subDepartments?: UpdateDepartmentSubDepartmentInput[];
}
