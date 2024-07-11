'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Address, isAddress } from 'viem';
import { useAccount } from 'wagmi';

// hooks
import { useSetToken0, useSetToken1, useToken0, useToken1 } from '@/src/state/liquidity/hooks';

// helpers
import { fetchTokens } from '@/src/library/common/getAvailableTokens';

// models
import { IToken } from '@/src/library/types';
import { V2PairId } from '@/src/state/liquidity/types';

// components
import Manage from '@/src/components/Liquidity/Manage/Panel/Liquidity';

// custom models
type DepositType = (typeof DepositTypeValues)[keyof typeof DepositTypeValues]

// custom constants
const DepositTypeValues = {
  VOLATILE: 'VOLATILE',
  STABLE: 'STABLE',
  CONCENTRATED_AUTOMATIC: 'CONCENTRATED_AUTOMATIC',
  CONCENTRATED_MANUAL: 'CONCENTRATED_MANUAL',
};

// unused code is commented out
const Panel = () => {
  // common
  const searchParams = useSearchParams();
  const setToken0 = useSetToken0();
  const setToken1 = useSetToken1();
  const { chainId } = useAccount();
  // const token0 = useToken0();
  // const token1 = useToken1();
  // const router = useRouter();
  // const pathname = usePathname();

  // states
  const [defaultPairs, setDefaultPairs] = useState<Address[]>([]);
  // const [depositType, setDepositType] = useState<DepositType>('VOLATILE');
  // const [defaultPairsTokens, setDefaultPairsTokens] = useState<IToken[]>([]);
  // const [pair, setPair] = useState<V2PairId>();

  // effects
  useEffect(() => {
    const searchParamToken0 = searchParams.get('token0');
    const searchParamToken1 = searchParams.get('token1');
    // const typeSearch = searchParams.get('type');

    if (searchParamToken0 && isAddress(searchParamToken0)) setToken0(searchParamToken0 as Address);
    if (searchParamToken1 && isAddress(searchParamToken1)) setToken1(searchParamToken1 as Address);

    // if (typeSearch && Object.values(DepositTypeValues).includes(typeSearch as DepositType)) {
    //   setDepositType(typeSearch as DepositType);
    // }
  }, []);

  useEffect(() => {
    const searchParamToken0 = searchParams.get('token0');
    const searchParamToken1 = searchParams.get('token1');
    // const typeSearch = searchParams.get('type');

    // if (typeSearch == 'CONCENTRATED_AUTOMATIC') setDepositType('CONCENTRATED_AUTOMATIC');
    // if (typeSearch == 'CONCENTRATED_MANUAL') setDepositType('CONCENTRATED_MANUAL');
    // if (typeSearch == 'STABLE') setDepositType('STABLE');
    // if (typeSearch == 'VOLATILE') setDepositType('VOLATILE');

    if (!isAddress(searchParamToken0!) || !isAddress(searchParamToken1!)) return;
    setDefaultPairs([searchParamToken0, searchParamToken1]);
  }, []);

  // useEffect(() => {
  //   const getList = async () => {
  //     try {
  //       if (chainId) {
  //         const responseData = await fetchTokens(chainId);
  //
  //         const parsedData = responseData.map((item: any) => {
  //           return {
  //             id: 0,
  //             name: item.basetoken.name,
  //             symbol: item.basetoken.symbol,
  //             address: item.basetoken.address,
  //             decimals: item.decimals,
  //             img: item.logourl,
  //             isCommon: item.common,
  //             price: parseFloat(item.priceUSD),
  //           };
  //         });
  //
  //         const newDefaultPairsTokens: [IToken, IToken] = [{} as IToken, {} as IToken];
  //         if (defaultPairs.length > 0) {
  //           parsedData.map((item: any) => {
  //             if (item.address.toLowerCase() == defaultPairs[0]?.toLowerCase()) newDefaultPairsTokens[0] = item;
  //             if (item.address.toLowerCase() == defaultPairs[1]?.toLowerCase()) newDefaultPairsTokens[1] = item;
  //           });
  //           setDefaultPairs([]);
  //         }
  //         setDefaultPairsTokens(newDefaultPairsTokens);
  //       }
  //     } catch (error) {
  //     }
  //   };
  //
  //   defaultPairs.length > 0 ? getList() : {};
  // }, [defaultPairs, chainId]);

  return (
    <section className="box-panel-trade">
      <div className="w-full flex flex-col xl:flex-row justify-between gap-12 items-center relative z-10">
        <div className="w-full items-center relative">
          <div className="flex items-center justify-between mb-[25px] font-semibold">
            <h1 className="text-lg md:text-xl text-white font-medium">Manage Position</h1>
            <div className="flex items-center gap-[13px]">
              <div className="flex items-center gap-[9px] h-10"></div>
              {/* <div className="w-[28px] h-[28px] md:w-[32px] md:h-[32px] p-2.5 border border-shark-200 bg-shark-300 bg-opacity-40 rounded-[10px] flex items-center justify-center">
                <span className="icon-cog text-white"></span>
              </div> */}
            </div>
          </div>

          <Manage />
        </div>
      </div>
    </section>
  );
};

export default Panel;
