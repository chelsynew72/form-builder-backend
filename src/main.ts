import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  

 app.enableCors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      'https://form-builder-client-pi.vercel.app',
      'https://form-builder-client-xi.vercel.app',
      /\.vercel\.app$/
    ];

    if (!origin || allowedOrigins.some(o =>
      typeof o === 'string' ? o === origin : o.test(origin)
    )) {
      callback(null, true);
    } else {
      callback(new Error('CORS blocked: ' + origin));
    }
  },
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