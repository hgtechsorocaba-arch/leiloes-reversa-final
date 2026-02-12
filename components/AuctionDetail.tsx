import React, { useState, useEffect } from 'react';
import { Auction, Bid, User, AuctionStatus } from '../types';
import { Clock, ArrowLeft, Gavel, ShieldCheck, Info, Package, History, TrendingUp, AlertTriangle } from 'lucide-react';
import { FEE_RATES } from '../constants';

interface AuctionDetailProps {
  auction: Auction;
  currentUser: User | null;
  onBack: () => void;
  onPlaceBid: (amount: number) => void;
}

export const AuctionDetail: React.FC<AuctionDetailProps> = ({ auction, currentUser, onBack, onPlaceBid }) => {
  const [bidAmount, setBidAmount] = useState<number>(0);
  const [activeImage, setActiveImage] = useState(auction.imageUrls[0]);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const diff = new Date(auction.endsAt).getTime() - new Date().getTime();
      setTimeLeft(Math.max(0, diff));
    }, 1000);
    return () => clearInterval(interval);
  }, [auction.endsAt]);

  const minBid = (auction.currentBid || auction.startingPrice) + 50;
  
  useEffect(() => {
    setBidAmount(minBid);
  }, [minBid]);

  const formatCurrency = (val: number) => val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const formatTime = (ms: number) => {
    const s = Math.floor(ms / 1000);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const handleBidSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      alert("Você precisa estar logado para dar um lance.");
      return;
    }
    if (currentUser.status !== 'APPROVED') {
      alert("Sua conta ainda não foi aprovada para realizar lances.");
      return;
    }
    if (bidAmount < minBid) {
      alert(`O lance mínimo é ${formatCurrency(minBid)}`);
      return;
    }
    onPlaceBid(bidAmount);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-in fade-in duration-500">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold mb-8 transition-colors group">
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Voltar para Vitrine
      </button>

      <div className="grid lg:grid-cols-12 gap-12">
        {/* Coluna Esquerda: Imagens e Info */}
        <div className="lg:col-span-7 space-y-8">
          <div className="space-y-4">
            <div className="aspect-video rounded-[2.5rem] overflow-hidden bg-slate-100 border-4 border-white shadow-2xl relative">
              <img src={activeImage} className="w-full h-full object-cover" alt={auction.title} />
              <div className="absolute top-6 left-6 flex gap-2">
                <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-900 border border-slate-200 shadow-sm">{auction.lotCode}</span>
                <span className="bg-indigo-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-200">{auction.category}</span>
              </div>
            </div>
            
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {auction.imageUrls.map((url, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveImage(url)}
                  className={`flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all ${activeImage === url ? 'border-indigo-600 scale-105 shadow-lg' : 'border-transparent grayscale opacity-50 hover:grayscale-0 hover:opacity-100'}`}
                >
                  <img src={url} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter mb-4">{auction.title}</h1>
            <p className="text-slate-500 leading-relaxed mb-8 font-medium">{auction.description}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-slate-50">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Itens</p>
                <p className="text-sm font-bold text-slate-800 flex items-center gap-1"><Package size={14}/> {auction.itemCount} Unidades</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Estado</p>
                <p className="text-sm font-bold text-slate-800">{auction.condition}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Origem</p>
                <p className="text-sm font-bold text-slate-800">{auction.origin}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                <p className="text-sm font-bold text-emerald-600 flex items-center gap-1"><TrendingUp size={14}/> Aberto</p>
              </div>
            </div>
          </div>
        </div>

        {/* Coluna Direita: Lances */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Gavel size={120} />
            </div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-10">
                <div>
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-1">Cronômetro Live</p>
                  <div className="flex items-center gap-3 text-4xl font-black tracking-tighter">
                    <Clock className="text-indigo-500" />
                    <span>{formatTime(timeLeft)}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Lances</p>
                  <p className="text-2xl font-black">{auction.bids.length}</p>
                </div>
              </div>

              <div className="space-y-1 mb-10">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Maior Lance Atual</p>
                <p className="text-5xl font-black text-indigo-400 tracking-tighter">{formatCurrency(auction.currentBid || auction.startingPrice)}</p>
                <p className="text-xs text-slate-500 font-bold">Lance Inicial: {formatCurrency(auction.startingPrice)}</p>
              </div>

              <form onSubmit={handleBidSubmit} className="space-y-4">
                <div className="relative group">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-slate-500">R$</span>
                  <input 
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-xl font-bold focus:bg-white/10 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
                <button 
                  type="submit"
                  disabled={timeLeft === 0}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-800 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-indigo-900/40 active:scale-95 transition-all"
                >
                  Confirmar Lance
                </button>
              </form>

              <div className="mt-8 p-6 bg-white/5 rounded-2xl border border-white/5 space-y-4">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-400">Comissão Leiloeiro (5%)</span>
                  <span>{formatCurrency(bidAmount * 0.05)}</span>
                </div>
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-400">Taxa Administrativa (2%)</span>
                  <span>{formatCurrency(bidAmount * 0.02)}</span>
                </div>
                <div className="pt-4 border-t border-white/5 flex justify-between font-black text-indigo-400">
                  <span>INVESTIMENTO TOTAL</span>
                  <span>{formatCurrency(bidAmount * 1.07)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
