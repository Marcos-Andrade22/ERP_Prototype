import 'lucide-react';  // ícones
import { EstoqueViewer } from '../features/estoque/ui/EstoqueViewer';
import { CsvRawDebugger } from '../features/estoque/ui/CsvRawDebugger';
import MlbTable from '../components/MlbTable';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Protótipos ERP</h1>
        {/* <MlbTable /> */}
        <EstoqueViewer />
        {/* <CsvDebugger /> */}
        {/* <CsvRawDebugger /> */}
        {/* <CsvConverter /> */}
      </div>
    </div>
  );
}

export default App;
