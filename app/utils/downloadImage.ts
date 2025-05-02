export function downloadImage(url: string) {
    const link = document.createElement('a')
    link.href = url
    link.download = 'interior-design.png'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  