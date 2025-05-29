// src/app/page.tsx
export default function HomePage() {
  return (
    <div className="container-fluid">
      <div className="card">
        <div className="card-body">
          <h2 className="card-title fs-4">Bem-vindo ao PosturAves!</h2>
          <p className="card-text small">
            Este é o painel principal do seu Sistema de Gerenciamento Avícola.
          </p>
          <p className="card-text small">
            Selecione uma opção no menu lateral para começar a navegar e gerenciar sua granja.
          </p>
        </div>
      </div>
    </div>
  )
}
