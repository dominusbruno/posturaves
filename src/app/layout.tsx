// src/app/layout.tsx
'use client'

import { useState, useEffect } from 'react'
import { Roboto } from 'next/font/google'

// Seus imports de CSS (globals e modules)
import './globals.css'
import layoutStyles from './layout.module.css'

// Seus imports de componentes
import Sidebar from '@/components/Sidebar/Sidebar'
import MobileHeader from '@/components/MobileHeader/MobileHeader'

const roboto = Roboto({
  weight: ['300', '400', '500', '700'], // Pesos que você pode querer usar (ex: light, normal, medium, bold)
  style: ['normal', 'italic'], // Estilos (opcional)
  subsets: ['latin'], // Subconjunto de caracteres
  display: 'swap', // Melhora a performance de carregamento da fonte
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [isMobileView, setIsMobileView] = useState(false)
  const [isMounted, setIsMounted] = useState(false) // <--- NOVO ESTADO ADICIONADO

  // Efeito para definir isMounted como true APENAS no cliente, após a montagem inicial
  useEffect(() => {
    setIsMounted(true)
  }, []) // Array de dependências vazio, executa uma vez após a montagem

  // Efeito para detectar o tamanho da tela e ajustar isMobileView
  useEffect(() => {
    // Só executa se o componente estiver montado no cliente (quando 'window' está disponível)
    if (!isMounted) {
      return // Não faz nada se não estiver montado no cliente
    }

    const handleResize = () => {
      const mobileCheck = window.innerWidth < 768 // Ponto de quebra 'md' do Bootstrap
      setIsMobileView(mobileCheck)
      if (!mobileCheck) {
        // Se não for mais visualização mobile
        setIsMobileSidebarOpen(false) // Fecha o sidebar mobile automaticamente
      }
    }

    handleResize() // Chama imediatamente para definir o estado inicial correto no cliente
    window.addEventListener('resize', handleResize) // Adiciona listener para redimensionamento

    // Limpa o listener quando o componente é desmontado
    return () => window.removeEventListener('resize', handleResize)
  }, [isMounted]) // Re-executa este efeito se isMounted mudar (para rodar após isMounted ser true)

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen)
  }

  // Para o render inicial (antes de isMounted ser true no cliente),
  // currentIsMobileView e currentIsMobileSidebarOpen serão false,
  // o que deve ser consistente com o que o servidor renderizaria (onde window não existe).
  const currentIsMobileView = isMounted && isMobileView
  const currentIsMobileSidebarOpen = isMounted && isMobileSidebarOpen

  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>PosturAves - Controle e Gestão Avícola</title>
        <meta
          name="description"
          content="Sistema de Gerenciamento para Granja de Postura Avícola PosturAves"
        />
        {/* <link rel="icon" href="/favicon.ico" /> */}

        {/* Links CDN para Bootstrap CSS e Icons */}
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
          crossOrigin="anonymous"
        />
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css"
          rel="stylesheet"
        />
      </head>
      <body className={roboto.className}>
        {/* Renderiza o MobileHeader. Ele já tem lógica d-md-none, então é seguro renderizar. */}
        <MobileHeader toggleSidebar={toggleMobileSidebar} />

        <Sidebar
          isMobileSidebarOpen={currentIsMobileSidebarOpen}
          toggleMobileSidebar={currentIsMobileView ? toggleMobileSidebar : undefined}
        />

        <main
          className={layoutStyles.mainContent}
          style={{
            // Usa currentIsMobileView para consistência inicial com o servidor
            paddingTop: currentIsMobileView ? '65px' : '15px',
          }}
        >
          {children}
        </main>

        {/* Renderiza o backdrop apenas se montado e as condições forem verdadeiras */}
        {currentIsMobileView && currentIsMobileSidebarOpen && (
          <div className={layoutStyles.backdrop} onClick={toggleMobileSidebar}></div>
        )}
        {/* Script CDN do Bootstrap JS (opcional, como antes) */}
      </body>
    </html>
  )
}
