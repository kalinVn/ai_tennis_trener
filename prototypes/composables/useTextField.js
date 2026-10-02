import { useField } from './useField.js'

export function useTextField(props, emit) {
  const field = useField(props, emit)

  function clearText() {
    field.setValue('')
  }

  return { ...field, clearText }
}
