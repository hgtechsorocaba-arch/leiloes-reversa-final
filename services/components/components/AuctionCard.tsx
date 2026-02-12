
import React, { useEffect, useState } from 'react';
import { Auction } from '../types';
import { Clock, Tag, Box, ArrowUpRight } from 'lucide-react';

interface AuctionCardProps {
  auction: Auction;
  onClick: (id: string) => void;
}

export const AuctionCard: React.FC<AuctionCardProps> = ({ auction, onClick }) => {
  const endsAtDate = new Date(auction.endsAt);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const diff = endsAtDate.getTime() - new Date().getTime();
      return Math.max(0, diff);
    };

    setTimeLeft(calculateTimeLeft());
    const interval = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(interval);
  }, [auction.endsAt]);

  const formatTimeLeft = (ms: number) => {
    const s = Math.floor(ms / 1000);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const isEnded = timeLeft === 0;
  const isUrgent = !isEnded && timeLeft < 3600000; // Menos de 1 hora

  const formatCurrency = (val: number | null) => 
    (val || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div 
      onClick={() => onClick(auction.id)}
      className="group bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 cursor-pointer overflow-hidden flex flex-col h-full"
    >
      {/* Imagem e Badges */}
      <div className="relative h-56 overflow-hidden bg-slate-100">
        <img 
          src={auction.imageUrls[0]} 
          alt={auction.title} 
          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${isEnded ? 'grayscale' : ''}`}
        />
        
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-slate-900 border border-slate-200 shadow-sm">
            {auction.lotCode}
          </span>
          <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg shadow-indigo-200">
            {auction.category}
          </span>
        </div>

        {isEnded && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-white text-slate-900 px-6 py-2 rounded-full font-black uppercase tracking-widest text-xs shadow-2xl">
              Arrematado
            </span>
          </div>
        )}
      </div>

      {/* Conteúdo */}
      <div className="p-6 flex flex-col flex-grow space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <Tag size={12} className="text-indigo-500" />
            <span>{auction.condition}</span>
          </div>
          <h3 className="text-lg font-black text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors line-clamp-2">
            {auction.title}
          </h3>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-50">
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Lance Atual</p>
            <p className="text-lg font-black text-slate-900 tracking-tighter">
              {formatCurrency(auction.currentBid || auction.startingPrice)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Itens</p>
            <p className="text-sm font-bold text-slate-700 flex items-center justify-end gap-1">
              <Box size={14} /> {auction.itemCount}
            </p>
          </div>
        </div>

        {/* Footer do Card */}
        <div className="pt-2 flex items-center justify-between">
          <div className={`flex items-center gap-2 ${isUrgent ? 'text-rose-500' : 'text-slate-500'}`}>
            <Clock size={16} className={isUrgent ? 'animate-pulse' : ''} />
            <span className="text-sm font-black tracking-tighter">
              {isEnded ? "ENCERRADO" : formatTimeLeft(timeLeft)}
            </span>
          </div>
          
          <button className={`p-3 rounded-xl transition-all ${isEnded ? 'bg-slate-100 text-slate-400' : 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-indigo-100'}`}>
            <ArrowUpRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
