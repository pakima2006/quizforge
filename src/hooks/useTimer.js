import { useState, useEffect, useRef, useCallback } from 'react'

export function useTimer(initialSeconds = 0) {
  const [seconds, setSeconds] = useState(initialSeconds)
  const [running, setRunning] = useState(false)
  const intervalRef = useRef(null)

  const start = useCallback(() => {
    setRunning(true)
  }, [])

  const pause = useCallback(() => {
    setRunning(false)
  }, [])

  const reset = useCallback((newSeconds = 0) => {
    setRunning(false)
    setSeconds(newSeconds)
  }, [])

  const restart = useCallback((newSeconds = 0) => {
    setSeconds(newSeconds)
    setRunning(true)
  }, [])

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds(s => s + 1)
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [running])

  const formatted = formatTime(seconds)

  return { seconds, formatted, running, start, pause, reset, restart }
}

function formatTime(s) {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
}
