import {
    makeSchema,
    nonNull,
    objectType,
    stringArg,
    inputObjectType,
    arg,

} from 'nexus'
import {applyMiddleware} from 'graphql-middleware'
import rp from 'request-promise'
import {getUserId} from './utils'
import {Context} from './context'
import {firebaseAdmin} from './firebase/firebase'

const Query = objectType({
    name: 'Query',
    definition(t) {
        t.nonNull.list.nonNull.field('allUsers', {
            type: 'User',
            resolve: (_, __, context: Context) => {
                return context.prisma.user.findMany()
            },
        })
        t.nullable.field('me', {
            type: 'User',
            resolve: async (parent, args, context: Context) => {
                const userId = await getUserId(context)
                return context.prisma.user.findUnique({
                    where: {
                        uid: userId,
                    },
                })
            },
        })
        t.nullable.field('likeById', {
            type: 'Liked',

            resolve: async (parent, args, context: Context) => {
                const userId = await getUserId(context)
                return context.prisma.user.findMany({
                    where: {
                        uid: userId,
                    },
                })
            },
        })
        t.list.field('likeByUser', {
            type: 'Liked',
            args: {
                data: nonNull(
                    arg({
                        type: 'UserUniqueInput',
                    })
                ),
            },
            resolve: async (_, __, context: Context) => {
                const userId = await getUserId(context)
                return context.prisma.user.findUnique({
                    where: {uid: userId},
                })
            },
        })
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

        t.field('SaveLike', {
            type: 'Liked',
            args: {
                data: nonNull(
                    arg({
                        type: 'LikeCreateInput',
                    })
                ),
            },
            resolve: async (_, args, context: Context) => {
                const userId = getUserId(context)
                return context.prisma.like.upsert({
                    where: {id: _},
                    update: {},
                    create: {
                        title: args.data.title,
                        genre: args.data.genre,
                        poster: args.data.poster,
                        rating: args.data.rating,
                        liked: args.data.liked,
                    },
                })
            },
        })
    },
})

const User = objectType({
    name: 'User',
    definition(t) {
        t.nonNull.string('id')
        t.nonNull.string('name')
        t.nonNull.string('email')
        t.nonNull.string('uid')
        t.list.field('likes', {
            type: 'Liked',
            resolve: async (parent, args, context: Context) => {
                return context.prisma.user
                    .findUnique({
                        where: {id: parent.id || undefined},
                    })
                    .likes()
            },
        })
    },
})
const Liked = objectType({
    name: 'Liked',
    definition(t) {
        t.nonNull.string('id')
        t.nonNull.string('title')
        t.nonNull.string('poster')
        t.nonNull.string('genre')
        t.nonNull.float('rating')
        t.nonNull.boolean('liked')
        t.field('author', {
            type: 'User',
            resolve: async (parent, _, context: Context) => {
                return context.prisma.like
                    .findUnique({
                        where: {id: parent.id || undefined},
                    })
                    .author()
            },
        })
    },
})

const AuthPayload = objectType({
    name: 'AuthPayload',
    definition(t) {
        t.string('token')
        t.field('user', {type: 'User'})
    },
})

const LikeCreateInput = inputObjectType({
    name: 'LikeCreateInput',
    definition(t) {
        t.nonNull.string('title')
        t.nonNull.string('poster')
        t.nonNull.string('genre')
        t.nonNull.float('rating')
    },
})
const UserCreateInput = inputObjectType({
    name: 'UserCreateInput',
    definition(t) {
        t.nonNull.string('name')
        t.nonNull.string('email')
        t.nonNull.string('uid')
        t.list.nonNull.field('likes', {
            type: 'LikeCreateInput',
        })
    },
})

const UserUniqueInput = inputObjectType({
    name: 'UserUniqueInput',
    definition(t) {
        t.string('id'), t.string('name'), t.string('email'), t.string('uid')
    },
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
