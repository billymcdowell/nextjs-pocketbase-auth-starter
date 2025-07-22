'use client'

import { useState, useRef, useEffect } from 'react'

interface OTPInputProps {
  length?: number
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  className?: string
}

export default function OTPInput({
  length = 6,
  value,
  onChange,
  disabled = false,
  className = '',
}: OTPInputProps) {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(''))
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    // Update internal state when value prop changes
    const valueArray = value.split('').slice(0, length)
    const newOtp = [...new Array(length).fill(''), ...valueArray].slice(0, length)
    setOtp(newOtp)
  }, [value, length])

  const handleChange = (element: HTMLInputElement, index: number) => {
    const val = element.value
    if (isNaN(Number(val))) return

    const newOtp = [...otp]
    newOtp[index] = val
    setOtp(newOtp)

    // Update parent component
    onChange(newOtp.join(''))

    // Move to next input if current input is filled
    if (val && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      if (otp[index]) {
        // Clear current input
        const newOtp = [...otp]
        newOtp[index] = ''
        setOtp(newOtp)
        onChange(newOtp.join(''))
      } else if (index > 0) {
        // Move to previous input
        inputRefs.current[index - 1]?.focus()
      }
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text/plain').replace(/\D/g, '')
    const pastedArray = pastedData.split('').slice(0, length)
    
    if (pastedArray.length > 0) {
      const newOtp = [...otp]
      pastedArray.forEach((char, index) => {
        if (index < length) {
          newOtp[index] = char
        }
      })
      setOtp(newOtp)
      onChange(newOtp.join(''))
      
      // Focus the next empty input or the last input
      const nextEmptyIndex = newOtp.findIndex(char => !char)
      const focusIndex = nextEmptyIndex === -1 ? length - 1 : nextEmptyIndex
      inputRefs.current[focusIndex]?.focus()
    }
  }

  return (
    <div className={`flex gap-2 justify-center ${className}`}>
      {otp.map((_, index) => (
        <input
          key={index}
          ref={(ref) => {
            inputRefs.current[index] = ref
          }}
          type="text"
          maxLength={1}
          value={otp[index]}
          onChange={(e) => handleChange(e.target, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          disabled={disabled}
          className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50"
          autoComplete="one-time-code"
        />
      ))}
    </div>
  )
} 