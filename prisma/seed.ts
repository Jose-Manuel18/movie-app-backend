import { PrismaClient, Prisma } from "@prisma/client"
import { faker } from "@faker-js/faker"
const prisma = new PrismaClient()

const userData: Prisma.UserCreateInput[] = [
  {
    id: faker.datatype.uuid(),
    name: "Alice",
    email: faker.internet.email(),
    uid: "qeqoruqwryuqirywuqiyrwuiqyrioeuwi",
    likes: {
      create: [
        {
          title: "John Wick 433",
          genre: "Action",
          liked: true,
          poster:
            "https://images.unsplash.com/photo-1485846234mmg645-a62644f84728?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8YWN0aW9ufGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=1600&q=60",
          rating: 10,
          overview: "dsdsdsdsdsdsdsdsds",
          movie_db_id: +faker.random.numeric(2),
        },
        {
          title: "John Wick 433",
          genre: "Action",
          liked: true,
          poster:
            "https://images.unsplash.com/photo-1485846234mmg645-a62644f84728?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8YWN0aW9ufGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=1600&q=60",
          rating: 10,
          overview: "dsdsdsdsdsdsdsdsds",
          movie_db_id: +faker.random.numeric(2),
        },
        {
          title: "John Wick 433",
          genre: "Action",
          liked: true,
          poster:
            "https://images.unsplash.com/photo-1485846234mmg645-a62644f84728?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8YWN0aW9ufGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=1600&q=60",
          rating: 10,
          overview: "dsdsdsdsdsdsdsdsds",
          movie_db_id: +faker.random.numeric(2),
        },
      ],
    },
  },
  {
    id: faker.datatype.uuid(),
    name: "Nilu",
    email: faker.internet.email(),
    uid: faker.datatype.uuid(),
    likes: {
      create: [
        {
          title: "John Wick 41",
          genre: "Action",
          liked: true,
          overview: "dsfsfsfsfdsfsfs",
          poster:
            "https://images.unsplash.com/photo-14858fsfd46234645-a6mmg2644f84728?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8YWN0aW9ufGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=1600&q=60",
          rating: 10,
          movie_db_id: +faker.random.numeric(2),
        },
      ],
    },
  },
  {
    id: faker.datatype.uuid(),
    name: "Mahmoud",
    email: faker.internet.email(),
    uid: faker.datatype.uuid(),
    likes: {
      create: [
        {
          title: "John Wick 43",
          liked: true,
          genre: "Action",
          overview: "hosfdsofsosdsf",
          poster:
            "https://images.unsplash.com/photo-14858462dfsfsfsdfmmg34645-a62644f84728?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8YWN0aW9ufGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=1600&q=60",
          rating: 7.89,
          movie_db_id: +faker.random.numeric(2),
        },
      ],
    },
  },
]

async function main() {
  console.log(`Start seeding ...`)
  for (const u of userData) {
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
