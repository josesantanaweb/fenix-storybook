
import Vote from '@/src/components/Vote'
export const metadata = {
  title: 'Vote | Fenix Finance',
  description:
    // eslint-disable-next-line max-len
    'Vote',
}
const VotePage = () => {
  return (
    <main>
      <div className="container">
        <Vote />
      </div>
    </main>
  )
}

export default VotePage
