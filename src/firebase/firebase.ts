import * as admin from 'firebase-admin'
import { ServiceAccount } from './serviceaccount'
const firebaseServiceAccount = ServiceAccount as admin.ServiceAccount

admin.initializeApp({
  credential: admin.credential.cert(firebaseServiceAccount),
  databaseURL: 'https://authwithfirebaseandnode-default-rtdb.firebaseio.com',
})

export const firebaseAdmin = admin
