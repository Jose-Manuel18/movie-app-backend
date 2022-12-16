"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("./schema");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const server_1 = require("@apollo/server");
const context_1 = require("./context");
const express4_1 = require("@apollo/server/express4");
const http_1 = __importDefault(require("http"));
const app = (0, express_1.default)();
const httpServer = http_1.default.createServer(app);
require("./firebase/firebase");
const server = new server_1.ApolloServer({
    schema: schema_1.schema,
});
app.use(body_parser_1.default.json(), (0, cors_1.default)({
// origin: 'http://localhost:19006',
}));
const serverStartFunction = async () => {
    await server.start();
    app.use((0, express4_1.expressMiddleware)(server, { context: context_1.createContext }));
};
serverStartFunction();
const startServer = async () => {
    await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
    console.log(`🚀 Server ready at http://localhost:4000/`);
};
startServer();
