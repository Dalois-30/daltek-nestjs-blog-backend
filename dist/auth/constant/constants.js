"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomString = exports.EXPIRES_IN = void 0;
const crypto = require("crypto");
exports.EXPIRES_IN = 3600;
const generateRandomString = (length) => {
    return crypto.randomBytes(length).toString('hex').slice(0, length);
};
exports.generateRandomString = generateRandomString;
//# sourceMappingURL=constants.js.map