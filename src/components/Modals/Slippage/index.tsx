'use client'
import { Button, Modal } from '@/src/components/UI'
import { useSetSlippageToleranceCallback, useSlippageTolerance } from '@/src/state/user/hooks'
import useStore from '@/src/state/zustand'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { z } from 'zod'
import { NumericalInput } from '../../UI/Input'

const slippageOptions = [
  // { label: 'Auto', value: 'Auto' },
  { label: '0.5%', value: 0.5 },
  { label: '1.0%', value: 1 },
  { label: '1.5%', value: 1.5 },
  { label: '5.0%', value: 5 },
]

interface SlippageProps {
  openModal: boolean
  setOpenModal: (openModal: boolean) => void
}
const slippageSchema = z.union([z.number().min(0).max(50), z.literal(0.5)])
const Slippage = () => {
  // const handlerClose = () => setOpenModal(false)
  const openModal = useStore((state) => state.slippageModal)
  const { setSlippageModal } = useStore()
  const setSlippage = useSetSlippageToleranceCallback()
  const slippage = useSlippageTolerance()
  const [slippageInput, setSlippageInput] = useState<any>(0.5)
  const [invalidInput, setInvalidInput] = useState<boolean>(false)
  const handleClose = () => setSlippageModal(false)

  // when slippage for redux changes, update the input in the ui
  useEffect(() => {
    setSlippageInput(slippage?.toString())
  }, [slippage, openModal])

  // when input changes, validate schema
  useEffect(() => {
    try {
      //
      const parsedInput = slippageInput.toString().toLowerCase() === 'auto' ? 'Auto' : parseFloat(slippageInput)
      //
      slippageSchema.parse(parsedInput)
      setInvalidInput(false)

      if (openModal) {
        setSlippage(slippageInput)
      }
    } catch (error) {
      setInvalidInput(true)
    }
  }, [slippageInput, openModal])

  return (
    <Modal className="" openModal={openModal} setOpenModal={setSlippageModal}>
      <div className="common-modal w-full">
        <span
          className="absolute top-2 right-4 xl:top-[2px] xl:right-[2px] text-2xl cursor-pointer icon-x text-shark-100"
          onClick={handleClose}
        />
        <div className="relative w-full h-full">
          <h2 className="mt-5 text-lg font-semibold text-center text-white my-10">Slippage Tolerance</h2>
          {/* <p className="text-shark-100 text-sm font-normal mt-3 text-center lg:mb-6 sm:mb-6 mb-2 max-w-[300px] mx-auto">
            Adjust to your personal preferences.
          </p> */}
          <div className="relative">
            {/* <input
              type="text"
              placeholder="0"
              value={slippageInput}
              onChange={(e) => {
                setSlippageInput(e.target.value)
              }}
              className="p-4 w-full h-[55px] rounded-lg outline-none bg-shark-400 text-white"
            /> */}
            <NumericalInput
              value={slippageInput}
              className="p-4 w-full h-[55px] rounded-lg outline-none bg-shark-400 text-white"
              placeholder="0"
              onUserInput={(input) => setSlippageInput(input)}
              precision={2}
            />
            {/* <button
              onClick={() => {
                setSlippageInput('Auto')
              }}
              className="absolute w-6 h-6 text-xs text-white rounded-lg cursor-pointer hover:bg-button-primary hover:border-outrageous-orange-400 right-2 top-4 bg-shark-300 bg-none"
            >
              %
            </button> */}
          </div>
          {Number(slippageInput) > 50 && (
            <div className="py-2 relative z-[200]">
              <div className="w-full bg-alizarin-crimson-600 bg-opacity-20 border-alizarin-crimson-600 border  rounded-lg h-[38px]">
                <div className="absolute top-[50%] bottom-[50%] flex items-center w-full justify-center">
                  <p className="text-alizarin-crimson-600 text-xs flex gap-1 items-center">
                    <span className="icon-info text-base" />
                    Slippage above 50% is not allowed.
                  </p>
                </div>
              </div>
            </div>
          )}
          <div
            className={`flex justify-center gap-3  ${Number(slippageInput) > 50 ? 'pb-2' : 'p-3'}  lg:flex-nowrap`}
          >
            {slippageOptions.map((option) => (
              <Button
                key={option.label}
                className="!py-2 w-[25%]"
                variant="tertiary"
                onClick={() => setSlippageInput(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>

          <p className="text-xs font-normal text-center text-shark-200">
            Difference between expected and actual trade values due to asset volatility. Exceeding the user-defined
            range reverses the transaction. Setting a higher slippage can help transactions be filled successfully, but
            can also lead to a higher price difference. Use with caution.
          </p>
          {/* <div className="flex justify-center">
            <Button
              className="mt-2 mb-2 lg:w-full sm:w-full w-72"
              variant="tertiary"
              disabled={invalidInput}
              onClick={() => {
                setSlippage(slippageInput)
                handleClose()
              }}
            >
              {invalidInput ? 'Invalid Slippage' : 'Confirm Slippage'}
            </Button>
          </div> */}
          {/* <div className="flex items-center justify-center gap-2 cursor-pointer text-shark-100 hover:text-outrageous-orange-500"> */}
          {/* <span className="icon-discord"></span>
            <Link href="https://discord.com/invite/fenixfi" className="text-sm">
              Need help?
            </Link> */}
          {/* </div> */}
        </div>
      </div>
    </Modal>
  )
}

export default Slippage
