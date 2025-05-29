// src/components/MobileHeader/MobileHeader.tsx
import styles from './MobileHeader.module.css'

// Definindo as propriedades que o componente MobileHeader espera receber
interface MobileHeaderProps {
  toggleSidebar: () => void // Função para alternar a visibilidade do sidebar
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ toggleSidebar }) => {
  return (
    <header
      className={`${styles.mobileHeader} bg-dark text-white d-flex d-md-none align-items-center px-3`}
    >
      <button
        className="btn btn-dark p-1 me-2" /* Reduzido padding e margem */
        type="button"
        onClick={toggleSidebar}
        aria-label="Alternar navegação"
      >
        <i className="bi bi-list fs-5"></i> {/* Reduzido de fs-4 para fs-5 */}
      </button>
      {/* fs-6 é o menor tamanho de heading do Bootstrap */}
      <h1 className="fs-6 mb-0">
        {' '}
        {/* Alterado de fs-5 para fs-6 */}
        <span style={{ color: '#FFD700' }}>Postur</span>
        <span style={{ color: '#FFFFFF' }}>Aves</span>
      </h1>
    </header>
  )
}

export default MobileHeader
