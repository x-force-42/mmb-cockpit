import type { Epico } from "../../../types/api";

/**
 * 5 épicos cobrindo: 2 abertos, 3 fechados, 1 (aquarium-prototipo)
 * com taxa de abort alta. Contagens batem com `ciclos.ts`.
 */
export const epicos: Epico[] = [
  {
    id: "20000000-0000-0000-0000-000000000001",
    slug: "mmb-logger-destilacao",
    started_at: "2026-05-12T09:00:00Z",
    intencao:
      "Destilar o sistema de logs do andaime: extrair o mmb-logger como pacote Python + API HTTP separada do MMB original, com schema novo (épicos, ciclos, eventos) pronto pro Cockpit consumir.",
    status: "aberto",
    closed_at: null,
    andaime_version: "v0.5.0",
    ciclos_total: 6,
    ciclos_completos: 2,
    ciclos_abortados: 2,
  },
  {
    id: "20000000-0000-0000-0000-000000000002",
    slug: "aquarium-prototipo",
    started_at: "2026-05-08T14:30:00Z",
    intencao:
      "Protótipo do mmb-aquarium em PixiJS: visualização de garagem com peixinhos representando Meeseeks ativos. Áudio reativo via Web Audio API.",
    status: "aberto",
    closed_at: null,
    andaime_version: "v0.4.0",
    ciclos_total: 7,
    ciclos_completos: 1,
    ciclos_abortados: 4,
  },
  {
    id: "20000000-0000-0000-0000-000000000003",
    slug: "cockpit-mvp",
    started_at: "2026-04-20T08:15:00Z",
    intencao:
      "MVP do Cockpit: SPA Vite/React/TS lendo a API do MMB, com Dashboard, lista de runs e detalhe com edição dos 3 campos manuais (merge, score, nota).",
    status: "fechado",
    closed_at: "2026-05-04T17:40:00Z",
    andaime_version: null,
    ciclos_total: 4,
    ciclos_completos: 4,
    ciclos_abortados: 0,
  },
  {
    id: "20000000-0000-0000-0000-000000000004",
    slug: "garagem-refactor",
    started_at: "2026-04-05T09:00:00Z",
    intencao:
      "Refatorar o pipeline da Garagem pra suportar timeout customizado por task e separar análise de slug do enriquecimento de briefing.",
    status: "fechado",
    closed_at: "2026-04-18T11:20:00Z",
    andaime_version: null,
    ciclos_total: 3,
    ciclos_completos: 2,
    ciclos_abortados: 1,
  },
  {
    id: "20000000-0000-0000-0000-000000000005",
    slug: "telemetry-eventbus",
    started_at: "2026-03-22T10:00:00Z",
    intencao:
      "Introduzir event bus interno no MMB pra desacoplar produção de eventos (Garagem, Meeseeks, Discord) da gravação no logger.",
    status: "fechado",
    closed_at: "2026-04-02T16:00:00Z",
    andaime_version: null,
    ciclos_total: 3,
    ciclos_completos: 2,
    ciclos_abortados: 1,
  },
];
