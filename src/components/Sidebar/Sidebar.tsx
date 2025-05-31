// src/components/Sidebar/Sidebar.tsx
import Image from 'next/image' // <<< NOVO: Importar o componente Image
import Link from 'next/link'
import styles from './Sidebar.module.css'

const menuItems = [
  // A lista de menuItems continua a mesma
  { name: 'Painel Principal', path: '/', icon: 'bi-house-door-fill' },
  { name: 'Galinheiros', path: '/galinheiros', icon: 'bi-grid-3x3-gap-fill' },
  { name: 'Lotes', path: '/lotes', icon: 'bi-stack' },
  { name: 'Funcionários', path: '/funcionarios', icon: 'bi-person-lines-fill' },
  { name: 'Fornecedores', path: '/fornecedores', icon: 'bi-truck' },
  { name: 'Produtos (Granja)', path: '/produtos-granja', icon: 'bi-egg-fried' },
  { name: 'Calendário/Agenda', path: '/agenda', icon: 'bi-calendar-event-fill' },
  { name: 'Produção', path: '/producao', icon: 'bi-graph-up-arrow' },
  { name: 'Ração', path: '/racao', icon: 'bi-basket3-fill' },
  { name: 'Classificação', path: '/classificacao', icon: 'bi-rulers' },
  { name: 'Financeiro', path: '/financeiro', icon: 'bi-cash-coin' },
  { name: 'Relatórios', path: '/relatorios', icon: 'bi-file-earmark-bar-graph-fill' },
  { name: 'Configurações', path: '/configuracoes', icon: 'bi-gear-fill' },
]

interface SidebarProps {
  isMobileSidebarOpen: boolean
  toggleMobileSidebar?: () => void
}

const Sidebar: React.FC<SidebarProps> = ({ isMobileSidebarOpen, toggleMobileSidebar }) => {
  return (
    <aside
      className={`
        ${styles.sidebar} 
        bg-dark 
        text-white 
        d-flex 
        flex-column
        ${isMobileSidebarOpen ? styles.sidebarIsOpenForMobile : styles.sidebarIsClosedForMobile}
      `}
    >
      {/* Header do Sidebar (Logo/Nome) */}
      <div className={`${styles.sidebarHeader} text-center`}>
        {/* Container Flex para alinhar logo e texto */}
        <div className="d-flex align-items-center justify-content-center">
          <Image
            src="/img/icon-logo.svg" // Caminho a partir da pasta 'public'
            alt="Logo PosturAves"
            width={32} // Largura da logo em pixels (ajuste conforme necessário)
            height={32} // Altura da logo em pixels (ajuste conforme necessário)
            className="me-2" // Margem à direita para separar do texto
          />
          <h1 className="fs-5 mb-0">
            <span className="logoTextPostur">Postur</span>
            <span className="logoTextAves">Aves</span>
          </h1>
        </div>
      </div>

      {/* Itens de Menu */}
      <nav className="nav flex-column flex-grow-1 px-2 mt-2">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.path}
            className={`${styles.navLink} nav-link d-flex align-items-center`}
            onClick={toggleMobileSidebar}
          >
            {item.icon && <i className={`bi ${item.icon} me-2 fs-6`}></i>}
            {item.name}
          </Link>
        ))}
      </nav>

      {/* Footer do Sidebar (Link do Perfil) */}
      <div className={`${styles.sidebarFooter} text-center mt-auto`}>
        <Link
          href="/perfil"
          className={`${styles.navLink} nav-link d-flex align-items-center justify-content-center`}
          onClick={toggleMobileSidebar}
        >
          <i className="bi bi-person-circle me-2 fs-6"></i>
          Meu Perfil
        </Link>
      </div>
    </aside>
  )
}

export default Sidebar
