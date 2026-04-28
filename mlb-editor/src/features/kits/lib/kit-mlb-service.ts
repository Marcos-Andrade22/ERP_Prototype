// REMOVIDO — substituído pelo serviço unificado em src/shared/lib/mlb-service.ts
// Reexporta para evitar quebrar imports residuais durante a transição.
export { mlbService as kitMlbService, parsearMlbBruto } from "../../../shared/lib/mlb-service";
export type { MlbEntry as KitMlbEntry } from "../../../shared/lib/mlb-service";
