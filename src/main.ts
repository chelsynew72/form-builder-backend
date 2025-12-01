import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: 'http://localhost:3000',
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
  console.log(`🔥 Application is running on: http://localhost:3001`);
}
bootstrap();