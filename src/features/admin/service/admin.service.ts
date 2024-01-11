import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { User } from 'src/auth/entities/user.entity';
import { ApiResponseDTO } from 'src/shared/response/api-response';
import { In, Repository } from 'typeorm';
import { Request as RequestExpress, Response } from 'express';
import { SharedService } from 'src/shared/services/shared.service';
import { UsersService } from 'src/features/users/services/users.service';
import { Role } from 'src/features/role/entities/role.entity';
import { CreateRoleDto } from '../dto/create-role.dto';
import { UserRolesEnum } from 'src/auth/enums/user-roles';

@Injectable()
export class AdminService {

    constructor(
        private usersService: UsersService,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
        private readonly sharedService: SharedService
    ) { }

    /**
     * 
     * @param createUserDto create user dto
     * @returns the admin user object
     */
    async createAdmin(createUserDto: CreateUserDto, response: Response) {
        const res = new ApiResponseDTO<User>();
        try {
            const user = await this.usersService.findOneByEmail(createUserDto.email);
            if (user) {
                throw new HttpException('User already exists', HttpStatus.CONFLICT);
            }

            const userName = await this.userRepository.findOneBy({ username: createUserDto.username })
            if (userName) {
                throw new HttpException('username already exists', HttpStatus.CONFLICT)
            }

            const newUser = new User();
            newUser.email = createUserDto.email;
            newUser.password = createUserDto.password;
            newUser.username = createUserDto.username;

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
            await this.sharedService.createEmailToken(newUser.email, response)
            // set the response object
            res.data = userResponse;
            res.statusCode = HttpStatus.CREATED;
            res.message = "user created successfully"
        } catch (error) {
            res.statusCode = HttpStatus.BAD_REQUEST;
            res.message = error.message
        }
        // return response
        return response.send(res);
    }
    /**
     * 
     * @param createRoleDto create role dto
     * @returns the role object
     */
    async createRole(createRoleDto: CreateRoleDto, response: Response) {
        const res = new ApiResponseDTO<Role>();
        try {

            const role = await this.roleRepository.findOneBy({ roleName: createRoleDto.roleName })
            if (role) {
                throw new HttpException('role already exists', HttpStatus.CONFLICT)
            }

            const newRole = new Role();
            newRole.roleName = createRoleDto.roleName;

            const roleResponse = await this.roleRepository.save(newRole);
            // set the response object
            res.data = roleResponse;
            res.statusCode = HttpStatus.CREATED;
            res.message = "role created successfully"
        } catch (error) {
            res.statusCode = HttpStatus.BAD_REQUEST;
            res.message = error.message
        }
        // return response
        return response.send(res);
    }

    /**
    * 
    * @returns the lis of all users
    */
    async findAll(headers: any): Promise<ApiResponseDTO<User[]>> {
        const res = new ApiResponseDTO<User[]>();
        try {
            // await this.sharedService.checkIfAdmin(headers);
            const result = await this.userRepository.find();
            res.data = result;
            res.message = "Successfully get users information";
            res.statusCode = HttpStatus.OK;
        } catch (error) {
            res.statusCode = HttpStatus.BAD_REQUEST;
            res.message = error.message
        }
        return res;
    }

    /**
    * 
    * @param id 
    * @returns delete user from database based on it's id
    */
    async deleteUserById(id: string) {
        const res = new ApiResponseDTO<User>();
        try {
            // first get the user
            const user = await this.userRepository.findOneBy({ id: id });
            // then check if it exists
            if (user === undefined || user === null) {
                throw new HttpException("User doesn't exists", HttpStatus.BAD_REQUEST);
            }
            await this.userRepository.delete(id)
            res.statusCode = HttpStatus.OK;
            res.message = "User deleted successfully"
        } catch (error) {
            res.statusCode = HttpStatus.BAD_REQUEST;
            res.message = error.message
        }
        return res;
    }
    /**
     * 
     * @returns delete all users from the database
     */
    async deleteAll() {
        return await this.userRepository.clear();
    }
}
