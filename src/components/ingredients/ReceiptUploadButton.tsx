import { useMutation } from '@tanstack/react-query'
import { useRef, type ChangeEvent } from 'react'

import { parseReceipt } from '../../api/endpoints/ocr'
import { Button } from '../common/Button'
import { Spinner } from '../common/Spinner'
import { getErrorMessage } from '../../lib/errors'

export function ReceiptUploadButton({ onParsed }: { onParsed: (ingredients: string[]) => void }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const mutation = useMutation({
    mutationFn: parseReceipt,
    onSuccess: (data) => onParsed(data.ingredients),
  })

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (file) {
      mutation.mutate(file)
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <input ref={inputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
      <Button
        type="button"
        variant="secondary"
        onClick={() => inputRef.current?.click()}
        disabled={mutation.isPending}
      >
        {mutation.isPending ? (
          <span className="flex items-center gap-2">
            <Spinner size={14} /> 영수증 분석 중...
          </span>
        ) : (
          '영수증으로 추가하기'
        )}
      </Button>
      {mutation.isError && (
        <p className="text-xs text-red-500">{getErrorMessage(mutation.error, '영수증 인식에 실패했습니다. 다시 시도해주세요.')}</p>
      )}
    </div>
  )
}
