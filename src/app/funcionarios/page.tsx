// src/app/funcionarios/page.tsx
'use client' // Esta página usará estado e efeitos para buscar dados e controlar UI

import { useState, useEffect } from 'react'
import FuncionariosTable from '@/components/Funcionarios/FuncionariosTable' // Importa a tabela

// Reutilizando a interface (idealmente, viria de um local compartilhado)
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
  perfil: string
  login: string
  situacao: string
  observacao?: string
  createdAt?: string
  updatedAt?: string
}

export default function FuncionariosPage() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([])
  const [isLoading, setIsLoading] = useState(true) // Estado para controlar o carregamento
  const [error, setError] = useState<string | null>(null) // Estado para mensagens de erro

  // Função para buscar os funcionários da API
  const fetchFuncionarios = async () => {
    setIsLoading(true)
    setError(null)
    try {
      // A API do backend está rodando em http://localhost:3001
      const response = await fetch('http://localhost:3001/api/funcionarios')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setFuncionarios(data)
    } catch (e: any) {
      console.error('Falha ao buscar funcionários:', e)
      setError(
        `Falha ao carregar funcionários: ${e.message}. Verifique se o servidor backend está rodando na porta 3001.`
      )
    } finally {
      setIsLoading(false)
    }
  }

  // useEffect para buscar os dados quando o componente montar
  useEffect(() => {
    fetchFuncionarios()
  }, []) // Array de dependências vazio, executa apenas uma vez

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Cadastro de Funcionários</h2>
        <div>
          {/* Placeholder para o filtro */}
          <input
            type="text"
            className="form-control form-control-sm d-inline-block me-2"
            style={{ width: '200px' }}
            placeholder="Filtrar..."
          />
          {/* Botão Adicionar (funcionalidade virá na próxima etapa) */}
          <button className="btn btn-primary btn-sm">
            <i className="bi bi-plus-circle me-1"></i>
            Adicionar Funcionário
          </button>
        </div>
      </div>

      {/* Seção do Formulário (será adicionada na Etapa 2, ficará aqui) */}
      {/* {showForm && <FuncionarioForm ... />} */}

      {/* Exibição da Tabela de Funcionários */}
      {isLoading && <p className="text-center">Carregando funcionários...</p>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!isLoading && !error && <FuncionariosTable funcionarios={funcionarios} />}
    </div>
  )
}
