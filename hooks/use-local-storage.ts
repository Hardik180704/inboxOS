"use client"

import { useState, useEffect } from "react"

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  // Always start with initialValue to match server
  const [storedValue, setStoredValue] = useState<T>(initialValue)

  // Update from localStorage after mount
  useEffect(() => {
    try {
        const item = window.localStorage.getItem(key)
        if (item) {
            // eslint-disable-next-line
            setStoredValue(JSON.parse(item))
        }
    } catch (error) {
        console.error(error)
    }
  }, [key])

  const setValue = (value: T) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error(error)
    }
  }

  return [storedValue, setValue]
}
