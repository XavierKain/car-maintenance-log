import { useMemo } from 'react'
import { useApp } from '../context'
import { TYPE_COLORS } from '../types'

export function Reminders() {
  const { vehicles, entries } = useApp()

  const vehicleMap = useMemo(() => {
    const map = new Map<string, (typeof vehicles)[0]>()
    vehicles.forEach(v => map.set(v.id, v))
    return map
  }, [vehicles])

  const reminders = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10)
    const items: {
      entry: (typeof entries)[0]
      vehicle: (typeof vehicles)[0]
      dueDateStr: string | null
      dueMileageStr: string | null
      overdue: boolean
      daysUntil: number | null
    }[] = []

    for (const entry of entries) {
      if (!entry.reminderDate && !entry.reminderMileage) continue
      const vehicle = vehicleMap.get(entry.vehicleId)
      if (!vehicle) continue

      const overdue = (entry.reminderDate && entry.reminderDate <= today) ||
        (entry.reminderMileage !== null && vehicle.mileage >= entry.reminderMileage)

      let daysUntil: number | null = null
      if (entry.reminderDate) {
        const diff = new Date(entry.reminderDate).getTime() - new Date(today).getTime()
        daysUntil = Math.ceil(diff / (1000 * 60 * 60 * 24))
      }

      items.push({
        entry,
        vehicle,
        dueDateStr: entry.reminderDate || null,
        dueMileageStr: entry.reminderMileage ? `${entry.reminderMileage.toLocaleString()} mi` : null,
        overdue: !!overdue,
        daysUntil,
      })
    }

    return items.sort((a, b) => {
      if (a.overdue && !b.overdue) return -1
      if (!a.overdue && b.overdue) return 1
      if (a.daysUntil !== null && b.daysUntil !== null) return a.daysUntil - b.daysUntil
      if (a.daysUntil !== null) return -1
      return 1
    })
  }, [entries, vehicleMap])

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Upcoming Reminders</h2>

      {reminders.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
          </svg>
          <p className="text-lg font-medium mb-1">No reminders</p>
          <p className="text-sm">Set a reminder date or mileage when adding a maintenance entry.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reminders.map(({ entry, vehicle, dueDateStr, dueMileageStr, overdue, daysUntil }) => {
            const badgeColor = TYPE_COLORS[entry.type] ?? TYPE_COLORS['Other']
            return (
              <div key={entry.id} className={`bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border ${overdue ? 'border-red-300 dark:border-red-700' : 'border-gray-200 dark:border-gray-700'}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {overdue && (
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                          Overdue
                        </span>
                      )}
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: badgeColor }}>
                        {entry.type}
                      </span>
                    </div>
                    <p className="font-medium mt-1">
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </p>
                    <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {dueDateStr && <span>Due: {dueDateStr}</span>}
                      {dueMileageStr && <span>Due at: {dueMileageStr}</span>}
                    </div>
                    {daysUntil !== null && !overdue && (
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                        {daysUntil === 0 ? 'Due today' : `In ${daysUntil} day${daysUntil === 1 ? '' : 's'}`}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      Last service: {entry.date} at {entry.mileage.toLocaleString()} mi
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
