"use client";

import { DownloadIcon, XIcon, ZapIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import styles from "./app-shell.module.css";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const isIOSDevice = () => {
  if (typeof navigator === "undefined") {
    return false;
  }

  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
};

const AppShell = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") ?? false;

  const [installPrompt, setInstallPrompt] =
    useState<InstallPromptEvent | null>(null);
  const [showInstallSheet, setShowInstallSheet] = useState(false);
  const [isIOS] = useState(isIOSDevice);

  useEffect(() => {
    if (isAdmin) {
      return;
    }

    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      ("standalone" in navigator &&
        Boolean(
          (navigator as Navigator & { standalone?: boolean }).standalone,
        ));
    const isMobileViewport = window.matchMedia("(max-width: 560px)").matches;
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

    if (isStandalone || !isMobileViewport || !isTouchDevice) {
      return;
    }

    const sheetTimer = window.setTimeout(() => setShowInstallSheet(true), 1500);

    const handleInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as InstallPromptEvent);
      setShowInstallSheet(true);
    };

    const handleInstalled = () => {
      setInstallPrompt(null);
      setShowInstallSheet(false);
    };

    window.addEventListener("beforeinstallprompt", handleInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);

    return () => {
      window.clearTimeout(sheetTimer);
      window.removeEventListener("beforeinstallprompt", handleInstallPrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, [isAdmin]);

  const handleInstall = async () => {
    if (isIOS || !installPrompt) {
      setShowInstallSheet(false);
      return;
    }

    await installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
    setShowInstallSheet(false);
  };

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <main className={styles.stage}>
      <section className={styles.phone}>
        <div className={styles.screen}>{children}</div>
      </section>

      {showInstallSheet && (
        <div className={styles.installOverlay}>
          <aside aria-label="Instalar ZapFood" className={styles.installSheet}>
            <button
              aria-label="Fechar convite de instalacao"
              className={styles.installClose}
              onClick={() => setShowInstallSheet(false)}
              type="button"
            >
              <XIcon aria-hidden="true" size={16} />
            </button>

            <div className={styles.installLead}>
              <span className={styles.installMark}>
                <ZapIcon aria-hidden="true" size={26} />
              </span>
              <div>
                <strong>Instalar ZapFood</strong>
                <p>Abra mais rapido e use como aplicativo no celular.</p>
              </div>
            </div>

            {isIOS ? (
              <p className={styles.installHint}>
                No iPhone, toque em Compartilhar e depois em Adicionar a Tela
                de Inicio.
              </p>
            ) : !installPrompt ? (
              <p className={styles.installHint}>
                Se o navegador nao abrir a instalacao, use o menu e toque em
                Instalar app.
              </p>
            ) : null}

            <div className={styles.installActions}>
              <button onClick={() => setShowInstallSheet(false)} type="button">
                Agora nao
              </button>
              <button onClick={handleInstall} type="button">
                <DownloadIcon aria-hidden="true" size={16} />
                {installPrompt ? "Instalar" : "Entendi"}
              </button>
            </div>
          </aside>
        </div>
      )}
    </main>
  );
};

export default AppShell;
