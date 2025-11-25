import { PipelinesService } from './pipelines.service';
import { CreatePipelineDto } from './dto/create-pipeline.dto';
import { UpdatePipelineDto } from './dto/update-pipeline.dto';
export declare class PipelinesController {
    private readonly pipelinesService;
    constructor(pipelinesService: PipelinesService);
    create(createPipelineDto: CreatePipelineDto): Promise<import("./schemas/pipeline.schema").Pipeline>;
    findAll(): void;
    findOne(id: string): void;
    update(id: string, updatePipelineDto: UpdatePipelineDto): Promise<import("./schemas/pipeline.schema").Pipeline>;
    remove(id: string): void;
}
