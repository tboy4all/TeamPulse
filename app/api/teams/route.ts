import { NextResponse } from 'next/server'
import { PrismaClient } from '@/lib/generated/prisma'
import { createTeamSchema } from '@/app/validationSchemas'

const prisma = new PrismaClient()

export async function GET() {
  const teams = await prisma.team.findMany({
    include: {
      sentiments: true,
    },
  })

  const formatted = teams.map((team) => {
    const sentimentValues = team.sentiments.map((s) => {
      switch (s.value) {
        case 'HAPPY':
          return 1
        case 'NEUTRAL':
          return 0
        case 'SAD':
          return -1
        default:
          return 0
      }
    })

    const score =
      sentimentValues.length > 0
        ? sentimentValues.reduce((acc: number, val) => acc + val, 0) /
          sentimentValues.length
        : 0

    return {
      id: team.id,
      name: team.name,
      sentimentScore: score.toFixed(2),
    }
  })

  return NextResponse.json(formatted)
}

export async function POST(req: Request) {
  try {
    const json = await req.json()

    const result = createTeamSchema.safeParse(json)
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { name } = result.data

    const existing = await prisma.team.findFirst({ where: { name } })

    if (existing) {
      return NextResponse.json(
        { error: 'A team with this name already exists.' },
        { status: 409 }
      )
    }

    const team = await prisma.team.create({
      data: { name },
    })

    return NextResponse.json(team, { status: 201 })
  } catch (err) {
    console.error('POST /api/teams error:', err)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
