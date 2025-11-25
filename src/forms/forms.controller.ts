// backend/src/forms/forms.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { FormsService } from './forms.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';

@Controller('forms')
export class FormsController {
  constructor(private readonly formsService: FormsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Request() req, @Body() createFormDto: CreateFormDto) {
    return this.formsService.create(req.user.userId, createFormDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Request() req) {
    return this.formsService.findAll(req.user.userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Request() req, @Param('id') id: string) {
    return this.formsService.findOne(id, req.user.userId);
  }

  @Get('public/:publicId')
  findByPublicId(@Param('publicId') publicId: string) {
    return this.formsService.findByPublicId(publicId);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(@Request() req, @Param('id') id: string, @Body() updateFormDto: UpdateFormDto) {
    return this.formsService.update(id, req.user.userId, updateFormDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  delete(@Request() req, @Param('id') id: string) {
    return this.formsService.delete(id, req.user.userId);
  }
}