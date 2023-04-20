import {
  makeSchema,
  nonNull,
  objectType,
  stringArg,
  inputObjectType,
  arg,
  floatArg,
  booleanArg,
  enumType,
  asNexusMethod,
  idArg,
  intArg,
  list,
} from "nexus"
import { applyMiddleware } from "graphql-middleware"
import rp from "request-promise"
import { getUserId } from "./utils"
import { Context } from "./context"
import { firebaseAdmin } from "./firebase/firebase"
import { DateTimeResolver } from "graphql-scalars"
import { Prisma } from "@prisma/client"

const DateTime = asNexusMethod(DateTimeResolver, "Date")

const Query = objectType({
  name: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("allUsers", {
      type: "User",
      resolve: (_, __, context: Context) => {
        return context.prisma.user.findMany()
      },
    })
    t.nullable.field("me", {
      type: "User",
      resolve: async (parent, args, context: Context) => {
        const userId = await getUserId(context)

        return context.prisma.user.findUnique({
          where: {
            uid: userId,
          },
        })
      },
    })
    t.nonNull.list.nonNull.field("allLikes", {
      type: "Liked",
      resolve: (_, __, context: Context) => {
        return context.prisma.like.findMany({
          where: {
            liked: true,
          },
          orderBy: { likedAt: "desc" },
        })
      },
    })
    t.nonNull.list.nonNull.field("likeFeed", {
      type: "Liked",
      resolve: async (_, __, ctx: Context) => {
        const userId = await getUserId(ctx)

        return ctx.prisma.user.findUnique({
          where: { uid: userId },
          select: { likes: { orderBy: { likedAt: "desc" } } },
        })
      },
    })
    t.list.field("likeById", {
      type: "Liked",
      args: {
        userId: idArg(),
      },
      resolve: async (_, args, ctx: Context) => {
        // const userId = await getUserId(ctx)
        return ctx.prisma.like.findMany({
          where: { authorId: args.userId },
          orderBy: { likedAt: "desc" },
        })
      },
    })
  },
})

const Mutation = objectType({
  name: "Mutation",
  definition(t) {
    t.field("signup", {
      type: "AuthPayload",
      args: {
        name: stringArg(),
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      resolve: async (_parent, args, context: Context) => {
        try {
          const firebaseUser = await firebaseAdmin.auth().createUser({
            displayName: args.name,
            email: args.email,
            password: args.password,
          })
          const user = await context.prisma.user.create({
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
            method: "POST",
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

    t.field("likeByUser", {
      type: "Liked",
      args: {
        data: arg({
          type: "LikeCreateInput",
        }),
      },
      resolve: async (_, args, ctx: Context) => {
        const userId = await getUserId(ctx)
        return ctx.prisma.like.create({
          data: {
            title: args.data.title,
            poster: args.data.poster,
            genre: args.data.genre,
            overview: args.data.overview,
            rating: args.data.rating,
            movie_db_id: args.data.movie_db_id,
            author: {
              connect: { uid: userId },
            },
          },
        })
      },
    })

    t.nonNull.field("deleteLikeByUser", {
      type: "Liked",
      args: {
        movie_db_id: nonNull(intArg()),
      },
      resolve: (_, args, ctx: Context) => {
        return ctx.prisma.like.delete({
          where: { movie_db_id: args.movie_db_id },
        })
      },
    })
  },
})

const User = objectType({
  name: "User",
  definition(t) {
    t.nonNull.string("id")
    t.string("name")
    t.nonNull.string("email")
    t.nonNull.string("uid")
    t.list.nonNull.field("likes", {
      type: "Liked",
      resolve: async (parent, args, context: Context) => {
        return context.prisma.user
          .findUnique({
            where: { id: parent.id || undefined },
          })
          .likes()
      },
    })
  },
})
const Liked = objectType({
  name: "Liked",
  definition(t) {
    t.nonNull.string("id")
    t.string("title")
    t.nonNull.field("likedAt", { type: "DateTime" })
    t.string("poster")
    t.string("genre")
    t.float("rating")
    t.string("overview")
    t.nonNull.int("movie_db_id")
    t.nonNull.boolean("liked")
    t.field("author", {
      type: "User",
      resolve: async (parent, args, context: Context) => {
        return context.prisma.like
          .findUnique({
            where: { id: parent.id || undefined },
          })
          .author()
      },
    })
  },
})

const AuthPayload = objectType({
  name: "AuthPayload",
  definition(t) {
    t.string("token")
    t.field("user", { type: "User" })
  },
})

const LikeCreateInput = inputObjectType({
  name: "LikeCreateInput",
  definition(t) {
    t.string("title")
    t.string("poster")
    t.string("genre")
    t.float("rating")
    t.string("overview")
    t.int("movie_db_id")
  },
})
const UserCreateInput = inputObjectType({
  name: "UserCreateInput",
  definition(t) {
    t.nonNull.string("name")
    t.nonNull.string("email")
    t.list.nonNull.field("likes", {
      type: "LikeCreateInput",
    })
  },
})

const UserUniqueInput = inputObjectType({
  name: "UserUniqueInput",
  definition(t) {
    t.string("id"), t.string("name"), t.string("email"), t.string("uid")
  },
})

const SortOrder = enumType({
  name: "SortOrder",
  members: ["asc", "desc"],
})

const schemaWithoutPermissions = makeSchema({
  types: [
    Query,
    Mutation,
    User,
    AuthPayload,
    Liked,
    LikeCreateInput,
    UserCreateInput,
    UserUniqueInput,
    SortOrder,
    DateTime,
  ],
  outputs: {
    schema: __dirname + "/../schema.graphql",
    typegen: __dirname + "/generated/nexus",
  },
  contextType: {
    module: require.resolve("./context"),
    export: "Context",
  },
  sourceTypes: {
    modules: [
      {
        module: "@prisma/client",
        alias: "prisma",
      },
    ],
  },
})
export const schema = applyMiddleware(schemaWithoutPermissions)
