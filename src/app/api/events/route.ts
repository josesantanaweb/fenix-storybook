import prisma from '@/src/library/utils/db'
import { transactionHashSchema, ethereumAddressSchema, EventTypeSchema } from '@/src/library/utils/schema'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const actionEventSchema = z.object({
  tx: transactionHashSchema,
  user: ethereumAddressSchema,
  event_type: EventTypeSchema,
  value: z.number().min(0),
})
export type ActionEvent = z.infer<typeof actionEventSchema>

export async function POST(request: NextRequest) {
  const body = await request.json()
  try {
    const validatedBody = actionEventSchema.parse(body)
    console.log(validatedBody)
    const user = await prisma.users.upsert({
      where: { id: validatedBody.user },
      update: {},
      create: { id: validatedBody.user },
    })
    const event = await prisma.action_event.create({
      data: {
        id: validatedBody.tx,
        user_id: user.id,
        event_type: validatedBody.event_type,
        value: validatedBody.value,
      },
    })

    return NextResponse.json({ message: 'ok' }, { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed' }, { status: 400 })
    } else {
      console.log(error)
      return NextResponse.json({ error: 'Unknown error' }, { status: 500 })
    }
  }
}
