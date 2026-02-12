
import React, { useState, useEffect } from 'react';
import { Auction, User, UserRole, UserStatus, CreateAuctionData } from './types';
import { INITIAL_AUCTIONS, INITIAL_USERS, INITIAL_BANNERS } from './constants';
import { AuctionCard } from './components/AuctionCard';
import { AuctionDetail } from './components/AuctionDetail';
import { BannerCarousel } from './components/BannerCarousel';
import { Footer } from './components/Footer';
import { LoginModal } from './components/LoginModal';
import { RegistrationModal } from './components/RegistrationModal';
import { CreateAuctionModal } from './components/CreateAuctionModal';
import { CookieConsent } from './components/CookieConsent';
import { InfoPage, InfoPageType } from './components/InfoPage';
import { Gavel, Plus, LogOut, User as UserIcon } from 'lucide-react';

const App: React.FC = () => {
  // Estados de Dados
  const [auctions, setAuctions] = useState<Auction[]>(() => {
    const saved = localStorage.getItem('reversa_auctions');
    return saved ? JSON.parse(saved) : INITIAL_AUCTIONS;
  });
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Estados de Navegação
  const [activeView, setActiveView] = useState<'HOME' | 'DETAIL' | 'INFO'>('HOME');
  const [infoType, setInfoType] = useState<InfoPageType>('ABOUT');
  const [selectedAuctionId, setSelectedAuctionId] = useState<string | null>(null);

  // Estados de Modais
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('reversa_auctions', JSON.stringify(auctions));
  }, [auctions]);

  const handleLogin = (cpf: string, pass: string) => {
    const user = users.find(u => (u.documents.cpf === cpf || u.name === cpf) && u.password === pass);
    if (user) {
      setCurrentUser(user);
      setIsLoginOpen(false);
    } else {
      alert("Credenciais inválidas. Use ADM / Sempre2026@@ para testar.");
    }
  };

  const handleRegister = (newUser: User) => {
    setUsers(prev => [...prev, newUser]);
    alert("Cadastro enviado! Aguarde aprovação administrativa.");
  };

  const handleCreateAuction = (data: CreateAuctionData) => {
    const newAuction: Auction = {
      id: Math.random().toString(36).substr(2, 9),
      lotCode: `REV-${Math.floor(1000 + Math.random() * 9000)}`,
      title: data.title,
      description: data.description,
      category: data.category,
      condition: data.condition,
      origin: data.origin,
      itemCount: data.itemCount,
      startingPrice: data.startingPrice,
      currentBid: null,
      endsAt: new Date(Date.now() + data.durationInHours * 60 * 60 * 1000),
      status: 'ACTIVE' as any,
      bids: [],
      imageUrls: data.imageUrls
    };
    setAuctions(prev => [newAuction, ...prev]);
  };

  const handlePlaceBid = (amount: number) => {
    if (!currentUser) {
      setIsLoginOpen(true);
      return;
    }
    if (currentUser.status !== 'APPROVED') {
      alert("Sua conta está em análise. Você ainda não pode dar lances.");
      return;
    }
    setAuctions(prev => prev.map(auc => {
      if (auc.id === selectedAuctionId) {
        return { ...auc, currentBid: amount };
      }
      return auc;
    }));
  };

  const navigateToInfo = (type: InfoPageType) => {
    setInfoType(type);
    setActiveView('INFO');
    window.scrollTo(0, 0);
  };

  const selectedAuction = auctions.find(a => a.id === selectedAuctionId);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <nav className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div onClick={() => setActiveView('HOME')} className="flex items-center gap-2 cursor-pointer group">
            <div className="bg-indigo-600 p-2 rounded-xl group-hover:rotate-12 transition-transform">
              <Gavel className="text-white" size={24} />
            </div>
            <span className="font-black text-2xl tracking-tighter text-slate-900 uppercase">REVERSA</span>
          </div>

          <div className="flex items-center gap-4">
            {currentUser ? (
              <div className="flex items-center gap-4">
                <div className="hidden md:flex flex-col items-end">
                  <span className="text-sm font-bold text-slate-900">{currentUser.name}</span>
                  <span className="text-[10px] font-black uppercase text-indigo-600 tracking-widest">
                    {currentUser.role === 'ADMIN' ? 'Admin' : 'Cliente'}
                  </span>
                </div>
                <button onClick={() => setCurrentUser(null)} className="p-2 hover:bg-red-50 text-red-500 rounded-full"><LogOut size={20} /></button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button onClick={() => setIsLoginOpen(true)} className="text-slate-600 font-bold text-sm hover:text-indigo-600">Entrar</button>
                <button onClick={() => setIsRegisterOpen(true)} className="bg-indigo-600 text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all">Cadastrar</button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        {activeView === 'HOME' && (
          <div className="container mx-auto px-4 py-8 space-y-12">
            <BannerCarousel banners={INITIAL_BANNERS} onRegisterClick={() => setIsRegisterOpen(true)} showButton={!currentUser} />
            
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Oportunidades</h2>
                <p className="text-slate-500 font-medium">Lotes exclusivos de logística reversa.</p>
              </div>
              {currentUser?.role === 'ADMIN' && (
                <button onClick={() => setIsCreateModalOpen(true)} className="bg-slate-900 text-white p-4 rounded-2xl flex items-center gap-2 font-bold hover:bg-indigo-600 transition-all shadow-xl">
                  <Plus size={20} /> <span className="hidden md:inline">Novo Lote</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {auctions.map(auc => (
                <AuctionCard key={auc.id} auction={auc} onClick={(id) => { setSelectedAuctionId(id); setActiveView('DETAIL'); }} />
              ))}
            </div>
          </div>
        )}

        {activeView === 'DETAIL' && selectedAuction && (
          <div className="container mx-auto px-4 py-8">
            <AuctionDetail auction={selectedAuction} currentUser={currentUser} onBack={() => setActiveView('HOME')} onPlaceBid={handlePlaceBid} />
          </div>
        )}

        {activeView === 'INFO' && (
          <InfoPage type={infoType} onBack={() => setActiveView('HOME')} />
        )}
      </main>

      <Footer onLogoClick={() => setActiveView('HOME')} onInfoClick={navigateToInfo} />

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} onLogin={handleLogin} />
      <RegistrationModal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} onRegister={handleRegister} />
      <CreateAuctionModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onSubmit={handleCreateAuction} />
      <CookieConsent />
    </div>
  );
};

export default App;
