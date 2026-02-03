import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { Cabecalho } from './componentes/layout/Cabecalho'
import { SecaoHero } from './componentes/secoes/SecaoHero'
import { SecaoRecurso } from './componentes/secoes/SecaoRecurso'
import { SecaoSobre } from './componentes/secoes/SecaoSobre'
import { Rodape } from './componentes/layout/Rodape'
import FormularioTutor from './componentes/formularios/FormularioTutor'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Página principal */}
        <Route
          path="/"
          element={
            <main className="min-h-screen bg-background">
              <Cabecalho />
              <SecaoHero />
              <SecaoRecurso />
              <SecaoSobre />
              <Rodape />
            </main>
          }
        />

        {/* Página do formulário */}
        <Route path="/cadastro-tutor" element={<FormularioTutor />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App