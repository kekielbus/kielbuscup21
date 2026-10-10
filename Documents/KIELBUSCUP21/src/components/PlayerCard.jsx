import { getTeam } from "../data/teams";

export default function PlayerCard({ player }) {
  const team = getTeam(player.teamId);

  return (
    <div className="player-card">

      <div className="player-name">
        <span>👤</span>
        <h2>{player.name}</h2>
      </div>

      {team ? (
        <div
          className="player-team"
          style={{
            borderLeft: `5px solid ${team.color}`,
          }}
        >
          {team.emoji} {team.name}
        </div>
      ) : (
        <div className="waiting-team">
          ⏳ Equipo todavía no asignado
        </div>
      )}

      {player.isCaptain && (
        <div className="captain-badge">
          👑 CAPITÁN
        </div>
      )}

      <div className="player-stats">

        <div className="stat">
          <span>❤️</span>
          <strong>{player.lives}</strong>
          <small>vidas</small>
        </div>

        <div className="stat">
          <span>🏆</span>
          <strong>{player.points}</strong>
          <small>puntos</small>
        </div>

      </div>

      {player.eliminated && (
        <div className="eliminated-box">
          💀 ELIMINADO
        </div>
      )}

    </div>
  );
}