import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from "@app/app.module";
import { AppConfig, appConfig } from "@cfg/app.config";
import { Logger } from "@logger/logger.service";
import { registerPrototypes } from "@cfg/prototypes.options";

async function bootstrap() {
    registerPrototypes();

    const app = await NestFactory.create(AppModule, {
        cors: true,
        bufferLogs: true,
    });

    const cfg = app
        .get(ConfigService)
        .get<AppConfig>(appConfig.KEY);

    if (cfg?.observability.logs)
        app.useLogger(app.get(Logger));

    if (cfg?.swagger.enabled) {
        const options = new DocumentBuilder()
        .setTitle(cfg.swagger.title)
        .setDescription(cfg.swagger.description)
        .setVersion(cfg.swagger.version)
        .build();

        const document = SwaggerModule.createDocument(app, options);
        SwaggerModule.setup(cfg.swagger.path, app, document);
    }

    await app.listen(cfg?.nest.port ?? 3000);
}

void bootstrap();
