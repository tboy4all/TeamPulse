import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { updateAppSettingsSchema } from '@/app/validationSchemas'

const prisma = new PrismaClient()

/**
 * GET – Fetch admin settings
 */
export async function GET() {
  try {
    const settings = await prisma.appSettings.findFirst()

    if (!settings) {
      return NextResponse.json({ error: 'Settings not found' }, { status: 404 })
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('GET /api/settings error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

/**
 * PATCH – Update admin settings with Zod validation
 */
export async function PATCH(req: Request) {
  try {
    const body = await req.json()

    // ✅ Validate input
    const result = updateAppSettingsSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { checkInsEnabled, checkInFrequency } = result.data

    // Ensure at least one settings record exists
    let settings = await prisma.appSettings.findFirst()

    if (!settings) {
      settings = await prisma.appSettings.create({
        data: {
          checkInsEnabled,
          checkInFrequency,
        },
      })
    } else {
      settings = await prisma.appSettings.update({
        where: { id: settings.id },
        data: {
          checkInsEnabled,
          checkInFrequency,
        },
      })
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('PATCH /api/settings error:', error)
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}
