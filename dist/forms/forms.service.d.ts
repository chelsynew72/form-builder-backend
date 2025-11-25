import { Model } from 'mongoose';
import { Form } from './schemas/form.schema';
import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';
export declare class FormsService {
    private formModel;
    constructor(formModel: Model<Form>);
    create(userId: string, createFormDto: CreateFormDto): Promise<Form>;
    findAll(userId: string): Promise<Form[]>;
    findOne(id: string, userId: string): Promise<Form>;
    findByPublicId(publicId: string): Promise<Form>;
    update(id: string, userId: string, updateFormDto: UpdateFormDto): Promise<Form>;
    delete(id: string, userId: string): Promise<void>;
    incrementSubmissionCount(formId: string): Promise<void>;
}
