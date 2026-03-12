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
        setOriginalItems(items);
        setHasChanges(false);
        setIsModalOpen(false);
    }

    return (
        <>
            {/* Botão principal */}
            <button
                onClick={() => setIsModalOpen(true)}
                style={{
                    background: '#28a745',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: 6,
                    fontSize: 16,
                    cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}
            >
                Gerenciar MLB
            </button>

            {/* Modal */}
            {isModalOpen && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                        padding: 20,
                    }}
                    onClick={() => !hasChanges && setIsModalOpen(false)}
                >
                    <div
                        style={{
                            background: 'white',
                            borderRadius: 12,
                            maxWidth: '90vw',
                            maxHeight: '90vh',
                            width: 1200,
                            height: 700,
                            overflow: 'hidden',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div style={{ background: '#f8f9fa', padding: 20, borderBottom: '1px solid #dee2e6' }}>
                            <div style={{ display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
                                <h2 style={{ margin: 0 }}>Gerenciar Itens MLB</h2>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    {hasChanges && (
                                        <button
                                            onClick={confirmChanges}
                                            style={{
                                                background: '#28a745',
                                                color: 'white',
                                                border: 'none',
                                                padding: '8px 16px',
                                                borderRadius: 4,
                                                cursor: 'pointer',
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            ✅ Confirmar
                                        </button>
                                    )}
                                    <button
                                        onClick={addItem}
                                        disabled={hasChanges}
                                        style={{
                                            background: hasChanges ? '#ccc' : '#007bff',
                                            color: 'white',
                                            border: 'none',
                                            padding: '8px 16px',
                                            borderRadius: 4,
                                            cursor: hasChanges ? 'not-allowed' : 'pointer',
                                        }}
                                    >
                                        + Adicionar
                                    </button>
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        disabled={hasChanges}
                                        style={{
                                            background: hasChanges ? '#ccc' : '#6c757d',
                                            color: 'white',
                                            border: 'none',
                                            padding: '8px 16px',
                                            borderRadius: 4,
                                            cursor: hasChanges ? 'not-allowed' : 'pointer',
                                        }}
                                    >
                                        Fechar
                                    </button>
                                </div>
                            </div>
                            {hasChanges && (
                                <div style={{ marginTop: 8, padding: 8, background: '#d1ecf1', borderRadius: 4, fontSize: 14, color: '#0c5460' }}>
                                    Você tem mudanças não salvas. Clique em "Confirmar" para salvar.
                                </div>
                            )}
                        </div>

                        {/* Tabela */}
                        <div style={{ height: 'calc(100% - 80px)', overflow: 'auto' }}>
                            <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                                <thead>
                                    <tr style={{ background: '#f8f9fa', position: 'sticky', top: 0, zIndex: 10 }}>
                                        <th style={{ padding: 12, border: '1px solid #dee2e6', textAlign: 'left' }}>MLB</th>
                                        <th style={{ padding: 12, border: '1px solid #dee2e6', textAlign: 'center', width: 80 }}>EAN</th>
                                        <th style={{ padding: 12, border: '1px solid #dee2e6', textAlign: 'center', width: 90 }}>Cubagem</th>
                                        <th style={{ padding: 12, border: '1px solid #dee2e6', textAlign: 'center', width: 100 }}>Otimizado</th>
                                        <th style={{ padding: 12, border: '1px solid #dee2e6', textAlign: 'center', width: 70 }}>Full</th>
                                        <th style={{ padding: 12, border: '1px solid #dee2e6', textAlign: 'center', width: 110 }}>Patrocinados</th>
                                        <th style={{ padding: 12, border: '1px solid #dee2e6', textAlign: 'center', width: 70 }}>Clipe</th>
                                        <th style={{ padding: 12, border: '1px solid #dee2e6', textAlign: 'center', width: 90 }}>Revisado</th>
                                        <th style={{ padding: 12, border: '1px solid #dee2e6', textAlign: 'center', width: 100 }}>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map(item => (
                                        <tr key={item.id} style={{ background: item.isEditing ? '#fff3cd' : 'white' }}>
                                            <td style={{ padding: 12, border: '1px solid #dee2e6' }}>
                                                <input
                                                    type="text"
                                                    value={item.valor}
                                                    disabled={!item.isEditing}
                                                    onChange={e =>
                                                        setItems(curr =>
                                                            curr.map(it =>
                                                                it.id === item.id ? { ...it, valor: e.target.value } : it
                                                            )
                                                        )
                                                    }
                                                    style={{
                                                        width: '100%',
                                                        padding: 8,
                                                        border: item.isEditing ? '1px solid #007bff' : '1px solid #ced4da',
                                                        background: item.isEditing ? 'white' : '#f8f9fa',
                                                        borderRadius: 4,
                                                    }}
                                                />
                                            </td>
                                            <td style={{ padding: 12, border: '1px solid #dee2e6', textAlign: 'center' }}>
                                                <input type="checkbox" checked={item.ean} onChange={e => updateFlag(item.id, 'ean', e.target.checked)} />
                                            </td>
                                            <td style={{ padding: 12, border: '1px solid #dee2e6', textAlign: 'center' }}>
                                                <input type="checkbox" checked={item.cubagem} onChange={e => updateFlag(item.id, 'cubagem', e.target.checked)} />
                                            </td>
                                            <td style={{ padding: 12, border: '1px solid #dee2e6', textAlign: 'center' }}>
                                                <input type="checkbox" checked={item.otimizado} onChange={e => updateFlag(item.id, 'otimizado', e.target.checked)} />
                                            </td>
                                            <td style={{ padding: 12, border: '1px solid #dee2e6', textAlign: 'center' }}>
                                                <input type="checkbox" checked={item.full} onChange={e => updateFlag(item.id, 'full', e.target.checked)} />
                                            </td>
                                            <td style={{ padding: 12, border: '1px solid #dee2e6', textAlign: 'center' }}>
                                                <input type="checkbox" checked={item.patrocinados} onChange={e => updateFlag(item.id, 'patrocinados', e.target.checked)} />
                                            </td>
                                            <td style={{ padding: 12, border: '1px solid #dee2e6', textAlign: 'center' }}>
                                                <input type="checkbox" checked={item.clipe} onChange={e => updateFlag(item.id, 'clipe', e.target.checked)} />
                                            </td>
                                            <td style={{ padding: 12, border: '1px solid #dee2e6', textAlign: 'center' }}>
                                                <input type="checkbox" checked={item.revisado} onChange={e => updateFlag(item.id, 'revisado', e.target.checked)} />
                                            </td>
                                            <td style={{ padding: 12, border: '1px solid #dee2e6', textAlign: 'center' }}>
                                                <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
                                                    <button
                                                        onClick={() => toggleEdit(item.id)}
                                                        style={{
                                                            background: 'none',
                                                            border: 'none',
                                                            fontSize: 18,
                                                            cursor: 'pointer',
                                                            color: item.isEditing ? '#dc3545' : '#007bff',
                                                        }}
                                                        title={item.isEditing ? 'Cancelar' : 'Editar'}
                                                    >
                                                        {item.isEditing ? '✕' : '🖉'}
                                                    </button>
                                                    <button
                                                        onClick={() => deleteItem(item.id)}
                                                        style={{
                                                            background: 'none',
                                                            border: 'none',
                                                            fontSize: 18,
                                                            cursor: 'pointer',
                                                            color: '#dc3545',
                                                        }}
                                                        title="Excluir"
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
