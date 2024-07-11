import { useAppDispatch, useAppSelector } from '..'
import { setReferralCode, setReferralSystemInitialized, setReferrerBy } from './actions'

export function useReferralCode() {
  const referralCode = useAppSelector((state) => state.referrals.referralCode)
  return referralCode
}
export function useSetReferralCodeCallback() {
  const dispatch = useAppDispatch()
  return (referralCode: string) => dispatch(setReferralCode({ referralCode }))
}
export function useReferrerBy() {
  const referrerBy = useAppSelector((state) => state.referrals.referrerBy)
  return referrerBy
}
export function useSetReferrerByCallback() {
  const dispatch = useAppDispatch()
  return (referrerBy: string) => dispatch(setReferrerBy({ referrerBy }))
}

export function useIsReferralSystemInitialized() {
  const isReferralSystemInitialized = useAppSelector((state) => state.referrals.isReferralSystemInitialized)
  return isReferralSystemInitialized
}

export function useSetReferralSystemInitializedCallback() {
  const dispatch = useAppDispatch()
  return (isReferralSystemInitialized: boolean) =>
    dispatch(setReferralSystemInitialized({ isReferralSystemInitialized }))
}
