import type { Evento } from "../../../types/api";

/**
 * Timeline rica em 4 ciclos. Demais ciclos respondem com lista vazia.
 * - C3 (pr_aberto, M2 cockpit): fluxo completo até PR
 * - C5 (abortado heartbeat): perda de heartbeat
 * - C8 (abortado manual): comunicação master→planner→abort
 * - C14 (F0 cockpit-mvp completo): fluxo curto e limpo
 */
export const eventos: Evento[] = [
  // ─── C3 ────────────────────────────────────────────────────────────
  {
    id: 1,
    ciclo_id: "30000000-0000-0000-0000-000000000003",
    ts: "2026-05-15T08:30:00Z",
    kind: "state_change",
    severity: "info",
    payload: { from: null, to: "iniciado" },
  },
  {
    id: 2,
    ciclo_id: "30000000-0000-0000-0000-000000000003",
    ts: "2026-05-15T08:30:02Z",
    kind: "msg_send",
    severity: "info",
    payload: {
      from: "master",
      to: "planner:cockpit",
      summary: "preparação do Cockpit pro contrato do mmb-logger",
    },
  },
  {
    id: 3,
    ciclo_id: "30000000-0000-0000-0000-000000000003",
    ts: "2026-05-15T08:32:15Z",
    kind: "msg_receive",
    severity: "info",
    payload: {
      from: "planner:cockpit",
      to: "master",
      summary: "briefing maduro pronto, escopo confirmado",
    },
  },
  {
    id: 4,
    ciclo_id: "30000000-0000-0000-0000-000000000003",
    ts: "2026-05-15T08:32:18Z",
    kind: "state_change",
    severity: "info",
    payload: { from: "iniciado", to: "planejado" },
  },
  {
    id: 5,
    ciclo_id: "30000000-0000-0000-0000-000000000003",
    ts: "2026-05-15T08:33:00Z",
    kind: "atomic_spawn",
    severity: "info",
    payload: { agent_id: "cockpit-M2", worktree: "M2-cockpit-preparacao" },
  },
  {
    id: 6,
    ciclo_id: "30000000-0000-0000-0000-000000000003",
    ts: "2026-05-15T11:14:30Z",
    kind: "journal_warn",
    severity: "warn",
    payload: {
      slug: "msw-handler-shape",
      msg: "fixture inicial divergia do schema; corrigido inline",
    },
  },
  {
    id: 7,
    ciclo_id: "30000000-0000-0000-0000-000000000003",
    ts: "2026-05-15T15:38:42Z",
    kind: "pr_opened",
    severity: "info",
    payload: {
      pr_number: 7,
      pr_url: "https://github.com/x-force-42/mmb-cockpit/pull/7",
    },
  },
  {
    id: 8,
    ciclo_id: "30000000-0000-0000-0000-000000000003",
    ts: "2026-05-15T15:38:43Z",
    kind: "state_change",
    severity: "info",
    payload: { from: "planejado", to: "pr_aberto" },
  },
  {
    id: 9,
    ciclo_id: "30000000-0000-0000-0000-000000000003",
    ts: "2026-05-15T15:38:48Z",
    kind: "atomic_deregister",
    severity: "info",
    payload: { agent_id: "cockpit-M2", reason: "open-pr.sh concluído" },
  },

  // ─── C5 (heartbeat-loss) ───────────────────────────────────────────
  {
    id: 10,
    ciclo_id: "30000000-0000-0000-0000-000000000005",
    ts: "2026-05-14T16:22:00Z",
    kind: "state_change",
    severity: "info",
    payload: { from: null, to: "iniciado" },
  },
  {
    id: 11,
    ciclo_id: "30000000-0000-0000-0000-000000000005",
    ts: "2026-05-14T16:22:30Z",
    kind: "atomic_spawn",
    severity: "info",
    payload: { agent_id: "core-cost-col", worktree: "cost-col-add" },
  },
  {
    id: 12,
    ciclo_id: "30000000-0000-0000-0000-000000000005",
    ts: "2026-05-14T16:32:18Z",
    kind: "heartbeat_loss",
    severity: "error",
    payload: {
      agent_id: "core-cost-col",
      last_seen_at: "2026-05-14T16:30:06Z",
      threshold_s: 600,
    },
  },
  {
    id: 13,
    ciclo_id: "30000000-0000-0000-0000-000000000005",
    ts: "2026-05-14T16:42:30Z",
    kind: "state_change",
    severity: "error",
    payload: {
      from: "iniciado",
      to: "abortado",
      abort_origin: "heartbeat",
    },
  },

  // ─── C8 (abort manual) ─────────────────────────────────────────────
  {
    id: 14,
    ciclo_id: "30000000-0000-0000-0000-000000000008",
    ts: "2026-05-09T11:00:00Z",
    kind: "state_change",
    severity: "info",
    payload: { from: null, to: "iniciado" },
  },
  {
    id: 15,
    ciclo_id: "30000000-0000-0000-0000-000000000008",
    ts: "2026-05-09T11:00:05Z",
    kind: "msg_send",
    severity: "info",
    payload: {
      from: "master",
      to: "planner:aquarium",
      summary: "física de natação dos peixinhos",
    },
  },
  {
    id: 16,
    ciclo_id: "30000000-0000-0000-0000-000000000008",
    ts: "2026-05-09T11:24:00Z",
    kind: "journal_warn",
    severity: "warn",
    payload: {
      slug: "feel-undefined",
      msg: "Rick não cravou tunáveis de feel; planner pediu pausa",
    },
  },
  {
    id: 17,
    ciclo_id: "30000000-0000-0000-0000-000000000008",
    ts: "2026-05-09T11:25:42Z",
    kind: "state_change",
    severity: "warn",
    payload: {
      from: "iniciado",
      to: "abortado",
      abort_origin: "manual",
    },
  },

  // ─── C14 (F0 completo) ─────────────────────────────────────────────
  {
    id: 18,
    ciclo_id: "30000000-0000-0000-0000-000000000014",
    ts: "2026-04-20T09:00:00Z",
    kind: "state_change",
    severity: "info",
    payload: { from: null, to: "iniciado" },
  },
  {
    id: 19,
    ciclo_id: "30000000-0000-0000-0000-000000000014",
    ts: "2026-04-20T09:05:00Z",
    kind: "state_change",
    severity: "info",
    payload: { from: "iniciado", to: "planejado" },
  },
  {
    id: 20,
    ciclo_id: "30000000-0000-0000-0000-000000000014",
    ts: "2026-04-20T09:06:30Z",
    kind: "atomic_spawn",
    severity: "info",
    payload: { agent_id: "cockpit-F0", worktree: "F0-scaffold" },
  },
  {
    id: 21,
    ciclo_id: "30000000-0000-0000-0000-000000000014",
    ts: "2026-04-20T12:58:00Z",
    kind: "pr_opened",
    severity: "info",
    payload: {
      pr_number: 1,
      pr_url: "https://github.com/x-force-42/mmb-cockpit/pull/1",
    },
  },
  {
    id: 22,
    ciclo_id: "30000000-0000-0000-0000-000000000014",
    ts: "2026-04-20T12:58:01Z",
    kind: "state_change",
    severity: "info",
    payload: { from: "planejado", to: "pr_aberto" },
  },
  {
    id: 23,
    ciclo_id: "30000000-0000-0000-0000-000000000014",
    ts: "2026-04-21T10:00:00Z",
    kind: "state_change",
    severity: "info",
    payload: { from: "pr_aberto", to: "completo" },
  },
];
