import { apiClient } from '../client'

export function parseReceipt(file: File) {
  const formData = new FormData()
  formData.append('image', file)
  return apiClient
    .post<{ ingredients: string[] }>('/ocr/receipt', formData)
    .then((r) => r.data)
}
