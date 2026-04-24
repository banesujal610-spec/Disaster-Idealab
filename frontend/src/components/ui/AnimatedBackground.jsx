import { useEffect, useRef } from 'react'

export default function AnimatedBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animationId
    let time = 0

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const drawAurora = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Extremely subtle grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)'
      ctx.lineWidth = 1
      const gridSize = 100
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }

      // Draw flowing orbs
      const createOrb = (x, y, radius, color) => {
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
        gradient.addColorStop(0, color)
        gradient.addColorStop(1, 'transparent')
        ctx.fillStyle = gradient
        ctx.fill()
      }

      // Orb 1 (Blue)
      ctx.beginPath()
      const x1 = canvas.width * 0.3 + Math.sin(time * 0.001) * 300
      const y1 = canvas.height * 0.4 + Math.cos(time * 0.0012) * 200
      createOrb(x1, y1, 600, 'rgba(59, 130, 246, 0.08)')

      // Orb 2 (Purple)
      ctx.beginPath()
      const x2 = canvas.width * 0.7 + Math.sin(time * 0.0008 + 2) * 400
      const y2 = canvas.height * 0.6 + Math.cos(time * 0.0009 + 1) * 300
      createOrb(x2, y2, 700, 'rgba(139, 92, 246, 0.08)')
      
      // Orb 3 (Red/Orange)
      ctx.beginPath()
      const x3 = canvas.width * 0.5 + Math.sin(time * 0.0015 + 4) * 200
      const y3 = canvas.height * 0.8 + Math.cos(time * 0.0011 + 3) * 200
      createOrb(x3, y3, 500, 'rgba(239, 68, 68, 0.05)')

      time++
      animationId = requestAnimationFrame(drawAurora)
    }

    resize()
    drawAurora()

    window.addEventListener('resize', resize)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0, backgroundColor: '#050505' }}
    />
  )
}

