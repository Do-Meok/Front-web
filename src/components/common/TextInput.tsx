import type { InputHTMLAttributes } from 'react'

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export function TextInput({ label, error, id, className = '', ...props }: TextInputProps) {
  const inputId = id ?? props.name
  return (
    <div className="flex flex-col gap-1 text-left">
      <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={inputId}
        className={`rounded-lg border px-3 py-2 text-sm outline-none focus:border-orange-500 ${
          error ? 'border-red-400' : 'border-gray-300'
        } ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
