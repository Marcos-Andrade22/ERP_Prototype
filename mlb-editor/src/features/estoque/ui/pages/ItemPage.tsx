import { useParams } from "react-router-dom";
import { EstoqueViewer } from "../EstoqueViewer";

export default function ItemPage() {
    const { id } = useParams<{ id: string }>();

    return <EstoqueViewer itemIdInicial={id ? Number(id) : undefined} />;
}
