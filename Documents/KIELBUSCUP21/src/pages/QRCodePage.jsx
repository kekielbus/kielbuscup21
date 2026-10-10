import { QRCodeSVG } from "qrcode.react";
import { Link, useLocation } from "react-router-dom";

export default function QRCodePage() {
  const location = useLocation();
  const isAdminQRPage = location.pathname === "/qr-code";
  const registrationUrl = `${window.location.origin}/registro`;

  return (
    <main className="welcome-qr-page">
      <div className="welcome-qr-glow" aria-hidden="true" />
      <section className="welcome-qr-card">
        <div className="welcome-qr-kicker">
          <span className="welcome-qr-dot" />
          TORNEO OFICIAL · REGISTRO ABIERTO
        </div>

        <div className="welcome-qr-trophy" aria-hidden="true">🏆</div>
        <p className="welcome-qr-eyebrow">BIENVENIDOS A</p>
        <h1>KIELBUS <span>CUP 21</span></h1>
        <p className="welcome-qr-description">
          Escanea el código QR con la cámara de tu móvil para inscribirte en el torneo.
        </p>

        <div className="welcome-qr-frame">
          <div className="welcome-qr-inner">
            <QRCodeSVG
              value={registrationUrl}
              size={260}
              level="H"
              includeMargin
              bgColor="#ffffff"
              fgColor="#111827"
            />
          </div>
          <span className="welcome-qr-corner corner-tl" />
          <span className="welcome-qr-corner corner-tr" />
          <span className="welcome-qr-corner corner-bl" />
          <span className="welcome-qr-corner corner-br" />
        </div>

        <div className="welcome-qr-steps">
          <div><span>01</span><p>Abre la cámara<br /><strong>de tu móvil</strong></p></div>
          <div><span>02</span><p>Escanea el código<br /><strong>y abre el enlace</strong></p></div>
          <div><span>03</span><p>Completa tu<br /><strong>registro</strong></p></div>
        </div>

        {isAdminQRPage ? (
          <Link className="welcome-qr-button" to="/admin">
            ← VOLVER AL PANEL DEL ADMINISTRADOR
          </Link>
        ) : (
          <Link className="welcome-qr-button" to="/registro">
            CONTINUAR AL REGISTRO <span aria-hidden="true">→</span>
          </Link>
        )}

        <p className="welcome-qr-url">{registrationUrl}</p>
        <footer className="welcome-qr-footer">
          <span>⚡</span> COMPITE · SOBREVIVE · CONQUISTA <span>⚡</span>
        </footer>
      </section>
    </main>
  );
}
