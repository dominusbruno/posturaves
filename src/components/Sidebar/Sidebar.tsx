// src/components/Sidebar/Sidebar.tsx
import Link from 'next/link'
import styles from './Sidebar.module.css'

const menuItems = [
  { name: 'Painel Principal', path: '/', icon: 'bi-house-door-fill' },
  { name: 'Galinheiros', path: '/galinheiros', icon: 'bi-grid-3x3-gap-fill' },
  { name: 'Lotes', path: '/lotes', icon: 'bi-stack' },
  { name: 'Funcionários', path: '/funcionarios', icon: 'bi-people-fill' },
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
      <div className={`${styles.sidebarHeader} text-center`}>
        {' '}
        {/* py-x foi para o .module.css */}
        <h1 className="fs-5 mb-0">
          {' '}
          {/* Sem espaços aqui */}
          <span style={{ color: '#FFD700' }}>Postur</span>
          <span style={{ color: '#FFFFFF' }}>Aves</span>
        </h1>
      </div>

      <nav className="nav flex-column flex-grow-1 px-2 mt-2">
        {' '}
        {/* Sem espaços aqui */}
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.path}
            className={`${styles.navLink} nav-link d-flex align-items-center`}
            onClick={toggleMobileSidebar}
          >
            {item.icon && <i className={`bi ${item.icon} me-2 fs-6`}></i>}{' '}
            {/* Sem espaço aqui ao lado do ícone se não houver texto */}
            {item.name}
          </Link>
        ))}
      </nav>

      <div className={`${styles.sidebarFooter} text-center mt-auto`}>
        {' '}
        {/* Sem espaços aqui */}
        <Link
          href="/perfil"
          className={`${styles.navLink} nav-link d-flex align-items-center justify-content-center`}
          onClick={toggleMobileSidebar}
        >
          <i className="bi bi-person-circle me-2 fs-6"></i> {/* Sem espaço aqui */}
          Meu Perfil
        </Link>
      </div>
    </aside>
  )
}

export default Sidebar
