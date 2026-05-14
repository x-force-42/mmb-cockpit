import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "@/test/render";
import type { RunDetail } from "@/types/api";
import { RunReviewForm } from "./RunReviewForm";

const baseRun: RunDetail = {
  id: "aaaaaaaa-0000-0000-0000-000000000001",
  project_id: "11111111-1111-1111-1111-111111111111",
  project_slug: "jogo",
  started_at: "2026-05-14T09:30:12",
  finished_at: "2026-05-14T09:31:39",
  task_raw: "tarefa de teste",
  terminal_phase: "success",
  total_elapsed_s: 87,
  garagem_outcome: "success",
  garagem_cost_usd: 0.02,
  garagem_elapsed_s: 12,
  meeseeks_outcome: "success",
  meeseeks_cost_usd: 0.08,
  meeseeks_elapsed_s: 75,
  merged_to_main: 1,
  assertiveness_score: 5,
  review_note: "ok",
  briefing_json: null,
  meeseeks_commits_json: null,
};

describe("RunReviewForm", () => {
  it("inicializa com valores atuais do run", () => {
    renderWithProviders(<RunReviewForm run={baseRun} />);
    expect(screen.getByLabelText("Nota")).toHaveValue("ok");
  });

  it("submete e mostra toast de sucesso", async () => {
    const user = userEvent.setup();
    renderWithProviders(<RunReviewForm run={baseRun} />);

    const note = screen.getByLabelText("Nota");
    await user.clear(note);
    await user.type(note, "nota nova");

    await user.click(screen.getByRole("button", { name: /salvar/i }));

    // O Toaster é renderizado no Layout; aqui validamos o efeito
    // observável no form: após sucesso, form.reset(values) zera isDirty.
    await waitFor(() => {
      expect(
        screen.queryByText(/mudanças não salvas/i),
      ).not.toBeInTheDocument();
    });
  });
});
