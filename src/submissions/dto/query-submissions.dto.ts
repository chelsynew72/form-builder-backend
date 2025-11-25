
import { IsOptional, IsInt, Min, Max, IsEnum, IsString, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export enum SubmissionStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export class QuerySubmissionsDto {
  // Pagination
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  // Filtering
  @IsOptional()
  @IsEnum(SubmissionStatus)
  status?: SubmissionStatus;

  @IsOptional()
  @IsString()
  search?: string; // Search in submission data

  // Date filtering
  @IsOptional()
  @IsDateString()
  startDate?: string; // ISO 8601 format: 2024-01-01T00:00:00Z

  @IsOptional()
  @IsDateString()
  endDate?: string; // ISO 8601 format: 2024-12-31T23:59:59Z

  // Sorting
  @IsOptional()
  @IsEnum(['submittedAt', 'processedAt', 'status'])
  sortBy?: string = 'submittedAt';

  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'desc';
}