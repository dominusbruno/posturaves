// src/app/funcionarios/page.tsx
'use client' // Diretiva para indicar que este é um Client Component, permitindo o uso de hooks como useState e useEffect

import FuncionarioForm from '@/components/Funcionarios/FuncionarioForm' // Componente para o formulário de cadastro de funcionário
import FuncionariosTable from '@/components/Funcionarios/FuncionariosTable' // Componente para exibir a tabela de funcionários
import { useCallback, useEffect, useState } from 'react' // Hooks do React para estado, efeitos colaterais e memoização de funções

// Definindo a interface para os dados de um funcionário.
// Esta estrutura deve espelhar o que o backend envia e o que o formulário manipula.
// Em um projeto maior, essa interface poderia ser compartilhada entre frontend e backend.
interface Funcionario {
  _id: string // ID gerado pelo MongoDB
  nome: string
  cpf: string
  apelido?: string
  nascimento: string // Espera-se uma string no formato ISO (YYYY-MM-DD) da API
  dataAdmissao: string // Espera-se uma string no formato ISO (YYYY-MM-DD) da API
  cargo: string
  salarioCarteira: number
  salarioFamilia?: number
  quinquenio?: number
  extras?: number
  valorDiaria?: number
  perfil: string // Ex: 'Admin', 'Aviarista', etc.
  login: string
  // A senha não é buscada nem exibida na lista
  situacao: string // Ex: 'ATIVO', 'DEMITIDO', 'AFASTADO'
  observacao?: string
  createdAt?: string // Data de criação, adicionada pelo Mongoose
  updatedAt?: string // Data da última atualização, adicionada pelo Mongoose
}

// Componente principal da página de Funcionários
export default function FuncionariosPage() {
  // Estado para armazenar a lista de funcionários buscada da API
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([])
  // Estado para controlar se os dados estão sendo carregados
  const [isLoading, setIsLoading] = useState(true)
  // Estado para armazenar mensagens de erro caso a busca falhe
  const [error, setError] = useState<string | null>(null)
  // Estado para controlar a visibilidade do formulário de cadastro
  const [showForm, setShowForm] = useState(false)

  // Função para buscar os funcionários da API backend.
  // Envolvida em useCallback para otimizar, evitando recriações desnecessárias
  // se passada como prop para componentes filhos ou usada em useEffect.
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
      // 'e' agora é 'unknown'
      console.error('Falha ao buscar funcionários:', e)

      // Definimos uma mensagem de erro padrão
      let errorMessage =
        'Falha ao carregar funcionários. Verifique se o servidor backend está rodando.'

      // Verificamos se 'e' é uma instância de Error para acessar 'e.message' com segurança
      if (e instanceof Error) {
        errorMessage = `Falha ao carregar funcionários: ${e.message}. Verifique se o servidor backend está rodando.`
      }
      // Você poderia adicionar mais verificações aqui se souber de outros tipos de erro possíveis
      // else if (typeof e === 'string') { errorMessage = e; }

      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // useEffect para executar a função fetchFuncionarios quando o componente é montado pela primeira vez.
  // A dependência [fetchFuncionarios] garante que se a função fetchFuncionarios mudar (o que não deve acontecer com useCallback e dependências vazias),
  // o efeito será re-executado, mas neste caso, é principalmente para seguir as boas práticas do hook.
  useEffect(() => {
    fetchFuncionarios()
  }, [fetchFuncionarios])

  // Função para lidar com o clique no botão "Adicionar Funcionário"
  const handleAddClick = () => {
    setShowForm(true) // Define o estado para mostrar o formulário
    setError(null) // Limpa qualquer mensagem de erro anterior do formulário
  }

  // Função para lidar com o fechamento do formulário (ex: clique no botão "Cancelar")
  const handleFormClose = () => {
    setShowForm(false) // Define o estado para esconder o formulário
  }

  // Função chamada após um funcionário ser adicionado com sucesso pelo formulário
  const handleFuncionarioAdicionado = () => {
    setShowForm(false) // Esconde o formulário
    fetchFuncionarios() // Busca novamente a lista de funcionários para incluir o novo registro
  }

  // Renderização do componente da página
  return (
    <div className="container-fluid">
      {' '}
      {/* Container principal fluido do Bootstrap */}
      {/* Cabeçalho da página: Título e Botões de Ação */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0 fs-4">Cadastro de Funcionários</h2> {/* Título da página */}
        {/* Controles no canto superior direito: Filtro e Botão Adicionar */}
        <div>
          {/* Campo de filtro/busca (funcionalidade a ser implementada no futuro) */}
          <input
            type="text"
            className="form-control form-control-sm d-inline-block me-2"
            style={{ width: '200px' }}
            placeholder="Filtrar..."
            disabled // Desabilitado por enquanto, até a lógica de filtro ser implementada
          />
          {/* Botão para mostrar o formulário de adição */}
          <button
            className="btn btn-primary btn-sm"
            onClick={handleAddClick}
            disabled={showForm} // Desabilita o botão se o formulário já estiver visível
          >
            <i className="bi bi-plus-circle me-1"></i> {/* Ícone de mais */}
            {/* Muda o texto do botão se o formulário estiver sendo exibido */}
            {showForm ? 'Adicionando...' : 'Adicionar Funcionário'}
          </button>
        </div>
      </div>
      {/* Seção do Formulário: Renderizado condicionalmente com base no estado 'showForm' */}
      {/* Quando showForm é true, o componente FuncionarioForm é montado e exibido */}
      {showForm && (
        <FuncionarioForm
          onFormSubmit={handleFuncionarioAdicionado} // Passa a função para ser chamada após o envio bem-sucedido
          onCancel={handleFormClose} // Passa a função para ser chamada ao cancelar
        />
      )}
      {/* Seção da Tabela de Funcionários */}
      {/* Exibe mensagem de carregamento enquanto os dados são buscados */}
      {isLoading && <p className="text-center mt-4">Carregando funcionários...</p>}
      {/* Exibe mensagem de erro se a busca falhar */}
      {error && <div className="alert alert-danger mt-4">{error}</div>}
      {/* Se não estiver carregando e não houver erro, exibe a tabela de funcionários */}
      {/* Passa a lista de funcionários para o componente FuncionariosTable */}
      {!isLoading && !error && <FuncionariosTable funcionarios={funcionarios} />}
    </div>
  )
}
