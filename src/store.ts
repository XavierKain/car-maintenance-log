import type { Vehicle, MaintenanceEntry } from './types'

const VEHICLES_KEY = 'carlog_vehicles'
const ENTRIES_KEY = 'carlog_entries'

export function loadVehicles(): Vehicle[] {
  try {
    const data = localStorage.getItem(VEHICLES_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function saveVehicles(vehicles: Vehicle[]) {
  localStorage.setItem(VEHICLES_KEY, JSON.stringify(vehicles))
}

export function loadEntries(): MaintenanceEntry[] {
  try {
    const data = localStorage.getItem(ENTRIES_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function saveEntries(entries: MaintenanceEntry[]) {
  localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries))
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}
