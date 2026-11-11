import { useState, useEffect, useRef } from "react"
import logoImg from "./assets/logo-reconecta-clean.png"

function usePersist<T>(
  key: string,
  init: T,
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [val, setVal] = useState<T>(() => {
    try {
      const s = localStorage.getItem(key)
      if (!s) return init
      const parsed = JSON.parse(s)
      return parsed === null || parsed === undefined ? init : parsed
    } catch {
      return init
    }
  })
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(val))
    } catch {}
  }, [key, val])
  return [val, setVal]
}

type Screen = "login" | "home" | "explore" | "publish" | "requests" | "requestDetails" | "profile" | "details" | "transaction" | "chat" | "about" | "support"
type ItemStatus = "disponível" | "reservado" | "concluído" | "pausado"
type TxStatus = "pendente" | "negociação" | "acordo" | "entrega" | "concluída" | "cancelada"
interface Item {
  id: number
  name: string
  brand: string
  model: string
  category: string
  condition: string
  purpose: string
  price?: number
  description: string
  defect: string
  location: string
  distance: string
  status: ItemStatus
  image: string
  images?: string[]
  ownerId: number
  date: string
}
interface User {
  id: number
  name: string
  city: string
  avatar: string
  avatarUrl?: string
  email?: string
  reputation: number
  transactions: number
  memberSince: string
  bio: string
}
interface Tx {
  id: number
  itemId: number
  senderId: number
  receiverId: number
  status: TxStatus
  step: number
  date: string
}
interface Req {
  id: number
  title: string
  description: string
  category: string
  location: string
  userId: number
  date: string
}
interface Message {
  id: number
  from: number
  text: string
  time: string
  edited?: boolean
  deleted?: boolean
}
interface Conversation {
  id: number
  userId: number
  itemId: number
  messages: Message[]
}
interface Notif {
  id: number
  text: string
  read: boolean
  time: string
  target: Screen
  targetId?: number
}
interface ExploreState {
  q: string
  cat: string
  cond: string
  purpose: string
  sort: string
  minP: string
  maxP: string
  showF: boolean
}

const USERS: User[] = [
  {
    id: 1,
    name: "Lucas Ferreira",
    city: "Belo Horizonte - MG",
    avatar: "LF",
    reputation: 4.9,
    transactions: 23,
    memberSince: "Mar 2024",
    bio: "Apaixonado por tecnologia e consumo consciente.",
  },
  {
    id: 2,
    name: "Ana Beatriz",
    city: "Contagem - MG",
    avatar: "AB",
    reputation: 4.7,
    transactions: 15,
    memberSince: "Jun 2024",
    bio: "Engenheira de hardware. Reparo e reutilizo componentes.",
  },
  {
    id: 3,
    name: "Carlos Mendes",
    city: "Betim - MG",
    avatar: "CM",
    reputation: 4.5,
    transactions: 8,
    memberSince: "Ago 2024",
    bio: "Técnico de informática. Acredito na economia circular.",
  },
  {
    id: 4,
    name: "Fernanda Lima",
    city: "Nova Lima - MG",
    avatar: "FL",
    reputation: 5.0,
    transactions: 41,
    memberSince: "Jan 2024",
    bio: "Top contribuidora da plataforma.",
  },
  {
    id: 5,
    name: "Rafael Souza",
    city: "Sabará - MG",
    avatar: "RS",
    reputation: 4.3,
    transactions: 6,
    memberSince: "Set 2024",
    bio: "Entusiasta de hardware e eletrônica.",
  },
]
const INIT_ITEMS: Item[] = [
  {
    id: 1,
    name: "Notebook Acer Aspire 3",
    brand: "Acer",
    model: "A315-58",
    category: "Notebooks",
    condition: "Com defeito",
    purpose: "Peças",
    description:
      "Notebook com placa-mãe queimada. Tela, teclado e bateria em ótimo estado.",
    defect: "Placa-mãe queimada",
    location: "Belo Horizonte",
    distance: "2,4 km",
    status: "disponível",
    image: "photo-1496181133206-80ce9b88a853",
    ownerId: 2,
    date: "2026-09-07",
  },
  {
    id: 2,
    name: "iPhone 11 Pro 64GB",
    brand: "Apple",
    model: "iPhone 11 Pro",
    category: "Celulares",
    condition: "Funcionando parcialmente",
    purpose: "Vender",
    price: 850,
    description: "Tela trincada mas toque funcionando.",
    defect: "Tela trincada",
    location: "Contagem",
    distance: "4,1 km",
    status: "disponível",
    image: "photo-1510557880182-3d4d3cba35a5",
    ownerId: 3,
    date: "2026-09-06",
  },
  {
    id: 3,
    name: 'Monitor Dell 24" Full HD',
    brand: "Dell",
    model: "S2421HN",
    category: "Periféricos",
    condition: "Funcionando",
    purpose: "Doar",
    description: "Monitor em perfeito estado. Substituído por ultrawide.",
    defect: "Sem defeitos",
    location: "Nova Lima",
    distance: "6,8 km",
    status: "disponível",
    image: "photo-1527443224154-c4a3942d3acf",
    ownerId: 4,
    date: "2026-09-05",
  },
  {
    id: 4,
    name: "Teclado Mecânico Redragon K552",
    brand: "Redragon",
    model: "Kumara K552",
    category: "Periféricos",
    condition: "Usado",
    purpose: "Vender",
    price: 180,
    description: "Teclado mecânico com switches red.",
    defect: "Desgaste nas teclas",
    location: "Belo Horizonte",
    distance: "3,2 km",
    status: "disponível",
    image: "photo-1587829741301-dc798b83add3",
    ownerId: 1,
    date: "2026-09-04",
  },
  {
    id: 5,
    name: "Raspberry Pi 4 4GB",
    brand: "Raspberry Pi",
    model: "Model B 4GB",
    category: "Componentes",
    condition: "Funcionando",
    purpose: "Reutilização",
    description: "Raspberry Pi 4 completo com case e fonte.",
    defect: "Sem defeitos",
    location: "Betim",
    distance: "8,5 km",
    status: "disponível",
    image: "photo-1518770660439-4636190af475",
    ownerId: 3,
    date: "2026-09-03",
  },
  {
    id: 6,
    name: "HD Externo Seagate 1TB",
    brand: "Seagate",
    model: "Backup Plus Slim",
    category: "Componentes",
    condition: "Com defeito",
    purpose: "Peças",
    description: "HD com problema mecânico.",
    defect: "Barulho mecânico",
    location: "Belo Horizonte",
    distance: "1,9 km",
    status: "disponível",
    image: "photo-1531492746076-161ca9bcad58",
    ownerId: 4,
    date: "2026-09-02",
  },
  {
    id: 7,
    name: "Fone Sony WH-1000XM4",
    brand: "Sony",
    model: "WH-1000XM4",
    category: "Áudio",
    condition: "Funcionando parcialmente",
    purpose: "Vender",
    price: 420,
    description: "ANC com falha intermitente. Áudio perfeito.",
    defect: "ANC intermitente",
    location: "Contagem",
    distance: "5,3 km",
    status: "disponível",
    image: "photo-1505740420928-5e560c06d30e",
    ownerId: 2,
    date: "2026-09-01",
  },
  {
    id: 8,
    name: "Lote Cabos USB-C",
    brand: "Diversas",
    model: "USB-C 3.1",
    category: "Cabos e carregadores",
    condition: "Funcionando",
    purpose: "Doar",
    description: "8 cabos USB-C testados e funcionando.",
    defect: "Sem defeitos",
    location: "Nova Lima",
    distance: "7,1 km",
    status: "disponível",
    image: "photo-1558618666-fcd25c85cd64",
    ownerId: 3,
    date: "2026-09-01",
  },
  {
    id: 9,
    name: "Placa de Vídeo GTX 1060 6GB",
    brand: "Nvidia",
    model: "GTX 1060 6GB",
    category: "Componentes",
    condition: "Funcionando",
    purpose: "Vender",
    price: 650,
    description: "GPU perfeita, substituída por RTX.",
    defect: "Sem defeitos",
    location: "Belo Horizonte",
    distance: "3,7 km",
    status: "disponível",
    image: "photo-1591488320449-011701bb6704",
    ownerId: 1,
    date: "2026-09-08",
  },
  {
    id: 10,
    name: "Tablet Samsung Galaxy Tab A8",
    brand: "Samsung",
    model: "Galaxy Tab A8",
    category: "Celulares",
    condition: "Funcionando parcialmente",
    purpose: "Vender",
    price: 390,
    description: "Tela com linhas finas, demais funções OK.",
    defect: "Linhas na tela",
    location: "Contagem",
    distance: "5,0 km",
    status: "disponível",
    image: "photo-1544244015-0df4b3ffc6b0",
    ownerId: 3,
    date: "2026-09-08",
  },
  {
    id: 11,
    name: "Notebook Dell Inspiron 15",
    brand: "Dell",
    model: "Inspiron 15 3000",
    category: "Notebooks",
    condition: "Funcionando",
    purpose: "Vender",
    price: 1400,
    description: "i5 10ª, 8GB RAM, SSD 256GB. Bateria nova.",
    defect: "Arranhão na tampa",
    location: "Nova Lima",
    distance: "9,2 km",
    status: "disponível",
    image: "photo-1593642632559-0c6d3fc62b89",
    ownerId: 4,
    date: "2026-09-09",
  },
  {
    id: 12,
    name: "Mouse Logitech MX Master 3",
    brand: "Logitech",
    model: "MX Master 3",
    category: "Periféricos",
    condition: "Usado",
    purpose: "Vender",
    price: 230,
    description: "Mouse topo de linha. Receptor e cabo inclusos.",
    defect: "Desgaste no scroll",
    location: "Sabará",
    distance: "12,1 km",
    status: "disponível",
    image: "photo-1527864550417-7fd91fc51a46",
    ownerId: 5,
    date: "2026-09-09",
  },
]
const INIT_REQUESTS: Req[] = [
  {
    id: 1,
    title: "Procuro teclado Dell Inspiron 15",
    description: "Preciso de teclado compatível com Dell Inspiron 15 5000.",
    category: "Notebook / Peça",
    location: "Contagem - MG",
    userId: 2,
    date: "2026-09-08",
  },
  {
    id: 2,
    title: "Bateria para MacBook Pro 2017",
    description: 'Bateria original ou compatível para MacBook Pro 13" 2017.',
    category: "Notebook / Peça",
    location: "Belo Horizonte - MG",
    userId: 3,
    date: "2026-09-07",
  },
  {
    id: 3,
    title: 'Monitor até 24" para escola',
    description: "Monitor funcional para projeto social em escola pública.",
    category: "Periférico",
    location: "Betim - MG",
    userId: 4,
    date: "2026-09-06",
  },
  {
    id: 4,
    title: "Fonte ATX 500W ou mais",
    description: "Fonte para montar PC de estudos.",
    category: "Componente",
    location: "Nova Lima - MG",
    userId: 1,
    date: "2026-09-05",
  },
  {
    id: 5,
    title: "Tela Samsung Galaxy A52",
    description: "Tela com digitalizador, pode ter pequenos defeitos.",
    category: "Celular / Peça",
    location: "Sabará - MG",
    userId: 5,
    date: "2026-09-04",
  },
]
const INIT_TRANSACTIONS: Tx[] = [
  {
    id: 1,
    itemId: 4,
    senderId: 1,
    receiverId: 2,
    status: "negociação",
    step: 2,
    date: "2026-09-06",
  },
  {
    id: 2,
    itemId: 7,
    senderId: 1,
    receiverId: 3,
    status: "concluída",
    step: 5,
    date: "2026-08-28",
  },
  {
    id: 3,
    itemId: 3,
    senderId: 4,
    receiverId: 1,
    status: "pendente",
    step: 1,
    date: "2026-09-07",
  },
  {
    id: 4,
    itemId: 9,
    senderId: 1,
    receiverId: 5,
    status: "acordo",
    step: 3,
    date: "2026-09-05",
  },
  {
    id: 5,
    itemId: 11,
    senderId: 3,
    receiverId: 1,
    status: "entrega",
    step: 4,
    date: "2026-09-04",
  },
  {
    id: 6,
    itemId: 2,
    senderId: 5,
    receiverId: 2,
    status: "concluída",
    step: 5,
    date: "2026-09-01",
  },
]
const INIT_CONVERSATIONS: Conversation[] = [
  {
    id: 1,
    userId: 2,
    itemId: 4,
    messages: [
      {
        id: 1,
        from: 2,
        text: "Olá! O teclado ainda está disponível?",
        time: "14:30",
      },
      { id: 2, from: 1, text: "Sim! Tem interesse?", time: "14:35" },
      { id: 3, from: 2, text: "Sim! Como posso buscar?", time: "14:40" },
      {
        id: 4,
        from: 1,
        text: "Posso deixar na portaria em Savassi.",
        time: "14:45",
      },
    ],
  },
  {
    id: 2,
    userId: 3,
    itemId: 7,
    messages: [
      { id: 1, from: 3, text: "O fone funciona para chamadas?", time: "10:15" },
      { id: 2, from: 1, text: "Funciona! Só o ANC tem falha.", time: "10:20" },
      { id: 3, from: 3, text: "Posso buscar no fim de semana?", time: "10:25" },
    ],
  },
  {
    id: 3,
    userId: 4,
    itemId: 3,
    messages: [
      { id: 1, from: 4, text: "O monitor funciona com Mac?", time: "09:00" },
      { id: 2, from: 1, text: "Funciona! Tem HDMI.", time: "09:05" },
    ],
  },
  {
    id: 4,
    userId: 5,
    itemId: 9,
    messages: [
      { id: 1, from: 5, text: "A placa roda jogos pesados?", time: "16:00" },
      {
        id: 2,
        from: 1,
        text: "Joguei Cyberpunk por meses sem problema.",
        time: "16:10",
      },
    ],
  },
  {
    id: 5,
    userId: 2,
    itemId: 11,
    messages: [
      { id: 1, from: 2, text: "Aceita pente de RAM adicional?", time: "11:30" },
    ],
  },
]
const INIT_NOTIFS: Notif[] = [
  {
    id: 1,
    text: "Ana demonstrou interesse no seu Teclado Mecânico.",
    read: false,
    time: "há 5 min",
    target: "transaction",
    targetId: 1,
  },
  {
    id: 2,
    text: "Carlos te enviou uma mensagem.",
    read: false,
    time: "há 12 min",
    target: "chat",
    targetId: 2,
  },
  {
    id: 3,
    text: "Seu pedido foi atualizado.",
    read: false,
    time: "há 1h",
    target: "requestDetails",
    targetId: 4,
  },
  {
    id: 4,
    text: "Fernanda respondeu à sua publicação.",
    read: false,
    time: "há 2h",
    target: "details",
    targetId: 3,
  },
  {
    id: 5,
    text: "Rafael demonstrou interesse no Monitor Dell.",
    read: true,
    time: "há 3h",
    target: "transaction",
    targetId: 3,
  },
  {
    id: 6,
    text: "Nova mensagem: 'Posso buscar amanhã?'",
    read: true,
    time: "há 5h",
    target: "chat",
    targetId: 1,
  },
  {
    id: 7,
    text: "Sua transação com Carlos foi concluída.",
    read: true,
    time: "ontem",
    target: "transaction",
    targetId: 2,
  },
  {
    id: 8,
    text: "Bem-vindo ao Re-Conecta! Complete seu perfil.",
    read: true,
    time: "há 2 dias",
    target: "profile",
  },
]
const CATEGORY_GROUPS = [
  {
    label: "Dispositivos pessoais",
    items: [
      { label: "Celulares", icon: "📱" },
      { label: "Tablets e e-readers", icon: "▣" },
      { label: "Smartwatches e dispositivos inteligentes", icon: "⌚" },
    ],
  },
  {
    label: "Informática",
    items: [
      { label: "Notebooks", icon: "💻" },
      { label: "Computadores", icon: "🖥️" },
      { label: "Monitores", icon: "▤" },
      { label: "Periféricos", icon: "🖱️" },
      { label: "Teclados e mouses", icon: "⌨️" },
      { label: "Componentes", icon: "🔧" },
    ],
  },
  {
    label: "Imagem, som e entretenimento",
    items: [
      { label: "Áudio", icon: "🎧" },
      { label: "TVs e projetores", icon: "▰" },
      { label: "Câmeras e fotografia", icon: "◉" },
      { label: "Consoles e videogames", icon: "🎮" },
    ],
  },
  {
    label: "Acessórios e peças",
    items: [
      { label: "Cabos e carregadores", icon: "🔌" },
      { label: "Peças", icon: "⚙️" },
      { label: "Outros", icon: "📦" },
    ],
  },
]
const CATEGORIES = CATEGORY_GROUPS.flatMap((group) => group.items)
const TX_STEPS = [
  "Interesse enviado",
  "Em negociação",
  "Acordo realizado",
  "Aguardando entrega",
  "Concluído",
]

