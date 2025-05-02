export async function generateDesign(
  prompt: string,
  roomImage: File | null
) {
  const formData = new FormData()
  formData.append('prompt', prompt)

  if (roomImage) {
    formData.append('image', roomImage)
  }

  const res = await fetch('/api/generate', {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) {
    const errorData = await res.json()
    throw new Error(errorData.error || 'Failed to generate design')
  }

  return res.json()
}
