"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: 'http://localhost:3000',
        credentials: true,
    });
    const server = app.getHttpServer();
    const router = server._events.request._router;
    console.log('🚀 Registered routes:');
    if (router && router.stack) {
        router.stack.forEach((layer) => {
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
//# sourceMappingURL=main.js.map