function itemImage(item: Item, index = 0) {
  const image = item.images?.[index] || item.images?.[0] || item.image
  return image.startsWith("data:") ||
    image.startsWith("blob:") ||
    image.startsWith("/")
    ? image
    : `https://images.unsplash.com/${image}?w=1000&h=700&fit=crop&auto=format`
}

function Av({
  initials,
  image,
  size = "md",
}: {
  initials: string
  image?: string
  size?: "xs" | "sm" | "md" | "lg" | "xl"
}) {
  const s = {
    xs: "w-6 h-6 text-[10px]",
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-14 h-14 text-lg",
    xl: "w-20 h-20 text-2xl",
  }
  return (
    <div
      className={`${s[size]} bg-[#2d6a40] text-white rounded-full flex items-center justify-center font-bold font-display flex-shrink-0 overflow-hidden`}
    >
      {image ? (
        <img src={image} alt="" className="w-full h-full object-cover" />
      ) : (
        initials
      )}
    </div>
  )
}
function Bdg({
  label,
  v = "default",
}: {
  label: string
  v?: "default" | "success" | "warn" | "danger" | "info" | "sale" | "free"
}) {
  const m: Record<string, string> = {
    default: "bg-gray-100 text-gray-600",
    success: "bg-emerald-50 text-emerald-700",
    warn: "bg-amber-50 text-amber-700",
    danger: "bg-red-50 text-red-600",
    info: "bg-blue-50 text-blue-600",
    sale: "bg-violet-50 text-violet-700",
    free: "bg-teal-50 text-teal-700",
  }
  return (
    <span
      className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${m[v]}`}
    >
      {label}
    </span>
  )
}
function PurposeBadge({ purpose }: { purpose: string }) {
  if (purpose === "Vender") return <Bdg label="À venda" v="sale" />
  if (purpose === "Doar") return <Bdg label="Doação" v="free" />
  if (purpose === "Reutilização")
    return <Bdg label="Para reutilização" v="info" />
  return <Bdg label="Para peças" v="warn" />
}
function CondBadge({ condition }: { condition: string }) {
  const v =
    condition === "Funcionando" || condition === "Novo"
      ? "success"
      : condition === "Com defeito"
        ? "danger"
        : "warn"
  return <Bdg label={condition} v={v as "success" | "warn" | "danger"} />
}
function Logo({
  dark = false,
  size = "md",
}: {
  dark?: boolean
  size?: "sm" | "md" | "lg"
}) {
  const h = size === "sm" ? "h-7" : size === "lg" ? "h-12" : "h-9"
  return dark ? (
    <img src={logoImg} alt="Re-Conecta" className={`${h} object-contain`} />
  ) : (
    <img
      src={logoImg}
      alt="Re-Conecta"
      className={`${h} object-contain brightness-0 invert`}
    />
  )
}

function ItemCard({
  item,
  onPress,
  favorites,
  onFav,
}: {
  item: Item
  onPress: () => void
  favorites: number[]
  onFav: (id: number) => void
}) {
  const isFav = favorites.includes(item.id)
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#e0eae2] text-left w-full transition-all hover:shadow-md hover:-translate-y-0.5 group relative">
      <button
        onClick={(e) => {
          e.stopPropagation()
          onFav(item.id)
        }}
        className={`absolute top-2 right-2 z-10 w-7 h-7 rounded-full flex items-center justify-center transition-all ${
          isFav
            ? "bg-rose-500 text-white"
            : "bg-white/80 text-gray-400 hover:text-rose-400"
        }`}
      >
        <svg
          className="w-3.5 h-3.5"
          fill={isFav ? "currentColor" : "none"}
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </button>
      <button onClick={onPress} className="w-full text-left">
        <div className="relative h-36 bg-[#e8f5ee] overflow-hidden">
          <img
            src={itemImage(item)}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          <div className="absolute top-2 left-2">
            <PurposeBadge purpose={item.purpose} />
          </div>
        </div>
        <div className="p-3">
          <p className="font-semibold text-[#18261d] text-sm leading-tight line-clamp-1 font-display">
            {item.name}
          </p>
          <p className="text-xs text-[#6b8071] mt-0.5">{item.brand}</p>
          {item.price ? (
            <p className="text-[#1a3a24] font-bold text-base mt-1 font-display">
              R${" "}
              {item.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </p>
          ) : (
            <p className="text-[#2d6a40] font-semibold text-sm mt-1">
              Gratuito
            </p>
          )}
          <div className="flex items-center justify-between mt-1.5">
            <CondBadge condition={item.condition} />
            <span className="text-xs text-[#6b8071] flex items-center gap-1">
              <svg
                className="w-3 h-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
              </svg>
              {item.distance}
            </span>
          </div>
        </div>
      </button>
    </div>
  )
}

function Header({
  screen,
  onNav,
  notifs,
  onNotifOpen,
  onNotifRead,
  onClearNotifs,
  user,
}: {
  screen: Screen
  onNav: (s: Screen) => void
  notifs: Notif[]
  onNotifOpen: (n: Notif) => void
  onNotifRead: (id: number) => void
  onClearNotifs: () => void
  user?: User
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const activeUser = user || USERS[0]
  const unread = notifs.filter((n) => !n.read).length
  const navLinks: [Screen, string][] = [
    ["home", "Início"],
    ["explore", "Explorar"],
    ["requests", "Pedidos"],
    ["chat", "Chat"],
    ["about", "Sobre nós"],
    ["support", "Suporte"],
  ]
  return (
    <header className="app-header sticky top-0 z-50 bg-[#1a3a24] shadow-lg">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 flex items-center justify-between h-16">
        <button
          onClick={() => onNav("home")}
          className="flex-shrink-0 hover:opacity-90 transition-opacity"
        >
          <span className="sm:hidden">
            <Logo dark={false} size="sm" />
          </span>
          <span className="hidden sm:block">
            <Logo dark={false} size="md" />
          </span>
        </button>
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map(([id, label]) => (
            <button
              key={id}
              onClick={() => onNav(id)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                screen === id
                  ? "bg-white/15 text-white"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNav("publish")}
            aria-label="Publicar eletrônico"
            className="flex items-center gap-1.5 bg-[#4a9e6b] hover:bg-[#5bbf7a] text-white font-bold px-2.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm shadow-sm"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M12 5v14m7-7H5"
              />
            </svg>
            <span className="hidden min-[360px]:inline">Publicar</span>
          </button>
          <div className="relative">
            <button
              onClick={() => {
                setNotifOpen((v) => !v)
                setMenuOpen(false)
              }}
              className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
            >
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              {unread > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center">
                  {unread}
                </span>
              )}
            </button>
            {notifOpen && (
              <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-[#e0eae2] overflow-hidden z-50 animate-scale-in">
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#e0eae2]">
                  <span className="font-bold text-[#18261d] font-display text-sm">
                    Notificações
                  </span>
                  <button
                    onClick={onClearNotifs}
                    className="text-xs text-[#2d6a40] font-medium hover:underline"
                  >
                    Marcar todas como lidas
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifs.map((n) => (
                    <div
                      key={n.id}
                      className={`w-full px-4 py-3 border-b border-[#f4f7f4] hover:bg-[#f4f7f4] flex gap-3 items-start ${
                        !n.read ? "bg-[#f0faf3]" : ""
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                          n.read ? "bg-transparent" : "bg-[#2d6a40]"
                        }`}
                      />
                      <button
                        onClick={() => {
                          onNotifOpen(n)
                          setNotifOpen(false)
                        }}
                        className="flex-1 text-left"
                      >
                        <p
                          className={`text-xs leading-relaxed ${
                            n.read
                              ? "text-[#6b8071]"
                              : "text-[#18261d] font-medium"
                          }`}
                        >
                          {n.text}
                        </p>
                        <p className="text-[10px] text-[#6b8071] mt-0.5">
                          {n.time}
                        </p>
                      </button>
                      {!n.read && (
                        <button
                          onClick={() => onNotifRead(n.id)}
                          className="text-[10px] text-[#2d6a40] font-bold whitespace-nowrap"
                        >
                          Marcar como lida
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button
            onClick={() => onNav("profile")}
            className="rounded-full hover:opacity-90 transition-opacity"
          >
            <Av
              initials={activeUser.avatar}
              image={activeUser.avatarUrl}
              size="sm"
            />
          </button>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
          >
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="lg:hidden bg-[#1e4228] border-t border-white/10 px-4 py-3 space-y-1">
          {navLinks.map(([id, label]) => (
            <button
              key={id}
              onClick={() => {
                onNav(id)
                setMenuOpen(false)
              }}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium ${
                screen === id
                  ? "bg-white/15 text-white"
                  : "text-white/70 hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}
      {notifOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setNotifOpen(false)}
        />
      )}
    </header>
  )
}

function BottomNav({
  screen,
  onNav,
}: {
  screen: Screen
  onNav: (s: Screen) => void
}) {
  const items: [Screen, string, React.ReactNode][] = [
    [
      "home",
      "Início",
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>,
    ],
    [
      "explore",
      "Explorar",
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>,
    ],
    [
      "chat",
      "Chat",
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
        />
      </svg>,
    ],
    [
      "profile",
      "Perfil",
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>,
    ],
  ]
  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 bg-white border-t border-[#e0eae2] flex items-center z-40"
      style={{ paddingBottom: "max(12px,env(safe-area-inset-bottom))" }}
    >
      {items.map(([id, label, icon]) => (
        <button
          key={id}
          onClick={() => onNav(id)}
          className={`flex-1 flex flex-col items-center py-2 gap-0.5 ${
            screen === id ? "text-[#2d6a40]" : "text-[#6b8071]"
          }`}
        >
          {icon}
          <span className="text-[10px] font-medium">{label}</span>
        </button>
      ))}
    </nav>
  )
}

function HomeScreen({
  items,
  requests,
  onItem,
  onRequest,
  onNav,
  favorites,
  onFav,
  onSearch,
  onCat,
  user,
}: {
  items: Item[]
  requests: Req[]
  onItem: (i: Item) => void
  onRequest: (r: Req) => void
  onNav: (s: Screen) => void
  favorites: number[]
  onFav: (id: number) => void
  onSearch: (q: string) => void
  onCat: (c: string) => void
  user: User
}) {
  const [q, setQ] = useState("")
  const recent = [...items]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 6)
  const nearby = items.filter((i) => i.status === "disponível").slice(0, 6)
  const featured = items.filter((i) => i.purpose === "Vender").slice(0, 4)
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (q.trim()) onSearch(q.trim())
  }
  return (
    <div className="animate-fade-up">
      <div className="bg-gradient-to-br from-[#1a3a24] via-[#1e4228] to-[#2d6a40] py-14 px-4 text-center">
        <h1 className="text-3xl lg:text-5xl font-bold text-white font-display leading-tight mb-3 max-w-2xl mx-auto">
          Seu eletrônico não
          <br />
          precisa virar lixo.
        </h1>
        <p className="text-[#a8d4b8] text-base lg:text-lg mb-8 max-w-xl mx-auto">
          Compre, venda, doe, reutilize e dê uma nova vida aos eletrônicos.
        </p>
        <form
          onSubmit={handleSearch}
          className="max-w-xl mx-auto flex gap-2 mb-6"
        >
          <div className="relative flex-1">
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b8071]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="O que você está procurando?"
              className="w-full pl-10 pr-4 py-3.5 bg-white rounded-xl text-sm text-[#18261d] placeholder:text-[#6b8071]"
            />
          </div>
          <button
            type="submit"
            className="bg-[#4a9e6b] hover:bg-[#5bbf7a] text-white font-semibold px-5 py-3 rounded-xl text-sm"
          >
            Buscar
          </button>
        </form>
        <button
          onClick={() => onNav("explore")}
          className="bg-white text-[#1a3a24] font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-[#f0faf3]"
        >
          Explorar produtos
        </button>
      </div>
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8 space-y-10">
        <div>
          <h2 className="text-lg font-bold text-[#18261d] font-display mb-4">
            Categorias
          </h2>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.label}
                onClick={() => onCat(cat.label)}
                className="flex flex-col items-center gap-1.5 bg-white border border-[#e0eae2] rounded-xl py-3 px-1 hover:border-[#4a9e6b] hover:bg-[#f0faf3] transition-all"
              >
                <span className="text-xl">{cat.icon}</span>
                <span className="text-[10px] font-medium text-[#18261d] text-center leading-tight">
                  {cat.label}
                </span>
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[#18261d] font-display">
              Recomendados para você
            </h2>
            <button
              onClick={() => onNav("explore")}
              className="text-sm text-[#2d6a40] font-medium hover:underline"
            >
              Ver todos
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {recent.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onPress={() => onItem(item)}
                favorites={favorites}
                onFav={onFav}
              />
            ))}
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[#18261d] font-display">
              Produtos em destaque
            </h2>
            <button
              onClick={() => onNav("explore")}
              className="text-sm text-[#2d6a40] font-medium hover:underline"
            >
              Ver todos
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {featured.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onPress={() => onItem(item)}
                favorites={favorites}
                onFav={onFav}
              />
            ))}
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[#18261d] font-display">
              Disponíveis perto de você
            </h2>
            <button
              onClick={() => onNav("explore")}
              className="text-sm text-[#2d6a40] font-medium hover:underline"
            >
              Ver todos
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {nearby.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onPress={() => onItem(item)}
                favorites={favorites}
                onFav={onFav}
              />
            ))}
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => onNav("requests")}
              className="text-lg font-bold text-[#18261d] font-display hover:text-[#2d6a40]"
            >
              Pedidos recentes
            </button>
            <button
              onClick={() => onNav("requests")}
              className="text-sm text-[#2d6a40] font-medium hover:underline"
            >
              Ver todos
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {requests.slice(0, 3).map((req) => {
              const u =
                req.userId === 1
                  ? user
                  : USERS.find((u) => u.id === req.userId)!
              return (
                <div
                  key={req.id}
                  className="bg-white border border-[#e0eae2] rounded-2xl p-4"
                >
                  <button
                    onClick={() => onRequest(req)}
                    className="w-full text-left"
                  >
                    <div className="flex items-start gap-3">
                      <Av initials={u.avatar} image={u.avatarUrl} size="sm" />
                      <div>
                        <p className="font-semibold text-sm text-[#18261d] font-display">
                          {req.title}
                        </p>
                        <p className="text-xs text-[#6b8071] mt-0.5">
                          {req.category} · {req.location}
                        </p>
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => onRequest(req)}
                    className="mt-3 w-full text-xs text-[#2d6a40] font-semibold border border-[#2d6a40]/30 py-1.5 rounded-lg hover:bg-[#e8f5ee]"
                  >
                    Ver detalhes
                  </button>
                </div>
              )
            })}
          </div>
        </div>
        <div className="bg-gradient-to-br from-[#1a3a24] to-[#2d6a40] rounded-3xl p-6 lg:p-8">
          <h2 className="text-white font-bold text-xl font-display mb-6 text-center">
            Impacto da comunidade
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { v: "1.248", l: "Eletrônicos reaproveitados", i: "♻️" },
              { v: "487", l: "Componentes reutilizados", i: "🔩" },
              { v: "824", l: "Usuários ativos", i: "👥" },
              { v: "386 kg", l: "Desviados do descarte", i: "🌱" },
            ].map((s) => (
              <div
                key={s.l}
                className="bg-white/10 rounded-2xl p-4 text-center"
              >
                <div className="text-3xl mb-2">{s.i}</div>
                <div className="text-white font-bold text-2xl font-display">
                  {s.v}
                </div>
                <div className="text-[#a8d4b8] text-xs leading-tight mt-1">
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="h-8" />
      </div>
    </div>
  )
}

function ExploreScreen({
  items,
  onItem,
  favorites,
  onFav,
  initial,
}: {
  items: Item[]
  onItem: (i: Item, s: ExploreState) => void
  favorites: number[]
  onFav: (id: number) => void
  initial: ExploreState
}) {
  const [q, setQ] = useState(initial.q)
  const [cat, setCat] = useState(initial.cat)
  const [cond, setCond] = useState(initial.cond)
  const [purpose, setPurpose] = useState(initial.purpose)
  const [sort, setSort] = useState(initial.sort)
  const [minP, setMinP] = useState(initial.minP)
  const [maxP, setMaxP] = useState(initial.maxP)
  const [showF, setShowF] = useState(initial.showF)
  let filtered = items.filter((i) => {
    const sq = q.toLowerCase()
    const ms =
      !q ||
      i.name.toLowerCase().includes(sq) ||
      i.brand.toLowerCase().includes(sq) ||
      i.category.toLowerCase().includes(sq)
    return (
      ms &&
      (!cat || i.category === cat) &&
      (!cond || i.condition === cond) &&
      (!purpose || i.purpose === purpose) &&
      (!minP || (i.price || 0) >= Number(minP)) &&
      (!maxP || (i.price || 0) <= Number(maxP))
    )
  })
  if (sort === "price_asc")
    filtered = [...filtered].sort((a, b) => (a.price || 0) - (b.price || 0))
  else if (sort === "price_desc")
    filtered = [...filtered].sort((a, b) => (b.price || 0) - (a.price || 0))
  else filtered = [...filtered].sort((a, b) => b.date.localeCompare(a.date))
  return (
    <div className="animate-fade-up max-w-7xl mx-auto px-4 lg:px-6 pt-6 pb-8">
      <h1 className="text-2xl font-bold text-[#18261d] font-display mb-4">
        Explorar
      </h1>
      <div className="flex gap-2 mb-3">
        <div className="relative flex-1">
          <svg
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b8071]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar eletrônicos, peças..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-[#e0eae2] rounded-xl text-sm"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-3 py-2.5 bg-white border border-[#e0eae2] rounded-xl text-sm text-[#18261d] font-medium"
        >
          <option value="recent">Mais recentes</option>
          <option value="price_asc">Menor preço</option>
          <option value="price_desc">Maior preço</option>
        </select>
        <button
          onClick={() => setShowF(!showF)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium ${
            showF
              ? "bg-[#2d6a40] text-white border-[#2d6a40]"
              : "bg-white text-[#6b8071] border-[#e0eae2]"
          }`}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"
            />
          </svg>
          Filtros
        </button>
      </div>
      {showF && (
        <div className="bg-white border border-[#e0eae2] rounded-2xl p-5 mb-4 animate-scale-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-semibold text-[#6b8071] uppercase tracking-wide mb-2 block">
                Categoria
              </label>
              <select
                value={cat}
                onChange={(e) => setCat(e.target.value)}
                className="w-full px-3 py-2 border border-[#e0eae2] rounded-xl text-sm"
              >
                <option value="">Todas</option>
                {CATEGORIES.map((c) => (
                  <option key={c.label} value={c.label}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-[#6b8071] uppercase tracking-wide mb-2 block">
                Condição
              </label>
              <select
                value={cond}
                onChange={(e) => setCond(e.target.value)}
                className="w-full px-3 py-2 border border-[#e0eae2] rounded-xl text-sm"
              >
                <option value="">Todas</option>
                {[
                  "Novo",
                  "Funcionando",
                  "Funcionando parcialmente",
                  "Com defeito",
                  "Para retirada de peças",
                ].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-[#6b8071] uppercase tracking-wide mb-2 block">
                Finalidade
              </label>
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full px-3 py-2 border border-[#e0eae2] rounded-xl text-sm"
              >
                <option value="">Todas</option>
                {["Vender", "Doar", "Reutilização", "Peças"].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-[#6b8071] uppercase tracking-wide mb-2 block">
                Faixa de preço
              </label>
              <div className="flex gap-2">
                <input
                  value={minP}
                  onChange={(e) => setMinP(e.target.value)}
                  placeholder="Mín"
                  type="number"
                  className="flex-1 px-3 py-2 border border-[#e0eae2] rounded-xl text-sm"
                />
                <input
                  value={maxP}
                  onChange={(e) => setMaxP(e.target.value)}
                  placeholder="Máx"
                  type="number"
                  className="flex-1 px-3 py-2 border border-[#e0eae2] rounded-xl text-sm"
                />
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              setCat("")
              setCond("")
              setPurpose("")
              setMinP("")
              setMaxP("")
              setQ("")
            }}
            className="mt-3 text-xs text-red-500 font-medium hover:underline"
          >
            Limpar filtros
          </button>
        </div>
      )}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {["", "Vender", "Doar", "Reutilização", "Peças"].map((p) => (
          <button
            key={p}
            onClick={() => setPurpose(p)}
            className={`flex-shrink-0 text-xs px-4 py-2 rounded-full border font-medium ${
              purpose === p
                ? "bg-[#2d6a40] text-white border-[#2d6a40]"
                : "bg-white text-[#18261d] border-[#e0eae2]"
            }`}
          >
            {p || "Todos"}
          </button>
        ))}
      </div>
      <p className="text-xs text-[#6b8071] mb-4">
        {filtered.length}{" "}
        {filtered.length === 1 ? "item encontrado" : "itens encontrados"}
      </p>
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-3">🔍</div>
          <p className="font-bold text-[#18261d] text-lg">
            Nenhum item encontrado
          </p>
          <p className="text-sm text-[#6b8071] mt-1">
            Tente outros termos ou remova filtros
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {filtered.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onPress={() =>
                onItem(item, { q, cat, cond, purpose, sort, minP, maxP, showF })
              }
              favorites={favorites}
              onFav={onFav}
            />
          ))}
        </div>
      )}
      <div className="h-8" />
    </div>
  )
}

function DetailsScreen({
  item,
  onBack,
  onChat,
  favorites,
  onFav,
  onTx,
  user,
}: {
  item: Item
  onBack: () => void
  onChat: () => void
  favorites: number[]
  onFav: (id: number) => void
  onTx: () => void
  user: User
}) {
  const [modal, setModal] = useState<"interest" | "report" | "block" | null>(
    null,
  )
  const [saved, setSaved] = useState(false)
  const [reported, setReported] = useState(false)
  const [reportReason, setReportReason] = useState("")
  const owner =
    item.ownerId === 1 ? user : USERS.find((u) => u.id === item.ownerId)!
  const isFav = favorites.includes(item.id)
  const [photo, setPhoto] = useState(0)
  const photos = item.images?.length ? item.images : [item.image]
  const handleInterest = () => {
    setTimeout(() => {
      setModal(null)
      onTx()
    }, 1200)
  }
  const handleReport = () => {
    if (reportReason) {
      setReported(true)
      setTimeout(() => setModal(null), 1500)
    }
  }
  return (
    <div className="animate-fade-up max-w-5xl mx-auto">
      <div className="relative h-72 lg:h-96 bg-[#e8f5ee]">
        <img
          src={itemImage(item, photo)}
          alt={item.name}
          className="w-full h-full object-cover"
        />
        <button
          onClick={onBack}
          className="absolute top-4 left-4 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow hover:bg-white"
        >
          <svg
            className="w-5 h-5 text-[#18261d]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        {photos.length > 1 && (
          <>
            <button
              onClick={() =>
                setPhoto((p) => (p - 1 + photos.length) % photos.length)
              }
              className="absolute left-4 top-1/2 w-9 h-9 bg-white/90 rounded-full shadow"
            >
              ‹
            </button>
            <button
              onClick={() => setPhoto((p) => (p + 1) % photos.length)}
              className="absolute right-4 top-1/2 w-9 h-9 bg-white/90 rounded-full shadow"
            >
              ›
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/55 text-white text-xs px-3 py-1 rounded-full">
              {photo + 1} / {photos.length}
            </div>
          </>
        )}
      </div>
      <div className="px-4 lg:px-6 py-6 space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#18261d] font-display">
              {item.name}
            </h1>
            <p className="text-[#6b8071] text-sm mt-0.5">
              {item.brand} · {item.model}
            </p>
            {item.price ? (
              <p className="text-[#1a3a24] font-bold text-3xl mt-2 font-display">
                R${" "}
                {item.price.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </p>
            ) : (
              <div className="mt-2">
                <Bdg label="Gratuito" v="free" />
              </div>
            )}
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={() => onFav(item.id)}
              className={`w-10 h-10 rounded-full border flex items-center justify-center ${
                isFav
                  ? "bg-rose-50 border-rose-300 text-rose-500"
                  : "bg-white border-[#e0eae2] text-[#6b8071]"
              }`}
            >
              <svg
                className="w-5 h-5"
                fill={isFav ? "currentColor" : "none"}
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
            <button
              onClick={() => setSaved(!saved)}
              className={`w-10 h-10 rounded-full border flex items-center justify-center ${
                saved
                  ? "bg-[#e8f5ee] border-[#2d6a40] text-[#2d6a40]"
                  : "bg-white border-[#e0eae2] text-[#6b8071]"
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <PurposeBadge purpose={item.purpose} />
          <CondBadge condition={item.condition} />
          <Bdg label={item.category} />
        </div>
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="bg-[#f4f7f4] rounded-2xl p-4">
            <p className="text-xs font-bold text-[#6b8071] uppercase tracking-wide mb-2">
              Descrição
            </p>
            <p className="text-sm text-[#18261d] leading-relaxed">
              {item.description}
            </p>
          </div>
          {item.defect && item.defect !== "Sem defeitos" && (
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
              <p className="text-xs font-bold text-amber-600 uppercase tracking-wide mb-2">
                Defeito / Observação
              </p>
              <p className="text-sm text-amber-800">{item.defect}</p>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-[#6b8071]">
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
          </svg>
          Localização aproximada: {item.location} · {item.distance}
        </div>
        <div className="bg-white border border-[#e0eae2] rounded-2xl p-5">
          <p className="text-xs font-bold text-[#6b8071] uppercase tracking-wide mb-3">
            Publicado por
          </p>
          <div className="flex items-center gap-4">
            <Av initials={owner.avatar} image={owner.avatarUrl} size="lg" />
            <div className="flex-1">
              <p className="font-bold text-[#18261d] font-display">
                {owner.name}
              </p>
              <p className="text-xs text-[#6b8071]">
                {owner.city} · Membro desde {owner.memberSince}
              </p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-sm text-amber-500 font-bold">
                  ⭐ {owner.reputation}
                </span>
                <span className="text-xs text-[#6b8071]">
                  {owner.transactions} transações
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          {item.status === "disponível" && (
            <button
              onClick={() => setModal("interest")}
              className="w-full bg-[#2d6a40] text-white font-bold py-4 rounded-2xl hover:bg-[#1a3a24]"
            >
              {item.purpose === "Vender"
                ? "Tenho interesse em comprar"
                : "Solicitar item"}
            </button>
          )}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onChat}
              className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-[#2d6a40] text-[#2d6a40] font-semibold text-sm hover:bg-[#e8f5ee]"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
              Conversar
            </button>
            <button
              onClick={() => setModal("report")}
              className="flex items-center justify-center gap-2 py-3 rounded-xl border border-[#e0eae2] text-[#6b8071] font-semibold text-sm hover:bg-[#f4f7f4]"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              Denunciar
            </button>
          </div>
          <button
            onClick={() => setModal("block")}
            className="text-xs text-red-400 hover:text-red-600 text-center font-medium py-1"
          >
            Bloquear este usuário
          </button>
        </div>
      </div>
      {modal === "interest" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 animate-scale-in text-center">
            <div className="w-14 h-14 bg-[#e8f5ee] rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
              🤝
            </div>
            <h3 className="text-lg font-bold text-[#18261d] font-display mb-1">
              Deseja solicitar este item?
            </h3>
            <p className="text-sm text-[#6b8071] mb-5">
              Sua solicitação será enviada ao proprietário.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setModal(null)}
                className="flex-1 py-3 rounded-xl border border-[#e0eae2] text-sm font-medium text-[#6b8071]"
              >
                Cancelar
              </button>
              <button
                onClick={handleInterest}
                className="flex-1 py-3 rounded-xl bg-[#2d6a40] text-white text-sm font-bold"
              >
                Enviar solicitação
              </button>
            </div>
          </div>
        </div>
      )}
      {modal === "report" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 animate-scale-in">
            {reported ? (
              <div className="text-center py-4">
                <div className="text-4xl mb-3">✅</div>
                <p className="font-bold text-[#18261d] font-display">
                  Denúncia enviada
                </p>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-bold text-[#18261d] font-display mb-4">
                  Denunciar publicação
                </h3>
                <div className="space-y-2 mb-5">
                  {[
                    "Produto suspeito",
                    "Informações falsas",
                    "Conteúdo inadequado",
                    "Possível fraude",
                    "Outro",
                  ].map((r) => (
                    <button
                      key={r}
                      onClick={() => setReportReason(r)}
                      className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-medium ${
                        reportReason === r
                          ? "bg-[#e8f5ee] border-[#2d6a40] text-[#2d6a40]"
                          : "border-[#e0eae2]"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setModal(null)}
                    className="flex-1 py-2.5 rounded-xl border border-[#e0eae2] text-sm font-medium text-[#6b8071]"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleReport}
                    disabled={!reportReason}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-bold ${
                      reportReason
                        ? "bg-red-500 text-white"
                        : "bg-[#e0eae2] text-[#6b8071] cursor-not-allowed"
                    }`}
                  >
                    Denunciar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      {modal === "block" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 animate-scale-in text-center">
            <div className="text-4xl mb-3">🚫</div>
            <h3 className="text-lg font-bold text-[#18261d] font-display mb-2">
              Bloquear {owner.name}?
            </h3>
            <p className="text-sm text-[#6b8071] mb-5">
              Você não verá mais publicações deste usuário.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setModal(null)}
                className="flex-1 py-2.5 rounded-xl border border-[#e0eae2] text-sm font-medium text-[#6b8071]"
              >
                Cancelar
              </button>
              <button
                onClick={() => setModal(null)}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-bold"
              >
                Bloquear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function PublishScreen({
  initType,
  onDone,
  onAddItem,
}: {
  initType: string
  onDone: () => void
  onAddItem: (i: Item) => void
}) {
  const purposeMap: Record<string, string> = {
    sale: "Vender",
    donate: "Doar",
    reuse: "Reutilização",
    parts: "Peças",
  }
  const [form, setForm] = useState({
    name: "",
    brand: "",
    model: "",
    category: "",
    condition: "",
    purpose: purposeMap[initType] || "Vender",
    price: "",
    description: "",
    defect: "",
    location: "",
  })
  const [done, setDone] = useState(false)
  const [photos, setPhotos] = useState<string[]>([])
  const [mainPhoto, setMainPhoto] = useState(0)
  const photoInput = useRef<HTMLInputElement>(null)
  const replaceInput = useRef<HTMLInputElement>(null)
  const [replaceIndex, setReplaceIndex] = useState<number | null>(null)
  const u = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))
  const readFiles = (files: FileList | null, replace: number | null = null) => {
    if (!files?.length) return
    Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .forEach((file) => {
        const reader = new FileReader()
        reader.onload = () =>
          setPhotos((current) =>
            replace === null
              ? [...current, String(reader.result)]
              : current.map((p, i) =>
                  i === replace ? String(reader.result) : p,
                ),
          )
        reader.readAsDataURL(file)
      })
  }
  const makeMain = (index: number) => {
    setPhotos((p) => {
      const copy = [...p]
      const [chosen] = copy.splice(index, 1)
      return [chosen, ...copy]
    })
    setMainPhoto(0)
  }
  const movePhoto = (index: number, dir: -1 | 1) => {
    const next = index + dir
    if (next < 0 || next >= photos.length) return
    setPhotos((p) => {
      const copy = [...p]
      ;[copy[index], copy[next]] = [copy[next], copy[index]]
      return copy
    })
    setMainPhoto(0)
  }
  const handleSubmit = () => {
    if (!form.name || !form.category || !form.condition) return
    const ordered =
      photos.length && mainPhoto !== 0
        ? [photos[mainPhoto], ...photos.filter((_, i) => i !== mainPhoto)]
        : photos
    onAddItem({
      id: Date.now(),
      name: form.name,
      brand: form.brand,
      model: form.model,
      category: form.category,
      condition: form.condition,
      purpose: form.purpose,
      price:
        form.purpose === "Vender" && form.price
          ? Number(form.price)
          : undefined,
      description: form.description,
      defect: form.defect,
      location: form.location,
      distance: "0 km",
      status: "disponível",
      image: ordered[0] || "photo-1518770660439-4636190af475",
      images: ordered,
      ownerId: 1,
      date: new Date().toISOString().split("T")[0],
    })
    setDone(true)
  }
  if (done)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center animate-scale-in">
        <div className="relative mb-6">
          <div className="w-20 h-20 bg-[#e8f5ee] rounded-full flex items-center justify-center text-4xl">
            ✅
          </div>
          <div className="absolute inset-0 rounded-full border-4 border-[#4a9e6b] animate-ping opacity-20" />
        </div>
        <h2 className="text-2xl font-bold text-[#18261d] font-display mb-2">
          Publicação criada com sucesso!
        </h2>
        <p className="text-[#6b8071] text-sm mb-6">
          Seu item já está disponível na plataforma.
        </p>
        <button
          onClick={onDone}
          className="bg-[#2d6a40] text-white font-bold px-8 py-3.5 rounded-xl hover:bg-[#1a3a24]"
        >
          Ir para o início
        </button>
      </div>
    )
  return (
    <div className="animate-fade-up max-w-2xl mx-auto px-4 lg:px-6 pt-6 pb-12">
      <h1 className="text-2xl font-bold text-[#18261d] font-display mb-6">
        Publicar eletrônico
      </h1>
      <div className="bg-white border border-[#e0eae2] rounded-2xl p-6 space-y-5">
        <input
          ref={photoInput}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            readFiles(e.target.files)
            e.target.value = ""
          }}
        />
        <input
          ref={replaceInput}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            readFiles(e.target.files, replaceIndex)
            setReplaceIndex(null)
            e.target.value = ""
          }}
        />
        <button
          onClick={() => photoInput.current?.click()}
          className="w-full border-2 border-dashed border-[#e0eae2] rounded-xl p-6 text-center bg-[#f4f7f4] hover:border-[#4a9e6b]"
        >
          <div className="text-3xl mb-2">📷</div>
          <p className="text-sm font-semibold text-[#18261d]">
            Adicionar fotos
          </p>
          <p className="text-xs text-[#6b8071] mt-1">
            Selecione uma ou várias imagens do dispositivo
          </p>
        </button>
        {photos.length > 0 && (
          <div>
            <div className="h-52 rounded-xl overflow-hidden bg-[#e8f5ee] mb-3">
              <img
                src={photos[mainPhoto]}
                alt="Pré-visualização da foto principal"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {photos.map((photo, index) => (
                <div
                  key={`${photo.slice(-20)}-${index}`}
                  className={`relative rounded-xl overflow-hidden border-2 ${
                    index === mainPhoto
                      ? "border-[#2d6a40]"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={photo}
                    alt={`Foto ${index + 1}`}
                    className="w-full h-24 object-cover"
                  />
                  <div className="absolute inset-x-1 bottom-1 flex gap-1 justify-center">
                    <button
                      onClick={() => makeMain(index)}
                      className="bg-white/95 text-[10px] font-bold px-2 py-1 rounded-md"
                    >
                      {index === mainPhoto ? "Principal" : "Tornar principal"}
                    </button>
                    <button
                      onClick={() => {
                        setReplaceIndex(index)
                        replaceInput.current?.click()
                      }}
                      className="bg-white/95 text-[10px] font-bold px-2 py-1 rounded-md"
                    >
                      Trocar
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      setPhotos((p) => p.filter((_, i) => i !== index))
                      setMainPhoto(0)
                    }}
                    className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full text-xs"
                  >
                    ×
                  </button>
                  <div className="absolute top-1 left-1 flex gap-1">
                    <button
                      onClick={() => movePhoto(index, -1)}
                      disabled={index === 0}
                      className="bg-white/95 w-6 h-6 rounded text-xs disabled:opacity-40"
                    >
                      ←
                    </button>
                    <button
                      onClick={() => movePhoto(index, 1)}
                      disabled={index === photos.length - 1}
                      className="bg-white/95 w-6 h-6 rounded text-xs disabled:opacity-40"
                    >
                      →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {[
          ["Nome do produto *", "name", "Ex: Notebook Dell Inspiron"],
          ["Marca", "brand", "Ex: Dell"],
          ["Modelo", "model", "Ex: Inspiron 15 3000"],
        ].map(([l, k, p]) => (
          <div key={k}>
            <label className="text-xs font-bold text-[#6b8071] uppercase tracking-wide mb-1.5 block">
              {l}
            </label>
            <input
              value={(form as Record<string, string>)[k]}
              onChange={(e) => u(k, e.target.value)}
              placeholder={p}
              className="w-full px-4 py-3 border border-[#e0eae2] rounded-xl text-sm"
            />
          </div>
        ))}
        <div>
          <label className="text-xs font-bold text-[#6b8071] uppercase tracking-wide mb-1.5 block">
            Categoria *
          </label>
          <select
            value={form.category}
            onChange={(e) => u("category", e.target.value)}
            className="w-full px-4 py-3 border border-[#e0eae2] rounded-xl text-sm"
          >
            <option value="">Selecionar...</option>
            {CATEGORY_GROUPS.map((group) => (
              <optgroup key={group.label} label={group.label}>
                {group.items.map((c) => (
                  <option key={c.label} value={c.label}>
                    {c.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-bold text-[#6b8071] uppercase tracking-wide mb-1.5 block">
            Condição *
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              "Novo",
              "Funcionando",
              "Funcionando parcialmente",
              "Com defeito",
              "Para retirada de peças",
            ].map((opt) => (
              <button
                key={opt}
                onClick={() => u("condition", opt)}
                className={`px-3 py-2.5 rounded-xl border text-sm font-medium text-left ${
                  form.condition === opt
                    ? "bg-[#e8f5ee] border-[#2d6a40] text-[#2d6a40]"
                    : "border-[#e0eae2] hover:border-[#4a9e6b]"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs font-bold text-[#6b8071] uppercase tracking-wide mb-1.5 block">
            Finalidade
          </label>
          <div className="grid grid-cols-2 gap-2">
            {["Vender", "Doar", "Reutilização", "Peças"].map((opt) => (
              <button
                key={opt}
                onClick={() => u("purpose", opt)}
                className={`px-3 py-2.5 rounded-xl border text-sm font-medium ${
                  form.purpose === opt
                    ? "bg-[#e8f5ee] border-[#2d6a40] text-[#2d6a40]"
                    : "border-[#e0eae2]"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
        {form.purpose === "Vender" && (
          <div>
            <label className="text-xs font-bold text-[#6b8071] uppercase tracking-wide mb-1.5 block">
              Preço — R$ *
            </label>
            <input
              value={form.price}
              onChange={(e) => u("price", e.target.value)}
              placeholder="Ex: 850,00"
              type="number"
              className="w-full px-4 py-3 border border-[#e0eae2] rounded-xl text-sm"
            />
          </div>
        )}
        <div>
          <label className="text-xs font-bold text-[#6b8071] uppercase tracking-wide mb-1.5 block">
            Descrição
          </label>
          <textarea
            value={form.description}
            onChange={(e) => u("description", e.target.value)}
            placeholder="Descreva o produto em detalhes..."
            rows={4}
            className="w-full px-4 py-3 border border-[#e0eae2] rounded-xl text-sm resize-none"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-[#6b8071] uppercase tracking-wide mb-1.5 block">
            Defeitos ou observações
          </label>
          <textarea
            value={form.defect}
            onChange={(e) => u("defect", e.target.value)}
            placeholder="Informe defeitos ou particularidades..."
            rows={2}
            className="w-full px-4 py-3 border border-[#e0eae2] rounded-xl text-sm resize-none"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-[#6b8071] uppercase tracking-wide mb-1.5 block">
            Localização aproximada
          </label>
          <input
            value={form.location}
            onChange={(e) => u("location", e.target.value)}
            placeholder="Ex: Belo Horizonte - MG"
            className="w-full px-4 py-3 border border-[#e0eae2] rounded-xl text-sm"
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={!form.name || !form.category || !form.condition}
          className={`w-full py-4 rounded-xl font-bold text-base ${
            form.name && form.category && form.condition
              ? "bg-[#2d6a40] text-white hover:bg-[#1a3a24]"
              : "bg-[#e0eae2] text-[#6b8071] cursor-not-allowed"
          }`}
        >
          Publicar
        </button>
      </div>
    </div>
  )
}

function RequestsScreen({
  items,
  reqs,
  setReqs,
  onRequest,
  user,
}: {
  items: Item[]
  reqs: Req[]
  setReqs: React.Dispatch<React.SetStateAction<Req[]>>
  onRequest: (r: Req) => void
  user: User
}) {
  const [showCreate, setShowCreate] = useState(false)
  const [newR, setNewR] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
  })
  const [matchModal, setMatchModal] = useState<Req | null>(null)
  const [selectedOffer, setSelectedOffer] = useState<number | null>(null)
  const [offerSent, setOfferSent] = useState(false)
  const [delConf, setDelConf] = useState<number | null>(null)
  const myItems = items.filter((i) => i.ownerId === 1)
  const handleCreate = () => {
    if (!newR.title.trim()) return
    setReqs((r) => [
      {
        id: Date.now(),
        ...newR,
        userId: 1,
        date: new Date().toISOString().split("T")[0],
      },
      ...r,
    ])
    setNewR({ title: "", description: "", category: "", location: "" })
    setShowCreate(false)
  }
  const handleOffer = () => {
    setOfferSent(true)
    setTimeout(() => {
      setMatchModal(null)
      setOfferSent(false)
      setSelectedOffer(null)
    }, 1500)
  }
  const handleDel = (id: number) => {
    setReqs((r) => r.filter((x) => x.id !== id))
    setDelConf(null)
  }
  return (
    <div className="animate-fade-up max-w-4xl mx-auto px-4 lg:px-6 pt-6 pb-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#18261d] font-display">
            Pedidos
          </h1>
          <p className="text-sm text-[#6b8071] mt-0.5">
            Encontre o que você precisa ou ofereça algo
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="bg-[#2d6a40] text-white text-sm font-bold px-4 py-2.5 rounded-xl hover:bg-[#1a3a24] flex items-center gap-2"
        >
          <span className="text-lg leading-none">+</span>Criar pedido
        </button>
      </div>
      <div className="space-y-3">
        {reqs.map((req) => {
          const u =
            req.userId === 1
              ? user
              : USERS.find((u) => u.id === req.userId) || user
          const isOwn = req.userId === 1
          return (
            <div
              key={req.id}
              className="bg-white border border-[#e0eae2] rounded-2xl p-5"
            >
              <button
                onClick={() => onRequest(req)}
                className="w-full text-left"
              >
                <div className="flex items-start gap-3">
                  <Av initials={u.avatar} image={u.avatarUrl} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-bold text-[#18261d] text-sm font-display">
                        {req.title}
                      </p>
                      {isOwn && (
                        <span className="text-[10px] bg-[#e8f5ee] text-[#2d6a40] font-bold px-2 py-0.5 rounded-full flex-shrink-0">
                          Meu
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#6b8071] mt-0.5">
                      {req.category}
                    </p>
                    {req.description && (
                      <p className="text-xs text-[#6b8071] mt-1.5">
                        {req.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-[#6b8071]">
                        {req.location}
                      </span>
                      <span className="text-xs text-[#6b8071]">
                        {new Date(req.date).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
              <div className="flex justify-between items-center mt-4 pt-3 border-t border-[#f4f7f4]">
                <button
                  onClick={() => onRequest(req)}
                  className="text-xs text-[#6b8071] hover:text-[#2d6a40]"
                >
                  {u.name}
                </button>
                <div className="flex gap-2">
                  {isOwn && (
                    <button
                      onClick={() => setDelConf(req.id)}
                      className="text-xs text-red-400 font-semibold border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50"
                    >
                      Excluir
                    </button>
                  )}
                  <button
                    onClick={() => setMatchModal(req)}
                    className="text-xs text-[#2d6a40] font-bold border border-[#2d6a40]/30 px-3 py-1.5 rounded-lg hover:bg-[#e8f5ee]"
                  >
                    Tenho algo parecido
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      {showCreate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-5 animate-scale-in">
            <h3 className="text-lg font-bold text-[#18261d] font-display mb-4">
              Criar pedido
            </h3>
            <div className="space-y-3 mb-4">
              {[
                [
                  "O que você procura? *",
                  "title",
                  "Ex: Tela Samsung Galaxy A52",
                ],
                ["Descrição", "description", "Detalhes..."],
                ["Categoria", "category", "Ex: Celular / Peça"],
                ["Localização", "location", "Ex: BH - MG"],
              ].map(([l, k, p]) => (
                <div key={k}>
                  <label className="text-xs font-bold text-[#6b8071] uppercase tracking-wide mb-1 block">
                    {l}
                  </label>
                  <input
                    value={(newR as Record<string, string>)[k]}
                    onChange={(e) =>
                      setNewR((r) => ({ ...r, [k]: e.target.value }))
                    }
                    placeholder={p}
                    className="w-full px-3.5 py-2.5 border border-[#e0eae2] rounded-xl text-sm"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCreate(false)}
                className="flex-1 py-2.5 rounded-xl border border-[#e0eae2] text-sm font-medium text-[#6b8071]"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreate}
                disabled={!newR.title.trim()}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold ${
                  newR.title.trim()
                    ? "bg-[#2d6a40] text-white"
                    : "bg-[#e0eae2] text-[#6b8071] cursor-not-allowed"
                }`}
              >
                Publicar
              </button>
            </div>
          </div>
        </div>
      )}
      {matchModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-5 animate-scale-in">
            {offerSent ? (
              <div className="text-center py-4">
                <div className="text-4xl mb-3">🤝</div>
                <p className="font-bold text-[#18261d] font-display">
                  Oferta enviada!
                </p>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-bold text-[#18261d] font-display mb-3">
                  Tenho algo parecido
                </h3>
                <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                  {myItems.length === 0 ? (
                    <p className="text-sm text-[#6b8071]">
                      Você não tem publicações ainda.
                    </p>
                  ) : (
                    myItems.map((i) => (
                      <button
                        key={i.id}
                        onClick={() => setSelectedOffer(i.id)}
                        className={`w-full text-left px-3 py-2.5 rounded-xl border text-sm ${
                          selectedOffer === i.id
                            ? "bg-[#e8f5ee] border-[#2d6a40]"
                            : "border-[#e0eae2]"
                        }`}
                      >
                        <p className="font-semibold text-[#18261d]">{i.name}</p>
                        <p className="text-xs text-[#6b8071]">{i.category}</p>
                      </button>
                    ))
                  )}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setMatchModal(null)}
                    className="flex-1 py-2.5 rounded-xl border border-[#e0eae2] text-sm font-medium text-[#6b8071]"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleOffer}
                    className="flex-1 py-2.5 rounded-xl bg-[#2d6a40] text-white text-sm font-bold"
                  >
                    Enviar oferta
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      {delConf !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 animate-scale-in text-center">
            <div className="text-4xl mb-3">⚠️</div>
            <h3 className="text-lg font-bold text-[#18261d] font-display mb-2">
              Excluir pedido?
            </h3>
            <p className="text-sm text-[#6b8071] mb-5">
              Tem certeza de que deseja excluir este pedido?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDelConf(null)}
                className="flex-1 py-2.5 rounded-xl border border-[#e0eae2] text-sm font-medium text-[#6b8071]"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDel(delConf)}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-bold"
              >
                Excluir pedido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function RequestDetailsScreen({
  request,
  onBack,
  onOffer,
  onChat,
  user,
}: {
  request: Req
  onBack: () => void
  onOffer: () => void
  onChat: () => void
  user: User
}) {
  const owner =
    request.userId === 1
      ? user
      : USERS.find((u) => u.id === request.userId) || user
  const [offerSent, setOfferSent] = useState(false)
  return (
    <div className="animate-fade-up max-w-2xl mx-auto px-4 lg:px-6 py-8">
      <button
        onClick={onBack}
        className="text-sm text-[#2d6a40] font-bold mb-5"
      >
        ← Voltar para pedidos
      </button>
      <div className="bg-white border border-[#e0eae2] rounded-3xl p-6">
        <div className="flex items-start gap-4 mb-6">
          <Av initials={owner.avatar} image={owner.avatarUrl} size="lg" />
          <div>
            <p className="text-xs text-[#6b8071] mb-1">
              Pedido criado por {owner.name}
            </p>
            <h1 className="text-2xl font-bold text-[#18261d] font-display">
              {request.title}
            </h1>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <p className="text-xs font-bold text-[#6b8071] uppercase tracking-wide">
              Descrição
            </p>
            <p className="text-sm text-[#18261d] mt-1">
              {request.description || "Sem descrição adicional."}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#f4f7f4] rounded-xl p-3">
              <p className="text-xs text-[#6b8071]">Categoria</p>
              <p className="text-sm font-bold text-[#18261d] mt-1">
                {request.category || "Não informada"}
              </p>
            </div>
            <div className="bg-[#f4f7f4] rounded-xl p-3">
              <p className="text-xs text-[#6b8071]">
                Produto ou peça procurada
              </p>
              <p className="text-sm font-bold text-[#18261d] mt-1">
                {request.title}
              </p>
            </div>
            <div className="bg-[#f4f7f4] rounded-xl p-3">
              <p className="text-xs text-[#6b8071]">Localização aproximada</p>
              <p className="text-sm font-bold text-[#18261d] mt-1">
                {request.location || "Não informada"}
              </p>
            </div>
            <div className="bg-[#f4f7f4] rounded-xl p-3">
              <p className="text-xs text-[#6b8071]">Data</p>
              <p className="text-sm font-bold text-[#18261d] mt-1">
                {new Date(request.date).toLocaleDateString("pt-BR")}
              </p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-6">
          <button
            onClick={() => setOfferSent(true)}
            className="bg-[#2d6a40] text-white font-bold py-3 rounded-xl"
          >
            Tenho algo parecido
          </button>
          <button
            onClick={onChat}
            className="border-2 border-[#2d6a40] text-[#2d6a40] font-bold py-3 rounded-xl"
          >
            Conversar
          </button>
        </div>
      </div>
      {offerSent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 text-center">
            <p className="font-bold text-[#18261d] font-display text-lg">
              Oferta registrada
            </p>
            <p className="text-sm text-[#6b8071] mt-2 mb-5">
              Agora escolha sua publicação compatível na lista de pedidos.
            </p>
            <button
              onClick={() => {
                setOfferSent(false)
                onOffer()
              }}
              className="w-full bg-[#2d6a40] text-white rounded-xl py-3 font-bold"
            >
              Continuar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function ChatScreen({
  initConvId,
  user,
  items,
}: {
  initConvId: number | null
  user: User
  items: Item[]
}) {
  const [convs, setConvs] = usePersist<Conversation[]>(
    "rc_convs",
    INIT_CONVERSATIONS,
  )
  const [active, setActive] = useState<number | null>(initConvId)
  const [text, setText] = useState("")
  const [menuMsg, setMenuMsg] = useState<number | null>(null)
  const [editMsg, setEditMsg] = useState<Message | null>(null)
  const [editText, setEditText] = useState("")
  const [deleteMsg, setDeleteMsg] = useState<Message | null>(null)
  const endRef = useRef<HTMLDivElement>(null)
  const conv = convs.find((c) => c.id === active)
  const otherUser = conv ? USERS.find((u) => u.id === conv.userId) : null
  const relItem = conv ? items.find((i) => i.id === conv.itemId) : null
  useEffect(() => {
    if (initConvId) setActive(initConvId)
  }, [initConvId])
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [active, conv?.messages.length])
  const send = () => {
    if (!text.trim() || !conv) return
    const msg: Message = {
      id: Date.now(),
      from: 1,
      text: text.trim(),
      time: new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }
    setConvs((cs) =>
      cs.map((c) =>
        c.id === active ? { ...c, messages: [...c.messages, msg] } : c,
      ),
    )
    setText("")
  }
  const saveEdit = () => {
    if (!editMsg || !editText.trim() || !active) return
    setConvs((cs) =>
      cs.map((c) =>
        c.id === active
          ? {
              ...c,
              messages: c.messages.map((m) =>
                m.id === editMsg.id && m.from === 1 && !m.deleted
                  ? { ...m, text: editText.trim(), edited: true }
                  : m,
              ),
            }
          : c,
      ),
    )
    setEditMsg(null)
    setMenuMsg(null)
  }
  const removeMessage = () => {
    if (!deleteMsg || !active) return
    setConvs((cs) =>
      cs.map((c) =>
        c.id === active
          ? {
              ...c,
              messages: c.messages.map((m) =>
                m.id === deleteMsg.id && m.from === 1
                  ? {
                      ...m,
                      text: "Mensagem excluída",
                      deleted: true,
                      edited: false,
                    }
                  : m,
              ),
            }
          : c,
      ),
    )
    setDeleteMsg(null)
    setMenuMsg(null)
  }
  return (
    <div className="flex h-[calc(100vh-64px)] lg:max-w-5xl lg:mx-auto animate-fade-up">
      <div
        className={`${
          active ? "hidden md:flex" : "flex"
        } flex-col w-full md:w-80 border-r border-[#e0eae2] bg-white flex-shrink-0`}
      >
        <div className="px-4 py-4 border-b border-[#e0eae2]">
          <h2 className="text-lg font-bold text-[#18261d] font-display">
            Mensagens
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {convs.map((c) => {
            const u = USERS.find((u) => u.id === c.userId)!
            const it = items.find((i) => i.id === c.itemId)
            const last = c.messages[c.messages.length - 1]
            return (
              <button
                key={c.id}
                onClick={() => setActive(c.id)}
                className={`w-full text-left px-4 py-3 border-b border-[#f4f7f4] flex items-start gap-3 ${
                  active === c.id ? "bg-[#f0faf3]" : "hover:bg-[#f4f7f4]"
                }`}
              >
                <Av initials={u.avatar} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-sm text-[#18261d]">
                      {u.name}
                    </p>
                    <p className="text-[10px] text-[#6b8071]">{last?.time}</p>
                  </div>
                  {it && (
                    <p className="text-[10px] text-[#4a9e6b] font-medium">
                      {it.name}
                    </p>
                  )}
                  <p className="text-xs text-[#6b8071] mt-0.5 line-clamp-1">
                    {last?.text}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      </div>
      {active && conv ? (
        <div className="flex flex-col flex-1 bg-[#f4f7f4]">
          <div className="px-4 py-3 bg-white border-b border-[#e0eae2] flex items-center gap-3">
            <button
              onClick={() => setActive(null)}
              className="md:hidden w-8 h-8 flex items-center justify-center"
            >
              <svg
                className="w-5 h-5 text-[#6b8071]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            {otherUser && <Av initials={otherUser.avatar} size="sm" />}
            <div>
              <p className="font-bold text-sm text-[#18261d]">
                {otherUser?.name}
              </p>
              {relItem && (
                <p className="text-xs text-[#4a9e6b] font-medium">
                  {relItem.name}
                </p>
              )}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {conv.messages.map((m) => {
              const isMe = m.from === 1
              return (
                <div
                  key={m.id}
                  className={`flex ${
                    isMe ? "justify-end" : "justify-start"
                  } items-end gap-2`}
                >
                  {!isMe && otherUser && (
                    <Av initials={otherUser.avatar} size="xs" />
                  )}
                  <div className="relative">
                    <button
                      disabled={!isMe || m.deleted}
                      onClick={() =>
                        isMe &&
                        !m.deleted &&
                        setMenuMsg(menuMsg === m.id ? null : m.id)
                      }
                      className={`block max-w-xs px-4 py-2.5 rounded-2xl text-sm text-left ${
                        isMe
                          ? "bg-[#2d6a40] text-white rounded-tr-sm"
                          : "bg-white text-[#18261d] rounded-tl-sm shadow-sm"
                      } ${m.deleted ? "italic opacity-75" : ""}`}
                    >
                      {m.text}
                    </button>
                    <p
                      className={`text-[10px] text-[#6b8071] mt-1 ${
                        isMe ? "text-right" : "text-left"
                      }`}
                    >
                      {m.time}
                      {m.edited && !m.deleted ? " · Editada" : ""}
                    </p>
                    {menuMsg === m.id && isMe && !m.deleted && (
                      <div className="absolute right-0 bottom-full mb-2 bg-white border border-[#e0eae2] rounded-xl shadow-lg overflow-hidden z-10 w-36">
                        <button
                          onClick={() => {
                            setEditMsg(m)
                            setEditText(m.text)
                          }}
                          className="w-full text-left px-3 py-2 text-xs font-semibold text-[#18261d] hover:bg-[#f4f7f4]"
                        >
                          Editar mensagem
                        </button>
                        <button
                          onClick={() => setDeleteMsg(m)}
                          className="w-full text-left px-3 py-2 text-xs font-semibold text-red-500 hover:bg-red-50"
                        >
                          Excluir mensagem
                        </button>
                      </div>
                    )}
                  </div>
                  {isMe && (
                    <Av
                      initials={user.avatar}
                      image={user.avatarUrl}
                      size="xs"
                    />
                  )}
                </div>
              )
            })}
            <div ref={endRef} />
          </div>
          <div className="px-4 py-3 bg-white border-t border-[#e0eae2] flex gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Digite uma mensagem..."
              className="flex-1 px-4 py-2.5 bg-[#f4f7f4] rounded-xl text-sm border border-[#e0eae2]"
            />
            <button
              onClick={send}
              disabled={!text.trim()}
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                text.trim()
                  ? "bg-[#2d6a40] text-white"
                  : "bg-[#e0eae2] text-[#6b8071]"
              }`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        <div className="hidden md:flex flex-col flex-1 items-center justify-center bg-[#f4f7f4] text-[#6b8071]">
          <div className="text-5xl mb-3">💬</div>
          <p className="font-bold text-[#18261d] font-display">
            Selecione uma conversa
          </p>
        </div>
      )}
      {editMsg && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-5">
            <h3 className="font-bold text-[#18261d] font-display mb-3">
              Editar mensagem
            </h3>
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              rows={4}
              className="w-full border border-[#e0eae2] rounded-xl p-3 text-sm resize-none"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setEditMsg(null)}
                className="flex-1 py-2.5 border border-[#e0eae2] rounded-xl text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={saveEdit}
                className="flex-1 py-2.5 bg-[#2d6a40] text-white rounded-xl text-sm font-bold"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
      {deleteMsg && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 text-center">
            <h3 className="font-bold text-[#18261d] font-display text-lg mb-2">
              Excluir mensagem?
            </h3>
            <p className="text-sm text-[#6b8071] mb-5">
              Tem certeza de que deseja excluir esta mensagem?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteMsg(null)}
                className="flex-1 py-2.5 border border-[#e0eae2] rounded-xl text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={removeMessage}
                className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-bold"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function TransactionScreen({
  onBack,
  initTxId,
  items,
}: {
  onBack: () => void
  initTxId: number | null
  items: Item[]
}) {
  const [txs, setTxs] = useState(INIT_TRANSACTIONS)
  const [selected, setSelected] = useState(
    () => txs.find((t) => t.id === initTxId) || txs[0],
  )
  const item = items.find((i) => i.id === selected?.itemId) || items[0]
  useEffect(() => {
    const tx = txs.find((t) => t.id === initTxId)
    if (tx) setSelected(tx)
  }, [initTxId])
  const advance = () => {
    if (selected.step < 5) {
      const next = { ...selected, step: selected.step + 1 }
      setTxs((ts) => ts.map((t) => (t.id === selected.id ? next : t)))
      setSelected(next)
    }
  }
  return (
    <div className="animate-fade-up max-w-4xl mx-auto px-4 lg:px-6 pt-6 pb-12">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="w-9 h-9 border border-[#e0eae2] rounded-full flex items-center justify-center"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-[#18261d] font-display">
          Transações
        </h1>
      </div>
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          {txs.map((tx) => {
            const it = items.find((i) => i.id === tx.itemId) || items[0]
            return (
              <button
                key={tx.id}
                onClick={() => setSelected(tx)}
                className={`w-full text-left bg-white border rounded-2xl p-4 ${
                  selected?.id === tx.id
                    ? "border-[#2d6a40]"
                    : "border-[#e0eae2]"
                }`}
              >
                <p className="font-semibold text-sm text-[#18261d] font-display">
                  {it.name}
                </p>
                <p className="text-xs text-[#6b8071] mt-0.5">
                  {new Date(tx.date).toLocaleDateString("pt-BR")}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="bg-[#f4f7f4] rounded-full flex-1 h-1.5 overflow-hidden">
                    <div
                      className="bg-[#2d6a40] h-full"
                      style={{ width: `${(tx.step / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-[#6b8071]">
                    Etapa {tx.step}/5
                  </span>
                </div>
              </button>
            )
          })}
        </div>
        {selected && (
          <div className="lg:col-span-2 bg-white border border-[#e0eae2] rounded-2xl p-5">
            <div className="flex gap-3 mb-5 pb-4 border-b border-[#f4f7f4]">
              <div className="w-16 h-16 rounded-xl bg-[#e8f5ee] overflow-hidden flex-shrink-0">
                <img
                  src={itemImage(item)}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="font-bold text-[#18261d] font-display">
                  {item.name}
                </p>
                <p className="text-xs text-[#6b8071]">
                  {item.brand} · {item.purpose}
                </p>
                {item.price && (
                  <p className="text-[#2d6a40] font-bold mt-1">
                    R${" "}
                    {item.price.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-0 mb-6">
              {TX_STEPS.map((s, i) => {
                const done = i < selected.step
                const active = i === selected.step - 1
                return (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-sm border-2 flex-shrink-0 ${
                          done
                            ? "bg-[#2d6a40] border-[#2d6a40] text-white"
                            : active
                              ? "bg-[#e8f5ee] border-[#2d6a40] text-[#2d6a40]"
                              : "bg-white border-[#e0eae2] text-[#6b8071]"
                        }`}
                      >
                        {done ? "✓" : i + 1}
                      </div>
                      {i < TX_STEPS.length - 1 && (
                        <div
                          className={`w-0.5 h-8 mt-0.5 ${
                            done ? "bg-[#2d6a40]" : "bg-[#e0eae2]"
                          }`}
                        />
                      )}
                    </div>
                    <div className="pb-6 flex-1">
                      <p
                        className={`text-sm font-semibold mt-1 ${
                          done || active ? "text-[#18261d]" : "text-[#6b8071]"
                        }`}
                      >
                        {s}
                      </p>
                      {active && (
                        <span className="text-[10px] text-[#4a9e6b] font-bold">
                          ← Etapa atual
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
            {selected.step >= 5 ? (
              <div className="text-center bg-[#e8f5ee] rounded-2xl p-6">
                <div className="text-4xl mb-2">🎉</div>
                <p className="font-bold text-[#18261d] font-display text-lg">
                  Transação concluída!
                </p>
              </div>
            ) : (
              <button
                onClick={advance}
                className="w-full bg-[#2d6a40] text-white font-bold py-3.5 rounded-xl hover:bg-[#1a3a24]"
              >
                {selected.step === 4
                  ? "Confirmar recebimento ✓"
                  : "Avançar etapa →"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function ProfileScreen({
  items,
  setItems,
  favorites,
  onItem,
  onNav,
  onOpenTransaction,
  onLogout,
  user,
  setUser,
}: {
  items: Item[]
  setItems: React.Dispatch<React.SetStateAction<Item[]>>
  favorites: number[]
  onItem: (i: Item) => void
  onNav: (s: Screen) => void
  onOpenTransaction: (id?: number) => void
  onLogout: () => void
  user: User
  setUser: React.Dispatch<React.SetStateAction<User>>
}) {
  const [tab, setTab] = useState(0)
  const myItems = items.filter((i) => i.ownerId === 1)
  const [editMode, setEditMode] = useState(false)
  const [editUser, setEditUser] = useState<User>(user)
  const [confirmDel, setConfirmDel] = useState<number | null>(null)
  const [confirmAccount, setConfirmAccount] = useState(false)
  const [settingsModal, setSettingsModal] = useState<string | null>(null)
  const [settingsNote, setSettingsNote] = useState("")
  const [editItem, setEditItem] = useState<Item | null>(null)
  const avatarInput = useRef<HTMLInputElement>(null)
  const [theme, setTheme] = usePersist<"light" | "dark" | "system">(
    "rc_theme",
    "light",
  )
  const TABS = [
    "Minhas Publicações",
    "Meus Pedidos",
    "Compras",
    "Vendas",
    "Doações",
    "Favoritos",
    "Histórico",
    "Configurações",
  ]
  const favItems = items.filter((i) => favorites.includes(i.id))
  const purchases = INIT_TRANSACTIONS.filter(
    (t) => t.receiverId === 1 && t.status === "concluída",
  )
  const sales = INIT_TRANSACTIONS.filter(
    (t) => t.senderId === 1 && t.status === "concluída",
  )
  const donations = myItems.filter(
    (i) => i.purpose === "Doar" && i.status === "concluído",
  )
  const handlePause = (id: number) =>
    setItems((its) =>
      its.map((i) =>
        i.id === id
          ? {
              ...i,
              status: (i.status === "pausado"
                ? "disponível"
                : "pausado") as ItemStatus,
            }
          : i,
      ),
    )
  const handleDone = (id: number) =>
    setItems((its) =>
      its.map((i) =>
        i.id === id ? { ...i, status: "concluído" as ItemStatus } : i,
      ),
    )
  const handleDel = (id: number) => {
    setItems((its) => its.filter((i) => i.id !== id))
    setConfirmDel(null)
  }
  const chooseAvatar = (files: FileList | null) => {
    const file = files?.[0]
    if (!file || !file.type.startsWith("image/")) return
    const reader = new FileReader()
    reader.onload = () =>
      setEditUser((u) => ({ ...u, avatarUrl: String(reader.result) }))
    reader.readAsDataURL(file)
  }
  const openSetting = (name: string) => {
    setSettingsModal(name)
    setSettingsNote("")
  }
  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  function Toggle({
    label,
    desc,
    def,
  }: {
    label: string
    desc: string
    def: boolean
  }) {
    const [on, setOn] = useState(def)
    return (
      <div className="bg-white border border-[#e0eae2] rounded-2xl px-5 py-4 flex items-center justify-between">
        <div>
          <p className="font-semibold text-sm text-[#18261d]">{label}</p>
          <p className="text-xs text-[#6b8071] mt-0.5">{desc}</p>
        </div>
        <button
          onClick={() => setOn(!on)}
          className={`w-12 h-6 rounded-full relative ${
            on ? "bg-[#2d6a40]" : "bg-[#e0eae2]"
          }`}
        >
          <div
            className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
              on ? "translate-x-6" : "translate-x-0.5"
            }`}
          />
        </button>
      </div>
    )
  }

  return (
    <div className="animate-fade-up max-w-6xl mx-auto lg:px-6 lg:py-6">
      <div className="profile-hero bg-gradient-to-br from-[#1a3a24] to-[#2d6a40] px-4 sm:px-6 pt-6 sm:pt-8 pb-5 sm:pb-6 lg:rounded-3xl">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5 mb-6">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <Av initials={user.avatar} image={user.avatarUrl} size="xl" />
            <div className="min-w-0">
              <h2 className="text-white font-bold text-xl sm:text-2xl font-display truncate">
                {user.name}
              </h2>
              <p className="text-[#a8d4b8] text-sm truncate">{user.city}</p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-amber-300 font-bold">
                  ★ {user.reputation}
                </span>
                <span className="text-[#a8d4b8] text-sm">
                  {user.transactions} transações
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              setEditUser(user)
              setEditMode(true)
            }}
            className="w-full sm:w-auto text-sm font-bold text-white border border-white/30 px-4 py-2.5 rounded-xl hover:bg-white/10"
          >
            Editar perfil
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          {[
            { v: myItems.length, l: "Publicações", action: () => setTab(0) },
            {
              v: myItems.filter((i) => i.status === "concluído").length,
              l: "Concluídas",
              action: () => setTab(6),
            },
            {
              v: user.transactions,
              l: "Transações",
              action: () => onOpenTransaction(),
            },
            { v: favItems.length, l: "Favoritos", action: () => setTab(5) },
          ].map((s) => (
            <button
              key={s.l}
              onClick={s.action}
              className="bg-white/10 hover:bg-white/20 focus:bg-white/20 rounded-xl p-3.5 text-center transition-colors min-h-16"
            >
              <p className="text-white font-bold text-xl font-display">{s.v}</p>
              <p className="text-[#a8d4b8] text-xs font-medium">{s.l}</p>
            </button>
          ))}
        </div>
      </div>
      <div className="flex border-b border-[#e0eae2] overflow-x-auto bg-white sticky top-16 z-10 lg:mt-4 lg:rounded-t-2xl">
        {TABS.map((t, i) => (
          <button
            key={t}
            onClick={() => setTab(i)}
            className={`flex-shrink-0 px-4 py-3 text-xs font-bold border-b-2 ${
              tab === i
                ? "border-[#2d6a40] text-[#2d6a40]"
                : "border-transparent text-[#6b8071]"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="px-4 lg:px-6 py-5">
        {tab === 0 && (
          <div className="space-y-3">
            {myItems.length === 0 && (
              <div className="text-center py-12">
                <p className="text-4xl mb-2">📦</p>
                <p className="font-semibold text-[#18261d]">
                  Nenhuma publicação ainda
                </p>
                <button
                  onClick={() => onNav("publish")}
                  className="mt-3 text-sm text-[#2d6a40] font-bold hover:underline"
                >
                  Publicar agora →
                </button>
              </div>
            )}
            {myItems.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-[#e0eae2] rounded-2xl p-4 flex gap-3"
              >
                <button
                  onClick={() => onItem(item)}
                  className="w-16 h-16 rounded-xl bg-[#e8f5ee] overflow-hidden flex-shrink-0"
                >
                  <img
                    src={itemImage(item)}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <button
                      onClick={() => onItem(item)}
                      className="font-bold text-sm text-[#18261d] font-display hover:text-[#2d6a40] text-left"
                    >
                      {item.name}
                    </button>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0 ${
                        item.status === "disponível"
                          ? "bg-emerald-50 text-emerald-700"
                          : item.status === "pausado"
                            ? "bg-gray-100 text-gray-500"
                            : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#6b8071] mt-0.5">
                    {item.category} · {item.purpose}
                  </p>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    <button
                      onClick={() => setEditItem(item)}
                      className="text-xs text-[#2d6a40] border border-[#2d6a40]/30 px-2.5 py-1 rounded-lg hover:bg-[#e8f5ee]"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handlePause(item.id)}
                      className="text-xs text-[#6b8071] border border-[#e0eae2] px-2.5 py-1 rounded-lg hover:bg-[#f4f7f4]"
                    >
                      {item.status === "pausado" ? "Reativar" : "Pausar"}
                    </button>
                    <button
                      onClick={() => handleDone(item.id)}
                      className="text-xs text-[#2d6a40] border border-[#2d6a40]/30 px-2.5 py-1 rounded-lg hover:bg-[#e8f5ee]"
                    >
                      Marcar concluído
                    </button>
                    <button
                      onClick={() => setConfirmDel(item.id)}
                      className="text-xs text-red-400 border border-red-200 px-2.5 py-1 rounded-lg hover:bg-red-50"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {tab === 1 && (
          <div>
            <div className="flex justify-end mb-3">
              <button
                onClick={() => onNav("requests")}
                className="text-sm text-[#2d6a40] font-bold hover:underline"
              >
                Ver todos →
              </button>
            </div>
            {INIT_REQUESTS.filter((r) => r.userId === 1).map((req) => (
              <div
                key={req.id}
                className="bg-white border border-[#e0eae2] rounded-2xl p-4 mb-3"
              >
                <p className="font-bold text-sm text-[#18261d] font-display">
                  {req.title}
                </p>
                <p className="text-xs text-[#6b8071] mt-0.5">{req.category}</p>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => onNav("requests")}
                    className="text-xs text-[#2d6a40] border border-[#2d6a40]/30 px-3 py-1.5 rounded-lg"
                  >
                    Editar na lista
                  </button>
                  <button
                    onClick={() => onNav("requests")}
                    className="text-xs text-red-400 border border-red-200 px-3 py-1.5 rounded-lg"
                  >
                    Gerenciar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        {tab === 2 && (
          <div className="space-y-3">
            {purchases.length === 0 && (
              <div className="text-center py-12">
                <p className="text-4xl mb-2">🛒</p>
                <p className="font-semibold text-[#18261d]">
                  Nenhuma compra ainda
                </p>
              </div>
            )}
            {purchases.map((tx) => {
              const it = items.find((i) => i.id === tx.itemId) || items[0]
              const u = USERS.find((u) => u.id === tx.senderId)!
              return (
                <button
                  key={tx.id}
                  onClick={() => onOpenTransaction(tx.id)}
                  className="w-full bg-white border border-[#e0eae2] rounded-2xl p-4 flex gap-3 text-left hover:border-[#4a9e6b] hover:shadow-sm transition-all"
                >
                  <div className="w-14 h-14 rounded-xl bg-[#e8f5ee] overflow-hidden flex-shrink-0">
                    <img
                      src={itemImage(it)}
                      alt={it.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-[#18261d] font-display">
                      {it.name}
                    </p>
                    <p className="text-xs text-[#6b8071] mt-0.5">
                      Vendido por {u.name}
                    </p>
                    {it.price && (
                      <p className="text-[#2d6a40] font-bold text-sm mt-1">
                        R${" "}
                        {it.price.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                    )}
                    <p className="text-xs text-[#2d6a40] font-bold mt-2">
                      Ver detalhes →
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        )}
        {tab === 3 && (
          <div className="space-y-3">
            {sales.length === 0 && (
              <div className="text-center py-12">
                <p className="text-4xl mb-2">💰</p>
                <p className="font-semibold text-[#18261d]">
                  Nenhuma venda ainda
                </p>
              </div>
            )}
            {sales.map((tx) => {
              const it = items.find((i) => i.id === tx.itemId) || items[0]
              const u = USERS.find((u) => u.id === tx.receiverId)!
              return (
                <button
                  key={tx.id}
                  onClick={() => onOpenTransaction(tx.id)}
                  className="w-full bg-white border border-[#e0eae2] rounded-2xl p-4 flex gap-3 text-left hover:border-[#4a9e6b] hover:shadow-sm transition-all min-h-20"
                >
                  <div className="w-14 h-14 rounded-xl bg-[#e8f5ee] overflow-hidden flex-shrink-0">
                    <img
                      src={itemImage(it)}
                      alt={it.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm text-[#18261d] font-display">
                      {it.name}
                    </p>
                    <p className="text-xs text-[#6b8071] mt-0.5">
                      Para {u.name}
                    </p>
                    <p className="text-xs text-[#2d6a40] font-bold mt-2">
                      Ver detalhes da venda →
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        )}
        {tab === 4 && (
          <div className="space-y-3">
            {donations.length === 0 && (
              <div className="text-center py-12">
                <p className="text-4xl mb-2">🎁</p>
                <p className="font-semibold text-[#18261d]">
                  Nenhuma doação concluída
                </p>
              </div>
            )}
            {donations.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-[#e0eae2] rounded-2xl p-4 flex gap-3"
              >
                <div className="w-14 h-14 rounded-xl bg-[#e8f5ee] overflow-hidden flex-shrink-0">
                  <img
                    src={itemImage(item)}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-bold text-sm text-[#18261d] font-display">
                    {item.name}
                  </p>
                  <Bdg label="Doação" v="free" />
                </div>
              </div>
            ))}
          </div>
        )}
        {tab === 5 && (
          <div>
            {favItems.length === 0 && (
              <div className="text-center py-12">
                <p className="text-4xl mb-2">❤️</p>
                <p className="font-semibold text-[#18261d]">
                  Nenhum favorito ainda
                </p>
                <p className="text-sm text-[#6b8071] mt-1">
                  Clique no ♡ nos cards para salvar
                </p>
              </div>
            )}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {favItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onItem(item)}
                  className="bg-white rounded-2xl overflow-hidden border border-[#e0eae2] text-left hover:shadow-md group"
                >
                  <div className="h-32 bg-[#e8f5ee] overflow-hidden">
                    <img
                      src={itemImage(item)}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-3">
                    <p className="font-bold text-xs text-[#18261d] font-display line-clamp-1">
                      {item.name}
                    </p>
                    {item.price ? (
                      <p className="text-[#2d6a40] font-bold text-sm mt-0.5">
                        R$ {item.price}
                      </p>
                    ) : (
                      <Bdg label="Gratuito" v="free" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
        {tab === 6 && (
          <div className="space-y-3">
            {INIT_TRANSACTIONS.map((tx) => {
              const it = items.find((i) => i.id === tx.itemId) || items[0]
              return (
                <button
                  key={tx.id}
                  onClick={() => onOpenTransaction(tx.id)}
                  className="w-full bg-white border border-[#e0eae2] rounded-2xl p-4 text-left hover:border-[#4a9e6b] hover:shadow-sm transition-all min-h-20"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-bold text-sm text-[#18261d] font-display">
                        {it.name}
                      </p>
                      <p className="text-xs text-[#6b8071] mt-0.5">
                        {new Date(tx.date).toLocaleDateString("pt-BR")} · Toque
                        para ver detalhes
                      </p>
                    </div>
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-bold flex-shrink-0 ${
                        tx.status === "concluída"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {tx.status}
                    </span>
                  </div>
                  <div className="mt-3 bg-[#f4f7f4] rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-[#2d6a40] h-full"
                      style={{ width: `${(tx.step / 5) * 100}%` }}
                    />
                  </div>
                </button>
              )
            })}
          </div>
        )}
        {tab === 7 && (
          <div className="max-w-2xl space-y-6">
            <div>
              <p className="text-xs font-bold text-[#6b8071] uppercase tracking-wide mb-2">
                Conta
              </p>
              <div className="bg-white border border-[#e0eae2] rounded-2xl divide-y divide-[#f4f7f4]">
                {[
                  "Editar nome",
                  "Editar e-mail",
                  "Alterar foto",
                  "Cidade/localização",
                  "Bio",
                ].map((label) => (
                  <button
                    key={label}
                    onClick={() => {
                      if (label === "Alterar foto") {
                        setEditUser(user)
                        avatarInput.current?.click()
                      } else openSetting(label)
                    }}
                    className="w-full flex justify-between px-5 py-3 text-sm font-semibold text-[#18261d] hover:bg-[#f4f7f4]"
                  >
                    <span>{label}</span>
                    <span>›</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-[#6b8071] uppercase tracking-wide mb-2">
                Notificações
              </p>
              <div className="space-y-2">
                <Toggle
                  label="Mensagens"
                  desc="Novas mensagens no chat"
                  def={true}
                />
                <Toggle
                  label="Novos interesses"
                  desc="Interesses nas suas publicações"
                  def={true}
                />
                <Toggle
                  label="Atualizações de pedidos"
                  desc="Mudanças nos seus pedidos"
                  def={true}
                />
                <Toggle
                  label="Atualizações de negociações"
                  desc="Etapas de transações"
                  def={true}
                />
                <Toggle
                  label="Avisos da plataforma"
                  desc="Novidades importantes"
                  def={false}
                />
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-[#6b8071] uppercase tracking-wide mb-2">
                Privacidade
              </p>
              <div className="space-y-2">
                <Toggle
                  label="Visibilidade do perfil"
                  desc="Perfil visível publicamente"
                  def={true}
                />
                <Toggle
                  label="Mostrar localização aproximada"
                  desc="Exibir apenas cidade e estado"
                  def={true}
                />
                <button
                  onClick={() => openSetting("Usuários bloqueados")}
                  className="w-full bg-white border border-[#e0eae2] rounded-2xl px-5 py-4 text-left font-semibold text-sm text-[#18261d]"
                >
                  Usuários bloqueados <span className="float-right">›</span>
                </button>
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-[#6b8071] uppercase tracking-wide mb-2">
                Aparência
              </p>
              <div className="bg-white border border-[#e0eae2] rounded-2xl p-2 grid grid-cols-3 gap-2">
                {([
                  ["light", "Tema claro"],
                  ["dark", "Tema escuro"],
                  ["system", "Usar sistema"],
                ] as const).map(([value, label]) => (
                  <button
                    key={value}
                    onClick={() => setTheme(value)}
                    className={`px-3 py-3 rounded-xl text-xs font-bold ${
                      theme === value
                        ? "bg-[#2d6a40] text-white"
                        : "text-[#6b8071] hover:bg-[#f4f7f4]"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-[#6b8071] uppercase tracking-wide mb-2">
                Segurança
              </p>
              <div className="bg-white border border-[#e0eae2] rounded-2xl divide-y divide-[#f4f7f4]">
                {[
                  "Alterar senha",
                  "Sessões/dispositivos conectados",
                  "Sair da conta",
                ].map((label) => (
                  <button
                    key={label}
                    onClick={() =>
                      label === "Sair da conta"
                        ? onLogout()
                        : openSetting(label)
                    }
                    className="w-full flex justify-between px-5 py-3 text-sm font-semibold text-[#18261d] hover:bg-[#f4f7f4]"
                  >
                    <span>{label}</span>
                    <span>›</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-[#6b8071] uppercase tracking-wide mb-2">
                Suporte
              </p>
              <div className="bg-white border border-[#e0eae2] rounded-2xl divide-y divide-[#f4f7f4]">
                {[
                  "Central de Ajuda",
                  "Reportar problema",
                  "Termos de Uso",
                  "Política de Privacidade",
                ].map((label) => (
                  <button
                    key={label}
                    onClick={() =>
                      label === "Central de Ajuda" ||
                      label === "Reportar problema"
                        ? onNav("support")
                        : openSetting(label)
                    }
                    className="w-full flex justify-between px-5 py-3 text-sm font-semibold text-[#18261d] hover:bg-[#f4f7f4]"
                  >
                    <span>{label}</span>
                    <span>›</span>
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={() => setConfirmAccount(true)}
              className="w-full border border-red-200 text-red-500 bg-white rounded-2xl py-4 font-bold text-sm"
            >
              Excluir minha conta
            </button>
          </div>
        )}
      </div>
      <input
        ref={avatarInput}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          chooseAvatar(e.target.files)
          setEditMode(true)
          e.target.value = ""
        }}
      />
      {editMode && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-5 animate-scale-in max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-[#18261d] font-display mb-4">
              Editar perfil
            </h3>
            <div className="flex items-center gap-4 mb-4">
              <Av
                initials={editUser.avatar}
                image={editUser.avatarUrl}
                size="lg"
              />
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => avatarInput.current?.click()}
                  className="text-xs font-bold text-[#2d6a40] border border-[#2d6a40]/30 rounded-lg px-3 py-2"
                >
                  Alterar foto
                </button>
                {editUser.avatarUrl && (
                  <button
                    onClick={() =>
                      setEditUser((u) => ({ ...u, avatarUrl: undefined }))
                    }
                    className="text-xs font-bold text-red-500 border border-red-200 rounded-lg px-3 py-2"
                  >
                    Remover foto
                  </button>
                )}
              </div>
            </div>
            <div className="space-y-3 mb-4">
              {([
                ["Nome", "name"],
                ["E-mail", "email"],
                ["Cidade", "city"],
                ["Bio", "bio"],
              ] as [string, keyof User][]).map(([l, k]) => (
                <div key={k}>
                  <label className="text-xs font-bold text-[#6b8071] uppercase tracking-wide mb-1 block">
                    {l}
                  </label>
                  {k === "bio" ? (
                    <textarea
                      value={String(editUser[k] || "")}
                      onChange={(e) =>
                        setEditUser((u: User) => ({
                          ...u,
                          [k]: e.target.value,
                        }))
                      }
                      rows={3}
                      className="w-full px-3.5 py-2.5 border border-[#e0eae2] rounded-xl text-sm resize-none"
                    />
                  ) : (
                    <input
                      value={String(editUser[k] || "")}
                      onChange={(e) =>
                        setEditUser((u: User) => ({
                          ...u,
                          [k]: e.target.value,
                        }))
                      }
                      className="w-full px-3.5 py-2.5 border border-[#e0eae2] rounded-xl text-sm"
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setEditUser(user)
                  setEditMode(false)
                }}
                className="flex-1 py-2.5 rounded-xl border border-[#e0eae2] text-sm font-medium text-[#6b8071]"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  setUser(editUser)
                  setEditMode(false)
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#2d6a40] text-white text-sm font-bold"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
      {confirmDel !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 animate-scale-in text-center">
            <div className="text-4xl mb-3">⚠️</div>
            <h3 className="text-lg font-bold text-[#18261d] font-display mb-2">
              Excluir publicação?
            </h3>
            <p className="text-sm text-[#6b8071] mb-5">
              Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDel(null)}
                className="flex-1 py-2.5 rounded-xl border border-[#e0eae2] text-sm font-medium text-[#6b8071]"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDel(confirmDel)}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-bold"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
      {editItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-5">
            <h3 className="font-bold text-[#18261d] font-display text-lg mb-4">
              Editar publicação
            </h3>
            <div className="space-y-3">
              <input
                value={editItem.name}
                onChange={(e) =>
                  setEditItem({ ...editItem, name: e.target.value })
                }
                className="w-full border border-[#e0eae2] rounded-xl px-3 py-2.5 text-sm"
              />
              <textarea
                value={editItem.description}
                onChange={(e) =>
                  setEditItem({ ...editItem, description: e.target.value })
                }
                rows={4}
                className="w-full border border-[#e0eae2] rounded-xl px-3 py-2.5 text-sm resize-none"
              />
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setEditItem(null)}
                className="flex-1 border border-[#e0eae2] rounded-xl py-2.5 text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  setItems((its) =>
                    its.map((i) => (i.id === editItem.id ? editItem : i)),
                  )
                  setEditItem(null)
                }}
                className="flex-1 bg-[#2d6a40] text-white rounded-xl py-2.5 text-sm font-bold"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
      {settingsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-5">
            <h3 className="font-bold text-[#18261d] font-display text-lg">
              {settingsModal}
            </h3>
            <p className="text-sm text-[#6b8071] mt-2">
              {settingsModal === "Usuários bloqueados"
                ? "Você não possui usuários bloqueados."
                : settingsModal === "Sessões/dispositivos conectados"
                  ? "Sessão atual: Navegador neste dispositivo."
                  : settingsModal === "Termos de Uso" ||
                      settingsModal === "Política de Privacidade"
                    ? "Documento demonstrativo disponível para leitura nesta simulação."
                    : "Esta ação será simulada com segurança."}
            </p>
            {![
              "Usuários bloqueados",
              "Sessões/dispositivos conectados",
              "Termos de Uso",
              "Política de Privacidade",
            ].includes(settingsModal) && (
              <input
                value={settingsNote}
                onChange={(e) => setSettingsNote(e.target.value)}
                placeholder={
                  settingsModal === "Alterar senha"
                    ? "Nova senha"
                    : "Digite a nova informação"
                }
                type={settingsModal === "Alterar senha" ? "password" : "text"}
                className="w-full border border-[#e0eae2] rounded-xl px-3 py-2.5 text-sm mt-4"
              />
            )}
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setSettingsModal(null)}
                className="flex-1 border border-[#e0eae2] rounded-xl py-2.5 text-sm"
              >
                Fechar
              </button>
              <button
                onClick={() => {
                  if (settingsModal === "Editar nome" && settingsNote)
                    setUser((u) => ({ ...u, name: settingsNote }))
                  if (settingsModal === "Editar e-mail" && settingsNote)
                    setUser((u) => ({ ...u, email: settingsNote }))
                  if (settingsModal === "Cidade/localização" && settingsNote)
                    setUser((u) => ({ ...u, city: settingsNote }))
                  if (settingsModal === "Bio" && settingsNote)
                    setUser((u) => ({ ...u, bio: settingsNote }))
                  setSettingsModal(null)
                }}
                className="flex-1 bg-[#2d6a40] text-white rounded-xl py-2.5 text-sm font-bold"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
      {confirmAccount && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 text-center">
            <h3 className="font-bold text-[#18261d] font-display text-lg mb-2">
              Excluir minha conta?
            </h3>
            <p className="text-sm text-[#6b8071] mb-5">
              Esta ação removeria permanentemente seus dados. Nesta
              demonstração, a conta será apenas desconectada.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmAccount(false)}
                className="flex-1 border border-[#e0eae2] rounded-xl py-2.5 text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  setConfirmAccount(false)
                  onNav("home")
                }}
                className="flex-1 bg-red-500 text-white rounded-xl py-2.5 text-sm font-bold"
              >
                Excluir conta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [theme] = usePersist<"light" | "dark" | "system">("rc_theme", "light")
  const [mode, setMode] = useState<"login" | "forgot" | "register">("login")
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({ name: "", email: "", password: "" })
  const [sent, setSent] = useState(false)
  const update = (key: keyof typeof form, value: string) =>
    setForm((current) => ({ ...current, [key]: value }))
  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])
  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    if (mode === "forgot") {
      setSent(true)
      return
    }
    onLogin()
  }
  return (
    <div className="login-shell min-h-screen bg-white grid lg:grid-cols-[1.05fr_0.95fr]">
      <section className="login-brand-panel hidden lg:flex bg-[#101713] px-12 py-10 text-white flex-col justify-between relative overflow-hidden">
        <div className="absolute -right-24 top-24 w-72 h-72 rounded-full border border-[#4a9e6b]/20" />
        <div className="absolute right-20 bottom-16 w-44 h-44 rounded-full bg-[#2d6a40]/20 blur-2xl" />
        <Logo dark={false} size="lg" />
        <div className="relative max-w-lg">
          <p className="text-[#5bbf7a] text-sm font-bold uppercase tracking-[0.2em] mb-4">
            Economia circular
          </p>
          <h1 className="font-display text-4xl xl:text-5xl font-bold leading-tight">
            Tecnologia que circula. Impacto que diminui.
          </h1>
          <p className="text-white/65 text-lg leading-relaxed mt-5">
            Conecte eletrônicos a novas possibilidades de uso, doação, venda e
            reaproveitamento.
          </p>
          <div className="grid grid-cols-3 gap-3 mt-10">
            {[
              ["1.248", "itens reaproveitados"],
              ["386 kg", "fora do descarte"],
              ["824", "pessoas conectadas"],
            ].map(([value, label]) => (
              <div key={label} className="border-t border-white/15 pt-4">
                <p className="text-xl font-bold font-display">{value}</p>
                <p className="text-xs text-white/50 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-white/40">
          Uma comunidade por uma tecnologia mais consciente.
        </p>
      </section>
      <main className="flex min-h-screen items-center justify-center px-5 py-8 sm:px-10">
        <div className="w-full max-w-md animate-fade-up">
          <div className="login-mobile-logo lg:hidden flex justify-center mb-10">
            <Logo dark={true} size="lg" />
          </div>
          <div className="mb-8">
            <p className="text-[#2d6a40] text-sm font-bold mb-2">
              {mode === "login"
                ? "Bem-vindo de volta"
                : mode === "forgot"
                  ? "Recupere seu acesso"
                  : "Comece a fazer parte"}
            </p>
            <h2 className="text-3xl font-bold text-[#18261d] font-display">
              {mode === "login"
                ? "Acesse sua conta"
                : mode === "forgot"
                  ? "Esqueceu sua senha?"
                  : "Crie sua conta"}
            </h2>
            <p className="text-[#6b8071] mt-2">
              {mode === "login"
                ? "Continue dando novos destinos à tecnologia."
                : mode === "forgot"
                  ? "Informe seu e-mail e enviaremos as orientações."
                  : "Cadastre-se para publicar e encontrar eletrônicos."}
            </p>
          </div>
          {sent ? (
            <div className="bg-[#e8f5ee] border border-[#4a9e6b]/30 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-[#2d6a40] text-white flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p className="font-bold text-[#18261d]">Confira seu e-mail</p>
              <p className="text-sm text-[#6b8071] mt-1">
                As instruções de recuperação foram simuladas com sucesso.
              </p>
              <button
                onClick={() => {
                  setSent(false)
                  setMode("login")
                }}
                className="mt-5 text-sm font-bold text-[#2d6a40]"
              >
                Voltar para entrar
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-5">
              {mode === "register" && (
                <div>
                  <label className="text-xs font-bold text-[#6b8071] uppercase tracking-wide mb-1.5 block">
                    Nome completo
                  </label>
                  <input
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    required
                    placeholder="Como você quer ser chamado?"
                    className="w-full px-4 py-3.5 bg-white border border-[#e0eae2] rounded-xl text-sm"
                  />
                </div>
              )}
              <div>
                <label className="text-xs font-bold text-[#6b8071] uppercase tracking-wide mb-1.5 block">
                  E-mail
                </label>
                <input
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  required
                  type="email"
                  placeholder="seu@email.com"
                  className="w-full px-4 py-3.5 bg-white border border-[#e0eae2] rounded-xl text-sm"
                />
              </div>
              {mode !== "forgot" && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-[#6b8071] uppercase tracking-wide">
                      Senha
                    </label>
                    {mode === "login" && (
                      <button
                        type="button"
                        onClick={() => setMode("forgot")}
                        className="text-xs font-bold text-[#2d6a40]"
                      >
                        Esqueci minha senha
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      value={form.password}
                      onChange={(e) => update("password", e.target.value)}
                      required
                      minLength={4}
                      type={showPassword ? "text" : "password"}
                      placeholder="Digite sua senha"
                      className="w-full px-4 pr-12 py-3.5 bg-white border border-[#e0eae2] rounded-xl text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      aria-label={
                        showPassword ? "Ocultar senha" : "Mostrar senha"
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b8071]"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.46 12C3.73 7.94 7.52 5 12 5s8.27 2.94 9.54 7c-1.27 4.06-5.06 7-9.54 7s-8.27-2.94-9.54-7z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
              <button
                type="submit"
                className="w-full bg-[#2d6a40] hover:bg-[#1a3a24] text-white font-bold py-3.5 rounded-xl transition-colors"
              >
                {mode === "login"
                  ? "Entrar"
                  : mode === "forgot"
                    ? "Enviar orientações"
                    : "Criar conta"}
              </button>
              <div className="flex items-center gap-3">
                <div className="h-px bg-[#e0eae2] flex-1" />
                <span className="text-xs text-[#6b8071]">ou</span>
                <div className="h-px bg-[#e0eae2] flex-1" />
              </div>
              <p className="text-center text-sm text-[#6b8071]">
                {mode === "login"
                  ? "Ainda não tem uma conta?"
                  : "Já possui uma conta?"}{" "}
                <button
                  type="button"
                  onClick={() =>
                    setMode(mode === "login" ? "register" : "login")
                  }
                  className="font-bold text-[#2d6a40]"
                >
                  {mode === "login" ? "Criar conta" : "Entrar"}
                </button>
              </p>
              {mode === "forgot" && (
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="w-full text-sm font-bold text-[#6b8071]"
                >
                  Voltar para o login
                </button>
              )}
            </form>
          )}
          <p className="text-center text-xs text-[#6b8071] mt-8">
            Interface demonstrativa. Nenhum pagamento é processado pela
            plataforma.
          </p>
        </div>
      </main>
    </div>
  )
}

function AboutScreen() {
  return (
    <div className="animate-fade-up max-w-4xl mx-auto px-4 lg:px-6 py-10">
      <div className="text-center mb-10">
        <Logo dark={true} size="lg" />
        <h1 className="text-3xl font-bold text-[#18261d] font-display mt-4 mb-3">
          Sobre o Re-Conecta
        </h1>
        <p className="text-[#6b8071] text-lg max-w-2xl mx-auto leading-relaxed">
          O Re-Conecta é uma plataforma criada para conectar pessoas e aumentar
          a vida útil de equipamentos eletrônicos.
        </p>
      </div>
      <div className="bg-gradient-to-br from-[#1a3a24] to-[#2d6a40] rounded-3xl p-8 text-center mb-8">
        <p className="text-2xl font-bold text-white font-display italic">
          "Antes de descartar, Re-Conecta."
        </p>
        <p className="text-[#a8d4b8] mt-2">
          Consumo consciente · Conecta pessoas
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        {[
          {
            icon: "🌍",
            t: "O problema",
            d: "O Brasil descarta 2,1 milhões de toneladas de lixo eletrônico por ano. A maioria poderia ser reaproveitada antes de virar resíduo.",
          },
          {
            icon: "♻️",
            t: "Nossa solução",
            d: "Conectamos quem tem eletrônicos sem uso com quem precisa, através de venda, doação, reutilização ou reaproveitamento de peças.",
          },
          {
            icon: "🔗",
            t: "Economia circular",
            d: "Promovemos um modelo onde cada componente tem seu máximo aproveitamento antes de ser descartado.",
          },
          {
            icon: "🤝",
            t: "Comunidade",
            d: "Somos uma rede colaborativa onde a tecnologia une pessoas com o mesmo objetivo: consumo mais consciente.",
          },
        ].map((s) => (
          <div
            key={s.t}
            className="bg-white border border-[#e0eae2] rounded-2xl p-6"
          >
            <div className="text-3xl mb-3">{s.icon}</div>
            <h3 className="font-bold text-[#18261d] font-display mb-2">
              {s.t}
            </h3>
            <p className="text-sm text-[#6b8071] leading-relaxed">{s.d}</p>
          </div>
        ))}
      </div>
      <div className="mb-10">
        <h2 className="text-xl font-bold text-[#18261d] font-display mb-6 text-center">
          Como funciona
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            ["1", "Publique", "Cadastre seu eletrônico", "📤"],
            ["2", "Encontre", "Busque o que precisa", "🔍"],
            ["3", "Conecte-se", "Fale com o usuário", "💬"],
            ["4", "Reutilize", "Dê nova vida ao item", "♻️"],
            ["5", "Reduza", "Menos lixo eletrônico", "🌱"],
          ].map(([n, t, d, i]) => (
            <div
              key={n}
              className="bg-white border border-[#e0eae2] rounded-2xl p-4 text-center"
            >
              <div className="w-8 h-8 bg-[#2d6a40] text-white rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-2">
                {n}
              </div>
              <div className="text-2xl mb-1">{i}</div>
              <p className="font-bold text-sm text-[#18261d] font-display">
                {t}
              </p>
              <p className="text-xs text-[#6b8071] mt-0.5">{d}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-[#f0faf3] border border-[#c0dfc9] rounded-2xl p-6 text-center">
        <p className="font-bold text-[#18261d] font-display text-lg mb-1">
          Faça parte da mudança
        </p>
        <p className="text-sm text-[#6b8071]">
          Cada eletrônico reaproveitado é um passo em direção a um planeta mais
          limpo.
        </p>
      </div>
    </div>
  )
}

function SupportScreen() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [search, setSearch] = useState("")
  const [form, setForm] = useState({
    name: "",
    email: "",
    category: "",
    subject: "",
    message: "",
  })
  const [sent, setSent] = useState(false)
  const faqs = [
    {
      q: "Como publicar um eletrônico?",
      a: "Clique em 'Publicar' no cabeçalho para abrir diretamente o formulário.",
    },
    {
      q: "Como editar meu anúncio?",
      a: "Vá em Perfil > Minhas Publicações e clique em Editar.",
    },
    {
      q: "Como excluir uma publicação?",
      a: "Em Perfil > Minhas Publicações, clique em Excluir e confirme.",
    },
    {
      q: "Como conversar com outro usuário?",
      a: "Abra o produto e clique em Conversar para abrir o chat.",
    },
    {
      q: "Como funciona uma doação?",
      a: "O doador publica como Doação. O interessado solicita e combinam entrega pelo chat.",
    },
    {
      q: "Como denunciar uma publicação?",
      a: "Na página de detalhes, clique em Denunciar e selecione o motivo.",
    },
    {
      q: "Como alterar meus dados?",
      a: "Vá em Perfil e clique em Editar perfil.",
    },
    {
      q: "Como funciona a venda?",
      a: "O vendedor publica com preço. Negociam pelo chat. Não processamos pagamentos.",
    },
  ]
  const categories = [
    "Minha conta",
    "Compras",
    "Vendas",
    "Pedidos",
    "Publicações",
    "Chat",
    "Doações",
    "Segurança",
    "Problemas técnicos",
  ]
  const filtered = faqs.filter(
    (f) => !search || f.q.toLowerCase().includes(search.toLowerCase()),
  )
  return (
    <div className="animate-fade-up max-w-4xl mx-auto px-4 lg:px-6 py-10">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-[#18261d] font-display mb-2">
          Central de Ajuda
        </h1>
        <div className="relative max-w-md mx-auto">
          <svg
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b8071]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Como podemos ajudar?"
            className="w-full pl-10 pr-4 py-3 border border-[#e0eae2] rounded-xl text-sm"
          />
        </div>
      </div>
      <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mb-8">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setSearch(c)}
            className="bg-white border border-[#e0eae2] rounded-xl py-3 px-2 text-xs font-medium text-[#18261d] hover:border-[#4a9e6b] hover:bg-[#f0faf3] text-center"
          >
            {c}
          </button>
        ))}
      </div>
      <div className="mb-10">
        <h2 className="text-lg font-bold text-[#18261d] font-display mb-4">
          Perguntas frequentes
        </h2>
        <div className="space-y-2">
          {filtered.map((faq, i) => (
            <div
              key={i}
              className="bg-white border border-[#e0eae2] rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-[#f4f7f4]"
              >
                <span className="font-semibold text-sm text-[#18261d]">
                  {faq.q}
                </span>
                <svg
                  className={`w-4 h-4 text-[#6b8071] flex-shrink-0 ml-3 transition-transform ${
                    openFaq === i ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {openFaq === i && (
                <div className="px-5 pb-4 text-sm text-[#6b8071] leading-relaxed border-t border-[#f4f7f4]">
                  <p className="mt-3">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white border border-[#e0eae2] rounded-2xl p-6">
        <h2 className="text-lg font-bold text-[#18261d] font-display mb-5">
          Falar com o suporte
        </h2>
        {sent ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">✅</div>
            <p className="font-bold text-[#18261d] font-display text-lg">
              Solicitação enviada com sucesso!
            </p>
            <p className="text-sm text-[#6b8071] mt-1">
              Responderemos em até 24 horas.
            </p>
            <button
              onClick={() => setSent(false)}
              className="mt-4 text-sm text-[#2d6a40] font-bold hover:underline"
            >
              Enviar outra mensagem
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {[
              ["Nome", "name", "Seu nome completo"],
              ["Email", "email", "seu@email.com"],
              ["Assunto", "subject", "Resumo do problema"],
            ].map(([l, k, p]) => (
              <div key={k}>
                <label className="text-xs font-bold text-[#6b8071] uppercase tracking-wide mb-1 block">
                  {l}
                </label>
                <input
                  value={(form as Record<string, string>)[k]}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, [k]: e.target.value }))
                  }
                  placeholder={p}
                  className="w-full px-3.5 py-2.5 border border-[#e0eae2] rounded-xl text-sm"
                />
              </div>
            ))}
            <div>
              <label className="text-xs font-bold text-[#6b8071] uppercase tracking-wide mb-1 block">
                Categoria
              </label>
              <select
                value={form.category}
                onChange={(e) =>
                  setForm((f) => ({ ...f, category: e.target.value }))
                }
                className="w-full px-3.5 py-2.5 border border-[#e0eae2] rounded-xl text-sm"
              >
                <option value="">Selecionar...</option>
                {categories.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-[#6b8071] uppercase tracking-wide mb-1 block">
                Mensagem
              </label>
              <textarea
                value={form.message}
                onChange={(e) =>
                  setForm((f) => ({ ...f, message: e.target.value }))
                }
                placeholder="Descreva seu problema..."
                rows={4}
                className="w-full px-3.5 py-2.5 border border-[#e0eae2] rounded-xl text-sm resize-none"
              />
            </div>
            <div className="md:col-span-2">
              <button
                onClick={() => setSent(true)}
                disabled={!form.name || !form.email || !form.message}
                className={`w-full py-3.5 rounded-xl font-bold text-sm ${
                  form.name && form.email && form.message
                    ? "bg-[#2d6a40] text-white hover:bg-[#1a3a24]"
                    : "bg-[#e0eae2] text-[#6b8071] cursor-not-allowed"
                }`}
              >
                Enviar solicitação
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function App() {
  const blankExplore: ExploreState = {
    q: "",
    cat: "",
    cond: "",
    purpose: "",
    sort: "recent",
    minP: "",
    maxP: "",
    showF: false,
  }
  const [screen, setScreen] = useState<Screen>("login")
  const [items, setItems] = usePersist<Item[]>("rc_items", INIT_ITEMS)
  const [requests, setRequests] = usePersist<Req[]>("rc_reqs", INIT_REQUESTS)
  const [user, setUser] = usePersist<User>("rc_user", {
    ...USERS[0],
    email: "lucas@email.com",
  })
  const [favorites, setFavorites] = usePersist<number[]>("rc_favs", [])
  const [notifs, setNotifs] = usePersist<Notif[]>("rc_notifs", INIT_NOTIFS)
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [selectedRequest, setSelectedRequest] = useState<Req | null>(null)
  const [exploreState, setExploreState] = useState<ExploreState>(blankExplore)
  const [initConvId, setInitConvId] = useState<number | null>(null)
  const [initTxId, setInitTxId] = useState<number | null>(null)
  const publishType = "sale"
  const scrollRef = useRef<HTMLDivElement>(null)
  const navigate = (s: Screen) => {
    setScreen(s)
    setTimeout(() => scrollRef.current?.scrollTo(0, 0), 0)
  }
  const navigateMain = (s: Screen) => {
    if (s === "explore") setExploreState(blankExplore)
    if (s === "chat") setInitConvId(null)
    navigate(s)
  }
  const toggleFav = (id: number) =>
    setFavorites((f) =>
      f.includes(id) ? f.filter((x) => x !== id) : [...f, id],
    )
  const readNotif = (id: number) =>
    setNotifs((ns) => ns.map((n) => (n.id === id ? { ...n, read: true } : n)))
  const clearNotifs = () =>
    setNotifs((ns) => ns.map((n) => ({ ...n, read: true })))
  const handleItem = (item: Item) => {
    setSelectedItem(item)
    navigate("details")
  }
  const handleRequest = (request: Req) => {
    setSelectedRequest(request)
    navigate("requestDetails")
  }
  const openChatForUser = (userId: number, itemId?: number) => {
    const conv =
      INIT_CONVERSATIONS.find(
        (c) =>
          c.userId === userId && (itemId === undefined || c.itemId === itemId),
      ) ||
      INIT_CONVERSATIONS.find((c) => c.userId === userId) ||
      INIT_CONVERSATIONS[0]
    setInitConvId(conv.id)
    navigate("chat")
  }
  const openNotification = (notification: Notif) => {
    readNotif(notification.id)
    const fallback = INIT_NOTIFS.find((n) => n.id === notification.id)
    const target = notification.target || fallback?.target || "home"
    const targetId = notification.targetId ?? fallback?.targetId
    if (target === "chat") {
      setInitConvId(targetId || 1)
      navigate("chat")
      return
    }
    if (target === "details") {
      const item = items.find((i) => i.id === targetId)
      if (item) {
        setSelectedItem(item)
        navigate("details")
      }
      return
    }
    if (target === "requestDetails") {
      const req = requests.find((r) => r.id === targetId)
      if (req) {
        setSelectedRequest(req)
        navigate("requestDetails")
      }
      return
    }
    if (target === "transaction") {
      setInitTxId(targetId || 1)
      navigate("transaction")
      return
    }
    navigate(target)
  }
  if (screen === "login")
    return <LoginScreen onLogin={() => navigate("home")} />
  return (
    <div className="min-h-screen bg-[#f4f7f4]">
      <Header
        screen={screen}
        onNav={navigateMain}
        notifs={notifs}
        onNotifOpen={openNotification}
        onNotifRead={readNotif}
        onClearNotifs={clearNotifs}
        user={user}
      />
      <div
        ref={scrollRef}
        className={
          screen === "chat"
            ? "h-[calc(100vh-64px)] overflow-hidden"
            : "overflow-auto"
        }
        style={screen === "chat" ? undefined : { paddingBottom: "80px" }}
      >
        {screen === "home" && (
          <HomeScreen
            items={items}
            requests={requests}
            onItem={handleItem}
            onRequest={handleRequest}
            onNav={navigateMain}
            favorites={favorites}
            onFav={toggleFav}
            onSearch={(q) => {
              setExploreState({ ...blankExplore, q })
              navigate("explore")
            }}
            onCat={(c) => {
              setExploreState({ ...blankExplore, cat: c })
              navigate("explore")
            }}
            user={user}
          />
        )}
        {screen === "explore" && (
          <ExploreScreen
            items={items}
            onItem={(item, state) => {
              setExploreState(state)
              handleItem(item)
            }}
            favorites={favorites}
            onFav={toggleFav}
            initial={exploreState}
          />
        )}
        {screen === "details" && selectedItem && (
          <DetailsScreen
            item={selectedItem}
            onBack={() => navigate("explore")}
            onChat={() =>
              openChatForUser(selectedItem.ownerId, selectedItem.id)
            }
            favorites={favorites}
            onFav={toggleFav}
            onTx={() => {
              setInitTxId(
                INIT_TRANSACTIONS.find((t) => t.itemId === selectedItem.id)
                  ?.id || 1,
              )
              navigate("transaction")
            }}
            user={user}
          />
        )}
        {screen === "publish" && (
          <PublishScreen
            initType={publishType}
            onDone={() => navigate("home")}
            onAddItem={(i) => setItems((its) => [i, ...its])}
          />
        )}
        {screen === "requests" && (
          <RequestsScreen
            items={items}
            reqs={requests}
            setReqs={setRequests}
            onRequest={handleRequest}
            user={user}
          />
        )}
        {screen === "requestDetails" && selectedRequest && (
          <RequestDetailsScreen
            request={selectedRequest}
            onBack={() => navigate("requests")}
            onOffer={() => navigate("requests")}
            onChat={() => openChatForUser(selectedRequest.userId)}
            user={user}
          />
        )}
        {screen === "chat" && (
          <ChatScreen initConvId={initConvId} user={user} items={items} />
        )}
        {screen === "transaction" && (
          <TransactionScreen
            onBack={() => navigate("profile")}
            initTxId={initTxId}
            items={items}
          />
        )}
        {screen === "profile" && (
          <ProfileScreen
            items={items}
            setItems={setItems}
            favorites={favorites}
            onItem={handleItem}
            onNav={navigate}
            onOpenTransaction={(id) => {
              setInitTxId(id || null)
              navigate("transaction")
            }}
            onLogout={() => navigate("login")}
            user={user}
            setUser={setUser}
          />
        )}
        {screen === "about" && <AboutScreen />}
        {screen === "support" && <SupportScreen />}
      </div>
      <BottomNav screen={screen} onNav={navigateMain} />
    </div>
  )
}
