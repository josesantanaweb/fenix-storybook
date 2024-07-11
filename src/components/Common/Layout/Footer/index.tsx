/* eslint-disable max-len */

import Image from 'next/image'
import Link from 'next/link'
import { FenixIcon } from '@/src/components/UI/Icons'
import { NAV_LINKS, SOCIAL_LINKS } from './data'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { getCommitHash } from './getComitHash'

const Footer = () => {
  const [commitHash, setCommitHash] = useState('0.0.1')

  // useEffect(() => {
  //   const fetchCommitHash = async () => {
  //     try {
  //       const hash = await getCommitHash()
  //       const shortenedHash = hash.substring(hash.length - 7)
  //       setCommitHash(shortenedHash)
  //     } catch (error) {
  //       console.error('Error al obtener el hash del commit:', error)
  //     }
  //   }

  //   fetchCommitHash()
  // }, [])

  const pathname = usePathname()
  const currentYear = new Date().getFullYear()
  // Todas las clases que tienen como condicion "pathname === '/' son tomadas en cuenta para el landing page de forma que no modifiquen estilos importantes en el resto de la aplicación"
  return (
    <footer className="relative mx-auto mt-auto flex flex-col gap-3">
      <div className="container relative ">
        {pathname === '/' && (
          <div className="absolute overflow-hidden 2xl:-left-[340px] -left-[158px]  h-[600px] right-0 bottom-0 pointer-events-none">
            <Image
              src="/static/images/footer/fenix-galaxy.svg"
              width={800}
              height={800}
              className={`${pathname === '/' ? '' : 'hidden'}
            absolute 
            2xl:left-0 
            object-cover 
            h-[400px] 
            w-[480px] 
            sm:h-[480px] 
            sm:w-[650px] 
            sm:-left-28
            sm:-bottom-40
            -bottom-36
            -left-10
            lg:-bottom-60
            md:-bottom-60
            md:-left-32
            lg:-left-36
            md:h-[600px] 
            md:w-[650px] 
            lg:w-[780px] 
            xl:-left-32
            xl:h-[600px] 
            xl:w-[780px] 
            2xl:h-[800px] 
            2xl:w-[800px]
            2xl:-bottom-[340px] 
            `}
              // className={`absolute sm:bottom-[-270px] max-sm:bottom-[-220px] sm:left-[-270px] max-sm:left-[-220px] z-10 object-center object-cover min-w-[500px]`}
              alt="fenix-galaxy"
            />
          </div>
        )}
        <div className={`${pathname === '/' ? 'pl-16 max-lg:!pl-0 max-lg:!pr-0 xl:ms-10' : 'footer-box'} `}>
          <div
            className={`relative flex items-end px-4 ${pathname === '/' ? 'pt-8 pb-6 md:pt-16 md:pb-6 max-md:!px-0' : 'py-8 md:py-16'}`}
          >
            <div className="relative z-10 flex xl:items-center flex-col md:flex-row  w-full px-5 sm:items-start ">
              <div
                className={`flex gap-2 flex-col mb-5 xl:mb-0 ${pathname === '/' ? 'xl:items-center xl:flex-row max-md:w-[100%] w-[70%]' : 'md:items-center md:flex-row sm:w-[70%]'}`}
              >
                <div className=" relative flex flex-col  gap-4">
                  {/* {pathname !== '/' && <FenixIcon className="text-4xl" />} */}
                  {pathname !== '/' && (
                    <Image src={'/static/images/footer/fenix-logo.svg'} width={128} height={34} alt="fenix" />
                  )}
                </div>
                <div className="flex  items-center relative">
                  {/* <p className="text-shark-100 text-sm leading-normal font-medium hidden xl:inline-block mb-2 xl:mb-0">
                    Navigation
                  </p> */}

                  <div
                    className={`grid grid-cols-3 xl:grid-cols-6 ${pathname === '/' ? 'gap-3 max-md:w-[100%]' : 'gap-2 text-center'}`}
                  >
                    {/* {NAV_LINKS.map((link, index) => (
                      <Link
                        href={link.href}
                        key={index}
                        className={`text-xs sm:text-sm text-white hover:text-transparent hover:bg-button-primary-hover hover:bg-clip-text transition-all text-${index % 3 === 0 && pathname === '/' ? 'left' : index % 3 === 1 && pathname === '/' ? 'center' : index % 3 === 2 && pathname === '/' ? 'right' : ''} xl:text-center`}
                        target="_blank"
                      >
                        {link.title}
                      </Link>
                    ))} */}
                  </div>
                </div>
              </div>
              <div className="flex md:justify-end  gap-5  md:gap-2.5 sm:w-[30%]">
                {SOCIAL_LINKS.map((link, index) => (
                  <Link
                    title={link.title}
                    href={link.href}
                    key={index}
                    target="_blank"
                    className="text-white w-9 h-9 flex items-center justify-center border  border-shark-400 rounded-[10px] flex-shrink-0 bg-shark-400 bg-opacity-40 transition-colors hover:border-outrageous-orange-500 hover:bg-button-primary-hover hover:bg-opacity-80"
                  >
                    <i
                      className={`icon-${link.iconName} ${link.iconName === 'git' ? 'mr-1 text-xs' : 'mr-0 text-sm'}`}
                    ></i>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div
          className={`flex flex-col gap-4 text-shark-100 text-xs mt-1 ${pathname === '/' ? 'pl-28 pr-10 max-md:gap-20 max-md:mt-[-16px] lg:flex-row max-md:!pl-4 max-md:!pr-4' : 'md:flex-row items-center'}`}
        >
          <div className={`flex justify-between ${pathname === '/' ? 'lg:w-1/2' : 'md:w-[40%]'}`}>
            <div className={`flex items-center gap-5 ${pathname === '/' && 'xl:ms-10'}`}>
              <div>Copyright {currentYear} Fenix. All rights reserved.</div>
            </div>
            <div
              className={`flex items-center whitespace-nowrap text-xs text-shark-100 px-3 py-1 rounded-xl md:hidden ${pathname === '/' ? 'hidden' : 'block'}`}
            >
              {/* version: {commitHash} */}
            </div>
          </div>
          <div className="flex flex-col items-center md:w-[20%]">
            <Link
              href={
                'https://app.hats.finance/audit-competitions/fenix-finance-0x83dbe5aa378f3ce160ed084daf85f621289fb92f/scope'
              }
              target="_blank"
              className={`${pathname === '/' ? 'hidden' : 'block'}`}
            >
              <div className="flex items-center gap-1">
                <Image
                  src="/static/images/footer/hats-finance.svg"
                  alt="hats-finance"
                  width={24}
                  height={24}
                  className="w-6 h-6 "
                />
                <span className="text-[9px] 2xl:text-xs whitespace-nowrap ">Audited by Hats Finance </span>
              </div>
            </Link>
          </div>
          <div
            className={`flex items-end flex-col gap-2 ${pathname === '/' ? 'justify-end lg:w-1/2 text-right' : 'justify-center md:justify-start md:w-[40%]'}`}
          >
            <div
              className={`
             
              flex justify-between max-sm:w-full items-center gap-6 ${pathname === '/' ? 'max-md:flex-col max-md:items-end sm:py-10' : 'md:py-10'}`}
            >
              <Link
                href={
                  'https://app.hats.finance/audit-competitions/fenix-finance-0x83dbe5aa378f3ce160ed084daf85f621289fb92f/scope'
                }
                target="_blank"
                className={`${pathname === '/' ? 'block' : 'hidden'}`}
              >
                <div className="flex items-center gap-1">
                  <Image
                    src="/static/images/footer/hats-finance.svg"
                    alt="hats-finance"
                    width={24}
                    height={24}
                    className="w-6 h-6 "
                  />
                  <span className="text-[9px] 2xl:text-xs">Audited by Hats Finance </span>
                </div>
              </Link>
              <div className="flex items-center gap-2">
                <span className="text-[9px] 2xl:text-xs">The Unified Trading and Liquidity Marketplace for </span>
                <Image
                  src="/static/images/point-stack/blast.svg"
                  alt="Blast"
                  width={24}
                  height={24}
                  className="w-6 h-6 opacity-50"
                />
              </div>
            </div>
          </div>
        </div>
        <div
          className={`flex items-center whitespace-nowrap text-xs justify-center relative -top-10 text-shark-100 px-3 py-1 rounded-xl max-md:hidden ${pathname === '/' ? 'hidden' : 'block'}`}
        >
          {/* version: {commitHash} */}
        </div>
      </div>
    </footer>
  )
}

export default Footer
