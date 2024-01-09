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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SharedService = void 0;
const common_1 = require("@nestjs/common");
const OtpGenerator = require("otp-generator");
const email_constants_1 = require("../../auth/constant/email-constants");
const users_service_1 = require("../../features/users/services/users.service");
let SharedService = class SharedService {
    constructor(usersService) {
        this.usersService = usersService;
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
            from: '"DalTek" <' + process.env.EMAIL_USER + '>',
            to: email,
            subject: 'Verify Email',
            text: 'Verify your Email',
            html: `Hi! <br><br> Thanks for your registration<br><br>
         <p>This is your verification code <a href=#> '${otp}' </a></p>`,
        };
        return await this.sendEmail(mailOptions);
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
SharedService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], SharedService);
exports.SharedService = SharedService;
//# sourceMappingURL=shared.service.js.map