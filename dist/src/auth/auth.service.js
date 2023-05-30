"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = require("bcrypt");
const typeorm_1 = require("typeorm");
const emailverification_entity_1 = require("./entities/emailverification.entity");
const typeorm_2 = require("@nestjs/typeorm");
require("dotenv/config");
const email_constants_1 = require("./constant/email-constants");
const user_roles_1 = require("./constant/user-roles");
const update_user_dto_1 = require("./dto/update-user.dto");
const user_entity_1 = require("./entities/user.entity");
const users_service_1 = require("../features/users/users.service");
const jwt_payload_service_1 = require("./jwt.payload.service");
const OtpGenerator = require("otp-generator");
const api_response_1 = require("../shared/response/api-response");
const phoneRegex = /^6(?=[579])([0-9]{8})/;
let AuthService = class AuthService {
    constructor(usersService, jwtPayloadService, emailVerificationRepository, userRepository) {
        this.usersService = usersService;
        this.jwtPayloadService = jwtPayloadService;
        this.emailVerificationRepository = emailVerificationRepository;
        this.userRepository = userRepository;
    }
    async create(createUserDto, response) {
        const res = new api_response_1.ApiResponseDTO();
        try {
            const user = await this.usersService.findOneByEmail(createUserDto.email);
            if (user) {
                throw new common_1.HttpException('User already exists', common_1.HttpStatus.BAD_REQUEST);
            }
            const newUser = new user_entity_1.User();
            newUser.email = createUserDto.email;
            newUser.password = createUserDto.password;
            newUser.role = user_roles_1.UserRoles.USER;
            const userResponse = await this.userRepository.save(newUser);
            await this.createEmailToken(newUser.email, response);
            res.data = userResponse;
            res.statusCode = common_1.HttpStatus.CREATED;
            res.message = "user created successfully";
        }
        catch (error) {
            res.statusCode = common_1.HttpStatus.BAD_REQUEST;
            res.message = error.message;
        }
        return response.send(res);
    }
    async createAdmin(createUserDto, response) {
        const res = new api_response_1.ApiResponseDTO();
        try {
            const user = await this.usersService.findOneByEmail(createUserDto.email);
            if (user) {
                throw new common_1.HttpException('User already exists', common_1.HttpStatus.BAD_REQUEST);
            }
            const newUser = new user_entity_1.User();
            newUser.email = createUserDto.email;
            newUser.password = createUserDto.password;
            newUser.role = user_roles_1.UserRoles.ADMIN;
            const userResponse = await this.userRepository.save(newUser);
            await this.createEmailToken(newUser.email, response);
            res.data = userResponse;
            res.statusCode = common_1.HttpStatus.CREATED;
            res.message = "user created successfully";
        }
        catch (error) {
            res.statusCode = common_1.HttpStatus.BAD_REQUEST;
            res.message = error.message;
        }
        return response.send(res);
    }
    async resetPassword(email, resetPassWord) {
        const res = new api_response_1.ApiResponseDTO();
        try {
            const user = await this.userRepository.findOneBy({
                email: email,
            });
            if (!user) {
                throw new common_1.UnauthorizedException('User does not exist');
            }
            const state = await this.checkPassword(resetPassWord.actualPassword, user);
            if (state) {
                const newUser = new update_user_dto_1.UpdateUserDto();
                newUser.password = resetPassWord.newPassword;
                this.userRepository.merge(user, newUser);
                await this.userRepository.save(user);
                res.message = "Successful Updated";
                res.statusCode = common_1.HttpStatus.OK;
            }
            else {
                throw new common_1.HttpException('Wrong credentials', common_1.HttpStatus.UNAUTHORIZED);
            }
        }
        catch (error) {
            res.statusCode = common_1.HttpStatus.BAD_REQUEST;
            res.message = error.message;
        }
        return res;
    }
    async validateUserByPassword(loginUserDto) {
        const res = new api_response_1.ApiResponseDTO();
        try {
            const user = await this.usersService.findOneByEmail(loginUserDto.email);
            if (!user) {
                throw new common_1.UnauthorizedException('User does not exist');
            }
            const promise = await new Promise(async (resolve) => {
                const state = await this.checkPassword(loginUserDto.password, user);
                if (state) {
                    resolve(this.jwtPayloadService.createJwtPayload(user));
                }
                else {
                    resolve({ status: 401 });
                }
            });
            if (promise.status !== 401) {
                res.data = promise;
                res.message = "Success";
                res.statusCode = common_1.HttpStatus.OK;
            }
            else {
                throw new common_1.HttpException('Wrong credentials', common_1.HttpStatus.UNAUTHORIZED);
            }
        }
        catch (error) {
            res.statusCode = common_1.HttpStatus.BAD_REQUEST;
            res.message = error.message;
        }
        return res;
    }
    async checkPassword(password, user) {
        return new Promise(async (resolve) => {
            await bcrypt.compare(password, user.password, async (err, isMatch) => {
                if (err) {
                    return err;
                }
                resolve(isMatch);
            });
        });
    }
    async validateUserByJwt(payload) {
        const user = await this.usersService.findOneByEmail(payload.email);
        if (user) {
            return this.jwtPayloadService.createJwtPayload(user);
        }
        else {
            throw new common_1.UnauthorizedException();
        }
    }
    async createEmailToken(email, res) {
        const otp = OtpGenerator.generate(10, {
            lowerCaseAlphabets: true,
            upperCaseAlphabets: true,
            specialChars: true,
        });
        res.cookie('OTP', otp, {
            maxAge: 5 * 60 * 1000,
            httpOnly: false,
            secure: false,
        });
        const user = await this.usersService.findOneByEmail(email);
        if (!user) {
            throw new common_1.UnauthorizedException('User does not exist');
        }
        const mailOptions = {
            from: '"Mendo Cash" <' + process.env.EMAIL_USER + '>',
            to: email,
            subject: 'Verify Email',
            text: 'Verify your Email',
            html: `Hi! <br><br> Thanks for your registration<br><br>
         <p>This is your verification code <a href=#> '${otp}' </a></p>`,
        };
        return await this.sendEmail(mailOptions);
    }
    async verifyEmail(token, email, req) {
        const otp = req.cookies['OTP'];
        if (!otp) {
            throw new common_1.HttpException('token expired', common_1.HttpStatus.NOT_FOUND);
        }
        const res = new api_response_1.ApiResponseDTO();
        console.log(otp, token);
        if (otp !== token) {
            throw new common_1.HttpException('Otp invalide', common_1.HttpStatus.NOT_ACCEPTABLE);
        }
        const userFromDb = await this.usersService.findOneByEmail(email);
        if (userFromDb) {
            await this.usersService.update(userFromDb.id, {
                verified: true,
            });
        }
        res.data = otp;
        res.message = "successfully verified OTP";
        return {
            res
        };
    }
    async sendEmail(mailOptions) {
        return await new Promise(async (resolve, reject) => {
            return await email_constants_1.transporter.sendMail(mailOptions, async (error, info) => {
                if (error) {
                    common_1.Logger.log(`Error while sending message: ${error}`, 'sendEmailVerification');
                    return reject(error);
                }
                common_1.Logger.log(`Send message: ${info.messageId}`, 'sendEmailVerification');
                resolve({ message: 'Successfully send email' });
            });
        });
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, typeorm_2.InjectRepository)(emailverification_entity_1.EmailVerificationEntity)),
    __param(3, (0, typeorm_2.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_payload_service_1.JwtPayloadService,
        typeorm_1.Repository,
        typeorm_1.Repository])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map