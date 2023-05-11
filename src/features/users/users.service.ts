import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserDto } from 'src/auth/dto/update-user.dto';
import { User } from 'src/auth/entities/user.entity';
import { ApiResponseDTO } from 'src/shared/response/api-response';
import { SharedService } from 'src/shared/shared.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly httpService: HttpService,
    private readonly jwtService: JwtService,
    private sharedService: SharedService,
  ) { }


  /**
   * 
   * @returns the lis of all users
   */
  async findAll(headers: any): Promise<ApiResponseDTO<User[]>>  {
    const res = new ApiResponseDTO<User[]>();
    try {
      await this.sharedService.checkIfAdmin(headers);
      const result = await this.userRepository.find();
      res.data = result;
      res.message = "Successfully get user information";
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
   * @returns returns the specified user by its email
   */
  async findOneById(id: string): Promise <ApiResponseDTO<User>> {
    const res = new ApiResponseDTO<User>();
    try {
      const result = await this.userRepository.findOneBy({ id }); 
      res.data = result;
      res.message = "Successful retrieve user"  
      res.statusCode = HttpStatus.OK;
    } catch (error) {
      res.statusCode = HttpStatus.BAD_REQUEST;
      res.message = error.message  
    }
    return res
  }
  /**
   * 
   * @param email 
   * @returns returns the specified user by its email
   */
  async findOneByEmail(email: string): Promise<User> {
    return await this.userRepository.findOneBy({ email });
  }
  /**
   * 
   * @param id 
   * @param newUser 
   * @returns updates user information
   */
  async update(id: string, newUser: UpdateUserDto) {
    const user = await this.userRepository.findOneBy({
      id: id,
    });
    if (newUser.email) {
      const userWithEmail = await this.userRepository.findOneBy({
        email: newUser.email,
      });
      if (
        userWithEmail !== null &&
        userWithEmail !== undefined &&
        newUser.email !== user.email
      ) {
        throw new HttpException('Email is already used', HttpStatus.BAD_REQUEST);
      }
    }
    // check if user doesn't exist or have already an email
    if (user === undefined || user === null) {
      throw new HttpException("User doesn't exists", HttpStatus.BAD_REQUEST);
    }
    // merge and save the modified user
    await this.userRepository.merge(user, newUser);
    return await this.userRepository.save(user);
  }
  /**
   * 
   * @param id 
   * @returns delete user from database based on it's id
   */
  async deleteUserById(id: string) {
    // first get the user
    const user = await this.userRepository.findOneBy({ id: id });
    // then check if it exists
    if (user === undefined || user === null) {
      throw new HttpException("User doesn't exists", HttpStatus.BAD_REQUEST);
    }

    return await this.userRepository.delete(id);
  }
  /**
   * 
   * @returns delete all users from the database
   */
  async deleteAll() {
    return await this.userRepository.clear();
  }



}