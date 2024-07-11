'use client'

import '@/src/assets/styles/globals.css'
import '@/src/assets/styles/icons.css'

import '@rainbow-me/rainbowkit/styles.css'
import { Space_Grotesk } from "next/font/google";
import Head from 'next/head'
import { Analytics } from '@vercel/analytics/react'

import Footer from '@/src/components/Common/Layout/FooterV2'
import Sidebar from '@/src/components/Common/Layout/Sidebar'
import Header from '@/src/components/Common/Layout/Header'
import MobileHeader from '@/src/components/Common/Layout/Header/Mobile'
// import RedirectHandler from '@/src/library/hooks/RedirectHandler'
import { GoogleAnalytics } from '@next/third-parties/google'

import { getDefaultConfig, getDefaultWallets, midnightTheme, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import {
  argentWallet,
  coinbaseWallet,
  ledgerWallet,
  metaMaskWallet,
  rabbyWallet,
  rainbowWallet,
  trustWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import dynamic from 'next/dynamic'
import { Provider as ReduxProvider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { createConfig, fallback, http, WagmiProvider } from 'wagmi'
import { blast, blastSepolia, holesky, polygon } from 'wagmi/chains'
import store, { persistor } from '../state'
import Slippage from '../components/Modals/Slippage'
import { Toaster } from 'react-hot-toast'
import NotificationFeed from '../components/Common/Notification/NotificationFeed'
import useIsLandingPage from '../library/hooks/isLandingPage'
import HeaderV2 from '../components/Common/Layout/HeaderV2'

const SpaceGroteskFont = Space_Grotesk({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
});

const { wallets } = getDefaultWallets()
export const configwallets = createConfig({
  chains: [blast, blastSepolia],
  transports: {
    [blast.id]: fallback([
      http('https://ancient-powerful-emerald.blast-sepolia.quiknode.pro/e93288d60f12f4fbb136d310242ac46df10b8f74/'),
      http('https://rpc.blast.io'),
    ]),
    [blastSepolia.id]: fallback([
      http('https://ancient-powerful-emerald.blast-mainnet.quiknode.pro/e93288d60f12f4fbb136d310242ac46df10b8f74/'),
      http('https://sepolia.blast.io'),
    ]),
  },
})

export const wagmiConfig = getDefaultConfig({
  appName: 'Fenix Finance',
  projectId: '1c866fe90ffb8663a08a1b7412f1b8b4',
  // transports: {
  //   [blast.id]: fallback([
  //     http('https://ancient-powerful-emerald.blast-sepolia.quiknode.pro/e93288d60f12f4fbb136d310242ac46df10b8f74/'),
  //     http('https://rpc.blast.io'),
  //   ]),
  //   [blastSepolia.id]: fallback([
  //     http('https://ancient-powerful-emerald.blast-mainnet.quiknode.pro/e93288d60f12f4fbb136d310242ac46df10b8f74/'),
  //     http('https://sepolia.blast.io'),
  //   ]),
  // },
  chains: [
    {
      ...blast,
      iconUrl: '/static/chains/blast.png',
    },
    {
      ...blastSepolia,
      iconUrl: '/static/chains/blast.png',
    },
    // ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [blastSepolia] : []),
  ],
  wallets: [
    {
      groupName: 'Popular',
      wallets: [metaMaskWallet, rabbyWallet, walletConnectWallet, coinbaseWallet],
    },
    {
      groupName: 'Other',
      wallets: [trustWallet, ledgerWallet, argentWallet, rainbowWallet],
    },
  ],
  ssr: true,
})

const queryClient = new QueryClient()

const Updaters = dynamic(() => import('@/src/state/updater'), { ssr: false })
// Todas las clases que tienen como condicion "pathname === '/' son tomadas en cuenta para el landing page de forma que no modifiquen estilos importantes en el resto de la aplicación"
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const isLandingPage = useIsLandingPage()

  return (
    <html lang="en">
      <Analytics />
      <GoogleAnalytics gaId="G-1MMRJBQK96" />
      <Head>
        <meta name="google-site-verification" content="mn5jWOAzNqP937Tzbl_Rvtnh0aswaep1gUvODRvTZp4" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body className={`${SpaceGroteskFont.className} ${isLandingPage ? 'bg-cover is-landing-page ' : 'is-product-page'}`}>
        <ReduxProvider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <WagmiProvider config={wagmiConfig}>
              <QueryClientProvider client={queryClient}>
                <RainbowKitProvider
                  initialChain={blast.id}
                  theme={midnightTheme({
                    accentColor:
                      'linear-gradient(90deg, rgba(254, 94, 53, 0.80) 10.49%, rgba(246, 119, 2, 0.80) 92.04%, rgba(255, 239, 118, 0.80) 158.76%)',
                    accentColorForeground: 'white',
                    fontStack: 'system',
                    overlayBlur: 'small',
                  })}
                >
                  <div className="flex flex-col min-h-screen">
                    <Updaters />
                    <HeaderV2 />
                    <Slippage />
                    <Toaster />
                    <NotificationFeed />
                    <MobileHeader />
                    <Sidebar />
                    <div className="flex-1 main-content">
                      {/* {children} */}
                    </div>
                    <div className="mt-auto">
                      <Footer />
                    </div>
                  </div>
                </RainbowKitProvider>
              </QueryClientProvider>
            </WagmiProvider>
          </PersistGate>
        </ReduxProvider>
      </body>
    </html>
  )
}
