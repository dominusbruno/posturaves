// src/components/MobileHeader/MobileHeader.tsx
import Image from 'next/image' // <<< NOVO: Importar o componente Image
import styles from './MobileHeader.module.css'

interface MobileHeaderProps {
  toggleSidebar: () => void
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ toggleSidebar }) => {
  return (
    <header
      className={`${styles.mobileHeader} bg-dark text-white d-flex d-md-none align-items-center px-3`}
    >
      {/* Botão Hambúrguer */}
      <button
        className="btn btn-dark p-1 me-2"
        type="button"
        onClick={toggleSidebar}
        aria-label="Alternar navegação"
      >
        <i className="bi bi-list fs-5"></i>
      </button>

      {/* Logo e Nome do sistema no header mobile */}
      <div className="d-flex align-items-center">
        {' '}
        {/* Container Flex para alinhar logo e texto */}
        <Image
          src="/img/icon-logo.svg" // Caminho a partir da pasta 'public'
          alt="Logo PosturAves"
          width={24} // Largura da logo (um pouco menor para o header mobile)
          height={24} // Altura da logo
          className="me-2" // Margem à direita
        />
        <h1 className="fs-6 mb-0">
          <span className="logoTextPostur">Postur</span>
          <span className="logoTextAves">Aves</span>
        </h1>
      </div>
    </header>
  )
}

export default MobileHeader
