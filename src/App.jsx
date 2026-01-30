import './App.css'
import { Cabecalho } from './componentes/layout/Cabecalho'
import { SecaoHero } from './componentes/secoes/SecaoHero'
import { SecaoRecurso } from './componentes/secoes/SecaoRecurso'
import { SecaoSobre } from './componentes/secoes/SecaoSobre'
import { Rodape } from './componentes/layout/Rodape'

function App() {

  return (
    <main className="min-h-screen bg-background">
      <Cabecalho/>
      <SecaoHero />
      <SecaoRecurso />
      <SecaoSobre />
      <Rodape />
    </main>
  )
}

export default App
