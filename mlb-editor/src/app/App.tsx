import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { EstoqueViewer } from '../features/estoque/ui/EstoqueViewer';
import { BuscaPage } from '../features/estoque/ui/pages/BuscaPage';
import { ResultadosBuscaPage } from '../features/estoque/ui/pages/ResultadosBuscaPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/estoque" replace />} />
        <Route path="/estoque" element={<EstoqueViewer />} />
        <Route path="/busca" element={<BuscaPage />} />
        <Route path="/busca/resultados" element={<ResultadosBuscaPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;