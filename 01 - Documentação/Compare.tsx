// src/components/Funcionarios/FuncionarioForm.tsx
'use client'

import { useState, FormEvent, useEffect } from 'react' // Adicionado useEffect
import { IMaskInput } from 'react-imask'

// Interface para os dados do formulário
interface FuncionarioFormData {
  nome: string
  cpf: string
  apelido?: string
  nascimento: string
  dataAdmissao: string
  cargo: string
  salarioCarteira: number | ''
  salarioFamilia?: number | ''
  quinquenio?: number | ''
  extras?: number | ''
  valorDiaria?: number | ''
  perfil: 'Admin' | 'Aviarista' | 'Gerente' | 'Estoquista' | 'Proprietário' | ''
  login: string
  senha?: string // Senha é opcional na edição (se em branco, não muda)
  situacao: 'ATIVO' | 'DEMITIDO' | 'AFASTADO' | ''
  observacao?: string
}

// Interface para os dados completos de um Funcionário (como vem da API)
interface Funcionario {
  _id: string
  nome: string
  cpf: string
  apelido?: string
  nascimento: string // ISO String date
  dataAdmissao: string // ISO String date
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

interface FuncionarioFormProps {
  onFormSubmit: () => void
  onCancel: () => void
  funcionarioToEdit?: Funcionario | null // Funcionário para editar (opcional)
}

const initialFormData: FuncionarioFormData = {
  nome: '',
  cpf: '',
  apelido: '',
  nascimento: '', // Formato YYYY-MM-DD para input type="date"
  dataAdmissao: '', // Formato YYYY-MM-DD para input type="date"
  cargo: '',
  salarioCarteira: '',
  salarioFamilia: '',
  quinquenio: '',
  extras: '',
  valorDiaria: '',
  perfil: '',
  login: '',
  senha: '',
  situacao: 'ATIVO',
  observacao: '',
}

const currencyMaskOptions = {
  /* ... (como antes, com lazy: false) ... */
}
// const currencyMaskOptions = {
//   mask: Number, scale: 2, thousandsSeparator: '.', padFractionalZeros: true,
//   normalizeZeros: true, radix: ',', mapToRadix: ['.'], prefix: 'R$ ', lazy: false,
// };

const FuncionarioForm: React.FC<FuncionarioFormProps> = ({
  onFormSubmit,
  onCancel,
  funcionarioToEdit,
}) => {
  const [formData, setFormData] = useState<FuncionarioFormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const isEditMode = !!funcionarioToEdit // Define se está em modo de edição

  // Efeito para preencher o formulário quando funcionarioToEdit mudar (modo de edição)
  useEffect(() => {
    if (isEditMode && funcionarioToEdit) {
      // Formata as datas para o input type="date" (YYYY-MM-DD)
      const formatInputDate = (isoDateString?: string) => {
        if (!isoDateString) return ''
        return new Date(isoDateString).toISOString().split('T')[0]
      }

      setFormData({
        nome: funcionarioToEdit.nome || '',
        cpf: funcionarioToEdit.cpf || '', // CPF virá não mascarado do DB, IMaskInput irá formatá-lo
        apelido: funcionarioToEdit.apelido || '',
        nascimento: formatInputDate(funcionarioToEdit.nascimento),
        dataAdmissao: formatInputDate(funcionarioToEdit.dataAdmissao),
        cargo: funcionarioToEdit.cargo || '',
        salarioCarteira: funcionarioToEdit.salarioCarteira ?? '', // Usa ?? para tratar 0 corretamente
        salarioFamilia: funcionarioToEdit.salarioFamilia ?? '',
        quinquenio: funcionarioToEdit.quinquenio ?? '',
        extras: funcionarioToEdit.extras ?? '',
        valorDiaria: funcionarioToEdit.valorDiaria ?? '',
        perfil: funcionarioToEdit.perfil || '',
        login: funcionarioToEdit.login || '',
        senha: '', // Senha nunca é pré-preenchida
        situacao: funcionarioToEdit.situacao || 'ATIVO',
        observacao: funcionarioToEdit.observacao || '',
      })
    } else {
      setFormData(initialFormData) // Reseta para o estado inicial se não for modo de edição
    }
  }, [funcionarioToEdit, isEditMode])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    /* ... (como antes) ... */
  }
  const handleCpfChange = (value: string) => {
    /* ... (como antes) ... */
  }
  const handleCurrencyChange = (
    fieldName: keyof FuncionarioFormData,
    typedValue: number | undefined
  ) => {
    /* ... (como antes) ... */
  }
  const unmaskCPF = (maskedCPF: string): string => {
    /* ... (como antes) ... */
  }

