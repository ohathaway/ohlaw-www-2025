// HTML5 Canvas signature pad composable.
// Handles mouse and touch drawing events.

import { ref, onMounted, onUnmounted } from 'vue'

export const useSignatureCanvas = () => {
  const canvasRef = ref(null)
  const hasSignature = ref(false)
  let ctx = null
  let drawing = false
  let lastX = 0
  let lastY = 0

  const getCoords = (e) => {
    const canvas = canvasRef.value
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    const clientX = e.touches
      ? e.touches[0].clientX
      : e.clientX
    const clientY = e.touches
      ? e.touches[0].clientY
      : e.clientY

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    }
  }

  const startDrawing = (e) => {
    e.preventDefault()
    drawing = true
    const { x, y } = getCoords(e)
    lastX = x
    lastY = y
  }

  const draw = (e) => {
    if (!drawing) return
    e.preventDefault()

    const { x, y } = getCoords(e)

    ctx.beginPath()
    ctx.moveTo(lastX, lastY)
    ctx.lineTo(x, y)
    ctx.stroke()

    lastX = x
    lastY = y
    hasSignature.value = true
  }

  const stopDrawing = () => {
    drawing = false
  }

  const clearSignature = () => {
    const canvas = canvasRef.value
    ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height,
    )
    hasSignature.value = false
  }

  const getSignatureDataUrl = () => {
    if (!hasSignature.value) return null
    return canvasRef.value.toDataURL('image/png')
  }

  const setup = () => {
    const canvas = canvasRef.value
    if (!canvas) return

    ctx = canvas.getContext('2d')
    ctx.strokeStyle = '#000'
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    canvas.addEventListener(
      'mousedown',
      startDrawing,
    )
    canvas.addEventListener('mousemove', draw)
    canvas.addEventListener(
      'mouseup',
      stopDrawing,
    )
    canvas.addEventListener(
      'mouseleave',
      stopDrawing,
    )

    canvas.addEventListener(
      'touchstart',
      startDrawing,
      { passive: false },
    )
    canvas.addEventListener(
      'touchmove',
      draw,
      { passive: false },
    )
    canvas.addEventListener(
      'touchend',
      stopDrawing,
    )
  }

  const cleanup = () => {
    const canvas = canvasRef.value
    if (!canvas) return

    canvas.removeEventListener(
      'mousedown',
      startDrawing,
    )
    canvas.removeEventListener('mousemove', draw)
    canvas.removeEventListener(
      'mouseup',
      stopDrawing,
    )
    canvas.removeEventListener(
      'mouseleave',
      stopDrawing,
    )
    canvas.removeEventListener(
      'touchstart',
      startDrawing,
    )
    canvas.removeEventListener('touchmove', draw)
    canvas.removeEventListener(
      'touchend',
      stopDrawing,
    )
  }

  onMounted(setup)
  onUnmounted(cleanup)

  return {
    canvasRef,
    hasSignature,
    clearSignature,
    getSignatureDataUrl,
  }
}
