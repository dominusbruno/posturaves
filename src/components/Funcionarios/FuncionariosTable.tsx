// src/components/Funcionarios/FuncionariosTable.tsx
'use client' // Este componente não precisa de estado complexo, mas pode ter interações no futuro

// Interface para definir a estrutura de um funcionário (espelhando o backend)
// Poderíamos importar IFuncionario do backend se estivéssemos em um monorepo
// ou definir uma cópia aqui para o frontend.
interface Funcionario {
  _id: string // Adicionado pelo MongoDB
  nome: string
  cpf: string
  apelido?: string
  nascimento: string // Receberemos como string ISO da API, formataremos para exibição
  dataAdmissao: string // Receberemos como string ISO da API, formataremos para exibição
  cargo: string
  salarioCarteira: number
  salarioFamilia?: number
  quinquenio?: number
  extras?: number
  valorDiaria?: number
  perfil: string // 'Admin' | 'Aviarista' | 'Gerente' | 'Estoquista' | 'Proprietário';
  login: string
  // Senha não será exibida
  situacao: string // 'ATIVO' | 'DEMITIDO' | 'AFASTADO';
  observacao?: string
  createdAt?: string // Adicionado pelo Mongoose (timestamps: true)
  updatedAt?: string // Adicionado pelo Mongoose (timestamps: true)
}

interface FuncionariosTableProps {
  funcionarios: Funcionario[]
  // Adicionaremos funções para editar/deletar aqui no futuro
}

// Função para formatar datas (ex: de ISO string para dd/mm/yyyy)
const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  // Adiciona 1 dia à data por causa de problemas comuns com fuso horário ao converter apenas data
  // Isso é um paliativo; o ideal seria tratar fusos horários consistentemente
  date.setDate(date.getDate() + 1)
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

// Função para formatar moeda (ex: para R$ 1.234,56)
const formatCurrency = (value: number | undefined): string => {
  if (value === undefined || value === null) return 'R$ -'
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

const FuncionariosTable: React.FC<FuncionariosTableProps> = ({ funcionarios }) => {
  if (!funcionarios || funcionarios.length === 0) {
    return <p className="text-center mt-3">Nenhum funcionário cadastrado ainda.</p>
  }

  return (
    <div className="table-responsive mt-4">
      {' '}
      {/* Torna a tabela rolável em telas pequenas */}
      <table className="table table-striped table-hover table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Nome</th>
            <th>CPF</th>
            <th>Cargo</th>
            <th>Data Admissão</th>
            <th>Sal. Carteira</th>
            <th>Situação</th>
            <th>Perfil</th>
            {/* Adicione mais colunas conforme necessário ou para ações futuras */}
            {/* <th>Ações</th> */}
          </tr>
        </thead>
        <tbody>
          {funcionarios.map((func) => (
            <tr key={func._id}>
              <td>{func.nome}</td>
              <td>{func.cpf}</td> {/* Poderíamos adicionar máscara de CPF aqui */}
              <td>{func.cargo}</td>
              <td>{formatDate(func.dataAdmissao)}</td>
              <td>{formatCurrency(func.salarioCarteira)}</td>
              <td>
                <span
                  className={`badge ${
                    func.situacao === 'ATIVO'
                      ? 'bg-success'
                      : func.situacao === 'AFASTADO'
                      ? 'bg-warning text-dark'
                      : 'bg-danger'
                  }`}
                >
                  {func.situacao}
                </span>
              </td>
              <td>{func.perfil}</td>
              {/* <td>
                <button className="btn btn-sm btn-outline-primary me-1">Editar</button>
                <button className="btn btn-sm btn-outline-danger">Excluir</button>
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default FuncionariosTable
