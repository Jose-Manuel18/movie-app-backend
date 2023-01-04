import * as admin from 'firebase-admin'
import { ServiceAccount } from './serviceaccount'
const firebaseServiceAccount = ServiceAccount as admin.ServiceAccount

admin.initializeApp({
  credential: admin.credential.cert(firebaseServiceAccount),
  databaseURL: `${process.env.databaseURL}`,
})

export const firebaseAdmin = admin
