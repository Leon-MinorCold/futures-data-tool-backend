import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { Config } from '../config/schema';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private client: postgres.Sql;
  public db: ReturnType<typeof drizzle>;
  public supabase: SupabaseClient;

  constructor(private configService: ConfigService<Config>) {
    // 创建 postgres 客户端
    this.client = postgres(this.configService.get('DATABASE_URL')!, {
      max: 1, // 连接池最大连接数
    });

    this.db = drizzle(this.client, {
      casing: 'snake_case',
    });

    this.supabase = createClient(
      this.configService.get('NEST_PUBLIC_SUPABASE_URL'),
      this.configService.get('NEST_PUBLIC_SUPABASE_ANON_KEY'),
    );
  }

  async onModuleInit() {
    try {
      // 测试连接
      await this.client`SELECT 1`;
      console.log('Database connected successfully');
    } catch (error) {
      console.error('Database connection failed:', error);
    }
  }

  async onModuleDestroy() {
    await this.client.end();
  }
}
