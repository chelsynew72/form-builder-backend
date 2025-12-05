
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: Transporter;

  constructor(private configService: ConfigService) {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    const emailEnabled = this.configService.get<string>('EMAIL_ENABLED') === 'true';
    
    if (!emailEnabled) {
      this.logger.warn('Email service is disabled');
      return;
    }

    const smtpHost = this.configService.get<string>('SMTP_HOST');
    const smtpPort = this.configService.get<number>('SMTP_PORT');
    const smtpUser = this.configService.get<string>('SMTP_USER');
    const smtpPass = this.configService.get<string>('SMTP_PASS');

    if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
      this.logger.warn('SMTP configuration incomplete, email service disabled');
      return;
    }

    this.transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465, 
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    this.logger.log('Email service initialized');
  }

  async sendEmail(to: string, subject: string, html: string): Promise<boolean> {
    if (!this.transporter) {
      this.logger.warn('Email transporter not configured');
      return false;
    }

    try {
      const info = await this.transporter.sendMail({
        from: `"AI Form builder" <${this.configService.get<string>('SMTP_USER')}>`,
        to,
        subject,
        html,
      });

      this.logger.log(`Email sent: ${info.messageId}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send email: ${error.message}`);
      return false;
    }
  }

  async sendNewSubmissionNotification(
    userEmail: string,
    formName: string,
    submissionId: string,
    submissionData: Record<string, any>,
    dashboardUrl: string,
  ): Promise<boolean> {
    const subject = `New Submission: ${formName}`;
    
    const dataRows = Object.entries(submissionData)
      .map(([key, value]) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #374151;">${key}</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">${value}</td>
        </tr>
      `)
      .join('');

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
          <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f3f4f6; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table cellpadding="0" cellspacing="0" border="0" width="600" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                  
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">📬 New Submission</h1>
                    </td>
                  </tr>

                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px;">
                      <p style="margin: 0 0 20px; color: #374151; font-size: 16px; line-height: 1.5;">
                        You have received a new submission for <strong>${formName}</strong>
                      </p>

                      <!-- Submission Data -->
                      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 20px 0; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                        ${dataRows}
                      </table>

                      <!-- Submission ID -->
                      <div style="margin: 20px 0; padding: 16px; background-color: #f9fafb; border-radius: 8px; border-left: 4px solid #667eea;">
                        <p style="margin: 0; font-size: 14px; color: #6b7280;">
                          <strong style="color: #374151;">Submission ID:</strong><br>
                          <code style="font-family: monospace; color: #667eea;">${submissionId}</code>
                        </p>
                      </div>

                      <!-- CTA Button -->
                      <div style="text-align: center; margin: 30px 0;">
                        <a href="${dashboardUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
                          View in Dashboard
                        </a>
                      </div>

                      <p style="margin: 20px 0 0; color: #9ca3af; font-size: 14px; line-height: 1.5;">
                        The AI pipeline is processing this submission. You'll receive another email when processing is complete.
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
                      <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                        AI Form Pipeline • Powered by AI
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;

    return this.sendEmail(userEmail, subject, html);
  }

  async sendProcessingCompleteNotification(
    userEmail: string,
    formName: string,
    submissionId: string,
    outputsCount: number,
    dashboardUrl: string,
  ): Promise<boolean> {
    const subject = ` Processing Complete: ${formName}`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
          <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f3f4f6; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table cellpadding="0" cellspacing="0" border="0" width="600" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                  
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px; text-align: center;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">✅ Processing Complete</h1>
                    </td>
                  </tr>

                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px;">
                      <p style="margin: 0 0 20px; color: #374151; font-size: 16px; line-height: 1.5;">
                        AI processing has been completed for your submission to <strong>${formName}</strong>
                      </p>

                      <!-- Stats -->
                      <div style="margin: 24px 0; padding: 20px; background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border-radius: 8px; text-align: center;">
                        <p style="margin: 0 0 8px; color: #065f46; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Pipeline Steps Completed</p>
                        <p style="margin: 0; color: #059669; font-size: 36px; font-weight: bold;">${outputsCount}</p>
                      </div>

                      <!-- Submission ID -->
                      <div style="margin: 20px 0; padding: 16px; background-color: #f9fafb; border-radius: 8px; border-left: 4px solid #10b981;">
                        <p style="margin: 0; font-size: 14px; color: #6b7280;">
                          <strong style="color: #374151;">Submission ID:</strong><br>
                          <code style="font-family: monospace; color: #10b981;">${submissionId}</code>
                        </p>
                      </div>

                      <!-- CTA Button -->
                      <div style="text-align: center; margin: 30px 0;">
                        <a href="${dashboardUrl}" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
                          View AI Results
                        </a>
                      </div>

                      <p style="margin: 20px 0 0; color: #9ca3af; font-size: 14px; line-height: 1.5;">
                        All AI-generated outputs are now available in your dashboard.
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
                      <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                        AI Form Pipeline • Powered by AI
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;

    return this.sendEmail(userEmail, subject, html);
  }

  async sendProcessingFailedNotification(
    userEmail: string,
    formName: string,
    submissionId: string,
    errorMessage: string,
    dashboardUrl: string,
  ): Promise<boolean> {
    const subject = ` Processing Failed: ${formName}`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
          <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f3f4f6; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table cellpadding="0" cellspacing="0" border="0" width="600" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                  
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 40px; text-align: center;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">❌ Processing Failed</h1>
                    </td>
                  </tr>

                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px;">
                      <p style="margin: 0 0 20px; color: #374151; font-size: 16px; line-height: 1.5;">
                        There was an error processing a submission for <strong>${formName}</strong>
                      </p>

                      <!-- Error Message -->
                      <div style="margin: 24px 0; padding: 20px; background-color: #fef2f2; border-radius: 8px; border-left: 4px solid #ef4444;">
                        <p style="margin: 0 0 8px; color: #991b1b; font-size: 14px; font-weight: 600;">Error Details:</p>
                        <p style="margin: 0; color: #7f1d1d; font-size: 14px; font-family: monospace; line-height: 1.6;">
                          ${errorMessage}
                        </p>
                      </div>

                      <!-- Submission ID -->
                      <div style="margin: 20px 0; padding: 16px; background-color: #f9fafb; border-radius: 8px;">
                        <p style="margin: 0; font-size: 14px; color: #6b7280;">
                          <strong style="color: #374151;">Submission ID:</strong><br>
                          <code style="font-family: monospace; color: #ef4444;">${submissionId}</code>
                        </p>
                      </div>

                      <!-- CTA Button -->
                      <div style="text-align: center; margin: 30px 0;">
                        <a href="${dashboardUrl}" style="display: inline-block; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
                          View in Dashboard
                        </a>
                      </div>

                      <p style="margin: 20px 0 0; color: #9ca3af; font-size: 14px; line-height: 1.5;">
                        You can reprocess this submission from your dashboard or check your pipeline configuration.
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
                      <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                        AI Form Pipeline • Powered by AI
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;

    return this.sendEmail(userEmail, subject, html);
  }
}