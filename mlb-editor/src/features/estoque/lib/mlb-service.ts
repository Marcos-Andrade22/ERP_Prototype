// REMOVIDO — substituído pelo serviço unificado em src/shared/lib/mlb-service.ts
// Reexporta para evitar quebrar imports residuais durante a transição.
export { mlbService, parsearMlbBruto } from "../../../shared/lib/mlb-service";
export type { MlbEntry as MlbItem } from "../../../shared/lib/mlb-service";
