import { ConfigService } from '@nestjs/config';
export declare class EmailService {
    private configService;
    private readonly logger;
    private transporter;
    constructor(configService: ConfigService);
    private initializeTransporter;
    sendEmail(to: string, subject: string, html: string): Promise<boolean>;
    sendNewSubmissionNotification(userEmail: string, formName: string, submissionId: string, submissionData: Record<string, any>, dashboardUrl: string): Promise<boolean>;
    sendProcessingCompleteNotification(userEmail: string, formName: string, submissionId: string, outputsCount: number, dashboardUrl: string): Promise<boolean>;
    sendProcessingFailedNotification(userEmail: string, formName: string, submissionId: string, errorMessage: string, dashboardUrl: string): Promise<boolean>;
}
