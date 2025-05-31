// src/components/Funcionarios/FuncionarioCard.tsx
'use client'

//import Image from 'next/image' // Se você for usar uma imagem de avatar no futuro
//import Link from 'next/link' // Se o nome ou outra parte do card for um link
import styles from './FuncionarioCard.module.css' // <<< Importa o nosso CSS Module

// Interface Funcionario (certifique-se que está completa com os campos que você quer exibir)
interface Funcionario {
  _id: string
  nome: string
  cpf: string
  apelido?: string
  nascimento: string
  dataAdmissao: string
  cargo: string
  salarioCarteira: number // Mesmo que não exibido, pode ser útil para o futuro
  perfil: string
  situacao: string
  // Adicione outros campos se for exibi-los no card
}

interface FuncionarioCardProps {
  funcionario: Funcionario
  onEdit: (funcionarioId: string) => void
}

// Funções de formatação (mantidas aqui por enquanto)
const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  const userTimezoneOffset = date.getTimezoneOffset() * 60000
  const adjustedDate = new Date(date.getTime() + userTimezoneOffset)
  return adjustedDate.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

const formatCPF = (cpf: string | undefined): string => {
  if (!cpf) return '-' // Retorna '-' se o CPF for nulo ou indefinido

  // Remove quaisquer caracteres não numéricos que possam existir (embora do DB deva vir limpo)
  const cleaned = cpf.replace(/\D/g, '')

  // Verifica se o CPF limpo tem 11 dígitos
  if (cleaned.length !== 11) {
    return cpf // Retorna o CPF original se não tiver 11 dígitos (pode ser um erro de dado)
  }

  // Aplica a máscara XXX.XXX.XXX-XX
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

const FuncionarioCard: React.FC<FuncionarioCardProps> = ({ funcionario, onEdit }) => {
  const handleEditClick = () => {
    onEdit(funcionario._id)
  }

  return (
    // Aplicando a classe .cardCustom do nosso CSS Module junto com a .card do Bootstrap
    // h-100 é uma classe do Bootstrap para fazer os cards na mesma linha terem a mesma altura
    <div className={`card h-100 ${styles.cardCustom}`}>
      {/* Aplicando a classe .cardHeaderCustom */}
      <div className={`card-header ${styles.cardHeaderCustom}`}>
        {/* Aplicando a classe .cardHeaderText e .text-truncate do Bootstrap */}
        <h5 className={`card-title mb-0 text-truncate ${styles.cardHeaderText}`}>
          {funcionario.nome}
        </h5>
      </div>
      <div className="card-body d-flex flex-column">
        {' '}
        {/* d-flex flex-column para alinhar o footer no final */}
        <p className="card-text mb-0">
          <span className={styles.infoLabel}>Cargo:</span>
          <span className={styles.infoValue}> {funcionario.cargo || '-'}</span>
        </p>
        <p className="card-text mb-0">
          <span className={styles.infoLabel}>CPF:</span>
          <span className={styles.infoValue}> {formatCPF(funcionario.cpf) || '-'}</span>
        </p>
        <p className="card-text mb-0">
          <span className={styles.infoLabel}>Admissão:</span>
          <span className={styles.infoValue}> {formatDate(funcionario.dataAdmissao)}</span>
        </p>
        <p className="card-text mb-0">
          {' '}
          {/* Aumentei um pouco a margem inferior aqui */}
          <span className={styles.infoLabel}>Situação:</span>{' '}
          <span
            className={`badge ${
              funcionario.situacao === 'ATIVO'
                ? 'bg-success'
                : funcionario.situacao === 'AFASTADO'
                ? 'bg-warning text-dark'
                : 'bg-danger'
            }`}
          >
            {funcionario.situacao}
          </span>
        </p>
        {/* Empurra o footer para o final do card-body se o conteúdo for pequeno */}
        <div className="mt-auto"></div>
      </div>
      <div className="card-footer text-end bg-light">
        {' '}
        {/* Adicionado bg-light para leve diferenciação */}
        <button
          type="button" // <<< ADICIONE ESTA LINHA
          className={`btn btn-primary btn-sm ${styles.editButton}`}
          onClick={handleEditClick}
        >
          <i className="bi bi-pencil-square me-1"></i>
          Editar
        </button>
      </div>
    </div>
  )
}

export default FuncionarioCard
