import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { users } from '../database/schema/users';
import { eq, count, desc } from 'drizzle-orm';
import { CreateUserDto, UpdateUserDto, User, uuidSchema } from '../types/user';

@Injectable()
export class UsersService {
  constructor(private readonly database: DatabaseService) {}

  async findOneById(id: string): Promise<User> {
    const isValidUUID = uuidSchema.safeParse(id).success;
    if (!isValidUUID) {
      throw new BadRequestException('Invalid UUID format');
    }

    const [user] = await this.database.db
      .select()
      .from(users)
      .where(eq(users.id, id)) // Ensure you are using the correct column reference
      .limit(1); // Limit to one result

    if (!user) throw new NotFoundException(`User with ID ${id} not found`);

    return user;
  }

  async create(data: CreateUserDto): Promise<User> {
    const { username, email, password, role = 'user', salt } = data;

    const userData = {
      username,
      email,
      password,
      salt,
      role,
    };
    const [newUser] = await this.database.db
      .insert(users)
      .values(userData)
      .returning();

    return newUser;
  }

  async getTotalCount(): Promise<number> {
    const result = await this.database.db
      .select({ count: count() })
      .from(users);
    return Number(result[0]?.count || 0);
  }

  async findAll({ page = 1, pageSize = 10 }): Promise<User[]> {
    const offset = (page - 1) * pageSize;
    return this.database.db
      .select()
      .from(users)
      .orderBy(desc(users.updatedAt))
      .limit(pageSize)
      .offset(offset);
  }

  async update(id: string, userData: UpdateUserDto): Promise<User> {
    const [updatedUser] = await this.database.db
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  async delete(id: string): Promise<User> {
    const [deletedUser] = await this.database.db
      .delete(users)
      .where(eq(users.id, id))
      .returning();
    return deletedUser;
  }

  // find user by email or username
  async findOneByIdentifier(
    identifier: string,
    error: boolean = true,
  ): Promise<User> {
    let user = await this.database.db
      .select()
      .from(users)
      .where(eq(users.email, identifier))
      .limit(1); // Limit to one result

    if (user.length > 0) return user[0]; // Return the first user found

    user = await this.database.db
      .select()
      .from(users)
      .where(eq(users.username, identifier))
      .limit(1); // Limit to one result

    if (user.length === 0 && error)
      throw new NotFoundException('User not found');

    return user[0]; // Return the first user found
  }

  async updateByEmail(email: string, data: UpdateUserDto): Promise<User> {
    const [updatedUser] = await this.database.db
      .update(users)
      .set(data)
      .where(eq(users.email, email))
      .returning();
    return updatedUser;
  }
}
