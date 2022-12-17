'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.schema = void 0
const nexus_1 = require('nexus')
const graphql_middleware_1 = require('graphql-middleware')
const request_promise_1 = __importDefault(require('request-promise'))
const utils_1 = require('./utils')
const firebase_1 = require('./firebase/firebase')
const Query = (0, nexus_1.objectType)({
  name: 'Query',
  definition(t) {
    t.nonNull.list.nonNull.field('allUsers', {
      type: 'User',
      resolve: (_parent, _args, ctx) => {
        return ctx.prisma.user.findMany()
      },
    })
    t.nullable.field('me', {
      type: 'User',
      resolve: async (parent, args, ctx) => {
        const userId = await (0, utils_1.getUserId)(ctx)
        return ctx.prisma.user.findUnique({
          where: {
            uid: userId,
          },
        })
      },
    })
    t.nullable.field('likeById', {
      type: 'Liked',
      args: {
        id: (0, nexus_1.intArg)(),
      },
      resolve: (_parent, args, ctx) => {
        return ctx.prisma.like.findMany({
          where: {
            id: args.id || undefined,
          },
        })
      },
    })
  },
})
const Mutation = (0, nexus_1.extendType)({
  type: 'Mutation',
  definition(t) {
    t.field('signup', {
      type: 'AuthPayload',
      args: {
        name: (0, nexus_1.stringArg)(),
        email: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
        password: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
      },
      resolve: async (_parent, args, ctx) => {
        try {
          const firebaseUser = await firebase_1.firebaseAdmin
            .auth()
            .createUser({
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
          const token = await firebase_1.firebaseAdmin
            .auth()
            .createCustomToken(firebaseUser.uid, {})
          const res = await (0, request_promise_1.default)({
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
    t.field('likeMovie', {
      type: 'Liked',
      args: {
        data: LikeCreateInput,
      },
      resolve: (_, args, ctx) => {
        const userId = (0, utils_1.getUserId)(ctx)
        return ctx.prisma.like.create({
          data: {
            title: args.data.title,
            rating: args.data.rating,
            genre: args.data.genre,
            poster: args.data.poster,
            authorId: +userId,
          },
        })
      },
    })
  },
})
const User = (0, nexus_1.objectType)({
  name: 'User',
  definition(t) {
    t.nonNull.int('id')
    t.string('name')
    t.nonNull.string('email')
    t.nonNull.string('uid')
    t.nonNull.list.nonNull.field('likes', {
      type: 'Liked',
      resolve: (parent, args, ctx) => {
        return ctx.prisma.user
          .findUnique({
            where: { id: parent.id || undefined },
          })
          .likes()
      },
    })
  },
})
const Liked = (0, nexus_1.objectType)({
  name: 'Liked',
  definition(t) {
    t.nonNull.int('id')
    t.string('title')
    t.string('poster')
    t.string('genre')
    t.string('rating')
    t.field('author', {
      type: 'User',
      resolve: (parent, _, ctx) => {
        return ctx.prisma.like
          .findUnique({
            where: { id: parent.id || undefined },
          })
          .author()
      },
    })
  },
})
const AuthPayload = (0, nexus_1.objectType)({
  name: 'AuthPayload',
  definition(t) {
    t.string('token')
    t.field('user', { type: 'User' })
  },
})
const UserCreateInput = (0, nexus_1.inputObjectType)({
  name: 'UserCreateInput',
  definition(t) {
    t.nonNull.string('email')
    t.string('name')
    t.nonNull.string('uid')
    t.list.nonNull.field('likes', { type: 'Liked' })
  },
})
const LikeCreateInput = (0, nexus_1.inputObjectType)({
  name: 'LikeCreateInput',
  definition(t) {
    t.string('title')
    t.string('poster')
    t.string('genre')
    t.string('rating')
  },
})
const schemaWithoutPermissions = (0, nexus_1.makeSchema)({
  types: [
    Query,
    Mutation,
    User,
    AuthPayload,
    UserCreateInput,
    LikeCreateInput,
    Liked,
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
exports.schema = (0, graphql_middleware_1.applyMiddleware)(
  schemaWithoutPermissions
)
