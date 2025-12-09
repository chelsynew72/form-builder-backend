import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: 'https://form-builder-client-git-vercel-773e87-chelsys-projects-a885e102.vercel.app/',
    credentials: true,
  });

  // Log all registered routes
  const server = app.getHttpServer();
  const router = server._events.request._router;
  
  console.log('🚀 Registered routes:');
  if (router && router.stack) {
    router.stack.forEach((layer: any) => {
      if (layer.route) {
        const path = layer.route.path;
        const methods = Object.keys(layer.route.methods).join(', ').toUpperCase();
        console.log(`  ${methods} ${path}`);
      }
    });
  }

  await app.listen(process.env.PORT ?? 3001);
  console.log(`🔥 Application is running on: https://form-builder-backend-6wju.onrender.com`);
}
bootstrap();