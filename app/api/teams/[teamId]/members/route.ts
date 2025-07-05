import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@/lib/generated/prisma'

const prisma = new PrismaClient()

export async function GET(
  req: NextRequest,
  context: { params: { teamId: string } }
) {
  const { teamId } = await context.params

  const members = await prisma.user.findMany({
    where: {
      teams: {
        some: {
          id: teamId,
        },
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
      sentiments: {
        where: {
          teamId,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 1,
      },
    },
  })

  const formatted = members.map((member) => ({
    id: member.id,
    name: member.name,
    email: member.email,
    sentiment: member.sentiments[0]?.value ?? 'NEUTRAL',
  }))

  return NextResponse.json(formatted)
}

export async function POST(
  req: NextRequest,
  context: { params: { teamId: string } }
) {
  const { teamId } = await context.params
  const { name, email, sentiment } = await req.json()

  if (!name || !email) {
    return NextResponse.json(
      { error: 'Name and email are required.' },
      { status: 400 }
    )
  }

  const existingUser = await prisma.user.findUnique({ where: { email } })

  let user

  if (existingUser) {
    user = await prisma.user.update({
      where: { email },
      data: {
        name,
        teams: {
          connect: { id: teamId },
        },
      },
    })
  } else {
    user = await prisma.user.create({
      data: {
        name,
        email,
        password: 'default123',
        teams: {
          connect: { id: teamId },
        },
      },
    })
  }

  if (sentiment) {
    await prisma.sentiment.create({
      data: {
        value: sentiment,
        userId: user.id,
        teamId,
      },
    })
  }

  return NextResponse.json({ success: true })
}

export async function PATCH(req: Request) {
  const body = await req.json()
  const { userId, sentiment } = body

  // Check if sentiment already exists
  const existing = await prisma.sentiment.findFirst({
    where: {
      userId,
      teamId: body.teamId, // Ensure teamId is included in the request body
    },
  })

  let updatedSentiment
  if (existing) {
    // Update existing sentiment
    updatedSentiment = await prisma.sentiment.update({
      where: { id: existing.id },
      data: { value: sentiment },
    })
  } else {
    // Create new sentiment
    updatedSentiment = await prisma.sentiment.create({
      data: {
        userId,
        teamId: body.teamId,
        value: sentiment,
      },
    })
  }

  return NextResponse.json(updatedSentiment)
}

export async function DELETE(
  req: NextRequest,
  context: { params: { teamId: string } }
) {
  const { teamId } = await context.params
  const { userId } = await req.json()

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId.' }, { status: 400 })
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      teams: {
        disconnect: { id: teamId },
      },
    },
  })

  return NextResponse.json({ success: true })
}
