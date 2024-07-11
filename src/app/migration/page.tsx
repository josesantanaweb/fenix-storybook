import Migration from '@/src/components/Migration'

export const metadata = {
  title: 'Migration | Fenix Finance',
  description:
    // eslint-disable-next-line max-len
    'Migration',
}
const MigrationPage = () => {
  return (
    <main>
      <div className="container">
        <Migration />
      </div>
    </main>
  )
}

export default MigrationPage
