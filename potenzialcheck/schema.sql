-- ════════════════════════════════════════════════════════════════════
-- Potenzial-Check — Tabelle `leads`  (Backlog 2.1, CONTEXT.md Abschnitt 8)
--
-- Import: phpMyAdmin (all-inkl) → Datenbank auswählen → Reiter „SQL" →
--         diesen Inhalt einfügen → „OK".
--
-- MySQL ist die eigene Wahrheit + Seed-Filter (C5) — bleibt bestehen,
-- auch wenn Brevo Kontakte separat speichert (getrennte Rechtsgrundlage).
-- ════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS `leads` (
  `id`             INT AUTO_INCREMENT PRIMARY KEY,
  `branche`        VARCHAR(50),
  `branche_custom` VARCHAR(120) NULL,   -- Freitext, wenn Branche = „Sonstige"
  `mitarbeiter`    VARCHAR(20),
  `rolle`          VARCHAR(50),
  `zeitfresser`    TEXT,                -- Mehrfachauswahl als CSV
  `stunden`        VARCHAR(20),
  `stunden_custom` INT NULL,            -- manuelle Stunden/Kopf, wenn Stunden = „manuell"
  `zufriedenheit`  VARCHAR(80),
  `dringlichkeit`  VARCHAR(40),
  `ergebnis_min`   INT,                 -- berechnete €-Spanne (unten)
  `ergebnis_max`   INT,                 -- berechnete €-Spanne (oben)
  `email`          VARCHAR(255),
  `name`           VARCHAR(120),
  `consent`        TINYINT(1) DEFAULT 0,-- 1 = Nurture-Einwilligung (C2)
  `created_at`     DATETIME DEFAULT CURRENT_TIMESTAMP,
  `confirmed_at`   DATETIME NULL,       -- DOI-Bestätigung (via Brevo-Webhook, optional)
  INDEX `idx_created_at` (`created_at`),-- Löschkonzept: nicht-konvertierte nach 12–24 Mon.
  INDEX `idx_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