  // Para colar o código completo das funções acima se precisar:
  // const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
  //   const { name, value } = e.target;
  //   setFormData(prev => ({ ...prev, [name]: value }));
  // };
  // const handleCpfChange = (value: string) => {
  //   setFormData(prev => ({ ...prev, cpf: value }));
  // };
  // const handleCurrencyChange = (
  //   fieldName: keyof FuncionarioFormData,
  //   typedValue: number | undefined
  // ) => {
  //   setFormData(prev => ({
  //     ...prev,
  //     [fieldName]: typedValue === undefined ? '' : typedValue,
  //   }));
  // };
  // const unmaskCPF = (maskedCPF: string): string => {
  //   return maskedCPF.replace(/\D/g, '');
  // };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccessMessage(null)

    let dataToSend: any = {
      // Copia todos os campos, pois alguns opcionais podem não estar no FormData se não foram tocados
      // e o backend pode esperar todos ou alguns deles.
      // O ideal é o backend lidar com campos opcionais não enviados.
      nome: formData.nome,
      cpf: unmaskCPF(formData.cpf),
      apelido: formData.apelido || undefined, // Envia undefined se vazio para campos opcionais
      nascimento: formData.nascimento,
      dataAdmissao: formData.dataAdmissao,
      cargo: formData.cargo,
      salarioCarteira: Number(formData.salarioCarteira) || 0,
      salarioFamilia: Number(formData.salarioFamilia) || 0,
      quinquenio: Number(formData.quinquenio) || 0,
      extras: Number(formData.extras) || 0,
      valorDiaria: Number(formData.valorDiaria) || 0,
      perfil: formData.perfil,
      login: formData.login,
      situacao: formData.situacao,
      observacao: formData.observacao || undefined,
    }

    // Apenas inclui a senha no envio se ela foi preenchida (para edição)
    if (formData.senha && formData.senha.trim() !== '') {
      dataToSend.senha = formData.senha
    } else if (!isEditMode) {
      // Se for modo de adição, a senha é obrigatória
      dataToSend.senha = formData.senha // Garante que a validação do backend pegue se estiver vazia
    }

    try {
      let response
      if (isEditMode && funcionarioToEdit) {
        // MODO DE EDIÇÃO: Requisição PUT
        response = await fetch(`http://localhost:3001/api/funcionarios/${funcionarioToEdit._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataToSend),
        })
      } else {
        // MODO DE ADIÇÃO: Requisição POST
        response = await fetch('http://localhost:3001/api/funcionarios', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataToSend),
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
        setFormData(initialFormData) // Limpa o formulário apenas se for modo de adição
      }
      onFormSubmit() // Chama a função do componente pai para fechar e recarregar
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

  return (
    <div className="card mt-3 mb-4">
      <div className="card-header">
        {isEditMode ? 'Editar Funcionário' : 'Cadastrar Novo Funcionário'}
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          {/* ... (mensagens de erro/sucesso como antes) ... */}
          {/* O JSX dos campos do formulário continua o mesmo, 
              eles serão preenchidos pelo estado 'formData' que é atualizado no useEffect para edição.
              Apenas o placeholder da senha pode mudar.
          */}

          {/* ... (Copie e cole aqui todo o JSX do <div className="row g-3"> ... </div> que você já tem) ... */}
          {/* A única pequena alteração no JSX seria no placeholder da senha: */}
          {/* Exemplo para o campo senha:
            <div className="col-md-4">
              <label htmlFor="senha" className="form-label">{isEditMode ? 'Nova Senha' : 'Senha'}*</label>
              <input 
                type="password" 
                className="form-control form-control-sm" 
                id="senha" 
                name="senha" 
                value={formData.senha} 
                onChange={handleChange} 
                placeholder={isEditMode ? '(Deixe em branco para não alterar)' : ''}
                required={!isEditMode} // Senha é obrigatória apenas no modo de adição
                disabled={isSubmitting}
              />
            </div>
          */}
          {/* COLE O CONTEÚDO COMPLETO DO FORMULÁRIO JSX AQUI (do <div className="row g-3"> até o final do </form>) 
              DA VERSÃO ANTERIOR, APENAS ATUALIZE O CAMPO SENHA COMO ACIMA.
          */}
          {/* Para evitar um response gigantesco, não vou repetir todo o JSX do formulário aqui.
              Mas as modificações importantes são:
              1. O useEffect acima para popular o formData.
              2. A lógica no handleSubmit para diferenciar POST e PUT.
              3. O título do card e texto do botão de submit mudam.
              4. O campo senha deve ter placeholder diferente e `required={!isEditMode}`.
          */}
        </form>
      </div>
    </div>
  )
}

export default FuncionarioForm
