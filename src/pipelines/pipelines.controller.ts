// backend/src/pipelines/pipelines.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { PipelinesService } from './pipelines.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreatePipelineDto } from './dto/create-pipeline.dto';
import { UpdatePipelineDto } from './dto/update-pipeline.dto';

@Controller('pipelines')
@UseGuards(JwtAuthGuard)
export class PipelinesController {
  constructor(private readonly pipelinesService: PipelinesService) {}

  // ✅ FIXED: Use createOrUpdate instead of create
  @Post()
  createOrUpdate(@Body() createPipelineDto: CreatePipelineDto) {
    return this.pipelinesService.createOrUpdate(createPipelineDto);
  }

  @Get('form/:formId')
  findByFormId(@Param('formId') formId: string) {
    return this.pipelinesService.findByFormId(formId);
  }

  @Put('form/:formId')
  update(@Param('formId') formId: string, @Body() updatePipelineDto: UpdatePipelineDto) {
    return this.pipelinesService.update(formId, updatePipelineDto);
  }

  @Delete('form/:formId')
  delete(@Param('formId') formId: string) {
    return this.pipelinesService.delete(formId);
  }
}