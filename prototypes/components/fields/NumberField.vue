<script setup>
import { useNumberField } from '../../composables/useNumberField.js'

defineOptions({ inheritAttrs: false })
const props = defineProps({
  modelValue: { type: Number, default: null },
  id: { type: String, required: true },
  label: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
})
const emit = defineEmits(['update:modelValue'])
const field = useNumberField(props, emit)
const { value, hasLabel } = field
defineExpose(field)
</script>

<template>
  <div class="field">
    <label v-if="hasLabel()" :for="id">{{ label }}</label>
    <input
      v-bind="$attrs"
      :id="id"
      v-model="value"
      type="number"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
    />
  </div>
</template>

<style scoped>
.field { box-sizing: border-box; color-scheme: dark; font: 16px/1.55 Inter, system-ui, -apple-system, "Segoe UI", sans-serif; display: grid; gap: 7px; width: min(360px, 100%); min-width: 0; }
    label { font-size: 13px; font-weight: 400; color: #a8b5ae; }
    input, select {
      box-sizing: border-box;
      width: 100%;
      min-width: 0;
      height: 51px;
      margin: 0;
      padding: 12px 14px;
      border: 1px solid rgba(255, 255, 255, .12);
      border-radius: 12px;
      background-color: #09130e;
      color: #f4f7f5;
      font: inherit;
    }
    input::placeholder { color: #a8b5ae; opacity: 1; }
    input:focus-visible, select:focus-visible { outline: 2px solid #65e8ff; outline-offset: 2px; }
</style>
