import EstoqueViewer from './components/EstoqueViewer';
import MlbTable from './components/MlbTable';
import 'lucide-react';  // ícones

function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Protótipos ERP</h1>
        {/* <MlbTable /> */}
        <EstoqueViewer />
      </div>
    </div>
  );
}

export default App;
