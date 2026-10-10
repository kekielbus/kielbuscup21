import { getTeam } from "../data/teams";

export default function TeamCard({
  teamId,
  players,
}) {
  const team = getTeam(teamId);

  if (!team) {
    return null;
  }

  const teamPlayers = players.filter(
    (player) =>
      player.teamId === teamId
  );

  const points = teamPlayers.reduce(
    (total, player) =>
      total + (player.points || 0),
    0
  );

  const captain = teamPlayers.find(
    (player) => player.isCaptain
  );

  return (
    <div
      className="team-card"
      style={{
        borderTop: `5px solid ${team.color}`,
      }}
    >

      <div className="team-title">

        <span>{team.emoji}</span>

        <div>
          <h2>{team.name}</h2>

          <small>
            {teamPlayers.length} jugadores
          </small>
        </div>

      </div>

      <div className="team-total">
        🏆 {points} puntos
      </div>

      <div className="team-captain">

        {captain ? (
          <>
            👑 Capitán:{" "}
            <strong>{captain.name}</strong>
          </>
        ) : (
          <>
            👑 Capitán:{" "}
            <strong>Sin asignar</strong>
          </>
        )}

      </div>

      <div className="team-players">

        {teamPlayers.length === 0 ? (
          <p className="empty-team">
            Todavía no hay jugadores.
          </p>
        ) : (
          teamPlayers.map((player) => (
            <div
              className="team-player"
              key={player.id}
            >
              <span>
                {player.isCaptain && "👑 "}
                {player.name}
              </span>

              <span>
                ❤️ {player.lives}
                {" · "}
                🏆 {player.points}
              </span>
            </div>
          ))
        )}

      </div>

    </div>
  );
}