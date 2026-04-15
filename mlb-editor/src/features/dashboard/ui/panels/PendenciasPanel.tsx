export default function PendenciasPanel() {
    return (
        <section>
            <p className="text-[11px] font-semibold text-gray-600 uppercase tracking-wider mb-2">Pendências</p>
            <div className="bg-[#ececec] border border-gray-400">
                <div
                    className="px-4 py-2 text-[11px] font-semibold text-white uppercase tracking-wider"
                    style={{ backgroundColor: "#22252A" }}
                >
                    Itens com estoque baixo
                </div>
                <div className="px-4 py-6 text-center text-[11px] text-gray-400">
                    Nenhuma pendência no momento.
                </div>
            </div>
        </section>
    );
}
