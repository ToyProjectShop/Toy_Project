import { DocumentBuilder } from '@nestjs/swagger';

export class BaseAPIDocument {
  public builder = new DocumentBuilder();

  public initializeOptions() {
    return this.builder
      .setTitle('Swagger Example')
      .setDescription('Swagger study API description')
      .setVersion('1.0.0')
      .addTag('swagger')
      .build();
  }
}
