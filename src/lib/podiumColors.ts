// Cores das medalhas do pódio.
//
// São tons mais escuros/saturados das cores clássicas de medalha para manter
// bom contraste sobre fundos claros/brancos (as versões "metálicas" puras,
// como #D4AF37 ou #C0C0C0, ficam lavadas em fundo branco).

export const PODIUM_COLORS = {
  gold: "#B8860B", // ouro escuro (DarkGoldenrod) — bom contraste em branco
  silver: "#6C757D", // prata/cinza azulado — contrasta melhor que cinza claro
  bronze: "#9A5B2E", // bronze escuro e saturado — legível em branco
} as const;

export const GRADIENTS = {
  orangeToRed: {
    from: "#F97316",
    to: "#DC2626",
  },
} as const;

export type PodiumPlacement = keyof typeof PODIUM_COLORS;
