
import VeFNXIDO from '@/src/components/VeFNXIDO'
export const metadata = {
  title: 'veFNXIDO | Fenix Finance',
  description:
    // eslint-disable-next-line max-len
    'veFNXIDO',
}
const veFNXIDOPage = () => {
  return (
    <main>
      <div className="container">
        <VeFNXIDO />
      </div>
    </main>
  )
}

export default veFNXIDOPage
