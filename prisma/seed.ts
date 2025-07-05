// import {
//   PrismaClient,
//   SentimentType,
//   CheckInFrequency,
// } from '../lib/generated/prisma'
import { PrismaClient, SentimentType, CheckInFrequency } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const existingUser = await prisma.user.findUnique({
    where: { email: 'admin@teampulse.dev' },
  })

  let user
  if (!existingUser) {
    user = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@teampulse.dev',
        password: 'password123',
      },
    })
  } else {
    user = existingUser
  }

  // Clear existing teams/sentiments for dev consistency
  await prisma.sentiment.deleteMany()
  await prisma.team.deleteMany()

  const team1 = await prisma.team.create({
    data: {
      name: 'Engineering',
      members: {
        connect: [{ id: user.id }],
      },
    },
  })

  const team2 = await prisma.team.create({
    data: {
      name: 'Marketing',
    },
  })

  await prisma.sentiment.createMany({
    data: [
      {
        value: SentimentType.HAPPY,
        userId: user.id,
        teamId: team1.id,
      },
      {
        value: SentimentType.NEUTRAL,
        userId: user.id,
        teamId: team2.id,
      },
    ],
  })

  // ✅ Create App Settings using ENUM
  await prisma.appSettings.create({
    data: {
      checkInsEnabled: true,
      checkInFrequency: CheckInFrequency.WEEKLY, // enum value used here
    },
  })
  console.log('✅ Mock data seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
