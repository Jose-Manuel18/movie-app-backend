import { Context } from './context'
import { firebaseAdmin } from './firebase/firebase'

export async function getUserId(context: Context) {
  const authHeader = context.req.get('Authorization')

  if (authHeader) {
    const token = authHeader.replace('Bearer ', '')
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(token)
    return decodedToken.uid
  }
}
