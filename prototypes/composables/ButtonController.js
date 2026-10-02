import { computed } from 'vue'

export function useButtonController(props, emit) {
  const isDisabled = computed(() => props.disabled || props.loading)

  function handleClick(event) {
    if (isDisabled.value) {
      return
    }

    emit('click', event)
  }

  return { isDisabled, handleClick }
}
