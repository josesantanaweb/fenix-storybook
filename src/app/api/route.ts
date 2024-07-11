import { NextResponse, NextRequest } from 'next/server'
import { URL, MEDIUM_TOKEN } from '@/src/config'

export async function GET(request: NextRequest) {
  let data

  try {
    const response = await fetch(URL, {
      headers: {
        Authorization: `Bearer ${MEDIUM_TOKEN}`,
      },
    })
    data = await response.json()
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ message: 'Error fetching data' }, { status: 500 })
  }

  return NextResponse.json(data, { status: 200 })
}
