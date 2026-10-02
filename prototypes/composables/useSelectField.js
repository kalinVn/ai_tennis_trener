import { useField } from './useField.js'

export function useSelectField(props, emit) {
  const field = useField(props, emit)

  function getSelectedOptions() {
    const selected = props.multiple ? (field.getValue() ?? []) : [field.getValue()]
    return props.options.filter((option) => selected.includes(option.value))
  }

  function getSelectedOption() {
    return getSelectedOptions()[0]
  }

  function getIndex() {
    return props.options.indexOf(getSelectedOption())
  }

  function selectOption(value) {
    if (!props.options.some((option) => option.value === value)) return
    if (props.multiple) {
      const selected = field.getValue() ?? []
      if (!selected.includes(value)) field.setValue([...selected, value])
    } else {
      field.setValue(value)
    }
  }

  function setIndex(index) {
    if (Number.isInteger(index) && props.options[index]) {
      selectOption(props.options[index].value)
    }
  }

  return { ...field, getSelectedOption, getSelectedOptions, getIndex, setIndex, selectOption }
}
