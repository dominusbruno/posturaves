// src/components/Funcionarios/FuncionarioForm.tsx
'use client'

import { useState, FormEvent } from 'react'

// Reutilizando a interface (ajuste os campos opcionais conforme o modelo do backend)
// Idealmente, esta interface seria compartilhada entre frontend e backend ou definida em um local comum.
interface FuncionarioFormData {
  nome: string
  cpf: string
  apelido?: string
  nascimento: string // Formato YYYY-MM-DD para input type="date"
  dataAdmissao: string // Formato YYYY-MM-DD para input type="date"
  cargo: string
  salarioCarteira: number | string // Manter como string para o input, converter ao enviar
  salarioFamilia?: number | string
  quinquenio?: number | string
  extras?: number | string
  valorDiaria?: number | string
  perfil: 'Admin' | 'Aviarista' | 'Gerente' | 'Estoquista' | 'Proprietário' | ''
  login: string
  senha?: string // Opcional aqui se a API gerar ou se for definido depois
  situacao: 'ATIVO' | 'DEMITIDO' | 'AFASTADO' | ''
  observacao?: string
}

interface FuncionarioFormProps {
  onFormSubmit: () => void // Função para chamar após o envio bem-sucedido (para fechar e recarregar)
  onCancel: () => void // Função para chamar ao cancelar (para fechar o formulário)
}

const initialFormData: FuncionarioFormData = {
  nome: '',
  cpf: '',
  apelido: '',
  nascimento: '',
  dataAdmissao: '',
  cargo: '',
  salarioCarteira: '',
  salarioFamilia: '',
  quinquenio: '',
  extras: '',
  valorDiaria: '',
  perfil: '', // Valor inicial vazio para o select
  login: '',
  senha: '',
  situacao: 'ATIVO', // Padrão ATIVO
  observacao: '',
}

