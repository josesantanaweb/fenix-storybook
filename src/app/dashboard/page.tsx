/* eslint-disable max-len */

import Dashboard from '@/src/components/Dashboard'

export const metadata = {
  title: 'Dashboard | Fenix Finance',
  description: 'Track all your positions and accumulated platform rewards in real time.',
}

const DashboardPage = () => {
  return (
    <main>
      <div className="container">
        <Dashboard />
      </div>
    </main>
  )
}

export default DashboardPage
