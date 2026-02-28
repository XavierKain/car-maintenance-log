import { useMemo } from 'react'
import { useApp } from '../context'
import { TYPE_COLORS } from '../types'
import { jsPDF } from 'jspdf'

export function Stats() {
  const { vehicles, entries } = useApp()

  const stats = useMemo(() => {
    return vehicles.map(v => {
      const vehicleEntries = entries
        .filter(e => e.vehicleId === v.id)
        .sort((a, b) => b.date.localeCompare(a.date))
      const totalSpent = vehicleEntries.reduce((s, e) => s + e.cost, 0)
      const typeBreakdown = new Map<string, { count: number; cost: number }>()
      for (const e of vehicleEntries) {
        const existing = typeBreakdown.get(e.type) ?? { count: 0, cost: 0 }
        typeBreakdown.set(e.type, { count: existing.count + 1, cost: existing.cost + e.cost })
      }
      return {
        vehicle: v,
        totalEntries: vehicleEntries.length,
        totalSpent,
        lastService: vehicleEntries[0]?.date ?? null,
        typeBreakdown: Array.from(typeBreakdown.entries()).sort((a, b) => b[1].cost - a[1].cost),
        entries: vehicleEntries,
      }
    })
  }, [vehicles, entries])

  const exportPdf = (vehicleStats: (typeof stats)[0]) => {
    const { vehicle, entries: vEntries, totalSpent } = vehicleStats
    const doc = new jsPDF()
    const title = `${vehicle.year} ${vehicle.make} ${vehicle.model} — Service History`
    doc.setFontSize(16)
    doc.text(title, 14, 20)

    doc.setFontSize(10)
    doc.text(`Plate: ${vehicle.plate || 'N/A'}   |   Mileage: ${vehicle.mileage.toLocaleString()} mi   |   Total Spent: $${totalSpent.toFixed(2)}`, 14, 28)
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 34)

    doc.setLineWidth(0.5)
    doc.line(14, 37, 196, 37)

    // Table header
    let y = 44
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.text('Date', 14, y)
    doc.text('Type', 44, y)
    doc.text('Mileage', 90, y)
    doc.text('Cost', 120, y)
    doc.text('Shop', 145, y)
    doc.text('Notes', 175, y)
    y += 6
    doc.setFont('helvetica', 'normal')

    for (const entry of vEntries) {
      if (y > 275) {
        doc.addPage()
        y = 20
      }
      doc.text(entry.date, 14, y)
      doc.text(entry.type.slice(0, 18), 44, y)
      doc.text(entry.mileage.toLocaleString(), 90, y)
      doc.text(`$${entry.cost.toFixed(2)}`, 120, y)
      doc.text((entry.shop || '').slice(0, 12), 145, y)
      doc.text((entry.notes || '').slice(0, 10), 175, y)
      y += 6
    }

    doc.save(`${vehicle.make}_${vehicle.model}_service_history.pdf`)
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Statistics</h2>

      {vehicles.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg font-medium mb-1">No vehicles yet</p>
          <p className="text-sm">Add a vehicle to see stats here.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {stats.map(s => (
            <div key={s.vehicle.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: s.vehicle.color }}>
                    {s.vehicle.make[0]}
                  </div>
                  <div>
                    <h3 className="font-semibold">{s.vehicle.year} {s.vehicle.make} {s.vehicle.model}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{s.vehicle.mileage.toLocaleString()} mi</p>
                  </div>
                </div>
                {s.totalEntries > 0 && (
                  <button onClick={() => exportPdf(s)} title="Export PDF"
                    className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    PDF
                  </button>
                )}
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{s.totalEntries}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Records</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">${s.totalSpent.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total Spent</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{s.lastService ?? '—'}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Last Service</p>
                </div>
              </div>

              {s.typeBreakdown.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">By Service Type</h4>
                  <div className="flex flex-wrap gap-2">
                    {s.typeBreakdown.map(([type, data]) => (
                      <div key={type} className="flex items-center gap-1.5 text-xs bg-gray-50 dark:bg-gray-700/50 rounded-full px-3 py-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: TYPE_COLORS[type] ?? TYPE_COLORS['Other'] }} />
                        <span>{type}</span>
                        <span className="text-gray-400">({data.count})</span>
                        <span className="font-medium">${data.cost.toFixed(0)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
