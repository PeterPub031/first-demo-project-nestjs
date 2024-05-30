import { INestApplication, ValidationPipe } from "@nestjs/common";

import { AppModule } from "src/app.module";
import { Test } from "@nestjs/testing";

describe('App EndToEnd tests', () => {
  let app: INestApplication
  beforeAll( async () => {
    const appModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()
    app = appModule.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init()
  })
  afterAll(async () => {
    app.close();
  })
  it.todo('Should PASS, Hehe');
})