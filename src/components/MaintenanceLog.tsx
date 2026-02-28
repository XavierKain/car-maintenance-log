import { useState, useMemo } from 'react'
import { useApp } from '../context'
import type { MaintenanceEntry } from '../types'
import { MAINTENANCE_TYPES, TYPE_COLORS } from '../types'

function EntryForm({ entry, vehicleId, onSave, onCancel }: {
  entry?: MaintenanceEntry
  vehicleId?: string
  onSave: (e: Omit<MaintenanceEntry, 'id'> | MaintenanceEntry) => void
  onCancel: () => void
}) {
  const { vehicles } = useApp()
  const [vId, setVId] = useState(entry?.vehicleId ?? vehicleId ?? vehicles[0]?.id ?? '')
  const [type, setType] = useState<string>(entry?.type ?? MAINTENANCE_TYPES[0])
  const [customType, setCustomType] = useState(MAINTENANCE_TYPES.includes(entry?.type as never) ? '' : entry?.type ?? '')
  const [date, setDate] = useState(entry?.date ?? new Date().toISOString().slice(0, 10))
  const [mileage, setMileage] = useState(entry?.mileage ?? 0)
  const [cost, setCost] = useState(entry?.cost ?? 0)
  const [shop, setShop] = useState(entry?.shop ?? '')
  const [notes, setNotes] = useState(entry?.notes ?? '')
  const [reminderDate, setReminderDate] = useState(entry?.reminderDate ?? '')
  const [reminderMileage, setReminderMileage] = useState<number | null>(entry?.reminderMileage ?? null)

  const isCustom = type === 'Other'

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!vId) return
    const finalType = isCustom && customType.trim() ? customType.trim() : type
    const data: Omit<MaintenanceEntry, 'id'> = {
      vehicleId: vId,
      type: finalType,
      date,
      mileage,
      cost,
      shop: shop.trim(),
      notes: notes.trim(),
      reminderDate,
      reminderMileage,
    }
    if (entry) {
      onSave({ ...data, id: entry.id })
    } else {
      onSave(data)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Vehicle *</label>
        <select value={vId} onChange={e => setVId(e.target.value)} required
          className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none">
          {vehicles.map(v => (
            <option key={v.id} value={v.id}>{v.year} {v.make} {v.model}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Service Type *</label>
          <select value={MAINTENANCE_TYPES.includes(type as never) ? type : 'Other'} onChange={e => setType(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none">
            {MAINTENANCE_TYPES.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        {isCustom && (
          <div>
            <label className="block text-sm font-medium mb-1">Custom Type</label>
            <input value={customType} onChange={e => setCustomType(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
        )}
        <div>
          <label className="block text-sm font-medium mb-1">Date *</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} required
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Mileage</label>
          <input type="number" value={mileage} onChange={e => setMileage(+e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Cost ($)</label>
          <input type="number" step="0.01" value={cost} onChange={e => setCost(+e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Shop</label>
          <input value={shop} onChange={e => setShop(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Notes</label>
        <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2}
          className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Reminder Date</label>
          <input type="date" value={reminderDate} onChange={e => setReminderDate(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Reminder Mileage</label>
          <input type="number" value={reminderMileage ?? ''} onChange={e => setReminderMileage(e.target.value ? +e.target.value : null)}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
      </div>
      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onCancel}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          Cancel
        </button>
        <button type="submit"
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
          {entry ? 'Update' : 'Add Entry'}
        </button>
      </div>
    </form>
  )
}

export function MaintenanceLog() {
  const { vehicles, entries, selectedVehicleId, setSelectedVehicleId, addEntry, updateEntry, deleteEntry } = useApp()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<MaintenanceEntry | null>(null)
  const [filterType, setFilterType] = useState<string>('all')
  const [filterDateFrom, setFilterDateFrom] = useState('')
  const [filterDateTo, setFilterDateTo] = useState('')

  const filtered = useMemo(() => {
    let list = entries
    if (selectedVehicleId) list = list.filter(e => e.vehicleId === selectedVehicleId)
    if (filterType !== 'all') list = list.filter(e => e.type === filterType)
    if (filterDateFrom) list = list.filter(e => e.date >= filterDateFrom)
    if (filterDateTo) list = list.filter(e => e.date <= filterDateTo)
    return list.sort((a, b) => b.date.localeCompare(a.date))
  }, [entries, selectedVehicleId, filterType, filterDateFrom, filterDateTo])

  const handleSave = (e: Omit<MaintenanceEntry, 'id'> | MaintenanceEntry) => {
    if ('id' in e) {
      updateEntry(e)
    } else {
      addEntry(e)
    }
    setShowForm(false)
    setEditing(null)
  }

  const vehicleMap = useMemo(() => {
    const map = new Map<string, typeof vehicles[0]>()
    vehicles.forEach(v => map.set(v.id, v))
    return map
  }, [vehicles])

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Service History</h2>
        {!showForm && !editing && vehicles.length > 0 && (
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Entry
          </button>
        )}
      </div>

      {vehicles.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg font-medium mb-1">No vehicles yet</p>
          <p className="text-sm">Add a vehicle first to start logging maintenance.</p>
        </div>
      ) : (
        <>
          {(showForm || editing) && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 mb-4">
              <h3 className="font-semibold mb-3">{editing ? 'Edit Entry' : 'New Entry'}</h3>
              <EntryForm entry={editing ?? undefined} vehicleId={selectedVehicleId ?? undefined}
                onSave={handleSave} onCancel={() => { setShowForm(false); setEditing(null) }} />
            </div>
          )}

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-4">
            <select value={selectedVehicleId ?? ''} onChange={e => setSelectedVehicleId(e.target.value || null)}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 text-sm bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="">All Vehicles</option>
              {vehicles.map(v => (
                <option key={v.id} value={v.id}>{v.year} {v.make} {v.model}</option>
              ))}
            </select>
            <select value={filterType} onChange={e => setFilterType(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 text-sm bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="all">All Types</option>
              {MAINTENANCE_TYPES.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <input type="date" value={filterDateFrom} onChange={e => setFilterDateFrom(e.target.value)} placeholder="From"
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 text-sm bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none" />
            <input type="date" value={filterDateTo} onChange={e => setFilterDateTo(e.target.value)} placeholder="To"
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 text-sm bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-sm">No maintenance records found.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map(entry => {
                const vehicle = vehicleMap.get(entry.vehicleId)
                const badgeColor = TYPE_COLORS[entry.type] ?? TYPE_COLORS['Other']
                return (
                  <div key={entry.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: badgeColor }}>
                            {entry.type}
                          </span>
                          {vehicle && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {vehicle.year} {vehicle.make} {vehicle.model}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300 mt-1">
                          <span>{entry.date}</span>
                          <span>{entry.mileage.toLocaleString()} mi</span>
                          {entry.cost > 0 && <span className="font-medium">${entry.cost.toFixed(2)}</span>}
                        </div>
                        {entry.shop && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{entry.shop}</p>}
                        {entry.notes && <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{entry.notes}</p>}
                        {(entry.reminderDate || entry.reminderMileage) && (
                          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                            Next: {entry.reminderDate && entry.reminderDate}{entry.reminderDate && entry.reminderMileage && ' or '}{entry.reminderMileage && `${entry.reminderMileage.toLocaleString()} mi`}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-1 ml-2">
                        <button onClick={() => setEditing(entry)} title="Edit"
                          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 transition-colors">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" />
                          </svg>
                        </button>
                        <button onClick={() => deleteEntry(entry.id)} title="Delete"
                          className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-500 hover:text-red-600 transition-colors">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}
    </div>
  )
}
