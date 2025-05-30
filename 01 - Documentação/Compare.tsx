// src/app/funcionarios/page.tsx
'use client'

import { useState, useEffect, useCallback } from 'react' // Adicionado useCallback
import FuncionariosTable from '@/components/Funcionarios/FuncionariosTable'
import FuncionarioForm from '@/components/Funcionarios/FuncionarioForm' // Importa o formulário

// Reutilizando a interface
interface Funcionario {
  /* ... (interface Funcionario como definida antes) ... */
}

export default function FuncionariosPage() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false) // Novo estado para controlar visibilidade do form

  // Função para buscar os funcionários da API (envolvida em useCallback)
  const fetchFuncionarios = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('http://localhost:3001/api/funcionarios')
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setFuncionarios(data)
    } catch (e: any) {
      console.error('Falha ao buscar funcionários:', e)
      setError(
        `Falha ao carregar funcionários: ${e.message}. Verifique se o servidor backend está rodando.`
      )
    } finally {
      setIsLoading(false)
    }
  }, []) // useCallback para evitar recriação desnecessária da função

  // useEffect para buscar os dados quando o componente montar
  useEffect(() => {
    fetchFuncionarios()
  }, [fetchFuncionarios]) // Adiciona fetchFuncionarios como dependência

  const handleAddClick = () => {
    setShowForm(true) // Mostra o formulário
  }

  const handleFormClose = () => {
    setShowForm(false) // Esconde o formulário
  }

  const handleFuncionarioAdicionado = () => {
    setShowForm(false) // Esconde o formulário
    fetchFuncionarios() // Recarrega a lista de funcionários
  }

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0 fs-4">Cadastro de Funcionários</h2> {/* Ajustado tamanho do título */}
        <div>
          {/* Placeholder para o filtro */}
          <input
            type="text"
            className="form-control form-control-sm d-inline-block me-2"
            style={{ width: '200px' }}
            placeholder="Filtrar..."
            disabled // Desabilitado por enquanto
          />
          <button className="btn btn-primary btn-sm" onClick={handleAddClick} disabled={showForm}>
            <i className="bi bi-plus-circle me-1"></i>
            {showForm ? 'Adicionando...' : 'Adicionar Funcionário'}
          </button>
        </div>
      </div>

      {/* Seção do Formulário - renderizado condicionalmente */}
      {showForm && (
        <FuncionarioForm onFormSubmit={handleFuncionarioAdicionado} onCancel={handleFormClose} />
      )}

      {/* Exibição da Tabela de Funcionários */}
      {isLoading && <p className="text-center mt-4">Carregando funcionários...</p>}
      {error && <div className="alert alert-danger mt-4">{error}</div>}
      {!isLoading && !error && <FuncionariosTable funcionarios={funcionarios} />}
    </div>
  )
}
