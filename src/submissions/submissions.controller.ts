
import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards, Request, Ip, Headers } from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { FormsService } from '../forms/forms.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { QuerySubmissionsDto } from './dto/query-submissions.dto';

@Controller('submissions')
export class SubmissionsController {
  constructor(
    private readonly submissionsService: SubmissionsService,
    private readonly formsService: FormsService,
  ) {}

  @Post()
  async create(
    @Body() createSubmissionDto: CreateSubmissionDto,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
  ) {
    // Verify form exists and is active
    await this.formsService.findByPublicId(createSubmissionDto.formId as any);
    
    const submission = await this.submissionsService.create({
      ...createSubmissionDto,
      ipAddress: ip,
      userAgent,
    } as any);

    await this.formsService.incrementSubmissionCount(createSubmissionDto.formId as any);

    return { 
      success: true, 
      submissionId: submission._id,
      message: 'Form submitted successfully. Processing started.' 
    };
  }

  @Get('form/:formId')
  @UseGuards(JwtAuthGuard)
  findAll(@Param('formId') formId: string, @Query() query: QuerySubmissionsDto) {
    return this.submissionsService.findAll(formId, query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.submissionsService.findOne(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  delete(@Param('id') id: string) {
    return this.submissionsService.delete(id);
  }
}