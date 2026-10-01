import { computed } from 'vue'
import { useField } from './useField.js'

export function useDateField(props, emit) {
  const field = useField(props, emit)

  // Native date inputs supply YYYY-MM-DD strings; avoid timezone conversion.
  function setDate(value) {
    field.setValue(value ?? '')
  }

  function clearDate() {
    setDate('')
  }

  const value = computed({ get: field.getValue, set: setDate })
  return { ...field, value, setDate, clearDate }
}
