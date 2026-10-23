import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { getTypeInfo } from '../constants/breweryTypes.js'
import useThemeColors from '../hooks/useThemeColors.js'
import styles from './TypeDonutChart.module.css'

const percent = (value, total) => `${total ? Math.round((value / total) * 1000) / 10 : 0}%`

// Donut of brewery types from a meta by_type object, e.g. { micro: 5916, brewpub: 3950 }.
export default function TypeDonutChart({ byType = {} }) {
  const colors = useThemeColors()
  const data = Object.entries(byType)
    .filter(([, value]) => value > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([type, value]) => ({ type, value, ...getTypeInfo(type) }))
  const total = data.reduce((sum, item) => sum + item.value, 0)
  const label = `Donut chart of brewery types. ${data.map((item) => `${item.label}: ${item.value.toLocaleString()} (${percent(item.value, total)})`).join(', ')}.`

  const renderTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null
    const item = payload[0].payload
    return (
      <div className={styles.tooltip}>
        <strong>{item.label}</strong>
        <span>{item.value.toLocaleString()} breweries · {percent(item.value, total)}</span>
      </div>
    )
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.chart} role="img" aria-label={label}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="label" innerRadius="62%" outerRadius="92%" paddingAngle={data.length > 1 ? 1 : 0} stroke={colors.surface} strokeWidth={2}>
              {data.map((item) => <Cell key={item.type} fill={colors.resolve(item.color)} />)}
            </Pie>
            <Tooltip content={renderTooltip} />
          </PieChart>
        </ResponsiveContainer>
        <div className={styles.centre} aria-hidden="true">
          <strong>{total.toLocaleString()}</strong>
          <span>breweries</span>
        </div>
      </div>
      <ul className={styles.legend} aria-label="Brewery types">
        {data.map((item) => (
          <li key={item.type}>
            <span className={styles.swatch} style={{ background: item.color }} aria-hidden="true" />
            <span className={styles.name}>{item.label}</span>
            <span className={styles.value}>{item.value.toLocaleString()} · {percent(item.value, total)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