const FuncionarioForm: React.FC<FuncionarioFormProps> = ({ onFormSubmit, onCancel }) => {
  const [formData, setFormData] = useState<FuncionarioFormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccessMessage(null)

    // Conversão de valores para número
    const dataToSend = {
      ...formData,
      // Garante que mesmo campos vazios sejam convertidos para 0 ou o valor numérico
      salarioCarteira: parseFloat(formData.salarioCarteira as string) || 0,
      salarioFamilia: parseFloat(formData.salarioFamilia as string) || 0,
      quinquenio: parseFloat(formData.quinquenio as string) || 0,
      extras: parseFloat(formData.extras as string) || 0,
      valorDiaria: parseFloat(formData.valorDiaria as string) || 0,
    }

    try {
      const response = await fetch('http://localhost:3001/api/funcionarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      })

      const result = await response.json() // Tenta parsear o JSON mesmo se não for ok, para pegar a mensagem de erro

      if (!response.ok) {
        // A API backend deve retornar um objeto com uma propriedade 'message' em caso de erro
        throw new Error(result.message || `HTTP error! status: ${response.status}`)
      }

      setSuccessMessage('Funcionário cadastrado com sucesso!')
      setFormData(initialFormData) // Limpa o formulário
      onFormSubmit() // Chama a função do componente pai
    } catch (e: unknown) {
      // <<< 'e' é do tipo 'unknown'
      console.error('Falha ao cadastrar funcionário:', e)
      // Verificamos se 'e' é uma instância de Error para acessar 'e.message' com segurança
      if (e instanceof Error) {
        setError(e.message) // Agora é seguro acessar e.message
      } else {
        // Se não for um Error, definimos uma mensagem genérica
        setError('Ocorreu um erro desconhecido ao cadastrar o funcionário.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="card mt-3 mb-4">
      <div className="card-header">Cadastrar Novo Funcionário</div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          {error && <div className="alert alert-danger">{error}</div>}
          {successMessage && <div className="alert alert-success">{successMessage}</div>}

          <div className="row g-3">
            {/* Linha 1: Nome, CPF, Apelido */}
            <div className="col-md-5">
              <label htmlFor="nome" className="form-label">
                Nome Completo*
              </label>
              <input
                type="text"
                className="form-control form-control-sm"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-4">
              <label htmlFor="cpf" className="form-label">
                CPF*
              </label>
              <input
                type="text"
                className="form-control form-control-sm"
                id="cpf"
                name="cpf"
                value={formData.cpf}
                onChange={handleChange}
                required
              />
              {/* Adicionar máscara de CPF aqui no futuro */}
            </div>
            <div className="col-md-3">
              <label htmlFor="apelido" className="form-label">
                Apelido
              </label>
              <input
                type="text"
                className="form-control form-control-sm"
                id="apelido"
                name="apelido"
                value={formData.apelido}
                onChange={handleChange}
              />
            </div>

            {/* Linha 2: Nascimento, Data Admissão, Cargo */}
            <div className="col-md-3">
              <label htmlFor="nascimento" className="form-label">
                Data de Nascimento*
              </label>
              <input
                type="date"
                className="form-control form-control-sm"
                id="nascimento"
                name="nascimento"
                value={formData.nascimento}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-3">
              <label htmlFor="dataAdmissao" className="form-label">
                Data de Admissão*
              </label>
              <input
                type="date"
                className="form-control form-control-sm"
                id="dataAdmissao"
                name="dataAdmissao"
                value={formData.dataAdmissao}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="cargo" className="form-label">
                Cargo*
              </label>
              <input
                type="text"
                className="form-control form-control-sm"
                id="cargo"
                name="cargo"
                value={formData.cargo}
                onChange={handleChange}
                required
              />
            </div>

            {/* Linha 3: Salários */}
            <div className="col-md-3">
              <label htmlFor="salarioCarteira" className="form-label">
                Salário (Carteira)* R$
              </label>
              <input
                type="number"
                step="0.01"
                className="form-control form-control-sm"
                id="salarioCarteira"
                name="salarioCarteira"
                value={formData.salarioCarteira}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-3">
              <label htmlFor="salarioFamilia" className="form-label">
                Salário Família R$
              </label>
              <input
                type="number"
                step="0.01"
                className="form-control form-control-sm"
                id="salarioFamilia"
                name="salarioFamilia"
                value={formData.salarioFamilia}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-2">
              <label htmlFor="quinquenio" className="form-label">
                Quinquênio R$
              </label>
              <input
                type="number"
                step="0.01"
                className="form-control form-control-sm"
                id="quinquenio"
                name="quinquenio"
                value={formData.quinquenio}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-2">
              <label htmlFor="extras" className="form-label">
                Extras R$
              </label>
              <input
                type="number"
                step="0.01"
                className="form-control form-control-sm"
                id="extras"
                name="extras"
                value={formData.extras}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-2">
              <label htmlFor="valorDiaria" className="form-label">
                Diária R$
              </label>
              <input
                type="number"
                step="0.01"
                className="form-control form-control-sm"
                id="valorDiaria"
                name="valorDiaria"
                value={formData.valorDiaria}
                onChange={handleChange}
              />
            </div>

            {/* Linha 4: Perfil, Login, Senha */}
            <div className="col-md-4">
              <label htmlFor="perfil" className="form-label">
                Perfil de Acesso*
              </label>
              <select
                className="form-select form-select-sm"
                id="perfil"
                name="perfil"
                value={formData.perfil}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Selecione...
                </option>
                <option value="Admin">Admin</option>
                <option value="Aviarista">Aviarista</option>
                <option value="Gerente">Gerente</option>
                <option value="Estoquista">Estoquista</option>
                <option value="Proprietário">Proprietário</option>
              </select>
            </div>
            <div className="col-md-4">
              <label htmlFor="login" className="form-label">
                Login*
              </label>
              <input
                type="text"
                className="form-control form-control-sm"
                id="login"
                name="login"
                value={formData.login}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-4">
              <label htmlFor="senha" className="form-label">
                Senha*
              </label>
              <input
                type="password"
                className="form-control form-control-sm"
                id="senha"
                name="senha"
                value={formData.senha}
                onChange={handleChange}
                required
              />
            </div>

            {/* Linha 5: Situação, Observação */}
            <div className="col-md-4">
              <label htmlFor="situacao" className="form-label">
                Situação*
              </label>
              <select
                className="form-select form-select-sm"
                id="situacao"
                name="situacao"
                value={formData.situacao}
                onChange={handleChange}
                required
              >
                <option value="ATIVO">ATIVO</option>
                <option value="DEMITIDO">DEMITIDO</option>
                <option value="AFASTADO">AFASTADO</option>
              </select>
            </div>
            <div className="col-md-8">
              <label htmlFor="observacao" className="form-label">
                Observação
              </label>
              <textarea
                className="form-control form-control-sm"
                id="observacao"
                name="observacao"
                rows={2}
                value={formData.observacao}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>

          {/* Botões */}
          <div className="mt-4 d-flex justify-content-end">
            <button
              type="button"
              className="btn btn-secondary btn-sm me-2"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary btn-sm" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : 'Salvar Funcionário'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default FuncionarioForm
