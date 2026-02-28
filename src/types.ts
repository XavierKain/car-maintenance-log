export interface Vehicle {
  id: string
  make: string
  model: string
  year: number
  plate: string
  mileage: number
  color: string
  photo?: string  // base64 data URL
}

export const MAINTENANCE_TYPES = [
  'Oil Change',
  'Tires',
  'Brakes',
  'Battery',
  'Air Filter',
  'Cabin Filter',
  'Spark Plugs',
  'Transmission',
  'Coolant',
  'Inspection',
  'Alignment',
  'Belts',
  'Wipers',
  'Other',
] as const

export type MaintenanceType = (typeof MAINTENANCE_TYPES)[number]

export interface MaintenanceEntry {
  id: string
  vehicleId: string
  type: MaintenanceType | string
  date: string
  mileage: number
  cost: number
  shop: string
  notes: string
  reminderDate: string
  reminderMileage: number | null
  photos: string[]  // base64 data URLs
}

export type Page = 'vehicles' | 'log' | 'reminders' | 'stats' | 'settings'

export const VEHICLE_COLORS = [
  '#2563eb', '#dc2626', '#16a34a', '#ca8a04', '#9333ea',
  '#0891b2', '#e11d48', '#65a30d',
]

export const TYPE_COLORS: Record<string, string> = {
  'Oil Change': '#ca8a04',
  'Tires': '#1d4ed8',
  'Brakes': '#dc2626',
  'Battery': '#16a34a',
  'Air Filter': '#0891b2',
  'Cabin Filter': '#0d9488',
  'Spark Plugs': '#f59e0b',
  'Transmission': '#7c3aed',
  'Coolant': '#2563eb',
  'Inspection': '#4b5563',
  'Alignment': '#6366f1',
  'Belts': '#a16207',
  'Wipers': '#0284c7',
  'Other': '#6b7280',
}
