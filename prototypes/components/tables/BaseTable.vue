<script setup>
import { computed, useId } from 'vue'

const props = defineProps({
  title: { type: String, required: true },
  columns: { type: Array, default: () => [] },
  rows: { type: Array, default: () => [] },
  rowKey: { type: String, default: 'id' },
})

const titleId = useId()

function normalizedColumnName(column) {
  return String(column?.label || column?.key || '')
    .replace(/[\s_-]+/g, '')
    .toLowerCase()
}

const displayedColumns = computed(() => {
  const hasSessionName = props.columns.some(column => normalizedColumnName(column) === 'sessionname')
  const hasFocus = props.columns.some(column => normalizedColumnName(column) === 'focus')

  if (!hasSessionName || !hasFocus) return props.columns

  return [
    ...props.columns.filter(column => !['sessionname', 'focus'].includes(normalizedColumnName(column))),
    { key: 'reviewSession', label: 'Review', reviewSessionAction: true },
  ]
})

function getReviewHref(row) {
  if (typeof row?.reviewHref === 'string' && row.reviewHref) return row.reviewHref

  const sessionId = row?.[props.rowKey] ?? row?.id
  return sessionId == null ? null : `/sessions/${encodeURIComponent(String(sessionId))}`
}
</script>

<template>
  <section class="base-table" :aria-labelledby="titleId">
    <h3 :id="titleId" class="base-table__title">{{ title }}</h3>
    <div class="base-table__scroll" role="region" :aria-labelledby="titleId" tabindex="0">
      <table class="base-table__table" :aria-labelledby="titleId">
        <thead>
          <tr>
            <th v-for="column in displayedColumns" :key="column.key" scope="col">{{ column.label }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in rows" :key="row[rowKey] ?? index">
            <td v-for="column in displayedColumns" :key="column.key">
              <slot :name="`cell-${column.key}`" :value="row[column.key]" :row="row" :column="column">
                <a v-if="column.reviewSessionAction && getReviewHref(row)" class="base-table__review" :href="getReviewHref(row)">Review Session</a>
                <span v-else-if="column.reviewSessionAction" class="base-table__review base-table__review--disabled" aria-disabled="true">Review Session</span>
                <template v-else>{{ row[column.key] }}</template>
              </slot>
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
.base-table__review { display: inline-flex; align-items: center; min-height: 36px; padding: 7px 12px; border: 1px solid rgba(255, 255, 255, .14); border-radius: 10px; color: #b7ff4a; font-size: 13px; font-weight: 700; text-decoration: none; white-space: nowrap; }
.base-table__review:hover { background: #183222; }
.base-table__review:focus-visible { outline: 2px solid #65e8ff; outline-offset: 2px; }
.base-table__review--disabled { color: #a8b5ae; opacity: .65; }
@media (max-width: 530px) {
  .base-table__table { font-size: 12px; }
  .base-table__table th, .base-table__table td { padding: 9px 5px; }
}
@media (max-width: 720px), (max-width: 950px) and (max-height: 500px) and (orientation: landscape) {
  .base-table__table { min-width: 600px; }
}
</style>
