'use client'
import React, { useEffect } from 'react'
import { Button } from '../../UI'
import { useState } from 'react'
import { Fuul } from '@fuul/sdk'
import { useSignMessage } from 'wagmi'
import useActiveConnectionDetails from '@/src/library/hooks/web3/useActiveConnectionDetails'
import { useReferralCode, useSetReferralCodeCallback } from '@/src/state/referrals/hooks'
import { NumericalInput } from '../../UI/Input'
import toast from 'react-hot-toast'
import useDebounce from '@/src/library/hooks/useDebounce'
import Clipboard from 'clipboard'

const CreateReferral = () => {
  const [isCopied, setIsCopied] = useState(false)
  let referralCode = useReferralCode()

  const shareOnX = () => {
    handleCopyReferralLink()
    setTimeout(() => {
      const textToTweet = encodeURIComponent(
        'Use my referral link to get 5% extra Fenix Rings: ' + 'https://www.fenixfinance.io/?referrer=' + referralCode
      )
      window.open('https://twitter.com/intent/tweet?text=' + textToTweet, '_blank')
    }, 600)
  }
  const handleCopyReferralLink = () => {
    const textToCopy = 'https://www.fenixfinance.io/?referrer=' + referralCode

    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        toast.success('Referral code copied successfully!')
        setIsCopied(true)
        setTimeout(() => {
          setIsCopied(false)
        }, 2000)
      })
      .catch((err) => {
        console.error('Error al copiar al portapapeles: ', err)
        if (err instanceof Error) {
          toast.error(err.message)
        } else {
          toast.error('An unexpected error occurred')
        }
      })
  }
  const { signMessageAsync } = useSignMessage()
  const { account } = useActiveConnectionDetails()
  const setReferralCode = useSetReferralCodeCallback()
  const [errorMessage, setErrorMessage] = useState('')
  const [createAffiliateCodeValue, setCreateAffiliateCodeValue] = useState('')

  useEffect(() => {
    setCreateAffiliateCodeValue('')
  }, [account])

  useEffect(() => {
    ;(document.querySelector('#ReferralInput') as HTMLInputElement)?.focus()
  }, [])

  useEffect(() => {
    const validateCode = async (code: string) => {
      if (!code) {
        setErrorMessage('')
        return
      }
      setErrorMessage('')
      const isCodeFormatValid = /^[a-zA-Z0-9-]+$/.test(code)
      if (!isCodeFormatValid) {
        setErrorMessage('Code can only contain letters, numbers, and dashes')
        return
      }
      let codeIsFree = true
      try {
        codeIsFree = await Fuul.isAffiliateCodeFree(createAffiliateCodeValue)
        if (codeIsFree === false) {
          setErrorMessage('This code is already taken')
          return
        }
      } catch (error) {
        console.log(error)
        setErrorMessage('This code is already taken')
      }

      setErrorMessage('')
    }
    if (createAffiliateCodeValue) {
      validateCode(createAffiliateCodeValue)
    }
  }, [createAffiliateCodeValue])
  const createAffiliateCode = async () => {
    if (!account) return

    const message = `I confirm that I am creating the ${createAffiliateCodeValue} code on Fuul`

    const signature = await signMessageAsync({
      account,
      message,
    })
    try {
      const createdCode = await Fuul.createAffiliateCode(account as string, createAffiliateCodeValue, signature)
      setReferralCode(createAffiliateCodeValue)
      toast.success('Referral code created successfully!')
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('An unexpected error occurred')
      }
    }
  }
  if (!account) {
    referralCode = ''
  }
  return (
    <div className="box-referrals-short max-sm:max-w-[372px]">
      <div className="relative z-50 flex items-center justify-between flex-wrap xl:flex-nowrap  gap-2">
        {!referralCode ? (
          <>
            <p className="text-sm sm:text-base font-semibold  text-white">Create your referral link</p>
            <div className="relative">
              <input
                className="items-center justify-between line-clamp-1 max-xl:w-full   text-white flex xl:min-w-[602px] min-h-[38px] bg-shark-400 bg-opacity-20 border border-solid border-shark-300 rounded-xl px-4"
                maxLength={42}
                value={createAffiliateCodeValue}
                onChange={(e) => {
                  setCreateAffiliateCodeValue(e.target.value)
                }}
                placeholder="Write your custom referral code here"
                id="ReferralInput"
              />

              {errorMessage && (
                <p className="text-xs absolute italic left-1 text-red-500 mt-[0.2rem]">{errorMessage}</p>
              )}
            </div>
            <Button
              onClick={createAffiliateCode}
              disabled={errorMessage.length > 0 || !createAffiliateCodeValue}
              variant="primary"
              labelWallet="Get Link"
              className="!text-xs max-sm:!p-2"
              walletConfig={{
                needSupportedChain: false,
                needWalletConnected: true,
              }}
            >
              Create referral link
            </Button>
          </>
        ) : (
          <>
            <p className="text-sm sm:text-base font-semibold text-white">Refer and Earn</p>
            <div className="items-center justify-between line-clamp-1 max-xl:w-full   text-white flex xl:min-w-[602px] min-h-[38px] bg-shark-400 bg-opacity-20 border border-solid border-shark-300 rounded-xl ">
              <p className="text-xs font-normal px-2  line-clamp-1">
                https://www.fenixfinance.io/?referrer={referralCode}
              </p>
              <div className="bg-shark-400 rounded-lg p-2 px-3 cursor-pointer" onClick={handleCopyReferralLink}>
                <span className={`text-lg ${isCopied ? 'icon-check' : 'icon-icons'}`} />
              </div>
            </div>
            <Button onClick={shareOnX} variant="tertiary" className="!text-xs">
              Share on X
            </Button>
          </>
        )}
      </div>
    </div>
  )
}

export default CreateReferral
