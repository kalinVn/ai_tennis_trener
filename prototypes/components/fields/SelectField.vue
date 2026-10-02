<script setup>
import { useSelectField } from '../../composables/useSelectField.js'

defineOptions({ inheritAttrs: false })
const props = defineProps({
  modelValue: { default: '' },
  id: { type: String, required: true },
  label: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
  options: { type: Array, default: () => [] },
  multiple: { type: Boolean, default: false },
})
const emit = defineEmits(['update:modelValue'])
const field = useSelectField(props, emit)
const { value, hasLabel } = field
defineExpose(field)
</script>

<template>
  <div class="field">
    <label v-if="hasLabel()" :for="id">{{ label }}</label>
    <select
      v-bind="$attrs"
      :id="id"
      v-model="value"
      :multiple="multiple"
      :disabled="disabled"
      :required="required"
    >
      <option v-if="placeholder && !multiple" value="" disabled data-placeholder>{{ placeholder }}</option>
      <option v-for="(option, index) in options" :key="index" :value="option.value">{{ option.label }}</option>
    </select>
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
    select:not([multiple]) {
      appearance: none;
      padding-right: 50px;
      background-image: url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20d%3D%22m5%207.5%205%205%205-5%22%20fill%3D%22none%22%20stroke%3D%22%23f4f7f5%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E");
      background-repeat: no-repeat;
      background-position: right 18px center;
      background-size: 20px 20px;
    }
    select:has(option[data-placeholder]:checked) { color: #a8b5ae; }
    option { color: #f4f7f5; }
    @media (forced-colors: active) {
      select { appearance: auto; background-image: none; padding-right: 14px; }
    }
      select[multiple] { height: auto; min-height: 51px; }
</style>
