import { PipelinesService } from './pipelines.service';
import { CreatePipelineDto } from './dto/create-pipeline.dto';
import { UpdatePipelineDto } from './dto/update-pipeline.dto';
export declare class PipelinesController {
    private readonly pipelinesService;
    constructor(pipelinesService: PipelinesService);
    createOrUpdate(createPipelineDto: CreatePipelineDto): Promise<import("./schemas/pipeline.schema").Pipeline>;
    findByFormId(formId: string): Promise<import("./schemas/pipeline.schema").Pipeline | null>;
    update(formId: string, updatePipelineDto: UpdatePipelineDto): Promise<import("./schemas/pipeline.schema").Pipeline>;
    delete(formId: string): Promise<void>;
}
