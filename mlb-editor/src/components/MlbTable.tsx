import { useState, useEffect } from 'react';
import type { MlbItem } from '../types/mlb.types';

export default function MlbTable() {
    const [items, setItems] = useState<MlbItem[]>([
        { id: '1', valor: 'MLB123456', isEditing: false, ean: false, cubagem: false, otimizado: true, full: false, patrocinados: false, clipe: false, revisado: true },
        { id: '2', valor: 'MLB789012', isEditing: false, ean: true, cubagem: true, otimizado: false, full: true, patrocinados: false, clipe: false, revisado: false },
    ]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [originalItems, setOriginalItems] = useState<MlbItem[]>([
        { id: '1', valor: 'MLB123456', isEditing: false, ean: false, cubagem: false, otimizado: true, full: false, patrocinados: false, clipe: false, revisado: true },
        { id: '2', valor: 'MLB789012', isEditing: false, ean: true, cubagem: true, otimizado: false, full: true, patrocinados: false, clipe: false, revisado: false },
    ]);

    useEffect(() => {
        setHasChanges(JSON.stringify(items) !== JSON.stringify(originalItems));
    }, [items, originalItems]);

    function updateFlag(id: string, field: keyof Omit<MlbItem, 'id' | 'valor' | 'isEditing'>, value: boolean) {
        setItems(curr => curr.map(it => (it.id === id ? { ...it, [field]: value } : it)));
    }

    function toggleEdit(id: string) {
        setItems(curr => curr.map(it => (it.id === id ? { ...it, isEditing: !it.isEditing } : it)));
    }

    function deleteItem(id: string) {
        setItems(curr => curr.filter(it => it.id !== id));
    }

    function addItem() {
        const newId = crypto.randomUUID();
        setItems(curr => [
            ...curr,
            {
                id: newId,
                valor: '',
                isEditing: true,
                ean: false,
                cubagem: false,
                otimizado: false,
                full: false,
                patrocinados: false,
                clipe: false,
                revisado: false,
            },
        ]);
    }

    function confirmChanges() {
        setOriginalItems([...items]);
        setHasChanges(false);
        setIsModalOpen(false);
    }

    return (
        <>
            {/* Botão Principal */}
            <button
                onClick={() => setIsModalOpen(true)}
                className="bg-green-500 hover:bg-green-600 active:bg-green-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer mb-12 mx-auto block"
            >
                Gerenciar MLB
            </button>

            {/* Modal */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6"
                    onClick={() => !hasChanges && setIsModalOpen(false)}
                >
                    <div
                        className="bg-white rounded-3xl shadow-2xl max-w-7xl max-h-[95vh] w-full h-[90vh] flex flex-col overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header do Modal */}
                        <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-8 border-b-2 border-gray-200 flex-shrink-0">
                            <div className="flex items-center justify-between">
                                <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                                    Gerenciar Itens MLB
                                </h2>
                                <div className="flex items-center gap-3">
                                    {hasChanges && (
                                        <button
                                            onClick={confirmChanges}
                                            className="bg-green-500 hover:bg-green-600 active:bg-green-700 text-white px-6 py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
                                        >
                                            ✅ Confirmar Alterações
                                        </button>
                                    )}
                                    <button
                                        onClick={addItem}
                                        disabled={hasChanges}
                                        className={`px-6 py-3 rounded-xl font-semibold text-white shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 ${hasChanges
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700 cursor-pointer'
                                            }`}
                                    >
                                        <span>+</span> Adicionar Item
                                    </button>
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        disabled={hasChanges}
                                        className={`px-6 py-3 rounded-xl font-semibold text-white shadow-md hover:shadow-lg transition-all duration-200 ${hasChanges
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-gray-500 hover:bg-gray-600 active:bg-gray-700 cursor-pointer'
                                            }`}
                                    >
                                        Fechar
                                    </button>
                                </div>
                            </div>
                            {hasChanges && (
                                <div className="mt-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-2xl text-sm font-medium text-blue-800 animate-pulse">
                                    🔄 Você tem alterações não salvas. Use "Confirmar" para salvar antes de fechar.
                                </div>
                            )}
                        </div>

                        {/* Tabela Scrollável */}
                        <div className="flex-1 overflow-auto">
                            <table className="w-full table-fixed">
                                <thead className="sticky top-0 bg-gradient-to-r from-gray-100 to-gray-200 z-20 shadow-sm">
                                    <tr>
                                        <th className="w-72 p-4 text-left border-b-2 border-gray-300 font-bold text-gray-700 uppercase tracking-wide text-sm">
                                            MLB
                                        </th>
                                        <th className="w-20 p-4 text-center border-b-2 border-gray-300 font-bold text-gray-700 text-xs">
                                            EAN
                                        </th>
                                        <th className="w-24 p-4 text-center border-b-2 border-gray-300 font-bold text-gray-700 text-xs">
                                            Cubagem
                                        </th>
                                        <th className="w-28 p-4 text-center border-b-2 border-gray-300 font-bold text-gray-700 text-xs">
                                            Otimizado
                                        </th>
                                        <th className="w-20 p-4 text-center border-b-2 border-gray-300 font-bold text-gray-700 text-xs">
                                            Full
                                        </th>
                                        <th className="w-32 p-4 text-center border-b-2 border-gray-300 font-bold text-gray-700 text-xs">
                                            Patrocinados
                                        </th>
                                        <th className="w-20 p-4 text-center border-b-2 border-gray-300 font-bold text-gray-700 text-xs">
                                            Clipe
                                        </th>
                                        <th className="w-24 p-4 text-center border-b-2 border-gray-300 font-bold text-gray-700 text-xs">
                                            Revisado
                                        </th>
                                        <th className="w-32 p-4 text-center border-b-2 border-gray-300 font-bold text-gray-700 text-xs">
                                            Ações
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {items.map((item) => (
                                        <tr
                                            key={item.id}
                                            className={`transition-all duration-200 hover:bg-gray-50 ${item.isEditing ? 'bg-yellow-50 border-2 border-yellow-200' : ''
                                                }`}
                                        >
                                            <td className="p-4">
                                                <input
                                                    type="text"
                                                    value={item.valor}
                                                    disabled={!item.isEditing}
                                                    onChange={(e) =>
                                                        setItems((curr) =>
                                                            curr.map((it) =>
                                                                it.id === item.id ? { ...it, valor: e.target.value } : it
                                                            )
                                                        )
                                                    }
                                                    className={`w-full px-4 py-3 rounded-xl font-mono text-lg transition-all duration-200 border-2 focus:outline-none focus:ring-4 ${item.isEditing
                                                        ? 'border-blue-400 ring-blue-200 bg-white shadow-md ring-4 ring-blue-100'
                                                        : 'border-gray-300 bg-gray-50 cursor-not-allowed opacity-70'
                                                        }`}
                                                    placeholder="Digite o código MLB..."
                                                />
                                            </td>
                                            <td className="p-4 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={item.ean}
                                                    onChange={(e) => updateFlag(item.id, 'ean', e.target.checked)}
                                                    className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
                                                    disabled={!item.isEditing}
                                                />
                                            </td>
                                            <td className="p-4 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={item.cubagem}
                                                    onChange={(e) => updateFlag(item.id, 'cubagem', e.target.checked)}
                                                    className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
                                                    disabled={!item.isEditing}
                                                />
                                            </td>
                                            <td className="p-4 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={item.otimizado}
                                                    onChange={(e) => updateFlag(item.id, 'otimizado', e.target.checked)}
                                                    className="w-5 h-5 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2 cursor-pointer"
                                                    disabled={!item.isEditing}
                                                />
                                            </td>
                                            <td className="p-4 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={item.full}
                                                    onChange={(e) => updateFlag(item.id, 'full', e.target.checked)}
                                                    className="w-5 h-5 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2 cursor-pointer"
                                                    disabled={!item.isEditing}
                                                />
                                            </td>
                                            <td className="p-4 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={item.patrocinados}
                                                    onChange={(e) => updateFlag(item.id, 'patrocinados', e.target.checked)}
                                                    className="w-5 h-5 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 focus:ring-2 cursor-pointer"
                                                    disabled={!item.isEditing}
                                                />
                                            </td>
                                            <td className="p-4 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={item.clipe}
                                                    onChange={(e) => updateFlag(item.id, 'clipe', e.target.checked)}
                                                    className="w-5 h-5 text-pink-600 bg-gray-100 border-gray-300 rounded focus:ring-pink-500 focus:ring-2 cursor-pointer"
                                                    disabled={!item.isEditing}
                                                />
                                            </td>
                                            <td className="p-4 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={item.revisado}
                                                    onChange={(e) => updateFlag(item.id, 'revisado', e.target.checked)}
                                                    className="w-5 h-5 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2 cursor-pointer"
                                                    disabled={!item.isEditing}
                                                />
                                            </td>
                                            <td className="p-4 text-center">
                                                <div className="flex gap-2 justify-center">
                                                    <button
                                                        onClick={() => toggleEdit(item.id)}
                                                        className={`p-2 rounded-full transition-all duration-200 hover:scale-110 cursor-pointer shadow-md ${item.isEditing
                                                            ? 'bg-red-500 hover:bg-red-600 text-white'
                                                            : 'bg-blue-500 hover:bg-blue-600 text-white'
                                                            }`}
                                                        title={item.isEditing ? 'Cancelar edição (✕)' : 'Editar linha (🖉)'}
                                                    >
                                                        {item.isEditing ? '✕' : '🖉'}
                                                    </button>
                                                    <button
                                                        onClick={() => deleteItem(item.id)}
                                                        className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full hover:scale-110 transition-all duration-200 cursor-pointer shadow-md"
                                                        title="Excluir item (🗑️)"
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
