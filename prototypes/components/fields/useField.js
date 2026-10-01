import { computed } from 'vue'

// Parent owns the value. Reset restores the value captured when this field mounts.
export function useField(props, emit) {
  const copyValue = (value) => Array.isArray(value) ? [...value] : value
  const initialValue = copyValue(props.modelValue)

  function getValue() {
    return props.modelValue
  }

  function setValue(value) {
    emit('update:modelValue', value)
  }

  function reset() {
    setValue(copyValue(initialValue))
  }

  function hasLabel() {
    return Boolean(props.label?.trim())
  }

  const value = computed({ get: getValue, set: setValue })
  return { value, getValue, setValue, reset, hasLabel }
}
