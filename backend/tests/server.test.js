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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const body_parser_1 = __importDefault(require("body-parser"));
const auth_1 = __importDefault(require("../src/routes/auth"));
const app = (0, express_1.default)();
const SECRET_KEY = 'your_secret_key';
app.use(body_parser_1.default.json());
app.use('/auth', auth_1.default);
const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        res.sendStatus(403);
        return;
    }
    jsonwebtoken_1.default.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
};
app.get('/main', authenticateJWT, (req, res) => {
    res.json({ message: `Welcome ${req.user.username}` });
});
describe('Server', () => {
    it('should return 403 if no token is provided', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get('/main');
        expect(response.status).toBe(403);
    }));
    it('should return 403 if token is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get('/main')
            .set('Authorization', 'invalid_token');
        expect(response.status).toBe(403);
    }));
    it('should return 200 and welcome message if token is valid', () => __awaiter(void 0, void 0, void 0, function* () {
        const token = jsonwebtoken_1.default.sign({ username: 'testuser' }, SECRET_KEY);
        const response = yield (0, supertest_1.default)(app)
            .get('/main')
            .set('Authorization', token);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Welcome testuser');
    }));
});
