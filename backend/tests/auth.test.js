"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../src/routes/auth"));
const globals_1 = require("@jest/globals");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/auth', auth_1.default);
(0, globals_1.describe)('Auth Routes', () => {
    (0, globals_1.it)('should register a new user', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post('/auth/register')
            .send({ username: 'testuser', password: 'testpass' });
        (0, globals_1.expect)(response.status).toBe(201);
        (0, globals_1.expect)(response.body.message).toBe('User registered successfully');
    }));
    (0, globals_1.it)('should not register an existing user', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app)
            .post('/auth/register')
            .send({ username: 'testuser', password: 'testpass' });
        const response = yield (0, supertest_1.default)(app)
            .post('/auth/register')
            .send({ username: 'testuser', password: 'testpass' });
        (0, globals_1.expect)(response.status).toBe(400);
        (0, globals_1.expect)(response.body.message).toBe('User already exists');
    }));
    (0, globals_1.it)('should login an existing user', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app)
            .post('/auth/register')
            .send({ username: 'testuser', password: 'testpass' });
        const response = yield (0, supertest_1.default)(app)
            .post('/auth/login')
            .send({ username: 'testuser', password: 'testpass' });
        (0, globals_1.expect)(response.status).toBe(200);
        (0, globals_1.expect)(response.body.token).toBeDefined();
    }));
    (0, globals_1.it)('should not login with invalid credentials', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post('/auth/login')
            .send({ username: 'invaliduser', password: 'invalidpass' });
        (0, globals_1.expect)(response.status).toBe(401);
        (0, globals_1.expect)(response.body.message).toBe('Invalid credentials');
    }));
});
