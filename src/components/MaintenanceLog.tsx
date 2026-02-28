import { useState, useMemo, useRef } from 'react'
import { useApp } from '../context'
import type { MaintenanceEntry } from '../types'
import { MAINTENANCE_TYPES, TYPE_COLORS } from '../types'
import { resizeImage } from '../utils/resizeImage'

function PhotoViewer({ photos, onClose }: { photos: string[]; onClose: () => void }) {
  const [idx, setIdx] = useState(0)
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="relative max-w-[90vw] max-h-[90vh]" onClick={e => e.stopPropagation()}>
        <img src={photos[idx]} alt="" className="max-w-full max-h-[85vh] rounded-lg object-contain" />
        {photos.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {photos.map((_, i) => (
              <button key={i} onClick={() => setIdx(i)}
                className={`w-2.5 h-2.5 rounded-full ${i === idx ? 'bg-white' : 'bg-white/40'}`} />
            ))}
          </div>
        )}
        <button onClick={onClose} className="absolute top-2 right-2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center text-lg">&times;</button>
      </div>
    </div>
  )
}

function EntryForm({ entry, vehicleId, onSave, onCancel }: {
  entry?: MaintenanceEntry
  vehicleId?: string
  onSave: (e: Omit<MaintenanceEntry, 'id'> | MaintenanceEntry) => void
  onCancel: () => void
}) {
  const { vehicles } = useApp()
  const fileRef = useRef<HTMLInputElement>(null)
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
  const [photos, setPhotos] = useState<string[]>(entry?.photos ?? [])

  const isCustom = type === 'Other'

  const handleAddPhotos = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    const newPhotos: string[] = []
    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) continue
      const resized = await resizeImage(file)
      newPhotos.push(resized)
    }
    setPhotos(prev => [...prev, ...newPhotos])
    if (fileRef.current) fileRef.current.value = ''
  }

  const removePhoto = (idx: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== idx))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!vId) return
    const finalType = isCustom && customType.trim() ? customType.trim() : type
    const data: Omit<MaintenanceEntry, 'id'> = {
      vehicleId: vId, type: finalType, date, mileage, cost,
      shop: shop.trim(), notes: notes.trim(), reminderDate, reminderMileage, photos,
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

      {/* Photos */}
      <div>
        <label className="block text-sm font-medium mb-1">Photos</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {photos.map((p, i) => (
            <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
              <img src={p} alt="" className="w-full h-full object-cover" />
              <button type="button" onClick={() => removePhoto(i)}
                className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">&times;</button>
            </div>
          ))}
          <button type="button" onClick={() => fileRef.current?.click()}
            className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center text-gray-400 hover:border-blue-400 hover:text-blue-400 transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z" />
            </svg>
            <span className="text-[10px] mt-0.5">Add</span>
          </button>
        </div>
        <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleAddPhotos} className="hidden" />
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
  const [viewPhotos, setViewPhotos] = useState<string[] | null>(null)

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
      {viewPhotos && <PhotoViewer photos={viewPhotos} onClose={() => setViewPhotos(null)} />}

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
            <input type="date" value={filterDateFrom} onChange={e => setFilterDateFrom(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 text-sm bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none" />
            <input type="date" value={filterDateTo} onChange={e => setFilterDateTo(e.target.value)}
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
                const hasPhotos = entry.photos && entry.photos.length > 0
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

                        {/* Photo thumbnails */}
                        {hasPhotos && (
                          <div className="flex gap-1.5 mt-2">
                            {entry.photos.slice(0, 4).map((p, i) => (
                              <button key={i} onClick={() => setViewPhotos(entry.photos)}
                                className="relative w-14 h-14 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
                                <img src={p} alt="" className="w-full h-full object-cover" />
                                {i === 3 && entry.photos.length > 4 && (
                                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xs font-medium">
                                    +{entry.photos.length - 4}
                                  </div>
                                )}
                              </button>
                            ))}
                          </div>
                        )}

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
