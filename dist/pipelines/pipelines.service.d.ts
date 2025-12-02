import { Model } from 'mongoose';
import { Pipeline } from './schemas/pipeline.schema';
import { CreatePipelineDto } from './dto/create-pipeline.dto';
import { UpdatePipelineDto } from './dto/update-pipeline.dto';
export declare class PipelinesService {
    private pipelineModel;
    constructor(pipelineModel: Model<Pipeline>);
    createOrUpdate(createPipelineDto: CreatePipelineDto): Promise<Pipeline>;
    findByFormId(formId: string): Promise<Pipeline | null>;
    update(formId: string, updatePipelineDto: UpdatePipelineDto): Promise<Pipeline>;
    delete(formId: string): Promise<void>;
}
