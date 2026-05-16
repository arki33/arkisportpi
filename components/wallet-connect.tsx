'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePiAuth } from '@/contexts/pi-wallet-context';
import { useLanguage } from '@/contexts/language-context';
import { Wallet, LogOut, Check, AlertCircle, Loader } from 'lucide-react';

export default function WalletConnect() {
  const { t } = useLanguage();
  const { wallet, connectWallet, disconnectWallet, isLoading, error } = usePiAuth();
  const [username, setUsername] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    if (!username.trim() || !walletAddress.trim()) {
      return;
    }

    setIsConnecting(true);
    try {
      await connectWallet(username, walletAddress);
    } catch (err) {
      console.error('Connection failed:', err);
    } finally {
      setIsConnecting(false);
    }
  };

  if (wallet?.isConnected) {
    return (
      <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <Check className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Wallet Connected</h3>
              <p className="text-sm text-gray-600">Pi Network</p>
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="bg-white p-3 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Username</p>
            <p className="font-medium">{wallet.username}</p>
          </div>
          <div className="bg-white p-3 rounded-lg break-all">
            <p className="text-xs text-gray-500 mb-1">Wallet Address</p>
            <p className="font-mono text-sm">{wallet.walletAddress}</p>
          </div>
          <div className="bg-white p-3 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Balance</p>
            <p className="text-2xl font-bold text-green-600">{wallet.balance.toFixed(4)} π</p>
          </div>
        </div>

        <Button
          onClick={disconnectWallet}
          className="w-full bg-red-600 hover:bg-red-700 text-white"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Disconnect Wallet
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <Wallet className="w-6 h-6 text-primary" />
        <h3 className="font-bold text-lg">Connect Pi Wallet</h3>
      </div>

      <p className="text-sm text-muted-foreground mb-4">
        Connect your Pi Network account to start earning and receiving rewards.
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Pi Network Username</label>
          <Input
            placeholder="Enter your Pi username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isConnecting || isLoading}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Your unique Pi Network identifier
          </p>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Wallet Address</label>
          <Input
            placeholder="Enter your public wallet address"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            disabled={isConnecting || isLoading}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Your public Pi Network wallet address
          </p>
        </div>

        <Button
          onClick={handleConnect}
          disabled={isConnecting || isLoading || !username.trim() || !walletAddress.trim()}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {isConnecting || isLoading ? (
            <>
              <Loader className="w-4 h-4 mr-2 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Wallet className="w-4 h-4 mr-2" />
              Connect Wallet
            </>
          )}
        </Button>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-medium text-sm mb-2">How to connect:</h4>
        <ol className="text-xs space-y-1 text-gray-700">
          <li>1. Open your Pi Network app</li>
          <li>2. Go to Wallet section</li>
          <li>3. Copy your username and wallet address</li>
          <li>4. Paste them above and click Connect</li>
          <li>5. Your rewards will be sent directly to your wallet</li>
        </ol>
      </div>
    </Card>
  );
}
