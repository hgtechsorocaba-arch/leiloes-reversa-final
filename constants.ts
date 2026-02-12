import { Auction, AuctionStatus, User, UserRole, UserStatus, Banner } from './types';

export const APP_NAME = "Leilões Reversa";

export const CATEGORIES = [
  "Lote Misto", "Smartphones & Tablets", "Informática & Periféricos",
  "Eletrodomésticos", "TV, Áudio & Vídeo", "Games & Consoles",
  "Móveis", "Ferramentas", "Moda & Acessórios", "Veículos & Peças"
];

export const LOT_CONDITIONS = [
  "Novo (Lacrado)", "Open Box (Caixa Aberta)", "Caixa Amassada",
  "Usado (Bom Estado)", "Sucata (Para Peças)", "Recuperados"
];

export const LOT_ORIGINS = [
  "Devolução de Cliente", "Excedente de Estoque", "Leilão Judicial", "Salvado de Seguradora"
];

export const INITIAL_BANNERS: Banner[] = [
  {
    id: 'b1',
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?q=80&w=2070',
    title: 'Oportunidades em Logística Reversa',
    subtitle: 'Lotes exclusivos de devoluções de grandes e-commerces.'
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'admin',
    name: 'Administrador',
    email: 'admin@reversa.com',
    password: 'Sempre2026@@',
    role: UserRole.ADMIN,
    status: UserStatus.APPROVED,
    documents: { cpf: 'ADM', address: '', hasSelfie: true },
    joinedAt: new Date()
  }
];

export const INITIAL_AUCTIONS: Auction[] = [
  {
    id: 'lot-001',
    lotCode: 'REV-1042',
    title: 'Lote 15x Smartphones Samsung & Motorola',
    description: 'Lote contendo 15 aparelhos celulares diversos. Ideal para manutenção.',
    category: 'Smartphones & Tablets',
    condition: 'No Estado',
    origin: 'Devolução de Cliente',
    itemCount: 15,
    startingPrice: 1500,
    currentBid: 3200,
    endsAt: new Date(Date.now() + 1000 * 60 * 60 * 48),
    status: AuctionStatus.ACTIVE,
    imageUrls: ['https://images.unsplash.com/photo-1592899677712-a5a254503484?q=80&w=800'],
    bids: []
  }
];
