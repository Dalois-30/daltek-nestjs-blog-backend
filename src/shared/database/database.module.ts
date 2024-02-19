import { Module, Global, Logger } from '@nestjs/common';
import { EnvModule } from '../env/env.module';
import { DatabaseOrmModule } from './constant/dbconfig';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Category } from 'src/features/categories/models/category.model';
import { Comments } from 'src/features/comments/models/comments.model';
import { Posts } from 'src/features/posts/models/posts.model';
import { UserRole } from 'src/auth/entities/userRole.entity';
import { Role } from 'src/features/role/entities/role.entity';
import { Repository } from 'typeorm';
import { UserRolesEnum } from 'src/auth/enums/user-roles';



@Global()
@Module({
  imports: [
    EnvModule,
    DatabaseOrmModule(),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Category]),
    TypeOrmModule.forFeature([Posts]),
    TypeOrmModule.forFeature([Comments]),
    TypeOrmModule.forFeature([UserRole]),
    TypeOrmModule.forFeature([Role]),
  ],
  exports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Category]),
    TypeOrmModule.forFeature([Posts]),
    TypeOrmModule.forFeature([Comments]),
    TypeOrmModule.forFeature([UserRole]),
    TypeOrmModule.forFeature([Role]),
  ]
})
export class DatabaseModule {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ){ }
  private readonly logger = new Logger(DatabaseModule.name);
  async onModuleInit() {
    const roles = ["Admin", "Blogger"];
    roles.forEach(async (roleName) => {
        const newRole =await this.roleRepository.findOneBy({ roleName: roleName });
        if(!newRole){
          const savedRole = new Role();
          savedRole.roleName = roleName;
          savedRole.description = roleName;
      
          const roleResponse = await this.roleRepository.save(savedRole);
          this.logger.verbose("Roles created");
        }
    })
    const user = await this.userRepository.findOneBy({ username: "admin" })
    if (!user) {
        const newUser = new User();
        newUser.email = "admin@admin.com";
        newUser.password = "Admin1234";
        newUser.username = "admin";

        // Trouver les rôles à partir des noms
        const adminRole = await this.roleRepository.findOne({
            where: {
                roleName: UserRolesEnum.ADMIN
            }
        });

        // Assigner les rôles à l'utilisateur
        if (adminRole) {
            newUser.userRoles = [adminRole];
        }

        const userResponse = await this.userRepository.save(newUser);
        this.logger.verbose("Database module initialized");
    }

  }
 }
