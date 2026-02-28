import { useState } from 'react'
import { useApp } from '../context'
import type { Vehicle } from '../types'
import { VEHICLE_COLORS } from '../types'

function VehicleForm({ vehicle, onSave, onCancel }: {
  vehicle?: Vehicle
  onSave: (v: Omit<Vehicle, 'id'> | Vehicle) => void
  onCancel: () => void
}) {
  const [make, setMake] = useState(vehicle?.make ?? '')
  const [model, setModel] = useState(vehicle?.model ?? '')
  const [year, setYear] = useState(vehicle?.year ?? new Date().getFullYear())
  const [plate, setPlate] = useState(vehicle?.plate ?? '')
  const [mileage, setMileage] = useState(vehicle?.mileage ?? 0)
  const [color, setColor] = useState(vehicle?.color ?? VEHICLE_COLORS[0])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!make.trim() || !model.trim()) return
    const data = { make: make.trim(), model: model.trim(), year, plate: plate.trim(), mileage, color }
    if (vehicle) {
      onSave({ ...data, id: vehicle.id })
    } else {
      onSave(data)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Make *</label>
          <input value={make} onChange={e => setMake(e.target.value)} required
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Model *</label>
          <input value={model} onChange={e => setModel(e.target.value)} required
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Year</label>
          <input type="number" value={year} onChange={e => setYear(+e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Plate</label>
          <input value={plate} onChange={e => setPlate(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Mileage</label>
          <input type="number" value={mileage} onChange={e => setMileage(+e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Color</label>
        <div className="flex gap-2">
          {VEHICLE_COLORS.map(c => (
            <button key={c} type="button" onClick={() => setColor(c)}
              className={`w-8 h-8 rounded-full border-2 transition-transform ${color === c ? 'border-gray-900 dark:border-white scale-110' : 'border-transparent'}`}
              style={{ backgroundColor: c }} />
          ))}
        </div>
      </div>
      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onCancel}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          Cancel
        </button>
        <button type="submit"
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
          {vehicle ? 'Update' : 'Add Vehicle'}
        </button>
      </div>
    </form>
  )
}

export function Vehicles() {
  const { vehicles, entries, addVehicle, updateVehicle, deleteVehicle, setPage, setSelectedVehicleId } = useApp()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Vehicle | null>(null)

  const handleSave = (v: Omit<Vehicle, 'id'> | Vehicle) => {
    if ('id' in v) {
      updateVehicle(v)
    } else {
      addVehicle(v)
    }
    setShowForm(false)
    setEditing(null)
  }

  const handleDelete = (id: string) => {
    if (confirm('Delete this vehicle and all its maintenance records?')) {
      deleteVehicle(id)
    }
  }

  const goToLog = (vehicleId: string) => {
    setSelectedVehicleId(vehicleId)
    setPage('log')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">My Vehicles</h2>
        {!showForm && !editing && (
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Vehicle
          </button>
        )}
      </div>

      {(showForm || editing) && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 mb-4">
          <h3 className="font-semibold mb-3">{editing ? 'Edit Vehicle' : 'New Vehicle'}</h3>
          <VehicleForm vehicle={editing ?? undefined} onSave={handleSave} onCancel={() => { setShowForm(false); setEditing(null) }} />
        </div>
      )}

      {vehicles.length === 0 && !showForm ? (
        <div className="text-center py-16 text-gray-400">
          <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 16.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM15 16.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z M2.5 13h15M3.5 9h13l1.5 4H2L3.5 9Z M5 9V6.5A1.5 1.5 0 0 1 6.5 5h7A1.5 1.5 0 0 1 15 6.5V9" />
          </svg>
          <p className="text-lg font-medium mb-1">No vehicles yet</p>
          <p className="text-sm">Add your first vehicle to start tracking maintenance.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {vehicles.map(v => {
            const vehicleEntries = entries.filter(e => e.vehicleId === v.id)
            const totalSpent = vehicleEntries.reduce((s, e) => s + e.cost, 0)
            return (
              <div key={v.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: v.color }}>
                      {v.make[0]}
                    </div>
                    <div>
                      <h3 className="font-semibold">{v.year} {v.make} {v.model}</h3>
                      <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                        {v.plate && <span>{v.plate}</span>}
                        <span>{v.mileage.toLocaleString()} mi</span>
                        <span>{vehicleEntries.length} records</span>
                        {totalSpent > 0 && <span>${totalSpent.toLocaleString()}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => goToLog(v.id)} title="View log"
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" />
                      </svg>
                    </button>
                    <button onClick={() => setEditing(v)} title="Edit"
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" />
                      </svg>
                    </button>
                    <button onClick={() => handleDelete(v.id)} title="Delete"
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
    </div>
  )
}
