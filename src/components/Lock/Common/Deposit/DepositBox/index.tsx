'use client'

import { Button } from '@/src/components/UI'
import Spinner from '../../../../Common/Spinner'
import { useEffect } from 'react'
import Link from 'next/link'

interface DepositBoxProps {
  activeVote: boolean
  loader?: boolean
  changeState: boolean
  setChangeState: (parameter: boolean) => void
}

const DepositBox = ({ activeVote, loader, changeState, setChangeState }: DepositBoxProps) => {
  
  useEffect(() => {
    setTimeout(() => {
      setChangeState(true)
    }, 5000)
  }, [loader])

  return (
    <div className="relative">
      <div className={` h-[70px] flex gap-3 items-center p-6 mb-3 relative exchange-box-info `}>
        <div className="flex items-center justify-center  w-9 h-9 p-3 rounded-xl bg-shark-400 bg-opacity-60">
          <span className={` icon-lock inline-block text-base text-gradient`} />
        </div>
        <div className="fw ">
          <div className="flex items-center gap-1">
            <div className="text-white flex gap-2">
              <p className={`text-xs  text-shark-100`}> Select the Lock you want to deposit</p>
            </div>
          </div>
        </div>
      </div>
      {!activeVote && (
        <>
          <div
            className={` h-[70px] flex   gap-3 items-center justify-between xl:p-6  mb-3 relative exchange-box-info `}
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center  w-9 h-9 p-3 rounded-xl bg-shark-400 bg-opacity-60">
                <span className={` icon-check inline-block text-base text-gradient`}></span>
              </div>
              <div className="fw ">
                <div className="flex items-center gap-1">
                  <div className="text-white flex gap-2">
                    <p className={`text-xs  text-shark-100`}> Confirm unlock date change</p>
                  </div>
                </div>
              </div>
            </div>
            <Button variant="tertiary" className="!py-2 !text-xs">
              Refresh Rate
            </Button>
          </div>

          <div className={` h-[70px] flex gap-3 items-center justify-between p-6 mb-3 relative exchange-box-info `}>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center  w-9 h-9 p-3 rounded-xl bg-shark-400 bg-opacity-60">
                <Spinner/>
              </div>
              <div className="fw ">
                <div className="flex items-center gap-1">
                  <div className="text-white flex gap-2">
                    <p className={`text-xs  text-shark-100`}> Waiting for next actions...</p>
                  </div>
                </div>
              </div>
            </div>
            <Button variant="tertiary" className="!py-2 !text-xs">
              Got it
            </Button>
          </div>
        </>
      )}

      {activeVote && (
        <>
          <div className={` h-[70px] flex gap-3 items-center p-6 mb-3 relative exchange-box-info `}>
            <div className="flex items-center justify-center  w-9 h-9 p-3 rounded-xl bg-shark-400 bg-opacity-60">
              <span className={` icon-lock-off inline-block text-base text-gradient`}></span>
            </div>
            <div className="fw ">
              <div className="flex items-center gap-1">
                <div className="text-white flex gap-2">
                  <p className={`text-xs  text-shark-100`}>
                    {' '}
                    Reset done for lock <span className="text-white text-xs">9339</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className={` h-[70px] flex gap-3 items-center p-6 mb-3 relative exchange-box-info `}>
            <div className="flex items-center justify-center  w-9 h-9 p-3 rounded-xl bg-shark-400 bg-opacity-60">
              <span className={` icon-check inline-block text-base text-gradient`}></span>
            </div>
            <div className="fw ">
              <div className="flex items-center gap-1">
                <div className="text-white flex gap-2">
                  <p className={`text-xs  text-shark-100`}> Confirm unlock date change</p>
                </div>
              </div>
            </div>
          </div>

          {loader ? (
            <>
              {changeState ? (
                <div
                  className={` h-[70px] flex gap-3 items-center justify-between p-6 mb-3 relative exchange-box-info `}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center  w-9 h-9 p-3 rounded-xl bg-shark-400 bg-opacity-60">
                      <span className={` icon-party inline-block text-base text-gradient`}></span>
                    </div>
                    <div className="fw ">
                      <div className="flex items-center gap-1">
                        <div className="text-white flex gap-2 w-3/4">
                          <p className={`text-xs  text-shark-100`}> Nest Activated</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Link href={''} className="text-shark-100 text-xs flex gap-2 items-center">
                      {' '}
                      <span className="icon-link"></span> Transaction Details
                    </Link>
                  </div>
                </div>
              ) : (
                <div
                  className={` h-[70px] flex gap-3 items-center justify-between p-6 mb-3 relative exchange-box-info `}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center  w-9 h-9 p-3 rounded-xl bg-shark-400 bg-opacity-60">
                      <Spinner />
                    </div>
                    <div className="fw ">
                      <div className="flex items-center gap-1">
                        <div className="text-white flex gap-2 w-3/4">
                          <p className={`text-xs  text-shark-100`}>
                            {' '}
                            Waiting for you transaction Lorem ipsum dolor sit amet consectetur.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className={` h-[70px] flex gap-3 items-center justify-between p-6 mb-3 relative exchange-box-info  `}>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center  w-9 h-9 p-3 rounded-xl bg-shark-400 bg-opacity-60">
                  <span className={` icon-lock inline-block text-base text-gradient`}></span>
                </div>
                <div className="fw ">
                  <div className="flex items-center gap-1">
                    <div className="text-white flex gap-2 ">
                      <p className={`text-xs  text-shark-100 text-justify `}>
                        {' '}
                        Wait for the system to get your quote ready in just a moment!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <Button variant="tertiary" className="!py-2 !text-xs w-32 ">
                Go it
              </Button>
            </div>
          )}
        </>
      )}
      {/* /// */}
    </div>
  )
}

export default DepositBox
