export interface ConnectToWalletButtonProps {
  labelWallet?: string;
  className?: string;
  onClick: () => void;
  disabled?: boolean;
  walletConfig?: {
    needWalletConnected: boolean
    needSupportedChain: boolean
  }
}
