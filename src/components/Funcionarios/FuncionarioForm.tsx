// src/components/Funcionarios/FuncionarioForm.tsx
'use client'

import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { IMaskInput } from 'react-imask'
import styles from './FuncionarioForm.module.css'

// Define a estrutura dos dados do formulário
interface FuncionarioFormData {
  nome: string
  cpf: string
  apelido?: string
  nascimento: string // Espera YYYY-MM-DD para o input type="date"
  dataAdmissao: string // Espera YYYY-MM-DD para o input type="date"
  cargo: string
  salarioCarteira: number | '' // Permite número ou string vazia para facilitar input e limpeza
  salarioFamilia?: number | ''
  quinquenio?: number | ''
  extras?: number | ''
  valorDiaria?: number | ''
  perfil: 'Admin' | 'Aviarista' | 'Gerente' | 'Estoquista' | 'Proprietário' | '' // Tipos de perfil permitidos
  login: string
  senha?: string // Senha é opcional na edição, não é pré-preenchida
  situacao: 'ATIVO' | 'DEMITIDO' | 'AFASTADO' | '' // Estados possíveis do funcionário
  observacao?: string
}

// Define a estrutura de um funcionário como recebido da API (para edição)
interface Funcionario {
  _id: string
  nome: string
  cpf: string
  apelido?: string
  nascimento: string // Geralmente uma string ISO da API (ex: "2023-10-26T00:00:00.000Z")
  dataAdmissao: string // Geralmente uma string ISO da API
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
}

// Propriedades que o componente FuncionarioForm espera receber
interface FuncionarioFormProps {
  onFormSubmit: () => void // Função a ser chamada após submissão bem-sucedida
  onCancel: () => void // Função a ser chamada ao clicar em "Cancelar"
  funcionarioToEdit?: Funcionario | null // Dados do funcionário para edição (opcional)
}

// Estado inicial para um novo formulário
const initialFormData: FuncionarioFormData = {
  nome: '',
  cpf: '',
  apelido: '',
  nascimento: '',
  dataAdmissao: '',
  cargo: '',
  salarioCarteira: '', // Inicia como string vazia
  salarioFamilia: '',
  quinquenio: '',
  extras: '',
  valorDiaria: '',
  perfil: '', // String vazia para que o placeholder "Selecione..." do <select> funcione
  login: '',
  senha: '', // Senha começa vazia
  situacao: 'ATIVO', // Valor padrão para situação
  observacao: '',
}

// Configurações reutilizáveis para a máscara de moeda BRL
const currencyMaskOptions = {
  mask: Number, // Define como máscara numérica
  scale: 2, // Número de casas decimais
  thousandsSeparator: '.', // Separador de milhar
  padFractionalZeros: true, // Adiciona zeros fracionários (ex: 1200 -> 1200,00)
  normalizeZeros: true, // Remove zeros à esquerda desnecessários
  radix: ',', // Caractere usado para separar a parte inteira da decimal
  mapToRadix: ['.'], // Permite que o usuário digite '.' e seja convertido para ','
  lazy: false, // Faz com que o prefixo (se houvesse) e a formatação apareçam mesmo com campo vazio
  // prefix: 'R$ ', // Removido, pois estamos usando input-group do Bootstrap para o "R$"
}

