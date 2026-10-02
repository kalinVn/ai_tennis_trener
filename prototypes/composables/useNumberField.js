import { computed } from 'vue'
import { useField } from './useField.js'

export function useNumberField(props, emit) {
  const field = useField(props, emit)

  function setNumber(value) {
    if (value === '' || value == null) {
      field.setValue(null)
      return
    }
    const number = Number(value)
    if (Number.isFinite(number)) field.setValue(number)
  }

  function increment() {
    setNumber((field.getValue() ?? 0) + 1)
  }

  function decrement() {
    setNumber((field.getValue() ?? 0) - 1)
  }

  const value = computed({ get: field.getValue, set: setNumber })
  return { ...field, value, setNumber, increment, decrement }
}
