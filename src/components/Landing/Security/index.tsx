/* eslint-disable max-len */
'use client'
import React, { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ScrollParallax } from 'react-just-parallax'

const Security = () => {
  const brands = [
    {
      title: 'Peckshield',
      image: '/static/images/landing/security/Peckshield.svg',
      link: 'https://github.com/peckshield/publications/blob/master/audit_reports/PeckShield-Audit-Report-Thena-v1.0.pdf',
    },
    {
      title: 'ChainSecurity',
      image: '/static/images/landing/security/ChainSecurity.svg',
      link: 'https://github.com/bancorprotocol/carbon-contracts/blob/dev/docs/audits/ChainSecurity_Carbon_Audit_Report.pdf',
    },
    {
      title: 'OpenZeppelin',
      image: '/static/images/landing/security/OpenZeppelin.svg',
      link: 'https://blog.openzeppelin.com/retro-thena-audit',
    },
    {
      title: 'PaladinBlockchainSecurity',
      image: '/static/images/landing/security/PaladinBlockchainSecurity.svg',
      link: 'https://github.com/cryptoalgebra/Algebra/tree/master/audits',
    },
  ]
  useEffect(() => {
    const handleMouseMove = (ev: MouseEvent) => {
      const allCards = document.querySelectorAll('.card2')

      allCards.forEach((card) => {
        const blob = card.querySelector('.blob2') as HTMLElement
        const fblob = card.querySelector('.fakeblob2') as HTMLElement
        const rec = fblob.getBoundingClientRect()

        blob.style.opacity = '1'
        blob.animate(
          [
            {
              transform: `translate(${ev.clientX - rec.left - rec.width / 2}px, ${ev.clientY - rec.top - rec.height / 2}px)`,
            },
          ],
          {
            duration: 300,
            fill: 'forwards',
          }
        )
      })
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])
  useEffect(() => {
    const handleMouseMove = (ev: MouseEvent) => {
      const allCards = document.querySelectorAll('.card3')

      allCards.forEach((card) => {
        const blob = card.querySelector('.blob3') as HTMLElement
        const fblob = card.querySelector('.fakeblob3') as HTMLElement
        const rec = fblob.getBoundingClientRect()

        blob.style.opacity = '1'
        blob.animate(
          [
            {
              transform: `translate(${ev.clientX - rec.left - rec.width / 2}px, ${ev.clientY - rec.top - rec.height / 2}px)`,
            },
          ],
          {
            duration: 300,
            fill: 'forwards',
          }
        )
      })
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <div>
      <div className="container mx-auto w-[100%]">
        <h2 className="text-gradient3 text-[40px] max-md:text-2xl font-normal leading-relaxed text-center">
          Security
        </h2>
        <div className="w-[100%] flex items-center flex-col mx-auto justify-center">
          <div className="text-xl max-lg:text-lg text-shark-100 font-normal max-md:text-center">Assured by</div>
          <Link
            href={
              'https://app.hats.finance/audit-competitions/fenix-finance-0x83dbe5aa378f3ce160ed084daf85f621289fb92f/scope'
            }
            target="_blank"
          >
            <div className="card2 w-[292px] !my-4 max-sm:!my-2  h-[93px] z-50">
              <div className="inner2 py-5 px-10 max-sm:py-3 max-sm:px-5 flex items-center justify-between h-[100%]">
                <Image
                  src={'/static/images/landing/security/HatsFinance.svg'}
                  alt={'HatsFinance'}
                  width={200}
                  height={50}
                  className="mx-auto"
                />
              </div>
              <div className="blob2"></div>
              <div className="fakeblob2"></div>
            </div>
          </Link>
          <div className="text-xl max-lg:text-lg text-shark-100 font-normal my-10 max-md:text-center">
            Code Validated by Industry Leaders
          </div>
          <div className="flex gap-4 flex-wrap lg:flex-row flex-col items-center justify-center z-50 ">
            {brands.map((item, index) => (
              <Link href={item.link} target="_blank" key={index}>
                <div className="card3  h-[93px] cursor-pointer w-[292px] ">
                  <div className="inner3 py-8 px-5 flex items-center justify-between  h-full">
                    <Image src={item.image} alt={item.title} width={200} height={50} className="mx-auto" />
                  </div>
                  <div className="blob3"></div>
                  <div className="fakeblob3"></div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="relative">
        <div className="absolute -z-10  h-[500px] top-[-50rem] left-0 right-0 overflow-hidden">
          <div className="min-w-full min-h-full mx-auto relative">
            <ScrollParallax isAbsolutelyPositioned>
              <Image
                src="/static/images/landing/main/planet.svg"
                width={60}
                height={60}
                className="absolute top-[350px] left-[35rem] z-10 max-lg:hidden"
                alt="planet"
              />
              <Image
                src="/static/images/landing/main/planet.svg"
                width={60}
                height={60}
                className="absolute top-[800px] right-[200px] z-10 lg:hidden"
                alt="planet"
              />
              <Image
                src="/static/images/landing/main/planet.svg"
                width={60}
                height={60}
                className="absolute top-[100px] left-0 z-10 lg:hidden"
                alt="planet"
              />
            </ScrollParallax>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Security
