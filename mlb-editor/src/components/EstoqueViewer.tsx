import { useState, useEffect } from 'react';
import { parseTabelasSi } from '../utils/estoqueParser';
import type { EstoqueItem } from '../utils/estoqueParser'

export default function EstoqueViewer() {
  const [data, setData] = useState<EstoqueItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    parseTabelasSi('/data/tabelas_si.tab')
      .then((parsed) => {
        console.log('✅ Parse OK:', parsed.length, 'itens');
        setData(parsed);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 p-8">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-lg text-gray-600">Carregando 12MB de estoque... (~30s)</p>
      </div>
    );
  }

  const totalValor = data.reduce((sum, item) => sum + parseFloat(item.preco), 0);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl shadow-xl">
        <div className="text-center">
          <div className="text-4xl font-bold text-blue-600">{data.length.toLocaleString()}</div>
          <div className="text-sm text-gray-600 mt-1">Total Peças</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold text-green-600">
            R$ {totalValor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-sm text-gray-600 mt-1">Valor Total</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold text-purple-600">
            {new Set(data.map(d => d.categoria)).size}
          </div>
          <div className="text-sm text-gray-600 mt-1">Categorias</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold text-orange-600">
            {data.filter(d => d.categoria === 'EIXO').length}
          </div>
          <div className="text-sm text-gray-600 mt-1">EIXO</div>
        </div>
      </div>

      {/* Tabela Preview */}
      <div className="bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-200">
        <div className="p-6 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            📦 Catálogo Estoque Completo
            <span className="ml-auto px-3 py-1 bg-blue-600 text-xs rounded-full font-bold">
              Primeiras 50 linhas
            </span>
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-blue-500 to-blue-700 text-white">
              <tr>
                <th className="p-4 text-left font-bold uppercase tracking-wide text-xs">Código</th>
                <th className="p-4 text-left font-bold uppercase tracking-wide text-xs">Ref</th>
                <th className="p-4 text-left font-bold uppercase tracking-wide text-xs">Descrição</th>
                <th className="p-4 text-right font-bold uppercase tracking-wide text-xs">Preço</th>
                <th className="p-4 text-left font-bold uppercase tracking-wide text-xs">Categoria</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.slice(0, 50).map((item, i) => (
                <tr key={i} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all">
                  <td className="p-4 font-mono text-sm bg-gray-50/50 font-semibold">{item.codigoProduto}</td>
                  <td className="p-4 font-mono text-xs">{item.referencia}</td>
                  <td className="p-4 max-w-lg" title={item.descricao}>
                    <div className="font-medium text-gray-900 truncate">{item.descricao}</div>
                  </td>
                  <td className="p-4 text-right">
                    <span className="font-bold text-lg text-green-600">
                      R$ {parseFloat(item.preco).toFixed(2)}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 text-xs font-bold rounded-full">
                      {item.categoria}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Download JSON */}
      <div className="text-center p-8 bg-gray-50 rounded-2xl">
        <button
          onClick={() => {
            const json = JSON.stringify(data.slice(0, 1000), null, 2);
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'estoque_si.json';
            a.click();
          }}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all cursor-pointer"
        >
          💾 Download JSON (1k itens)
        </button>
      </div>
    </div>
  );
}
