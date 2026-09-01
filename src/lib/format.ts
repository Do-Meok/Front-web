const BLANK_VALUES = new Set(['', 'nan', 'none', 'null', 'undefined'])

// 크롤링/LLM으로 채워지는 필드라 값이 없을 때 "nan"/"None" 같은 문자열이 그대로 들어오는 경우가 있다.
export function isMeaningfulText(value: string | null | undefined): value is string {
  if (!value) return false
  return !BLANK_VALUES.has(value.trim().toLowerCase())
}
