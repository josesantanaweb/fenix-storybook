/* eslint-disable max-len */
import Image from 'next/image'
import ARTICLES from './data'
import React from 'react'
const Articles = () => {
  return (
    <div className="relative pb-[100px] xl:pb-[200px]">
      <div className="container relative z-10 flex flex-col items-center justify-center gap-5 xl:gap-10 xl:flex-row">
        <div className="flex max-lg:flex-col  xl:flex-col gap-4 xl:gap-8 max-xl:justify-between max-xl:w-full">
          {ARTICLES.map((article, index) => {
            return (
              <div key={index} className="article-box ">
                <Image
                  src={article.imageDesktop}
                  alt="img"
                  width={190}
                  height={160}
                  className="w-full                   xl:w-[190px]
                  hidden sm:block 
                  xl:h-[160px] rounded-lg 
                  max-h-[159px] max-lg:mx-auto object-contain"
                />
                <Image
                  src={article.imageMobile}
                  alt="img"
                  width={190}
                  height={160}
                  className="w-full sm:hidden rounded-lg max-h-[159px] max-lg:mx-auto object-contain"
                />
                <div className="flex flex-col">
                  <h1 className="xl:text-xl text-lg font-medium text-gradient">{article.title}</h1>
                  <p className="xl:text-sm text-xs font-light text-white xl:line-clamp-none">{article.info}</p>
                </div>
              </div>
            )
          })}
        </div>
        <div className="article-big-box">
          <h1 className="mb-3 text-lg xl:text-xl font-medium text-gradient">Liquidity Providers</h1>
          <p className="mb-5 xl:mb-10 text-xs lg:text-sm text-white font-light">
            Competitive farming means LPs are encouraged to tighten their ranges to earn more FNX emissions according to
            fees generated.
            <br />
            <br />
            Professional LPs can enjoy fully customisable manual ranges and security provided by Algebra pools and fully
            battle-tested Solidly pools.
            <br />
            <br />
            Fenix is partnering with leading liquidity managers to make providing liquidity as easy as depositing with
            one token and sitting back to earn FNX emissions as your position is automatically managed.
          </p>
          <div className="w-full xl:h-[300px]">
            <Image
              src="/static/images/landing/articles/liquidity.svg"
              alt="img"
              width={600}
              height={300}
              className="w-full hidden sm:block h-full rounded-lg"
            />
            <Image
              src="/static/images/landing/articles/liquidity.svg"
              alt="img"
              width={190}
              height={160}
              className="w-full sm:hidden rounded-lg"
            />
          </div>
        </div>
      </div>
      <div className="max-w-[1932px] max-h-[1060px]   absolute  bottom-[-280px]  mix-blend-lighten overflow-hidden">
        <Image
          src="/static/images/landing/articles/world.svg"
          alt="img"
          width={1946}
          height={1085}
          className="w-[1932px] h-[1208px] object-contain"
        />
      </div>
    </div>
  )
}

export default Articles