const FuncionarioForm: React.FC<FuncionarioFormProps> = ({
  onFormSubmit,
  onCancel,
  funcionarioToEdit,
}) => {
  const [formData, setFormData] = useState<FuncionarioFormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const isEditMode = !!funcionarioToEdit // True se funcionarioToEdit tiver dados, false caso contrário

  // useEffect para preencher o formulário com dados quando estiver em modo de edição
  useEffect(() => {
    if (isEditMode && funcionarioToEdit) {
      const formatInputDate = (isoDateString?: string): string => {
        if (!isoDateString) return ''
        try {
          // Converte data ISO para o formato YYYY-MM-DD, esperado pelo input type="date"
          return new Date(isoDateString).toISOString().split('T')[0]
        } catch (e) {
          console.error('Erro ao formatar data para input:', isoDateString, e)
          return ''
        }
      }

      setFormData({
        nome: funcionarioToEdit.nome || '',
        cpf: funcionarioToEdit.cpf || '', // IMaskInput formatará este valor para exibição
        apelido: funcionarioToEdit.apelido || '',
        nascimento: formatInputDate(funcionarioToEdit.nascimento),
        dataAdmissao: formatInputDate(funcionarioToEdit.dataAdmissao),
        cargo: funcionarioToEdit.cargo || '',
        salarioCarteira: funcionarioToEdit.salarioCarteira ?? '', // Se null/undefined, usa string vazia
        salarioFamilia: funcionarioToEdit.salarioFamilia ?? '',
        quinquenio: funcionarioToEdit.quinquenio ?? '',
        extras: funcionarioToEdit.extras ?? '',
        valorDiaria: funcionarioToEdit.valorDiaria ?? '',
        perfil: funcionarioToEdit.perfil || '',
        login: funcionarioToEdit.login || '',
        senha: '', // Campo senha NUNCA é pré-preenchido por segurança
        situacao: funcionarioToEdit.situacao || 'ATIVO',
        observacao: funcionarioToEdit.observacao || '',
      })
    } else {
      // Se não estiver em modo de edição, garante que o formulário use os dados iniciais (limpos)
      setFormData(initialFormData)
    }
  }, [funcionarioToEdit, isEditMode]) // Roda este efeito se funcionarioToEdit ou isEditMode mudarem

  // Handler genérico para campos de input de texto, select, textarea, date
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handler para o campo CPF (controlado pelo IMaskInput)
  const handleCpfChange = (value: string) => {
    // 'value' aqui é o valor mascarado
    setFormData((prev) => ({ ...prev, cpf: value }))
  }

  // Handler para campos de moeda (controlado pelo IMaskInput)
  const handleCurrencyChange = (
    fieldName: keyof FuncionarioFormData,
    typedValue: number | undefined // 'typedValue' é o valor numérico puro ou undefined
  ) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: typedValue === undefined ? '' : typedValue, // Armazena número ou string vazia
    }))
  }

  // Remove caracteres não numéricos do CPF para envio ao backend
  const unmaskCPF = (maskedCPF: string): string => {
    return maskedCPF.replace(/\D/g, '')
  }

  // Lida com a submissão do formulário
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccessMessage(null)

    // Prepara o payload de dados para enviar à API
    const dataPayload: Partial<FuncionarioFormData> & { senha?: string } = {
      nome: formData.nome,
      cpf: unmaskCPF(formData.cpf),
      apelido: formData.apelido || undefined, // Envia undefined se vazio
      nascimento: formData.nascimento,
      dataAdmissao: formData.dataAdmissao,
      cargo: formData.cargo,
      salarioCarteira: Number(formData.salarioCarteira) || 0, // Converte para número; '' vira 0
      salarioFamilia: Number(formData.salarioFamilia) || 0,
      quinquenio: Number(formData.quinquenio) || 0,
      extras: Number(formData.extras) || 0,
      valorDiaria: Number(formData.valorDiaria) || 0,
      perfil: formData.perfil,
      login: formData.login,
      situacao: formData.situacao,
      observacao: formData.observacao || undefined, // Envia undefined se vazio
    }

    // Lógica para incluir a senha apenas se ela foi digitada/alterada
    if (formData.senha && formData.senha.trim() !== '') {
      dataPayload.senha = formData.senha
    } else if (!isEditMode && (!formData.senha || formData.senha.trim() === '')) {
      // Se estiver adicionando e a senha estiver vazia, envia vazia para o backend validar (se required)
      dataPayload.senha = ''
    }
    // Se estiver editando e a senha for deixada em branco, a propriedade 'senha' não será incluída no dataPayload,
    // e o backend (conforme nosso controller) não alterará a senha existente.

    try {
      let response
      const endpoint = 'http://localhost:3001/api/funcionarios'

      if (isEditMode && funcionarioToEdit) {
        response = await fetch(`${endpoint}/${funcionarioToEdit._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataPayload),
        })
      } else {
        response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataPayload),
        })
      }

      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.message || `HTTP error! status: ${response.status}`)
      }

      setSuccessMessage(
        isEditMode ? 'Funcionário atualizado com sucesso!' : 'Funcionário cadastrado com sucesso!'
      )
      if (!isEditMode) {
        setFormData(initialFormData) // Limpa o formulário somente no modo de adição
      }
      onFormSubmit() // Notifica o componente pai sobre o sucesso
    } catch (err: unknown) {
      console.error(`Falha ao ${isEditMode ? 'atualizar' : 'cadastrar'} funcionário:`, err)
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError(
          `Ocorreu um erro desconhecido ao ${isEditMode ? 'atualizar' : 'cadastrar'} o funcionário.`
        )
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // Renderização do formulário
  return (
    <div className="card mt-3 mb-4 shadow-sm">
      {' '}
      {/* Adicionado shadow-sm para um leve destaque */}
      <div className={`card-header bg-light ${styles.formCardHeader}`}>
        {' '}
        <h5 className={`mb-0 py-1 ${styles.formHeaderTitle}`}>
          {isEditMode ? 'Editar Funcionário' : 'Novo Funcionário'}
        </h5>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="alert alert-danger py-2" role="alert">
              {error}
            </div>
          )}
          {successMessage && (
            <div className="alert alert-success py-2" role="alert">
              {successMessage}
            </div>
          )}

          {/* Usando g-2 para espaçamento menor entre colunas do grid, conforme seu código */}
          <div className="row g-2">
            {/* Linha 1 */}
            <div className="col-md-5">
              <label htmlFor="nome" className="form-label form-label-sm">
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
                disabled={isSubmitting}
              />
            </div>
            <div className="col-md-4">
              <label htmlFor="cpf" className="form-label form-label-sm">
                CPF*
              </label>
              <IMaskInput
                mask="000.000.000-00"
                value={formData.cpf}
                onAccept={handleCpfChange}
                id="cpf"
                type="text"
                className="form-control form-control-sm"
                placeholder="000.000.000-00"
                required
                disabled={isSubmitting}
                name="cpf"
              />
            </div>
            <div className="col-md-3">
              <label htmlFor="apelido" className="form-label form-label-sm">
                Apelido
              </label>
              <input
                type="text"
                className="form-control form-control-sm"
                id="apelido"
                name="apelido"
                value={formData.apelido}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>

            {/* Linha 2 */}
            <div className="col-md-3">
              <label htmlFor="nascimento" className="form-label form-label-sm">
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
                disabled={isSubmitting}
              />
            </div>
            <div className="col-md-3">
              <label htmlFor="dataAdmissao" className="form-label form-label-sm">
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
                disabled={isSubmitting}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="cargo" className="form-label form-label-sm">
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
                disabled={isSubmitting}
              />
            </div>

            {/* Linha 3: Salários */}
            <div className="col-md-3">
              <label htmlFor="salarioCarteira" className="form-label form-label-sm">
                Salário (Carteira)*
              </label>
              <div className="input-group input-group-sm">
                <span className="input-group-text">R$</span>
                <IMaskInput
                  {...currencyMaskOptions}
                  unmask={true}
                  value={
                    formData.salarioCarteira === '' ? undefined : String(formData.salarioCarteira)
                  }
                  onAccept={(value, maskRef) =>
                    handleCurrencyChange(
                      'salarioCarteira',
                      maskRef.typedValue as number | undefined
                    )
                  }
                  type="text"
                  className="form-control"
                  id="salarioCarteira"
                  placeholder="0,00"
                  required
                  disabled={isSubmitting}
                  aria-label="Salário Carteira"
                />
              </div>
            </div>
            <div className="col-md-3">
              <label htmlFor="salarioFamilia" className="form-label form-label-sm">
                Salário Família
              </label>
              <div className="input-group input-group-sm">
                <span className="input-group-text">R$</span>
                <IMaskInput
                  {...currencyMaskOptions}
                  unmask={true}
                  value={
                    formData.salarioFamilia === '' ? undefined : String(formData.salarioFamilia)
                  }
                  onAccept={(value, maskRef) =>
                    handleCurrencyChange('salarioFamilia', maskRef.typedValue as number | undefined)
                  }
                  type="text"
                  className="form-control"
                  id="salarioFamilia"
                  placeholder="0,00"
                  disabled={isSubmitting}
                  aria-label="Salário Família"
                />
              </div>
            </div>
            <div className="col-md-2">
              <label htmlFor="quinquenio" className="form-label form-label-sm">
                Quinquênio
              </label>
              <div className="input-group input-group-sm">
                <span className="input-group-text">R$</span>
                <IMaskInput
                  {...currencyMaskOptions}
                  unmask={true}
                  value={formData.quinquenio === '' ? undefined : String(formData.quinquenio)}
                  onAccept={(value, maskRef) =>
                    handleCurrencyChange('quinquenio', maskRef.typedValue as number | undefined)
                  }
                  type="text"
                  className="form-control"
                  id="quinquenio"
                  placeholder="0,00"
                  disabled={isSubmitting}
                  aria-label="Quinquênio"
                />
              </div>
            </div>
            <div className="col-md-2">
              <label htmlFor="extras" className="form-label form-label-sm">
                Extras
              </label>
              <div className="input-group input-group-sm">
                <span className="input-group-text">R$</span>
                <IMaskInput
                  {...currencyMaskOptions}
                  unmask={true}
                  value={formData.extras === '' ? undefined : String(formData.extras)}
                  onAccept={(value, maskRef) =>
                    handleCurrencyChange('extras', maskRef.typedValue as number | undefined)
                  }
                  type="text"
                  className="form-control"
                  id="extras"
                  placeholder="0,00"
                  disabled={isSubmitting}
                  aria-label="Extras"
                />
              </div>
            </div>
            <div className="col-md-2">
              <label htmlFor="valorDiaria" className="form-label form-label-sm">
                Diária
              </label>
              <div className="input-group input-group-sm">
                <span className="input-group-text">R$</span>
                <IMaskInput
                  {...currencyMaskOptions}
                  unmask={true}
                  value={formData.valorDiaria === '' ? undefined : String(formData.valorDiaria)}
                  onAccept={(value, maskRef) =>
                    handleCurrencyChange('valorDiaria', maskRef.typedValue as number | undefined)
                  }
                  type="text"
                  className="form-control"
                  id="valorDiaria"
                  placeholder="0,00"
                  disabled={isSubmitting}
                  aria-label="Valor da Diária"
                />
              </div>
            </div>

            {/* Linha 4: Perfil, Login, Senha */}
            <div className="col-md-4">
              <label htmlFor="perfil" className="form-label form-label-sm">
                Perfil de Acesso*
              </label>
              <select
                className="form-select form-select-sm"
                id="perfil"
                name="perfil"
                value={formData.perfil}
                onChange={handleChange}
                required
                disabled={isSubmitting}
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
              <label htmlFor="login" className="form-label form-label-sm">
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
                disabled={isSubmitting}
              />
            </div>
            <div className="col-md-4">
              <label htmlFor="senha" className="form-label form-label-sm">
                {isEditMode ? 'Nova Senha' : 'Senha'}
                {!isEditMode && '*'}
              </label>
              <input
                type="password"
                className="form-control form-control-sm"
                id="senha"
                name="senha"
                value={formData.senha || ''}
                onChange={handleChange}
                placeholder={isEditMode ? '(Deixe em branco para não alterar)' : 'Digite a senha'}
                required={!isEditMode}
                disabled={isSubmitting}
              />
            </div>

            {/* Linha 5: Situação, Observação */}
            {/* Reorganizei para Observação ocupar mais espaço e Situação ao lado, se couber */}
            <div className="col-md-8">
              <label htmlFor="observacao" className="form-label form-label-sm">
                Observação
              </label>
              <textarea
                className="form-control form-control-sm"
                id="observacao"
                name="observacao"
                rows={2}
                value={formData.observacao}
                onChange={handleChange}
                disabled={isSubmitting}
              ></textarea>
            </div>
            <div className="col-md-4">
              <label htmlFor="situacao" className="form-label form-label-sm">
                Situação*
              </label>
              <select
                className="form-select form-select-sm"
                id="situacao"
                name="situacao"
                value={formData.situacao}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              >
                <option value="ATIVO">ATIVO</option>
                <option value="DEMITIDO">DEMITIDO</option>
                <option value="AFASTADO">AFASTADO</option>
              </select>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="mt-3 d-flex justify-content-end">
            {' '}
            {/* Diminuído mt-4 para mt-3 */}
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm me-2" // Mudado para outline-secondary
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button type="submit" className="btn btn-success btn-sm" disabled={isSubmitting}>
              {' '}
              {/* Mudado para success */}
              {isSubmitting
                ? isEditMode
                  ? 'Salvando...'
                  : 'Cadastrando...' // Texto mais específico
                : isEditMode
                ? 'Salvar Alterações'
                : 'Cadastrar Funcionário'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default FuncionarioForm
