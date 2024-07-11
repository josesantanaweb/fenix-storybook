'use client'

import Link from 'next/link'
import MainBox from '@/src/components/Common/Boxes/MainBox'
import { Button, ProgressBar } from '@/src/components/UI'
import { useState } from 'react'
import InactiveVote from '@/src/components/Vote/InactiveVote'
import CheckBox from '@/src/components/UI/CheckBox'
import ActiveVote from '@/src/components/Vote/ActiveVote'
import SelectVote from '@/src/components/Modals/SelectVote'
import DepositBox from './DepositBox'
import { useRouter } from 'next/navigation'
import { LockElement } from '@/src/library/structures/lock/LockElement'

const DepositLock = () => {
  const [openModal, setOpenModal] = useState(false)
  const [activeVote, setActiveVote] = useState(false)
  const [checked, setChecked] = useState(false)
  const [loader, setLoader] = useState(false)
  const [changeState, setChangeState] = useState(false)
  const { push } = useRouter()
  const handlerGoTo = () => push('/lock/create')
  const handlerCheck = () => (checked ? setChecked(false) : setChecked(true))
  const handlerChange = () => (
    openModal ? setOpenModal(false) : setOpenModal(true), setLoader(false), setChangeState(false)
  )
  const handlerLoader = () => (loader ? setLoader(false) : setLoader(true))
  const [lock, setlock] = useState<LockElement>()
  return (
    <div>
      <div className="w-full h-auto lock-box">
        <div className="flex flex-col w-full xl:flex-row relative py-5  z-10">
          <div className="w-full mb-5 xl:w-1/2">
            <div className="flex flex-wrap xl:flex-nowrap items-center justify-between mb-5">
              <h4 className="text-xl font-semibold text-white">Deposit Lock</h4>
              <div>
                <Button className=" flex gap-2 items-center !py-3" variant="primary" onClick={handlerGoTo}>
                  <span className="icon-lock"></span>
                  Create New Lock
                </Button>
              </div>
            </div>
            <div>
              <p className="text-white text-sm mb-2">Select lock you want to deposit</p>

              {activeVote ? (
                <ActiveVote lock={lock} handlerChange={handlerChange} />
              ) : (
                <InactiveVote handlerChange={handlerChange} />
              )}
            </div>
            <p className="text-white text-sm mt-5 mb-2">Nest Strategy</p>
            <div className="flex flex-col  exchange-box-x1">
              <div className="flex items-center gap-2">
                <div className="flex relative items-center justify-center w-12 h-12 p-3 rounded-lg bg-shark-400 bg-opacity-60">
                  <span className="icon-lucide inline-block text-2xl text-gradient "></span>
                  <span className="bg-green-600 p-1 rounded-full absolute bottom-2 right-2"></span>
                </div>
                <div>
                  <div className="flex gap-2">
                    <p className="text-white">veFnx Maxi</p>{' '}
                    <p className="text-xs w-[71px] h-[21px] text-white bg-shark-400 flex items-center justify-center  rounded-lg  border-shark-300 border-solid border">
                      ID 1230
                    </p>
                  </div>
                  <div className="flex gap-2 xs:flex-row flex-col xl:flex-row ">
                    <p
                      className="text-xs flex p-2 justify-center  items-center 
                  text-shark-100  w-full text-center  bg-shark-400  rounded-lg  
                  border-shark-300 border-solid border"
                    >
                      Update 2 days ago
                    </p>
                    <p
                      className="text-xs flex items-center justify-center text-shark-100 bg-shark-400 p-2 rounded-lg 
                   border-shark-300 border-solid border"
                    >
                      0xc981...EF14f <span className="icon-document"></span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-5 items-center">
              <CheckBox
                checked={checked}
                size={20}
                onClick={handlerCheck}
                className="bg-shark-400 outline-none p-3 border-shark-300 border"
              />
              <p className="text-orange-500 text-xs text-justify">
                I understand that by depositing my Lock into a Nest strategy, the Lock unlock date will be extended to 4
                years.
              </p>
            </div>
          </div>
          <div className="flex justify-center items-center px-10 relative ">
            <div className="bg-shark-400 h-4/5 w-[1px]"></div>
          </div>
          <div className=" flex flex-col w-full xl:w-1/2 xl:max-h-[390px]  overflow-x-none border-t-2 xl:border-none border-shark-400">
            <div className="mt-4 flex justify-between">
              <h1 className="text-white text-xl font-medium mb-5">Nest Deposit</h1>
              <div className="xl:absolute max-xl:mt-3  xl:-top-[70px] max-w-[100px] z-10 w-28 xl:right-[30px]">
                <ProgressBar progress={30} />
              </div>
            </div>

            <div>
              <DepositBox
                changeState={changeState}
                setChangeState={setChangeState}
                loader={loader}
                activeVote={activeVote}
              />
            </div>

            {!loader && (
              <>
                {activeVote && (
                  <div className="mt-2">
                    <Button className="w-full" onClick={handlerLoader}>
                      Deposit
                    </Button>
                  </div>
                )}
              </>
            )}
            <Link
              target="_blank"
              href="https://discord.com/invite/fenixfi"
              className="py-4 xl:absolute -bottom-20 right-36  text-sm flex gap-2 justify-center text-shark-100 cursor-pointer"
            >
              <span className="icon-discord"></span>Need some help?
            </Link>
          </div>
        </div>
      </div>
      <SelectVote
        openModal={openModal}
        setOpenModal={setOpenModal}
        activeVote={activeVote}
        setActiveVote={setActiveVote}
        setlock={setlock}
      />
    </div>
  )
}

export default DepositLock
