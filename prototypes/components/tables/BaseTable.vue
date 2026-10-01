<script setup>
import { useId } from 'vue'

defineProps({
  title: { type: String, required: true },
  columns: { type: Array, default: () => [] },
  rows: { type: Array, default: () => [] },
  rowKey: { type: String, default: 'id' },
})
const titleId = useId()
</script>

<template>
  <section class="base-table" :aria-labelledby="titleId">
    <h3 :id="titleId" class="base-table__title">{{ title }}</h3>
    <div class="base-table__scroll" role="region" :aria-labelledby="titleId" tabindex="0">
      <table class="base-table__table" :aria-labelledby="titleId">
        <thead>
          <tr>
            <th v-for="column in columns" :key="column.key" scope="col">{{ column.label }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in rows" :key="row[rowKey] ?? index">
            <td v-for="column in columns" :key="column.key">
              <slot :name="`cell-${column.key}`" :value="row[column.key]" :row="row" :column="column">{{ row[column.key] }}</slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<style scoped>
/* Prototype styles derived from the History table; no application layout rules. */
.base-table {
  box-sizing: border-box;
  min-width: 0;
  padding: 22px;
  border: 1px solid rgba(255, 255, 255, .12);
  border-radius: 22px;
  background: #0d1913;
  color: #f4f7f5;
  font: 16px/1.55 Inter, system-ui, -apple-system, "Segoe UI", sans-serif;
}
.base-table__title { margin: 0 0 10px; font-size: 21px; font-weight: 700; }
.base-table__scroll { overflow-x: auto; }
.base-table__scroll:focus-visible { outline: 2px solid #65e8ff; outline-offset: 2px; }
.base-table__table { width: 100%; border-collapse: collapse; }
.base-table__table th, .base-table__table td { text-align: left; padding: 14px; border-bottom: 1px solid rgba(255, 255, 255, .12); }
.base-table__table th { color: #a8b5ae; font-size: 13px; font-weight: 700; }
@media (max-width: 530px) {
  .base-table__table { font-size: 12px; }
  .base-table__table th, .base-table__table td { padding: 9px 5px; }
}
@media (max-width: 720px), (max-width: 950px) and (max-height: 500px) and (orientation: landscape) {
  .base-table__table { min-width: 600px; }
}
</style>
