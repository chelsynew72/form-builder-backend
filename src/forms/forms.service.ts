// backend/src/forms/forms.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Form } from './schemas/form.schema';
import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';
import { nanoid } from 'nanoid';

@Injectable()
export class FormsService {
  constructor(
    @InjectModel(Form.name) private formModel: Model<Form>,
  ) {}

  async create(userId: string, createFormDto: CreateFormDto): Promise<Form> {
    const publicId = nanoid(10);
    const form = new this.formModel({
      ...createFormDto,
      userId,
      publicId,
    });
    return form.save();
  }

  async findAll(userId: string): Promise<Form[]> {
    return this.formModel.find({ userId }).sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string, userId: string): Promise<Form> {
    const form = await this.formModel.findOne({ _id: id, userId }).exec();
    if (!form) {
      throw new NotFoundException('Form not found');
    }
    return form;
  }

  async findByPublicId(publicId: string): Promise<Form> {
    const form = await this.formModel.findOne({ publicId, isActive: true }).exec();
    if (!form) {
      throw new NotFoundException('Form not found');
    }
    return form;
  }

  async update(id: string, userId: string, updateFormDto: UpdateFormDto): Promise<Form> {
    const form = await this.formModel
      .findOneAndUpdate({ _id: id, userId }, updateFormDto, { new: true })
      .exec();
    if (!form) {
      throw new NotFoundException('Form not found');
    }
    return form;
  }

  async delete(id: string, userId: string): Promise<void> {
    const result = await this.formModel.deleteOne({ _id: id, userId }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Form not found');
    }
  }

  async incrementSubmissionCount(formId: string): Promise<void> {
    await this.formModel.updateOne(
      { _id: formId },
      { $inc: { submissionCount: 1 } }
    ).exec();
  }
}