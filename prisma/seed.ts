import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

const userSeed: Prisma.UserCreateInput[] = [
  {
    name: 'Alice',
    email: 'alice@prisma.io',
    uid: 'mmmmmmmmmmmmm',
    likes: {
      create: [
        {
          title: 'John Wick 4',
          genre: 'Action & Adventure',
          rating: 10,
          liked: true,
          poster:
            'https://images.unsplash.com/photo-1621274283140-e4450435a76a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2960&q=80',
        },
      ],
    },
  },
  {
    name: 'Bob',
    email: 'bob@prisma.io',
    uid: 'mmmmmmmmmmmmm',
    likes: {
      create: [
        {
          title: 'John Wick 4',
          genre: 'Action & Adventure',
          rating: 10,
          liked: true,
          poster:
            'https://images.unsplash.com/photo-1621274283140-e4450435a76a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2960&q=80',
        },
      ],
    },
  },
  {
    name: 'Carol',
    email: 'carol@prisma.io',
    uid: 'mmmmmmmmmmmmm',
    likes: {
      create: [
        {
          title: 'John Wick 4',
          genre: 'Action & Adventure',
          rating: 10,
          liked: true,
          poster:
            'https://images.unsplash.com/photo-1621274283140-e4450435a76a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2960&q=80',
        },
      ],
    },
  },
]
async function main() {
  console.log(`Start seeding ...`)
  for (const u of userSeed) {
    const user = await prisma.user.create({
      data: u,
    })
    console.log(`Created user with id: ${user.id}`)
  }
  console.log(`Seeding finished.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
