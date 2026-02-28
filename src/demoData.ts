import type { Vehicle, MaintenanceEntry } from './types'
import { camryPhoto, crvPhoto, f150Photo } from './demoPhotos'

export const demoVehicles: Vehicle[] = [
  {
    id: 'demo-v1',
    make: 'Toyota',
    model: 'Camry',
    year: 2021,
    plate: 'ABC-1234',
    mileage: 45200,
    color: '#2563eb',
    photo: camryPhoto,
  },
  {
    id: 'demo-v2',
    make: 'Honda',
    model: 'CR-V',
    year: 2019,
    plate: 'XYZ-5678',
    mileage: 72800,
    color: '#dc2626',
    photo: crvPhoto,
  },
  {
    id: 'demo-v3',
    make: 'Ford',
    model: 'F-150',
    year: 2022,
    plate: 'TRK-9012',
    mileage: 28500,
    color: '#16a34a',
    photo: f150Photo,
  },
]

export const demoEntries: MaintenanceEntry[] = [
  // Toyota Camry entries
  { id: 'demo-e01', vehicleId: 'demo-v1', type: 'Oil Change', date: '2025-12-15', mileage: 42000, cost: 65, shop: 'Quick Lube Pro', notes: 'Full synthetic 0W-20', reminderDate: '2026-06-15', reminderMileage: 47000, photos: [] },
  { id: 'demo-e02', vehicleId: 'demo-v1', type: 'Tires', date: '2025-10-03', mileage: 40200, cost: 620, shop: 'Discount Tire', notes: 'Michelin Defender 215/55R17, all 4 replaced', reminderDate: '', reminderMileage: 80000, photos: [] },
  { id: 'demo-e03', vehicleId: 'demo-v1', type: 'Brakes', date: '2025-08-20', mileage: 38500, cost: 340, shop: 'AutoCare Center', notes: 'Front pads + rotors resurfaced', reminderDate: '', reminderMileage: 68500, photos: [] },
  { id: 'demo-e04', vehicleId: 'demo-v1', type: 'Air Filter', date: '2025-12-15', mileage: 42000, cost: 25, shop: 'Quick Lube Pro', notes: 'Replaced during oil change', reminderDate: '2026-12-15', reminderMileage: null, photos: [] },
  { id: 'demo-e05', vehicleId: 'demo-v1', type: 'Inspection', date: '2026-01-10', mileage: 43500, cost: 35, shop: 'State Auto Inspect', notes: 'Passed — all clear', reminderDate: '2027-01-10', reminderMileage: null, photos: [] },
  { id: 'demo-e06', vehicleId: 'demo-v1', type: 'Wipers', date: '2025-11-01', mileage: 41000, cost: 28, shop: 'AutoZone', notes: 'Bosch Icon front pair', reminderDate: '', reminderMileage: null, photos: [] },

  // Honda CR-V entries
  { id: 'demo-e07', vehicleId: 'demo-v2', type: 'Oil Change', date: '2026-01-20', mileage: 71500, cost: 72, shop: 'Honda Dealer', notes: 'Synthetic blend 0W-20, filter replaced', reminderDate: '2026-07-20', reminderMileage: 76500, photos: [] },
  { id: 'demo-e08', vehicleId: 'demo-v2', type: 'Transmission', date: '2025-09-15', mileage: 67000, cost: 185, shop: 'Honda Dealer', notes: 'CVT fluid drain and fill', reminderDate: '', reminderMileage: 97000, photos: [] },
  { id: 'demo-e09', vehicleId: 'demo-v2', type: 'Battery', date: '2025-07-10', mileage: 64500, cost: 165, shop: 'Interstate Batteries', notes: 'Interstate MTZ-51, 3yr warranty', reminderDate: '2028-07-10', reminderMileage: null, photos: [] },
  { id: 'demo-e10', vehicleId: 'demo-v2', type: 'Coolant', date: '2025-11-25', mileage: 70000, cost: 120, shop: 'Honda Dealer', notes: 'Honda Type-2 coolant, full flush', reminderDate: '', reminderMileage: 100000, photos: [] },
  { id: 'demo-e11', vehicleId: 'demo-v2', type: 'Brakes', date: '2025-06-05', mileage: 62000, cost: 480, shop: 'Midas', notes: 'Front and rear pads, rear rotors replaced', reminderDate: '', reminderMileage: 92000, photos: [] },
  { id: 'demo-e12', vehicleId: 'demo-v2', type: 'Cabin Filter', date: '2026-01-20', mileage: 71500, cost: 18, shop: 'Honda Dealer', notes: 'OEM filter, done during oil change', reminderDate: '2026-07-20', reminderMileage: null, photos: [] },
  { id: 'demo-e13', vehicleId: 'demo-v2', type: 'Alignment', date: '2025-10-12', mileage: 68500, cost: 89, shop: 'Firestone', notes: 'Front toe was off, corrected', reminderDate: '', reminderMileage: null, photos: [] },

  // Ford F-150 entries
  { id: 'demo-e14', vehicleId: 'demo-v3', type: 'Oil Change', date: '2026-02-01', mileage: 27000, cost: 85, shop: 'Ford Service Center', notes: 'Motorcraft full synthetic 5W-30', reminderDate: '2026-08-01', reminderMileage: 32000, photos: [] },
  { id: 'demo-e15', vehicleId: 'demo-v3', type: 'Inspection', date: '2026-02-01', mileage: 27000, cost: 0, shop: 'Ford Service Center', notes: 'Multi-point inspection — all good', reminderDate: '2027-02-01', reminderMileage: null, photos: [] },
  { id: 'demo-e16', vehicleId: 'demo-v3', type: 'Tires', date: '2025-05-20', mileage: 20000, cost: 920, shop: 'Big O Tires', notes: 'BFGoodrich All-Terrain KO2 275/65R18 x4', reminderDate: '', reminderMileage: 60000, photos: [] },
  { id: 'demo-e17', vehicleId: 'demo-v3', type: 'Spark Plugs', date: '2025-09-08', mileage: 24000, cost: 145, shop: 'Ford Service Center', notes: 'Motorcraft platinum, all 6 cylinders', reminderDate: '', reminderMileage: 84000, photos: [] },
  { id: 'demo-e18', vehicleId: 'demo-v3', type: 'Belts', date: '2025-12-10', mileage: 26000, cost: 210, shop: 'Pep Boys', notes: 'Serpentine belt + tensioner replaced', reminderDate: '', reminderMileage: 86000, photos: [] },
]
