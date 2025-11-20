import { InputType, Field, ID } from '@nestjs/graphql';
import { IsString, MinLength, IsInt } from 'class-validator';
import { Transform } from 'class-transformer';

@InputType()
export class UpdateSubDepartmentInput {
  @Field(() => ID)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-call
  @Transform(({ value }) => parseInt(value, 10))
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsInt()
  id: number;

  @Field()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsString()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @MinLength(2)
  name: string;
}
