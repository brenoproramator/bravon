// Conteúdo da BRAVON — marca fictícia, dados ilustrativos.

export const NAV = [
  { id: 'sobre', label: 'A casa' },
  { id: 'servicos', label: 'Serviços' },
  { id: 'galeria', label: 'Galeria' },
  { id: 'equipe', label: 'Equipe' },
  { id: 'contato', label: 'Contato' }
];

export const SERVICES = [
  {
    id: 'corte',
    name: 'Corte masculino',
    price: 65,
    duration: 45,
    image: 'degrade',
    text: 'Tesoura, máquina e navalha no ponto certo. Do clássico ao degradê navalhado.',
    includes: { lavagem: true, toalha: false, navalha: true, finalizacao: true }
  },
  {
    id: 'barba',
    name: 'Barba',
    price: 45,
    duration: 30,
    image: 'g-barba-pb',
    text: 'Toalha quente, navalha e óleo. Contorno desenhado para o formato do seu rosto.',
    includes: { lavagem: false, toalha: true, navalha: true, finalizacao: true }
  },
  {
    id: 'combo',
    name: 'Corte + barba',
    price: 95,
    duration: 75,
    image: 'g-tesoura',
    featured: true,
    text: 'O ritual completo, sem pressa. Você sai pronto para qualquer compromisso.',
    includes: { lavagem: true, toalha: true, navalha: true, finalizacao: true }
  },
  {
    id: 'acabamento',
    name: 'Acabamento',
    price: 25,
    duration: 15,
    image: 'g-desenho',
    text: 'Pezinho, contorno e sobrancelha para manter o corte em dia entre as visitas.',
    includes: { lavagem: false, toalha: false, navalha: true, finalizacao: false }
  }
];

export const INCLUDES = [
  { key: 'lavagem', label: 'Lavagem' },
  { key: 'toalha', label: 'Toalha quente' },
  { key: 'navalha', label: 'Navalha' },
  { key: 'finalizacao', label: 'Finalização' }
];

export const TEAM = [
  {
    id: 'rafael',
    name: 'Rafael Duarte',
    role: 'Degradê & cortes clássicos',
    years: '11 anos de cadeira',
    image: 'equipe-rafael',
    bio: 'Obcecado por transições limpas. Mede o degradê no olho e confere na luz.'
  },
  {
    id: 'otavio',
    name: 'Otávio Brandão',
    role: 'Barba & navalha',
    years: '14 anos de cadeira',
    image: 'equipe-otavio',
    bio: 'Mestre da toalha quente. Desenha o contorno da barba à mão livre.'
  },
  {
    id: 'caio',
    name: 'Caio Menezes',
    role: 'Texturas & cortes modernos',
    years: '7 anos de cadeira',
    image: 'equipe-caio',
    bio: 'Traz o que está na rua para a cadeira, sem exagero e sem perder a forma.'
  }
];

export const TESTIMONIALS = [
  {
    quote: 'Saí com o corte que eu nem sabia explicar. O Rafael entendeu de primeira.',
    name: 'Lucas M.',
    detail: 'Corte masculino'
  },
  {
    quote: 'A toalha quente da barba já vale a visita. Ambiente calmo, ninguém com pressa.',
    name: 'André P.',
    detail: 'Barba'
  },
  {
    quote: 'Pontual, preciso e com café bom. Virei cliente de quinze em quinze dias.',
    name: 'Bruno S.',
    detail: 'Corte + barba'
  }
];

export const GALLERY = [
  { image: 'g-maquina', alt: 'Barbeiro com braços tatuados passando a máquina na nuca de um cliente', caption: 'Nuca limpa, linha firme' },
  { image: 'g-barba-pb', alt: 'Barba sendo aparada com navalha, em preto e branco', caption: 'Navalha na barba' },
  { image: 'g-desenho', alt: 'Close de um degradê com risco desenhado na lateral da cabeça', caption: 'Risco à mão' },
  { image: 'g-estudio', alt: 'Barbeiro de boné finalizando o corte de um cliente em um salão iluminado', caption: 'Acabamento no detalhe' },
  { image: 'g-tesoura', alt: 'Barbeiro cortando o topo do cabelo de um cliente com tesoura', caption: 'Tesoura no topo' },
  { image: 'g-ambiente', alt: 'Cadeira de barbeiro vintage em couro vermelho no salão', caption: 'Cadeira da casa' },
  { image: 'g-pente', alt: 'Barbeiro usando pente e tesoura no cabelo de um cliente de barba', caption: 'Pente e tesoura' },
  { image: 'g-cabelo-longo', alt: 'Pente de madeira penteando cabelo comprido para trás', caption: 'Penteado para trás' }
];

export const RITUAL = [
  {
    image: 'ritual-navalha',
    alt: 'Cliente reclinado na cadeira enquanto o barbeiro passa a navalha no pescoço',
    kicker: 'Passo 01',
    title: 'Conversa antes do corte',
    text: 'Cinco minutos para entender seu cabelo, sua rotina e o que você quer ver no espelho.'
  },
  {
    image: 'ritual-espuma',
    alt: 'Barbeiro aplicando espuma na barba com pincel, em preto e branco',
    kicker: 'Passo 02',
    title: 'Toalha quente, navalha afiada',
    text: 'Pele preparada, lâmina nova a cada cliente e mão firme do início ao fim.'
  },
  {
    image: 'ritual-ferramentas',
    alt: 'Máquina, tesoura, pente e pomadas organizados sobre uma bancada de madeira',
    kicker: 'Passo 03',
    title: 'Finalização com assinatura',
    text: 'Produto certo para o seu fio e uma dica de como manter o corte em casa.'
  }
];

// Ter–Sex 9h–20h, Sáb 8h–18h. Dom e Seg fechado.
export const HOURS = [
  { days: 'Terça a sexta', time: '9h às 20h' },
  { days: 'Sábado', time: '8h às 18h' },
  { days: 'Domingo e segunda', time: 'Fechado' }
];

export const OPENING = {
  2: [9, 20],
  3: [9, 20],
  4: [9, 20],
  5: [9, 20],
  6: [8, 18]
};

export const brl = value =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 });
