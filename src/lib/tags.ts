/**
 * Tags do andaime que aparecem como opções no filtro multiselect
 * das listagens de épicos e ciclos. Lista hardcoded por enquanto —
 * tag discovery dinâmica é decisão consciente de ficar fora do MVP
 * (vide brief filtro-andaime-version).
 *
 * **Manter atualizada**: toda vez que o andaime ganha uma versão
 * (`vX.Y[.Z]`), acrescente aqui pra ela aparecer no filtro.
 */
export const TAGS_DISPONIVEIS: readonly string[] = [
  "v0",
  "v0.1",
  "v0.2",
  "v0.3.0",
  "v0.4.0",
  "v0.5.0",
  "v0.6.0",
];
