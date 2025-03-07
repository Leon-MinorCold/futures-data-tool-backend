import 'dotenv/config';
import { db, queryClient } from './config';
import crypto from 'crypto';
import { users } from './schema/users';
import { futures } from './schema/futures';

// 辅助函数：生成盐值和密码哈希
function generatePassword(plainPassword: string) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto
    .pbkdf2Sync(plainPassword, salt, 1000, 64, 'sha512')
    .toString('hex');
  return { salt, hash };
}

async function insertUsers() {
  const userCredentials = generatePassword('password123');

  // 示例用户数据
  await db.insert(users).values([
    {
      username: 'zhangsan',
      email: 'zhangsan@example.com',
      salt: userCredentials.salt,
      password: userCredentials.hash,
    },
  ]);
}

async function insertFutures() {
  await db.insert(futures).values([
    {
      code: 'FG',
      name: '玻璃',
      minPriceTick: 1,
      fee: 6,
      exchange: '上海交易所',
      size: 20,
      unit: '吨',
    },
  ]);
}

async function seed() {
  try {
    await Promise.all([insertFutures(), insertUsers()]);
    console.log('✅ 示例数据添加成功');
  } catch (error) {
    console.error('❌ 添加示例数据失败:', error);
  } finally {
    await queryClient.end();
  }
}

seed();
