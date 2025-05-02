import { NextResponse } from 'next/server'
import cloudinary from 'cloudinary'

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const prompt = formData.get('prompt')?.toString() || ''
    const image = formData.get('image') as File | null

    if (!prompt || !image) {
      return NextResponse.json({ error: 'Prompt and image are required' }, { status: 400 })
    }

    const bytes = await image.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // 1. Upload to Cloudinary
    const uploadRes = await new Promise<any>((resolve, reject) => {
      cloudinary.v2.uploader.upload_stream(
        { resource_type: 'image' },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      ).end(buffer)
    })

    const imageUrl = uploadRes.secure_url

    // 2. Call Replicate API
    const replicateRes = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: "f84db4db5c38caa8b1845265a07b033ed0de57ad8996dcac12d5fd5aa046c582", // instruct-pix2pix
        input: {
          image: imageUrl,
          prompt: prompt,
          guidance_scale: 7.5,
          num_inference_steps: 50
        },
      }),
    })

    const replicateData = await replicateRes.json()

    console.log('Replicate full response:', replicateData)

    if (replicateData.error) {
      console.error('Replicate error', replicateData)
      return NextResponse.json({ error: 'Failed to generate design' }, { status: 500 })
    }

    const outputUrl = replicateData?.prediction?.output || replicateData?.output

    if (!outputUrl) {
      return NextResponse.json({ error: 'Failed to get generated image' }, { status: 500 })
    }

    return NextResponse.json({ imageUrl: outputUrl })
  } catch (error) {
    console.error('[generate API error]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
