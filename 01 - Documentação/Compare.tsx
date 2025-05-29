// src/app/layout.tsx
'use client'

import { useState, useEffect } from 'react'
import { Inter } from 'next/font/google'

// ... (CDN links ou imports NPM, conforme sua escolha)
// Se CDN, mantenha os <link> no <head>
// Se NPM, mantenha os imports:
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap-icons/font/bootstrap-icons.css';

import './globals.css'
import layoutStyles from './layout.module.css'

import Sidebar from '@/components/Sidebar/Sidebar'
import MobileHeader from '@/components/MobileHeader/MobileHeader'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [isMobileView, setIsMobileView] = useState(false)
  const [isMounted, setIsMounted] = useState(false) // Novo estado

  useEffect(() => {
    setIsMounted(true) // Define como montado assim que o componente carrega no cliente

    const handleResize = () => {
      const mobileCheck = window.innerWidth < 768
      setIsMobileView(mobileCheck)
      if (!mobileCheck) {
        setIsMobileSidebarOpen(false)
      }
    }
    handleResize() // Chama na montagem
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, []) // Array de dependências vazio

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen)
  }

  // Evita renderizar a UI que depende do window até que esteja montado no cliente
  // Isso previne que o servidor renderize algo que o cliente renderizaria diferente inicialmente
  if (!isMounted) {
    // Você pode retornar um loader simples ou null, mas para o layout raiz,
    // é melhor renderizar uma estrutura mínima ou a mesma estrutura que o servidor renderizaria
    // com os estados iniciais. Vamos tentar garantir que os estados iniciais causem o mesmo render.
    // A lógica principal aqui é que isMobileView será 'false' no servidor e no primeiro render do cliente
    // ANTES do useEffect. O useEffect então o corrige.
    // A chave é que o *HTML estrutural* não mude drasticamente.
    // A diferença no 'className' do Sidebar já é um problema se a estrutura de classes for diferente.
    // Por agora, o isMounted pode ajudar mais com o backdrop e o paddingTop.
  }

  return (
    <html lang="pt-BR">
      <head>
        {/* ... (seu conteúdo do head com meta tags, title, e links CDN se estiver usando) ... */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>PosturAves - Gestão Avícola</title>
        <meta
          name="description"
          content="Sistema de Gerenciamento para Granja de Postura Avícola PosturAves"
        />
        {/* Seus links CDN para Bootstrap e Bootstrap Icons aqui, SE você estiver usando CDN */}
        {/* Exemplo:
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossOrigin="anonymous" />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet" />
        */}
      </head>
      <body className={inter.className}>
        {isMounted && <MobileHeader toggleSidebar={toggleMobileSidebar} />}{' '}
        {/* Renderiza apenas no cliente */}
        {/* Para o Sidebar, o isMobileSidebarOpen (false inicialmente) e isMobileView (false inicialmente)
            já devem produzir uma saída consistente no servidor e no primeiro render do cliente.
            O problema do className={null} é o mais crítico a ser resolvido no Sidebar.tsx.
        */}
        <Sidebar
          isMobileSidebarOpen={isMobileSidebarOpen}
          toggleMobileSidebar={isMounted && isMobileView ? toggleMobileSidebar : undefined}
        />
        <main
          className={layoutStyles.mainContent}
          style={{
            paddingTop: isMounted && isMobileView ? '65px' : '15px',
          }}
        >
          {children}
        </main>
        {isMounted && isMobileView && isMobileSidebarOpen && (
          <div className={layoutStyles.backdrop} onClick={toggleMobileSidebar}></div>
        )}
      </body>
    </html>
  )
}
