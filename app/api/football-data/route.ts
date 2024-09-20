import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export async function GET() {
  try {
    const xmlFilePath = path.join(process.cwd(), 'football.xml')
    const xmlData = await fs.readFile(xmlFilePath, 'utf-8')
    return new NextResponse(xmlData, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
      },
    })
  } catch (error) {
    console.error('Error reading XML file:', error)
    return new NextResponse('Error reading XML file', { status: 500 })
  }
}