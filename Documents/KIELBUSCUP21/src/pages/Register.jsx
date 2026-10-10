import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header";

import {
  createPlayer,
  getPlayers,
} from "../data/store";

export default function Register() {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    const cleanName = name.trim();

    if (!cleanName) {
      setError("Por favor, introduce tu nombre.");
      return;
    }

    if (cleanName.length < 2) {
      setError(
        "El nombre debe tener al menos 2 caracteres."
      );
      return;
    }

    if (cleanName.length > 40) {
      setError(
        "El nombre no puede superar los 40 caracteres."
      );
      return;
    }

    try {
      setSaving(true);

      // Obtener jugadores desde Firebase
      const players = await getPlayers();

      const alreadyExists = players.some(
        (player) =>
          player.name?.trim().toLowerCase() ===
          cleanName.toLowerCase()
      );

      if (alreadyExists) {
        setError(
          "Ya existe un jugador con ese nombre."
        );
        setSaving(false);
        return;
      }

      // Crear jugador en Firebase
      const player = await createPlayer({
        name: cleanName,
      });

      localStorage.setItem(
        "kielbus-current-player",
        player.id
      );

      navigate(
        `/jugador?id=${encodeURIComponent(
          player.id
        )}`
      );
    } catch (error) {
      console.error(
        "Error registrando jugador:",
        error
      );

      setError(
        "No se ha podido completar el registro."
      );

      setSaving(false);
    }
  }

  return (
    <>
      <Header />

      <main className="register-page">
        <div className="register-box">

          <div className="big-icon">
            🏆
          </div>

          <h1>
            KIELBUS CUP 21
          </h1>

          <h2>
            Registro de jugador
          </h2>

          <p>
            Has llegado mediante el QR oficial
            del torneo.
          </p>

          <form onSubmit={handleSubmit}>

            <label htmlFor="player-name">
              Introduce tu nombre
            </label>

            <input
              id="player-name"
              type="text"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              placeholder="Tu nombre"
              maxLength={40}
              autoComplete="name"
              autoFocus
              disabled={saving}
            />

            {error && (
              <div className="error">
                {error}
              </div>
            )}

            <button
              className="primary-button"
              type="submit"
              disabled={saving}
            >
              {saving
                ? "Registrando..."
                : "🚀 REGISTRARME"}
            </button>

          </form>

        </div>
      </main>
    </>
  );
}
