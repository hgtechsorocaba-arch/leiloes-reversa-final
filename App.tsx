import React, { useState, useEffect } from 'react';
import { Auction, Bid, CreateAuctionData, AuctionStatus, User, UserRole, UserStatus, Banner } from './types';
import { INITIAL_AUCTIONS, INITIAL_USERS, INITIAL_BANNERS, APP_NAME } from './constants';
import { AuctionCard } from './components/AuctionCard';
import { AuctionDetail } from './components/AuctionDetail';
import { CreateAuctionModal } from './components/CreateAuctionModal';
import { RegistrationModal } from './components/RegistrationModal';
import { LoginModal } from './components/LoginModal';
import { BannerCarousel } from './components/BannerCarousel';
import { CookieConsent } from './components/CookieConsent';
import { BannerModal } from './components/BannerModal';
import { LogoModal } from './components/LogoModal';
import { Footer } from './components/Footer';
import { EmptyState } from './components/EmptyState';
import { InfoPage, InfoPageType } from './components/InfoPage';
import { ReceiptModal } from './components/ReceiptModal';
import { Gavel, PlusCircle, LogOut, Shield, Settings } from 'lucide-react';

const App: React.FC = () => {
  const [auctions, setAuctions] = useState<Auction[]>(() => {
    const saved = localStorage.getItem('reversa_auctions');
    return saved ? JSON.parse(saved) : INITIAL_AUCTIONS;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('reversa_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [banners, setBanners] = useState<Banner[]>(() => {
    const saved = localStorage.getItem('reversa_banners');
    return saved ? JSON.parse(saved) : INITIAL_BANNERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('reversa_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [activeView, setActiveView] = useState<'HOME' | 'ADMIN' | 'DETAIL' | 'INFO'>('HOME');
  const [infoPageType, setInfoPageType] = useState<InfoPageType>('ABOUT');
  const [selectedAuctionId, setSelectedAuctionId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'ABERTOS' | 'FINALIZADOS'>('ABERTOS');
  
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
  const [receiptData, setReceiptData] = useState<{ auction: Auction, winner: User, bid: Bid } | null>(null);
  const [customLogo, setCustomLogo] = useState<string | null>(localStorage.getItem('reversa_custom_logo'));
  
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    localStorage.setItem('reversa_auctions', JSON.stringify(auctions));
    localStorage.setItem('reversa_users', JSON.stringify(users));
    localStorage.setItem('reversa_current_user', JSON.stringify(currentUser));
  }, [auctions, users, currentUser]);

  const handleLogin = (cpf: string, pass: string) => {
    const user = users.find(u => 
      (u.documents.cpf.replace(/\D/g, '') === cpf.replace(/\D/g, '') || u.documents.cpf === cpf) && 
      u.password === pass
    );
    if (user) {
      setCurrentUser(user);
      setIsLoginModalOpen(false);
    } else {
      alert("Credenciais inválidas.");
    }
  };

  const handlePlaceBid = (amount: number) => {
    if (!selectedAuctionId || !currentUser) return;
    setAuctions(prev => prev.map(auc => {
      if (auc.id === selectedAuctionId) {
        const newBid: Bid = {
          id: Math.random().toString(36).substr(2, 9),
          auctionId: auc.id,
          bidderId: currentUser.id,
          bidderName: currentUser.name,
          amount,
          timestamp: new Date()
        };
        return { ...auc, currentBid: amount, bids: [newBid, ...auc.bids] };
      }
      return auc;
    }));
  };

  const handleAuctionClick = (id: string) => {
    const auction = auctions.find(a => a.id === id);
    if (!auction) return;
    const isEnded = new Date(auction.endsAt) < new Date();
    if (isEnded && currentUser && auction.bids.length > 0 && auction.bids[0].bidderId === currentUser.id) {
      setReceiptData({ auction, winner: currentUser, bid: auction.bids[0] });
    } else {
      setSelectedAuctionId(id);
      setActiveView('DETAIL');
    }
  };

  const filteredAuctions = auctions.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase()) || a.lotCode.toLowerCase().includes(searchTerm.toLowerCase());
    const isAuctionEnded = new Date(a.endsAt) < new Date();
    const matchesTab = activeTab === 'ABERTOS' ? !isAuctionEnded : isAuctionEnded;
    return matchesSearch && matchesTab;
  });

  const selectedAuction = auctions.find(a => a.id === selectedAuctionId);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      <nav className="bg-white/80 backdrop-blur-xl border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div onClick={() => { setActiveView('HOME'); setSelectedAuctionId(null); }} className="flex items-center gap-3 cursor-pointer">
            <div className="bg-indigo-600 p-2.5 rounded-xl">
              {customLogo ? <img src={customLogo} className="w-6 h-6 object-contain filter brightness-0 invert" alt="Logo" /> : <Gavel className="text-white" size={22} />}
            </div>
            <span className="font-black text-2xl tracking-tighter">REVERSA</span>
          </div>
          <div className="flex items-center gap-4">
            {currentUser ? (
              <div className="flex items-center gap-3">
                <button onClick={() => setCurrentUser(null)} className="p-3 text-rose-500 rounded-xl hover:bg-rose-50"><LogOut size={20}/></button>
              </div>
            ) : (
              <button onClick={() => setIsLoginModalOpen(true)} className="bg-indigo-600 text-white px-6 py-3 rounded-xl text-xs font-black uppercase">Entrar</button>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-grow container mx-auto px-4 py-8">
        {activeView === 'HOME' && (
          <div className="space-y-12">
            <BannerCarousel banners={banners} onRegisterClick={() => setIsRegisterModalOpen(true)} showButton={!currentUser} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredAuctions.map(auc => <AuctionCard key={auc.id} auction={auc} onClick={handleAuctionClick} />)}
            </div>
          </div>
        )}
        {activeView === 'DETAIL' && selectedAuction && (
          <AuctionDetail auction={selectedAuction} currentUser={currentUser} onBack={() => setActiveView('HOME')} onPlaceBid={handlePlaceBid} />
        )}
      </main>

      <Footer onLogoClick={() => setActiveView('HOME')} onInfoClick={(type) => { setInfoPageType(type); setActiveView('INFO'); }} />
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} onLogin={handleLogin} />
      <RegistrationModal isOpen={isRegisterModalOpen} onClose={() => setIsRegisterModalOpen(false)} onRegister={(u) => setUsers([...users, u])} />
      <CookieConsent />
    </div>
  );
};

export default App;
