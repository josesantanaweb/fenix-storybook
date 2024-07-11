'use client'

import React, { useState } from 'react'
import PanelWrapper from '@/src/components/Liquidity/MyPositions/Common/Panel'
import Main from '@/src/components/Liquidity/MyPositions/Main'
import Increase from '@/src/components/Liquidity/MyPositions/Increase'
import Remove from '@/src/components/Liquidity/MyPositions/Remove'

const Panel = () => {
  const [tabActive, setTabActive] = useState<string>("")

  return (
    <PanelWrapper>
      {tabActive === "" && (
        <Main tabActive={tabActive} setTabActive={setTabActive}/>
      )}
      {tabActive === "increase" && (
        <Increase tabActive={tabActive} setTabActive={setTabActive}/>
      )}
      {tabActive === "remove" && (
        <Remove tabActive={tabActive} setTabActive={setTabActive}/>
      )}
    </PanelWrapper>
  )
}

export default Panel
