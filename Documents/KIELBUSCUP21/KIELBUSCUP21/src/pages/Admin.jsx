import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  subscribeToPlayers,
  updatePlayer,
  resetPlayers,
} from "../data/store";

import {
  TEAMS,
  getTeam,
  INITIAL_LIVES,
} from "../data/teams";

import TeamCard from "../components/TeamCard";

export default function Admin() {
  const [players, setPlayers] = useState([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    return subscribeToPlayers(
      (nextPlayers) => {
        setPlayers(nextPlayers);
        setError("");
      },
      () => setError("No se han podido cargar los jugadores."),
    );
  }, []);

  async function runUpdate(action) {
    setError("");
    setSaving(true);

    try {
      await action();
    } catch (updateError) {
      console.error("Error actualizando el torneo:", updateError);
      setError("No se ha podido guardar el cambio. Inténtalo de nuevo.");
    } finally {
      setSaving(false);
    }
  }

  function assignTeam(playerId, teamId) {
    return runUpdate(() =>
      updatePlayer(playerId, { teamId: teamId || null }),
    );
  }

  function addPoints(playerId, amount) {
    const player = players.find((item) => item.id === playerId);
    if (!player) return;

    return runUpdate(() =>
      updatePlayer(playerId, {
        points: Math.max(0, (player.points || 0) + amount),
      }),
    );
  }

  function changeLives(playerId, amount) {
    const player = players.find((item) => item.id === playerId);
    if (!player) return;

    const lives = Math.max(
      0,
      Math.min(INITIAL_LIVES, (player.lives ?? INITIAL_LIVES) + amount),
    );

    return runUpdate(() =>
      updatePlayer(playerId, {
        lives,
        eliminated: lives === 0,
      }),
    );
  }

  function toggleCaptain(playerId) {
    const player = players.find((item) => item.id === playerId);
    if (!player?.teamId) return;

    const teamPlayers = players.filter(
      (item) => item.teamId === player.teamId,
    );

    return runUpdate(() =>
      Promise.all(
        teamPlayers.map((teamPlayer) =>
          updatePlayer(teamPlayer.id, {
            isCaptain:
              teamPlayer.id === playerId
                ? !teamPlayer.isCaptain
                : false,
          }),
        ),
      ),
    );
  }

  function toggleEliminated(playerId) {
    const player = players.find((item) => item.id === playerId);
    if (!player) return;

    return runUpdate(() => {
      if (player.eliminated) {
        return updatePlayer(playerId, {
          eliminated: false,
          lives: player.lives > 0 ? player.lives : 1,
        });
      }

      return updatePlayer(playerId, {
        eliminated: true,
        lives: 0,
      });
    });
  }

  function logout() {
    localStorage.removeItem("isAdminLoggedIn");
    navigate("/admin-login", { replace: true });
  }

  async function handleReset() {
    const confirmed = window.confirm(
      "¿Seguro que quieres borrar TODOS los jugadores y reiniciar el torneo?",
    );

    if (!confirmed) return;

    await runUpdate(resetPlayers);
  }

  const unassigned = useMemo(
    () => players.filter((player) => !player.teamId),
    [players],
  );

  const totalPoints = players.reduce(
    (sum, player) => sum + (player.points || 0),
    0,
  );

  const eliminated = players.filter((player) => player.eliminated).length;

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div>
          <p className="eyebrow">KIELBUS CUP 21</p>
          <h1>👑 Panel del Administrador</h1>
          <p>Gestiona jugadores, equipos, puntos y vidas.</p>
        </div>

        <div className="admin-actions">
          <button
            className="secondary-button"
            onClick={() => navigate("/qr-code")}
            disabled={saving}
          >
            📱 Generar QR
          </button>
          <button className="logout-button" onClick={logout} disabled={saving}>
            Cerrar sesión
          </button>
        </div>
      </header>

      {error && <div className="error admin-error">{error}</div>}

      <section className="admin-stats" aria-label="Resumen del torneo">
        <div className="admin-stat">
          <strong>{players.length}</strong>
          <span>Jugadores</span>
        </div>
        <div className="admin-stat">
          <strong>{unassigned.length}</strong>
          <span>Sin equipo</span>
        </div>
        <div className="admin-stat">
          <strong>{totalPoints}</strong>
          <span>Puntos totales</span>
        </div>
        <div className="admin-stat">
          <strong>{eliminated}</strong>
          <span>Eliminados</span>
        </div>
      </section>

      {unassigned.length > 0 && (
        <section>
          <h2 className="section-title">⚡ Jugadores pendientes</h2>
          <div className="pending-list">
            {unassigned.map((player) => (
              <div className="pending-player" key={player.id}>
                <div>
                  <strong>{player.name}</strong>
                  <small>
                    ❤️ {player.lives} · 🏆 {player.points}
                  </small>
                </div>
                <div className="team-buttons">
                  {TEAMS.map((team) => (
                    <button
                      key={team.id}
                      style={{ background: team.color }}
                      onClick={() => assignTeam(player.id, team.id)}
                      disabled={saving}
                    >
                      {team.emoji} {team.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <h2 className="section-title">🏆 Equipos</h2>
      <div className="teams-grid">
        {TEAMS.map((team) => (
          <TeamCard key={team.id} teamId={team.id} players={players} />
        ))}
      </div>

      <h2 className="section-title">👥 Gestión de jugadores</h2>
      <div className="players-admin">
        {players.length === 0 ? (
          <div className="empty-state">
            Todavía no hay jugadores registrados.
          </div>
        ) : (
          players.map((player) => {
            const team = getTeam(player.teamId);

            return (
              <div
                className={`admin-player ${
                  player.eliminated ? "admin-player-eliminated" : ""
                }`}
                key={player.id}
              >
                <div className="admin-player-main">
                  <strong>
                    {player.isCaptain && "👑 "}
                    {player.name}
                  </strong>
                  <small>ID: {player.id}</small>
                  <span className="player-team-label">
                    {team ? `${team.emoji} ${team.name}` : "Sin equipo"}
                  </span>
                </div>

                <div className="admin-control">
                  <label htmlFor={`team-${player.id}`}>Equipo</label>
                  <select
                    id={`team-${player.id}`}
                    value={player.teamId || ""}
                    onChange={(event) =>
                      assignTeam(player.id, event.target.value)
                    }
                    disabled={saving}
                  >
                    <option value="">Sin equipo</option>
                    {TEAMS.map((teamOption) => (
                      <option key={teamOption.id} value={teamOption.id}>
                        {teamOption.emoji} {teamOption.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="admin-control">
                  <label>Vidas</label>
                  <div className="button-row">
                    <button
                      onClick={() => changeLives(player.id, -1)}
                      disabled={saving || player.lives <= 0}
                      aria-label={`Quitar una vida a ${player.name}`}
                    >
                      −
                    </button>
                    <strong>{player.lives}</strong>
                    <button
                      onClick={() => changeLives(player.id, 1)}
                      disabled={saving || player.lives >= INITIAL_LIVES}
                      aria-label={`Añadir una vida a ${player.name}`}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="admin-control">
                  <label>Puntos</label>
                  <div className="button-row">
                    <button
                      onClick={() => addPoints(player.id, -1)}
                      disabled={saving || player.points <= 0}
                    >
                      −1
                    </button>
                    <strong>{player.points}</strong>
                    <button
                      onClick={() => addPoints(player.id, 3)}
                      disabled={saving}
                    >
                      +3
                    </button>
                  </div>
                </div>

                <div className="admin-control">
                  <label>Capitán</label>
                  <button
                    className={
                      player.isCaptain ? "captain-active" : "captain-button"
                    }
                    disabled={saving || !player.teamId}
                    onClick={() => toggleCaptain(player.id)}
                  >
                    {player.isCaptain ? "👑 Capitán" : "Hacer capitán"}
                  </button>
                </div>

                <div className="admin-control">
                  <label>Estado</label>
                  <button
                    className="eliminate-button"
                    disabled={saving}
                    onClick={() => toggleEliminated(player.id)}
                  >
                    {player.eliminated ? "↩️ Reincorporar" : "💀 Eliminar"}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <button
        className="reset-button"
        onClick={handleReset}
        disabled={saving || players.length === 0}
      >
        🗑️ Reiniciar torneo
      </button>
    </main>
  );
}
