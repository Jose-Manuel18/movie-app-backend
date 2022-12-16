"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserId = void 0;
const firebase_1 = require("./firebase/firebase");
async function getUserId(context) {
    const authHeader = context.req.get('Authorization');
    if (authHeader) {
        const token = authHeader.replace('Bearer ', '');
        const decodedToken = await firebase_1.firebaseAdmin.auth().verifyIdToken(token);
        return decodedToken.uid;
    }
}
exports.getUserId = getUserId;
