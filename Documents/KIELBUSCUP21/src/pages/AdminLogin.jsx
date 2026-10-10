import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "Polska21";

export default function AdminLogin() {
  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const navigate = useNavigate();

  /*
   * Si ya inició sesión anteriormente,
   * no tiene sentido volver a pedir
   * usuario y contraseña.
   */
  useEffect(() => {
    const loggedIn =
      localStorage.getItem(
        "isAdminLoggedIn"
      ) === "true";

    if (loggedIn) {
      navigate("/admin", {
        replace: true,
      });
    }
  }, [navigate]);

  function handleLogin(event) {
    event.preventDefault();

    setError("");

    const cleanUsername =
      username.trim();

    if (!cleanUsername) {
      setError(
        "Introduce el usuario."
      );
      return;
    }

    if (!password) {
      setError(
        "Introduce la contraseña."
      );
      return;
    }

    setLoading(true);

    /*
     * Login local.
     */
    const validLogin =
      cleanUsername === ADMIN_USERNAME &&
      password === ADMIN_PASSWORD;

    if (!validLogin) {
      setError(
        "Usuario o contraseña incorrectos."
      );

      setLoading(false);

      return;
    }

    /*
     * Guardamos la sesión.
     */
    localStorage.setItem(
      "isAdminLoggedIn",
      "true"
    );

    /*
     * Entramos al panel.
     */
    navigate("/admin", {
      replace: true,
    });
  }

  return (
    <main className="admin-login">

      <div className="login-box">

        <div className="big-icon">
          👑
        </div>

        <h1>
          KIELBUS CUP 21
        </h1>

        <h2>
          Administrador
        </h2>

        <p>
          Acceso exclusivo para el organizador
        </p>

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        <form
          onSubmit={handleLogin}
        >

          <label htmlFor="admin-username">
            Usuario
          </label>

          <input
            id="admin-username"
            type="text"
            value={username}
            onChange={(event) => {
              setUsername(
                event.target.value
              );
              setError("");
            }}
            autoComplete="username"
            autoFocus
            disabled={loading}
          />

          <label htmlFor="admin-password">
            Contraseña
          </label>

          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={(event) => {
              setPassword(
                event.target.value
              );
              setError("");
            }}
            autoComplete="current-password"
            disabled={loading}
          />

          <button
            className="primary-button"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Entrando..."
              : "🔐 INICIAR SESIÓN"}
          </button>

        </form>

        
      </div>

    </main>
  );
}