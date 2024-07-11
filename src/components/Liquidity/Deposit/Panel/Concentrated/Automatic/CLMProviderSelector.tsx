/* eslint-disable react/destructuring-assignment */
/* eslint-disable max-len */
/* eslint-disable react/no-multi-comp */
import Image from 'next/image'
import ComponentVisible from '@/src/library/hooks/useVisible'
import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/src/components/UI'
import useIsMobile from '@/src/library/hooks/useIsMobile'
import { useToken0, useToken1 } from '@/src/state/liquidity/hooks'
import { IchiVault, useIchiVaultInfo } from '@/src/library/hooks/web3/useIchi'
export type IOption = {
  label: string
  value: string
  icon?: JSX.Element
  apr?: number
  src?: string
  logo?: {
    src: string
    width: number
    height: number
  }
}

type onSelectedChange = (selected: string) => void
type onSelectedChangeMulitple = (selected: string[]) => void

type ISingleSelectProps = {
  options: IOption[]
  selected: string
  onSelectedChange: onSelectedChange
  mode?: undefined
  className?: string
}

type IDropdownProps = ISingleSelectProps

const ItemWrapper = ({
  children,
  className = '',
  onClick,
}: {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}) => {
  return (
    <button
      type="button"
      className={`bg-shark-400 bg-opacity-40 rounded-[10px] border border-shark-950 text-white px-3 md:px-4 flex items-center justify-between h-[45px] md:h-[55px] w-full backdrop-blur-[15px] ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

const Item = ({ option }: { option: IOption }) => {
  const { label, icon, logo } = option
  const isMobile = useIsMobile()
  const token0 = useToken0()
  const token1 = useToken1()
  //
  //  const { apr } = useIchiVaultInfo(token0, token1)
  return (
    <div className="flex h-[30px] items-center min-w-0 text-ellipsis whitespace-nowrap flex-grow justify-between">
      {logo && (
        <div className="min-w-[50px] md:min-w-[100px]">
          <Image
            src={logo.src}
            alt="token"
            className="rounded-full px-2"
            width={logo.width * (isMobile ? 0.667 : 1.2)}
            height={logo.height * (isMobile ? 0.667 : 1.2)}
          />
        </div>
      )}

      <div className="flex items-center gap-[5px] md:gap-3 text-xs md:text-sm leading-none">
        {/* <Image
          src="/static/images/brands/satin.png"
          alt="token"
          className="rounded-full max-md:w-[15px] max-md:h-[15px]"
          width={20}
          height={20}
        /> */}
        <div>{/* {'apr'}%<span className="max-md:hidden"> APR</span> */}</div>
      </div>

      <div className="max-md:hidden"></div>
    </div>
  )
}

const SingleDropdownSelected = ({ options, selected }: { options: IOption[]; selected: string }) => {
  const currentOptionSelected = useMemo(() => options.find((option) => option.value === selected), [selected, options])

  if (!currentOptionSelected) return null

  return <Item option={currentOptionSelected} />
}

const DefaultOptions = ({ options, onSelectedChange }: { options: IOption[]; onSelectedChange: onSelectedChange }) => {
  return (
    <>
      {options.map((option, i) => (
        <ItemWrapper
          key={i}
          className="!bg-shark-300 !bg-opacity-40 !border-shark-200 !h-[45px] md:!h-[69px] !cursor-auto max-md:gap-1"
        >
          <Item option={option} />
          <div
            className="button-tertiary !text-xs !w-[56px] md:!w-[77px] !h-[28px] flex items-center justify-center rounded-[10px] cursor-pointer"
            onClick={() => onSelectedChange(option.value)}
          >
            Select
          </div>
        </ItemWrapper>
      ))}
    </>
  )
}

const DropdownOptionsWrapper = ({ isVisible, children }: { isVisible: boolean; children: React.ReactNode }) => {
  if (!isVisible) return null

  return (
    <div className="rounded-10 absolute top-[calc(100%+10px)] w-[230px] left-1/2 max-md:-translate-x-1/2 md:w-full md:left-0 right-0 flex flex-col gap-[5px] overflow-auto scrollbar-hide z-20">
      {children}
    </div>
  )
}

const Dropdown = (props: IDropdownProps) => {
  const { options, selected, onSelectedChange, className } = props

  const { ref, isVisible, setIsVisible } = ComponentVisible(false)

  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className={`relative select-none ${className}`}>
      <ItemWrapper
        className={isVisible ? `!bg-shark-300 !bg-opacity-40 !border-shark-200` : ''}
        onClick={() => setIsVisible(!isVisible)}
      >
        <SingleDropdownSelected options={options} selected={selected} />

        <div className={`text-[16px] ml-5 pr-0.5 pl-1 ${isVisible ? 'rotate-180' : ''}`}>
          <span className="icon-chevron text-xs md:text-sm inline-block"></span>
        </div>
      </ItemWrapper>

      <DropdownOptionsWrapper isVisible={isVisible}>
        <DefaultOptions
          options={options}
          onSelectedChange={(selected: string) => {
            onSelectedChange(selected)
            setIsVisible(false)
          }}
        />
      </DropdownOptionsWrapper>
    </div>
  )
}

const CLMProviderSelector = ({
  currentProvider,
  providers,
  setCurrentProvider,
}: {
  // vaultInfo: IchiVault[] | null | undefined
  currentProvider: string
  providers: IOption[]
  setCurrentProvider: (selected: string) => void
}) => {
  const selectedProvider = useMemo(
    () => providers.find((provider) => provider.value === currentProvider),
    [currentProvider, providers]
  )

  return (
    <div className="bg-shark-400 bg-opacity-40 px-[15px] py-[29px] md:px-[19px] border border-shark-950 rounded-[10px] mb-2.5">
      <div className="text-xs leading-normal text-white mb-2">Select CLM Provider</div>
      <div className="flex gap-[7px] md:gap-[15px]">
        <Dropdown
          options={providers}
          selected={currentProvider}
          onSelectedChange={(selectedOption) => setCurrentProvider(selectedOption)}
          className="flex-grow"
        />

        <Button
          variant="tertiary"
          className="!w-[45px] !h-[45px] md:!w-[55px] md:!h-[55px]"
          onClick={() => {
            window.open(selectedProvider?.src, '_blank')
          }}
        >
          <span className="lg:text-lg icon-link"></span>
        </Button>
      </div>
    </div>
  )
}

export default CLMProviderSelector
