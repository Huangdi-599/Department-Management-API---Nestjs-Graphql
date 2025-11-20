import { InputType, Field, ID } from '@nestjs/graphql';
import { IsString, MinLength, IsInt } from 'class-validator';
import { Transform } from 'class-transformer';

@InputType()
export class CreateSubDepartmentInput {
  @Field()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsString()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @MinLength(2)
  name: string;

  @Field(() => ID)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-call
  @Transform(({ value }) => parseInt(value, 10))
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsInt()
  departmentId: number;
}
