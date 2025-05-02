'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { generateDesign } from '@/app/utils/generateDesign'
import { downloadImage } from '@/app/utils/downloadImage'

interface HistoryItem {
  prompt: string
  imageUrl: string
  timestamp: string
}

export default function Home() {
  const [prompt, setPrompt] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [roomImage, setRoomImage] = useState<File | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('designHistory')
    if (stored) setHistory(JSON.parse(stored))
  }, [])

  const saveToHistory = (item: HistoryItem) => {
    const updated = [item, ...history]
    setHistory(updated)
    localStorage.setItem('designHistory', JSON.stringify(updated))
  }

  const handleGenerate = async () => {
    if (!prompt || !roomImage) {
      setError('Please enter a prompt and upload an image.')
      return
    }

    setLoading(true)
    setError('')
    setImageUrl('')

    try {
      const res = await generateDesign(prompt, roomImage)
      if (res?.imageUrl) {
        setImageUrl(res.imageUrl)
        saveToHistory({ prompt, imageUrl: res.imageUrl, timestamp: new Date().toLocaleString() })
      } else {
        throw new Error(res?.error || 'Unknown error')
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-bold text-center mb-10">AI Interior Room Designer</h1>

      <div className="w-full max-w-2xl flex flex-col items-center gap-4">
        <textarea
          className="w-full p-4 border rounded-lg shadow-sm"
          placeholder="Describe your ideal room design..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={3}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setRoomImage(e.target.files?.[0] || null)}
          className="w-full p-2 border rounded-lg bg-white shadow-sm"
        />

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Generating...' : 'Generate Design'}
        </button>

        {error && <p className="text-red-600 mt-2 text-center">{error}</p>}
      </div>

      {loading && (
        <div className="flex justify-center mt-10">
          <div className="w-8 h-8 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
        </div>
      )}

      {imageUrl && (
        <div className="max-w-2xl mx-auto mt-10 text-center">
          <h2 className="text-2xl font-semibold mb-4">Your Generated Room</h2>
          <Image src={imageUrl} alt="Generated Room" width={512} height={512} className="rounded-lg mx-auto" />
          <button
            onClick={() => downloadImage(imageUrl)}
            className="mt-4 px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Download Image
          </button>
        </div>
      )}
    </main>
  )
}
