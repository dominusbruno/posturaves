// src/app/funcionarios/page.tsx
'use client'

import FuncionarioCard from '@/components/Funcionarios/FuncionarioCard'
import FuncionarioForm from '@/components/Funcionarios/FuncionarioForm'
import { IconPlus } from '@tabler/icons-react' // IconUsers foi removido se não estiver mais em uso aqui
import { ChangeEvent, useCallback, useEffect, useState } from 'react'

// Interface Funcionario (certifique-se que está completa)
interface Funcionario {
  _id: string
  nome: string
  cpf: string
  apelido?: string
  nascimento: string
  dataAdmissao: string
  cargo: string
  salarioCarteira: number
  salarioFamilia?: number
  quinquenio?: number
  extras?: number
  valorDiaria?: number
  perfil: 'Admin' | 'Aviarista' | 'Gerente' | 'Estoquista' | 'Proprietário'
  login: string
  situacao: 'ATIVO' | 'DEMITIDO' | 'AFASTADO'
  observacao?: string
  createdAt?: string
  updatedAt?: string
}

export default function FuncionariosPage() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [termoBusca, setTermoBusca] = useState('')
  const [editingFuncionario, setEditingFuncionario] = useState<Funcionario | null>(null)

  const fetchFuncionarios = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('http://localhost:3001/api/funcionarios')
      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: `HTTP error! status: ${response.status}` }))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setFuncionarios(data)
    } catch (e: unknown) {
      console.error('Falha ao buscar funcionários:', e)
      let errorMessage = 'Falha ao carregar funcionários.'
      if (e instanceof Error) {
        errorMessage = `Falha ao carregar funcionários: ${e.message}.`
      }
      setError(`${errorMessage} Verifique se o servidor backend está rodando.`)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchFuncionarios()
  }, [fetchFuncionarios])

  const handleAddClick = () => {
    setEditingFuncionario(null)
    setShowForm(true)
    setError(null)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingFuncionario(null)
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingFuncionario(null)
    fetchFuncionarios()
    setTermoBusca('')
  }

  const handleBuscaChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTermoBusca(event.target.value)
  }

  const funcionariosFiltrados = funcionarios.filter((funcionario) =>
    funcionario.nome.toLowerCase().includes(termoBusca.toLowerCase())
  )

  const handleEditFuncionario = async (funcionarioId: string) => {
    setError(null)
    if (showForm && editingFuncionario?._id === funcionarioId) {
      console.log('Recarregando dados para o mesmo funcionário em edição.')
    }
    try {
      const response = await fetch(`http://localhost:3001/api/funcionarios/${funcionarioId}`)
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(
          errorData.message || `Falha ao buscar dados do funcionário. Status: ${response.status}`
        )
      }
      const funcionarioData: Funcionario = await response.json()
      setEditingFuncionario(funcionarioData)
      if (!showForm) {
        setShowForm(true)
      }
    } catch (e: unknown) {
      console.error('Erro ao buscar funcionário para edição:', e)
      let errorMessage = 'Erro desconhecido ao buscar funcionário para edição.'
      if (e instanceof Error) {
        errorMessage = e.message
      }
      setError(errorMessage)
    }
  }

  return (
    <div className="container-fluid">
      {/* Tente 'align-items-baseline' ou 'align-items-start' aqui se 'align-items-center' não estiver bom */}
      <div className="d-flex justify-content-between mb-1">
        <h2 className="mb-0 fs-4 d-flex align-items-center">
          {' '}
          {/* <<< ALTERADO AQUI de align-items-center para align-items-baseline */}
          <i
            className="bi bi-people-fill me-2"
            style={{ fontSize: '3rem' }} // Mantenha o tamanho do ícone que você definiu e gostou
          ></i>
          <span className="d-none d-md-inline">Cadastro de Funcionários</span>
        </h2>
        <div className="d-flex align-items-center">
          <input
            type="text"
            className="form-control form-control-sm me-2"
            style={{ maxWidth: '150px' }}
            placeholder="Filtrar..."
            value={termoBusca}
            onChange={handleBuscaChange}
          />
          <button
            className="btn btn-primary btn-sm add-funcionario-btn" // A classe CSS cuidará do tamanho/padding no mobile
            onClick={handleAddClick}
            disabled={showForm && !editingFuncionario}
            aria-label="Adicionar Funcionário"
            // Removido o style inline daqui, pois a classe .add-funcionario-btn cuidará disso
          >
            <IconPlus size={18} strokeWidth={2} /> {/* Ajuste size/strokeWidth se necessário */}
            <span className="d-none d-md-inline ms-1">
              {showForm && !editingFuncionario ? 'Adicionando...' : 'Adicionar'}
            </span>
          </button>
        </div>
      </div>

      {showForm && (
        <FuncionarioForm
          onFormSubmit={handleFormSuccess}
          onCancel={handleFormClose}
          funcionarioToEdit={editingFuncionario}
        />
      )}

      {isLoading && !showForm && <p className="text-center mt-4">Carregando funcionários...</p>}
      {error && <div className="alert alert-danger mt-4">{error}</div>}

      {!isLoading && !error && (
        <div className="row mt-2">
          {funcionariosFiltrados.length > 0 ? (
            funcionariosFiltrados.map((funcionario) => (
              <div
                key={funcionario._id}
                className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-3 mb-4"
              >
                <FuncionarioCard funcionario={funcionario} onEdit={handleEditFuncionario} />
              </div>
            ))
          ) : (
            <p className="text-center col-12">
              Nenhum funcionário encontrado com os critérios atuais.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
