// Renders PDF pages into canvas elements
// using pdf.js. Call render() to load and
// display. Tracks scroll position.

import { ref, nextTick, watch }
  from 'vue'

export const usePdfViewer = (
  containerRef,
  pdfUrl,
  opts = {},
) => {
  const pages = ref([])
  const loading = ref(false)
  const error = ref(null)
  const scrolledToBottom = ref(false)
  const scale = opts.scale ?? 1.5

  let pdfjsLib = null

  const onScroll = () => {
    const el = containerRef.value
    if (!el) return
    scrolledToBottom.value
      = el.scrollHeight - el.scrollTop
        <= el.clientHeight + 50
  }

  // Attach scroll listener when container
  // becomes available
  watch(containerRef, (el, _, onCleanup) => {
    if (!el) return
    el.addEventListener('scroll', onScroll)
    onCleanup(() =>
      el.removeEventListener('scroll', onScroll),
    )
  })

  const render = async (url) => {
    const src = url ?? pdfUrl?.value
    if (!src) return

    loading.value = true
    error.value = null
    pages.value = []

    try {
      // pdf.js is client-only
      if (import.meta.server) return

      if (!pdfjsLib) {
        pdfjsLib = await import('pdfjs-dist')
        const workerUrl = await import(
          'pdfjs-dist/build/pdf.worker.min.mjs?url'
        )
        pdfjsLib.GlobalWorkerOptions.workerSrc
          = workerUrl.default
      }

      const response = await fetch(src)
      if (!response.ok) {
        throw new Error(
          `Failed to load PDF (${response.status})`,
        )
      }
      const arrayBuffer
        = await response.arrayBuffer()

      const pdf = await pdfjsLib.getDocument({
        data: arrayBuffer,
      }).promise

      pages.value = Array.from(
        { length: pdf.numPages },
        (_, i) => i + 1,
      )

      await nextTick()

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const viewport = page.getViewport({
          scale,
        })

        const canvas
          = containerRef.value?.querySelector(
            `[data-page="${i}"]`,
          )
        if (!canvas) continue

        canvas.width = viewport.width
        canvas.height = viewport.height

        await page.render({
          canvasContext:
            canvas.getContext('2d'),
          viewport,
        }).promise
      }
    }
    catch (err) {
      console.error('PDF render failed:', err)
      error.value = err.message
    }
    finally {
      loading.value = false
    }
  }

  // Auto-render if autoRender option set
  if (opts.autoRender) {
    watch(
      () => pdfUrl?.value,
      (url) => { if (url) render(url) },
      { immediate: true },
    )
  }

  return {
    pages,
    loading,
    error,
    scrolledToBottom,
    render,
  }
}
