import { IsNotEmpty, IsObject } from 'class-validator';

export class CreateSubmissionDto {
  @IsNotEmpty()
  formId: string;

  @IsObject()
  data: Record<string, any>;
}
