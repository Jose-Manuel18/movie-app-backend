import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()
async function main() {
  const alice = await prisma.user.upsert({
    where: { email: 'alice@prisma.com' },
    update: {},
    create: {
      email: 'alice@prisma.com',
      name: 'Alice',
      uid: 'msfmdsmfmsfmsmd',
      likes: {
        create: {
          title: 'John Wick 4',
          genre: 'Action',
          liked: true,
          poster:
            'https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8YWN0aW9ufGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=1600&q=60',
          rating: 7.89,
        },
      },
    },
  })
  const bob = await prisma.user.upsert({
    where: { email: 'bob@prisma.com' },
    update: {},
    create: {
      email: 'bob@prisma.com',
      name: 'Bob',
      uid: 'msfmdsmfmdadadsadsfmsmd',
      likes: {
        create: {
          title: 'John Wick 4',
          genre: 'Action',
          liked: true,
          poster:
            'https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8YWN0aW9ufGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=1600&q=60',
          rating: 10,
        },
      },
    },
  })
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
