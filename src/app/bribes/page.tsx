
import Bribes from '@/src/components/Bribes'
export const metadata = {
  title: 'Bribes | Fenix Finance',
  description:
    // eslint-disable-next-line max-len
    'Bribes',
}
const BribesPage = () => {
  return (
    <main className="container flex justify-center py-10 px-10">
      <Bribes />
    </main>
  )
}

export default BribesPage
