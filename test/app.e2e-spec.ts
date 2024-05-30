import * as pactum from 'pactum'

import { INestApplication, ValidationPipe } from "@nestjs/common";

import { AppModule } from "../src/app.module";
import { PrismaService } from "../src/prisma/prisma.service";
import { Test } from "@nestjs/testing";

const PORT = 3002
describe('App EndToEnd tests', () => {
  let app: INestApplication
  let prismaService: PrismaService
  beforeAll( async () => {
    const appModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()
    app = appModule.createNestApplication()
    app.useGlobalPipes(new ValidationPipe())
    await app.init()
    await app.listen(PORT)
    prismaService = app.get(PrismaService)
    await prismaService.cleanDatabase()
    pactum.request.setBaseUrl(`http://localhost:${PORT}`)
  })

  describe('Test Authentication', () => {
    describe('Register', () => {
      it('should register', () => {
        return pactum.spec()
          .post('/auth/register')
          .withBody({
            email: 'testemail01@gmail.com',
            password: 'a123'
          })
          .expectStatus(201)
          // .inspect() //show detail input/output
      })
      it('should show error with empty email', () => {
        return pactum.spec()
          .post('/auth/register')
          .withBody({
            email: '',
            password: 'a123'
          })
          .expectStatus(400)
      })
      it('should show error with invalid email format', () => {
        return pactum.spec()
          .post('/auth/register')
          .withBody({
            email: 'phuc@gmail',
            password: 'a123'
          })
          .expectStatus(400)
      })
    })
    describe('Login', () => {
      it('should login', () => {
        return pactum.spec()
          .post('/auth/login')
          .withBody({
            email: 'testemail01@gmail.com',
            password: 'a123'
          })
          .expectStatus(201)
      })
    })
  })

  afterAll(async () => {
    app.close();
  })
  it.todo('Should PASS, Hehe');
})