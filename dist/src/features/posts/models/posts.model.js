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
exports.Posts = void 0;
const user_entity_1 = require("../../../auth/entities/user.entity");
const category_model_1 = require("../../categories/models/category.model");
const comments_model_1 = require("../../comments/models/comments.model");
const typeorm_1 = require("typeorm");
let Posts = class Posts {
    constructor() {
        this.publish = false;
    }
};
exports.Posts = Posts;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Posts.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        unique: true
    }),
    __metadata("design:type", String)
], Posts.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "longtext"
    }),
    __metadata("design:type", String)
], Posts.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Posts.prototype, "image", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Posts.prototype, "publish", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => category_model_1.Category, (category) => category.posts),
    __metadata("design:type", category_model_1.Category)
], Posts.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (category) => category.posts),
    __metadata("design:type", user_entity_1.User)
], Posts.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => comments_model_1.Comments, (comment) => comment.post),
    __metadata("design:type", Array)
], Posts.prototype, "comments", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" }),
    __metadata("design:type", Date)
], Posts.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" }),
    __metadata("design:type", Date)
], Posts.prototype, "updated_at", void 0);
exports.Posts = Posts = __decorate([
    (0, typeorm_1.Entity)()
], Posts);
//# sourceMappingURL=posts.model.js.map