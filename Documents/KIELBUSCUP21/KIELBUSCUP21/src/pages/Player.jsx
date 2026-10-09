import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";

import Header from "../components/Header";
import PlayerCard from "../components/PlayerCard";
import { subscribeToPlayer } from "../data/store";

export default function Player() {
  const [searchParams] = useSearchParams();
  const playerId = searchParams.get("id");
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    setPlayer(null);
    setLoading(true);
    setLoadError(false);

    if (!playerId) {
      setLoading(false);
      return undefined;
    }

    return subscribeToPlayer(
      playerId,
      (nextPlayer) => {
        setPlayer(nextPlayer);
        setLoading(false);
      },
      () => {
        setLoadError(true);
        setLoading(false);
      },
    );
  }, [playerId]);

  if (!playerId || (!loading && !player)) {
    return (
      <>
        <Header />
        <main className="center-page">
          <div className="big-icon">❌</div>
          <h2>Jugador no encontrado</h2>
          <p>Comprueba que has escaneado el QR correcto o que el registro se ha completado.</p>
          <Link className="primary-button" to="/registro">Volver al registro</Link>
        </main>
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="center-page" aria-live="polite">
          <div className="big-icon">🏆</div>
          <h2>Cargando tu ficha…</h2>
          <p>Estamos obteniendo tus vidas y puntos.</p>
        </main>
      </>
    );
  }

  if (loadError) {
    return (
      <>
        <Header />
        <main className="center-page" role="alert">
          <div className="big-icon">⚠️</div>
          <h2>No se ha podido cargar tu ficha</h2>
          <p>Comprueba la conexión e inténtalo de nuevo. Si continúa, avisa al administrador.</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="player-page">
        <h1>🎮 Mi ficha</h1>
        <p className="player-live-note" aria-live="polite">Tu ficha se actualiza automáticamente cuando el administrador cambia tus datos.</p>
        <PlayerCard player={player} />
        <div className="info-box">
          <strong>ℹ️ Tu estado</strong>
          <p>El administrador controla tu equipo, tus puntos y tus vidas. No necesitas volver a escanear el QR para ver los cambios.</p>
        </div>
      </main>
    </>
  );
}
