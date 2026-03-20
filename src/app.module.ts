import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

/** Decorator chạy 1 app module,  trong app module có 1 Decorator
 *  nhậm vào 1 param, param là 1 object gồm 3 thuộc tính
 *  import | controller(App controller) | provider(App service)
 *  Controller: Liên quan đến việc Routing, ví dụ có method get
 * @Controller()
    export class AppController {
      constructor(private readonly appService: AppService) {}
    
      @Get()
      getHello(): string {
        return this.appService.getHello();
      }
    }
 * trong controller có 1 Decorator để quuy định method getHello
 * là method Get
 * 
 * trong method Get có this.appService.getHello(), đây là app service
 * hay còn gọi là  nó inject vào
 * 
 * 
 * @Injectable()
    export class AppService {
      getHello(): string {
        return 'Hello World!';
      }
    }
  Dùng decorator Injectable : có tác dụng inject vào những cái class khác

  file app.controller.spec.ts => Testing thôi

  Muốn chạy ở dev có dev mode thì chạy bằng npm run start dev
 * 
 * **/
