import Claim from '@/src/components/Claim'

import React from 'react'
export const metadata = {
  title: 'Claim | Fenix Finance',
  description:
    // eslint-disable-next-line max-len
    'Claim',
}
const ClaimPage = () => {
  return (
    <div className="container">
      <Claim />
    </div>
  )
}

export default ClaimPage
