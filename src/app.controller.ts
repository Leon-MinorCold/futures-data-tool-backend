import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { db } from './db/config';
import { users } from './db/schema';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello(): Promise<any> {
    const dbUsers = await db.select().from(users);
    return dbUsers;
  }
}
