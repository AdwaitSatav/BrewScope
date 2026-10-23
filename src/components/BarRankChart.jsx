import { Bar, BarChart, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import useThemeColors from '../hooks/useThemeColors.js'
import styles from './BarRankChart.module.css'

const shorten = (text) => (text.length > 16 ? `${text.slice(0, 15)}…` : text)

// Horizontal ranking chart. data: [{ label, value, key }] already sorted and sliced (top N).
// Bars are buttons: click, or Tab + Enter/Space, calls onSelect(key, item).
export default function BarRankChart({ data = [], onSelect, valueLabel = 'breweries' }) {
  const colors = useThemeColors()
  const height = data.length * 34 + 16

  const renderBar = ({ x, y, width, height: barHeight, payload }) => {
    const select = () => onSelect?.(payload.key, payload)
    return (
      <g
        className={onSelect ? styles.bar : undefined}
        role={onSelect ? 'button' : undefined}
        tabIndex={onSelect ? 0 : undefined}
        aria-label={`${payload.label}: ${payload.value.toLocaleString()} ${valueLabel}${onSelect ? '. Open' : ''}`}
        onClick={select}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); select() }
        }}
      >
        <rect x={x} y={y} width={Math.max(width, 2)} height={barHeight} rx={6} fill={colors.brand} />
      </g>
    )
  }

  const renderTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null
    const item = payload[0].payload
    return (
      <div className={styles.tooltip}>
        <strong>{item.label}</strong>
        <span>{item.value.toLocaleString()} {valueLabel}{onSelect ? ' · click to open' : ''}</span>
      </div>
    )
  }

  return (
    <div className={styles.chart} role="group" aria-label={`Bar chart ranking ${data.length} items by ${valueLabel}`}>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 52, bottom: 0, left: 0 }} barCategoryGap={6}>
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="label" width={118} tickLine={false} axisLine={false} tickFormatter={shorten} tick={{ fill: colors.text, fontSize: 13 }} interval={0} />
          <Tooltip content={renderTooltip} cursor={{ fill: colors.surface2 }} />
          <Bar dataKey="value" shape={renderBar} isAnimationActive={false}>
            <LabelList dataKey="value" position="right" formatter={(value) => value.toLocaleString()} fill={colors.textMuted} fontSize={12} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
