export const INITIAL_LIVES = 3;

export const TEAMS = [
  {
    id: "promesa",
    name: "PROMESA",
    emoji: "🏆",
    color: "#f59e0b",
  },
  {
    id: "leyendas",
    name: "LEYENDAS",
    emoji: "🔥",
    color: "#ef4444",
  },
  {
    id: "galacticos",
    name: "GALÁCTICOS",
    emoji: "⚡",
    color: "#3b82f6",
  },
  {
    id: "invictos",
    name: "INVICTOS",
    emoji: "💀",
    color: "#22c55e",
  },
];

export function getTeam(teamId) {
  return TEAMS.find((team) => team.id === teamId) || null;
}