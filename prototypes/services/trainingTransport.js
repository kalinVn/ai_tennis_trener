// Prototype contract: send binary JPEG frames; receive JSON { type, payload } events.
// Endpoint/authentication are supplied by the host; no backend URL is invented here.
export function createTrainingTransport({ url, onMessage, onError, onClose }) {
  let socket = null
  let pending = null
  let timeout = null

  function disconnect() {
    clearTimeout(timeout)
    pending?.(new Error('Analysis connection cancelled.'))
    pending = null
    const current = socket
    socket = null
    if (current) {
      current.onopen = current.onmessage = current.onerror = current.onclose = null
      current.close()
    }
  }

  function connect() {
    if (socket) return Promise.reject(new Error('Analysis transport is already connected.'))
    return new Promise((resolve, reject) => {
      if (!url) { reject(new Error('No analysis endpoint configured.')); return }
      let endpoint
      try {
        endpoint = new URL(url)
        if (!['ws:', 'wss:'].includes(endpoint.protocol)) throw new Error('Use a ws:// or wss:// analysis endpoint.')
        if (globalThis.location?.protocol === 'https:' && endpoint.protocol !== 'wss:') throw new Error('A secure page requires wss://.')
        socket = new WebSocket(endpoint.href)
      } catch (error) { reject(error); return }
      pending = reject
      timeout = setTimeout(() => { reject(new Error('Analysis connection timed out.')); disconnect() }, 10000)
      socket.onopen = () => { clearTimeout(timeout); pending = null; resolve() }
      socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data)
          if (!message || typeof message.type !== 'string') throw new Error('Invalid analysis message.')
          onMessage?.(message)
        } catch (error) { onError?.(error) }
      }
      socket.onerror = () => {
        const error = new Error('Analysis connection failed.')
        pending?.(error)
        pending = null
        onError?.(error)
      }
      socket.onclose = () => {
        clearTimeout(timeout)
        pending?.(new Error('Analysis connection closed.'))
        pending = null
        socket = null
        onClose?.()
      }
    })
  }

  function sendFrame(frame) {
    if (socket?.readyState !== WebSocket.OPEN) throw new Error('Analysis connection is not open.')
    // Drop rather than queue stale camera frames on slow networks.
    if (socket.bufferedAmount > 2 * 1024 * 1024) return false
    socket.send(frame)
    return true
  }

  return { connect, disconnect, sendFrame }
}
