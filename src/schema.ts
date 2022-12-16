import {
  intArg,
  makeSchema,
  nonNull,
  objectType,
  stringArg,
  inputObjectType,
  arg,
  asNexusMethod,
  enumType,
  extendInputType,
  extendType,
} from 'nexus'
import { applyMiddleware } from 'graphql-middleware'
import rp from 'request-promise'
import { getUserId } from './utils'
import { Context } from './context.js'
import { firebaseAdmin } from './firebase/firebase'

const Query = objectType({
  name: 'Query',
  definition(t) {
    t.nonNull.list.nonNull.field('allUsers', {
      type: 'User',
      resolve: (_parent, _args, ctx: Context) => {
        return ctx.prisma.user.findMany()
      },
    })
    t.nullable.field('me', {
      type: 'User',
      resolve: async (parent, args, ctx: Context) => {
        const userId = await getUserId(ctx)
        return ctx.prisma.user.findUnique({
          where: {
            uid: userId,
          },
        })
      },
    })
    // t.nullable.field('likeById', {
    //   type: 'LikeCreateInput',
    //   args: {
    //     id: intArg(),
    //   },
    //   resolve: (_parent, args, ctx: Context) => {
    //     return ctx.prisma.like.findMany({
    //       where: {
    //         id: args.id || undefined,
    //       },
    //     })
    //   },
    // })
  },
})

const Mutation = objectType({
  name: 'Mutation',
  definition(t) {
    t.field('signup', {
      type: 'AuthPayload',
      args: {
        name: stringArg(),
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      resolve: async (_parent, args, ctx: Context) => {
        try {
          const firebaseUser = await firebaseAdmin.auth().createUser({
            displayName: args.name,
            email: args.email,
            password: args.password,
          })
          const user = await ctx.prisma.user.create({
            data: {
              name: args.name,
              email: args.email,
              uid: firebaseUser.uid,
            },
          })
          const token = await firebaseAdmin
            .auth()
            .createCustomToken(firebaseUser.uid, {})

          const res = await rp({
            url: `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyCustomToken?key=AIzaSyDTsuOGC3uZs1ZvNBTE8bQsoRuZ4S88ODo`,
            method: 'POST',
            body: {
              token,
              returnSecureToken: true,
            },
            json: true,
          })
          return {
            token: res.idToken,
            user,
          }
        } catch (error) {
          console.error(error)
        }
      },
    })
  },
})
// const LikeMutation = extendType({
//   type: 'Mutation',
//   definition(t) {
//     t.field('likeMovie', {
//       type: 'Like',
//       args: {
//         data: nonNull(arg({ type: 'LikeCreateInput' })),
//       },
//       resolve: (_, args, ctx: Context) => {
//         const userId = getUserId(ctx)

//         return ctx.prisma.like.create({
//           data: {
//             title: args.data.title,
//             genre: args.data.genre,
//             poster: args.data.poster,
//             rating: args.data.rating,
//             authorId: +userId,
//           },
//         })
//       },
//     })
//   },
// })
const User = objectType({
  name: 'User',
  definition(t) {
    t.nonNull.int('id')
    t.string('name')
    t.nonNull.string('email')
    t.nonNull.string('uid')
    // t.nonNull.list.nonNull.field('likes', {
    //   type: 'Liked',
    //   resolve: (parent, args, ctx: Context) => {
    //     return ctx.prisma.user
    //       .findUnique({
    //         where: { id: parent.id || undefined },
    //       })
    //       .likes()
    //   },
    // })
  },
})
// const Liked = objectType({
//   name: 'Liked',
//   definition(t) {
//     t.nonNull.int('id')
//     t.string('title')
//     t.string('poster')
//     t.string('genre')
//     t.int('rating')
//     t.field('author', {
//       type: 'User',
//       resolve: (parent, _, ctx: Context) => {
//         return ctx.prisma.like
//           .findUnique({
//             where: { id: parent.id || undefined },
//           })
//           .author()
//       },
//     })
//   },
// })
const AuthPayload = objectType({
  name: 'AuthPayload',
  definition(t) {
    t.string('token')
    t.field('user', { type: 'User' })
  },
})

// const LikeCreateInput = inputObjectType({
//   name: 'LikeCreateInput',
//   definition(t) {
//     t.string('title')
//     t.string('poster')
//     t.string('genre')
//     t.int('rating')
//   },
// })

const schemaWithoutPermissions = makeSchema({
  types: [
    Query,
    Mutation,
    User,
    AuthPayload,
    // LikeCreateInput,
    // Liked,
    // LikeMutation,
  ],
  outputs: {
    schema: __dirname + '/../schema.graphql',
    typegen: __dirname + '/generated/nexus',
  },
  contextType: {
    module: require.resolve('./context'),
    export: 'Context',
  },
  sourceTypes: {
    modules: [
      {
        module: '@prisma/client',
        alias: 'prisma',
      },
    ],
  },
})
export const schema = applyMiddleware(schemaWithoutPermissions)
