import LiquidityUpdater from './liquidity/updater'
import ReferralsUpdater from './referrals/updater'
import UserUpdater from './user/updater'

export default function AppUpdater() {
  return (
    <>
      <LiquidityUpdater />
      <UserUpdater />
      <ReferralsUpdater />
    </>
  )
}
