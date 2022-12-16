"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createContext = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function createContext(req) {
    return Object.assign(Object.assign({}, req), { prisma });
}
exports.createContext = createContext;
