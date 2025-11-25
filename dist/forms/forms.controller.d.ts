import { FormsService } from './forms.service';
import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';
export declare class FormsController {
    private readonly formsService;
    constructor(formsService: FormsService);
    create(req: any, createFormDto: CreateFormDto): Promise<import("./schemas/form.schema").Form>;
    findAll(req: any): Promise<import("./schemas/form.schema").Form[]>;
    findOne(req: any, id: string): Promise<import("./schemas/form.schema").Form>;
    findByPublicId(publicId: string): Promise<import("./schemas/form.schema").Form>;
    update(req: any, id: string, updateFormDto: UpdateFormDto): Promise<import("./schemas/form.schema").Form>;
    delete(req: any, id: string): Promise<void>;
}
