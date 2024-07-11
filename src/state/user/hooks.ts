import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '..'
import { resetUser, updateSlippageTolerance, setChart, setCloseBanner, setActiveSubMenu } from './actions'

export function useResetUser() {
  const dispatch = useAppDispatch()
  return useCallback(() => {
    dispatch(resetUser())
  }, [dispatch])
}

export function useSetSlippageToleranceCallback(): (slippageTolerance: number | 'Auto') => void {
  const dispatch = useAppDispatch()
  return useCallback(
    (slippageTolerance: number | 'Auto') => {
      dispatch(updateSlippageTolerance({ slippageTolerance }))
    },
    [dispatch]
  )
}

export function useSlippageTolerance(): number | 'Auto' {
  return useAppSelector((state) => state.user.slippageTolerance)
}

export function useSetChart() {
  const dispatch = useAppDispatch()
  return useCallback(
    (showChart: boolean) => {
      dispatch(setChart(showChart))
    },
    [dispatch]
  )
}
export function useCloseBanner() {
  const dispatch = useAppDispatch()
  return useCallback(
    (closeBanner: boolean) => {
      dispatch(setCloseBanner(closeBanner))
    },
    [dispatch]
  )
}

export function useShowChart(): boolean {
  return useAppSelector((state) => state.user.showChart)
}
export function useShowBanner(): boolean {
  return useAppSelector((state) => state.user.closeBanner)
}

export function useIsActiveSubMenu(): boolean {
  return useAppSelector((state) => state.user.activeSubMenu)
}

export function useSetActiveSubMenu() {
  const dispatch = useAppDispatch()
  return useCallback(
    (isActive: boolean) => {
      dispatch(setActiveSubMenu(isActive))
    },
    [dispatch]
  )
}
