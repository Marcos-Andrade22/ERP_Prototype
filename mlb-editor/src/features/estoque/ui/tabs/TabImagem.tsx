import type { EstoqueItem } from "../../model/EstoqueItem";

type Props = {
    item: EstoqueItem;
    handleChange: (key: keyof EstoqueItem) => (value: any) => void;
};

export function TabImagem({ item, handleChange }: Props) {
    return (
        <div className="p-3 flex flex-col gap-3 items-center">
            {item.imagem ? (
                <img
                    src={item.imagem}
                    alt="Imagem do item"
                    className="max-h-48 object-contain border border-gray-300"
                />
            ) : (
                <div className="w-full h-40 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-[11px]">
                    Sem imagem
                </div>
            )}
            <input
                type="file"
                accept="image/*"
                onChange={e => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = () => handleChange("imagem")(reader.result as string);
                    reader.readAsDataURL(file);
                }}
                className="text-[11px]"
            />
        </div>
    );
}
