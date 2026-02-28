import { AppProvider, useApp } from './context'
import { Vehicles } from './components/Vehicles'
import { MaintenanceLog } from './components/MaintenanceLog'
import { Reminders } from './components/Reminders'
import { Stats } from './components/Stats'
import { Nav } from './components/Nav'

function AppInner() {
  const { page, darkMode } = useApp()

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors">
        <Nav />
        <main className="max-w-3xl mx-auto px-4 pb-24 pt-4">
          {page === 'vehicles' && <Vehicles />}
          {page === 'log' && <MaintenanceLog />}
          {page === 'reminders' && <Reminders />}
          {page === 'stats' && <Stats />}
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  )
}
