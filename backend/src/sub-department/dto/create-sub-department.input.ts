import { InputType, Field, ID } from '@nestjs/graphql';
import { IsString, MinLength, IsInt } from 'class-validator';
import { Transform } from 'class-transformer';

@InputType()
export class CreateSubDepartmentInput {
  @Field()
  @IsString()
  @MinLength(2)
  name: string;
  @Field(() => ID)
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  departmentId: number;
}
