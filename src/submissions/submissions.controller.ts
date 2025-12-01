
import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards, Request, Ip, Headers, ValidationPipe } from '@nestjs/common';
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

   @Get('test')
  test() {
    return { message: 'Submissions controller is working!' };
  }

  @Post()
async create(
  @Body() createSubmissionDto: any, // Using 'any' temporarily to avoid validation issues
  @Ip() ip: string,
  @Headers('user-agent') userAgent: string,
) {
  console.log('📝 Received submission:', createSubmissionDto);
  
  try {
    // Verify form exists and is active
    const form = await this.formsService.findByPublicId(createSubmissionDto.formId);
    console.log('✅ Form found:', form._id);
    
    const submission = await this.submissionsService.create({
      formId: form._id, // Use the actual MongoDB _id, not the publicId
      data: createSubmissionDto.data,
      ipAddress: ip,
      userAgent,
    } as any);
    
    console.log('✅ Submission created:', submission._id);

    await this.formsService.incrementSubmissionCount(form._id.toString());

    return { 
      success: true, 
      data: {
        submissionId: submission._id.toString(), // This is what your frontend expects!
      },
      message: 'Form submitted successfully. Processing started.' 
    };
  } catch (error) {
    console.error('❌ Submission error:', error);
    throw error;
  }
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