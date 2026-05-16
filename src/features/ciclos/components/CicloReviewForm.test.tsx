import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "@/test/render";
import type { CicloDetail } from "@/types/api";
import { CicloReviewForm } from "./CicloReviewForm";

const baseCiclo: CicloDetail = {
  id: "30000000-0000-0000-0000-000000000001",
  epico_id: "20000000-0000-0000-0000-000000000001",
  project: "mmb-core",
  planner_invoked_at: "2026-05-12T09:05:14Z",
  status: "completo",
  instruction: "tarefa de teste",
  pr_url: "https://github.com/x-force-42/mmb-core/pull/142",
  pr_number: 142,
  closed_partial_at: "2026-05-12T11:48:00Z",
  closed_complete_at: "2026-05-12T16:20:00Z",
  merged_to_main: 1,
  assertiveness_score: 4,
  cost_usd: 0.84,
  abort_origin: null,
  abort_reason: null,
  andaime_version: null,
  briefing_md: null,
  review_note: "ok",
  abort_at: null,
  tokens_input: null,
  tokens_output: null,
  diff_added: null,
  diff_deleted: null,
  diff_files: null,
};

describe("CicloReviewForm", () => {
  it("inicializa com valores atuais do ciclo", () => {
    renderWithProviders(<CicloReviewForm ciclo={baseCiclo} />);
    expect(screen.getByLabelText("Nota")).toHaveValue("ok");
  });

  it("submete e mostra estado salvo (isDirty=false)", async () => {
    const user = userEvent.setup();
    renderWithProviders(<CicloReviewForm ciclo={baseCiclo} />);

    const note = screen.getByLabelText("Nota");
    await user.clear(note);
    await user.type(note, "nota nova");

    await user.click(screen.getByRole("button", { name: /salvar/i }));

    await waitFor(() => {
      expect(
        screen.queryByText(/mudanças não salvas/i),
      ).not.toBeInTheDocument();
    });
  });

  it("desabilita inputs e some botão Salvar quando status='abortado'", () => {
    renderWithProviders(
      <CicloReviewForm
        ciclo={{ ...baseCiclo, status: "abortado", abort_origin: "manual" }}
      />,
    );
    expect(screen.getByLabelText("Nota")).toBeDisabled();
    expect(screen.queryByRole("button", { name: /salvar/i })).toBeNull();
  });
});
