<?php
declare(strict_types=1);

// ════════════════════════════════════════════════════════════════════
// Löschkonzept (DSGVO Art. 5 Abs. 1 lit. e — Speicherbegrenzung)
//
// Löscht Leads aus der MySQL-Tabelle, die älter als 24 Monate sind
// (Zusage in der Datenschutzerklärung: „spätestens nach 24 Monaten").
//
// Standard-Regel: Leads mit bestätigtem Newsletter-Abo (confirmed_at
// gesetzt) bleiben erhalten — die laufende Einwilligungs-Beziehung lebt
// in Brevo, der MySQL-Eintrag stützt den Seed-Filter (CONTEXT.md C5).
// Wer auch diese löschen will: KEEP_CONFIRMED unten auf false setzen.
//
// Einrichtung als all-inkl Cronjob (KAS → Tools → Cronjobs):
//   1. In submit-config.php einen langen Zufallswert eintragen:
//        'cleanup_token' => '<64 zufällige Zeichen>',
//      (z. B. erzeugen mit:  openssl rand -hex 32 )
//   2. Cronjob-URL (z. B. monatlich):
//        https://www.smartwandler.de/potenzialcheck/cleanup-leads.php?token=<WERT>
//   3. Antwort ist JSON: {"ok":true,"deleted":N}
//
// Ohne konfigurierten Token verweigert das Skript jede Ausführung.
// ════════════════════════════════════════════════════════════════════

header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
header('Content-Type: application/json; charset=utf-8');

const RETENTION_MONTHS = 24;   // Zusage aus der Datenschutzerklärung
const KEEP_CONFIRMED   = true; // true = Newsletter-bestätigte Leads behalten

function respond(int $code, array $data): void {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

// ── Config laden (gleiche Datei wie submit.php, nicht im Repo) ──
$configFile = __DIR__ . '/submit-config.php';
if (!is_file($configFile)) {
    respond(500, ['ok' => false, 'error' => 'config_missing']);
}
/** @var array $config */
$config = require $configFile;
if (!is_array($config)) {
    respond(500, ['ok' => false, 'error' => 'config_invalid']);
}

// ── Token prüfen (Pflicht — ohne Token keine Ausführung) ──
$expected = isset($config['cleanup_token']) && is_string($config['cleanup_token'])
    ? $config['cleanup_token'] : '';
$given = isset($_GET['token']) && is_string($_GET['token']) ? $_GET['token'] : '';
if ($expected === '' || strlen($expected) < 32) {
    respond(503, ['ok' => false, 'error' => 'cleanup_token_not_configured']);
}
if ($given === '' || !hash_equals($expected, $given)) {
    respond(403, ['ok' => false, 'error' => 'forbidden']);
}

// ── Löschen ──
try {
    $dsn = sprintf('mysql:host=%s;dbname=%s;charset=utf8mb4',
        $config['db_host'] ?? 'localhost', $config['db_name'] ?? '');
    $pdo = new PDO($dsn, $config['db_user'] ?? '', $config['db_pass'] ?? '', [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    ]);
    $table = preg_replace('/[^a-zA-Z0-9_]/', '', (string) ($config['db_table'] ?? 'leads'));

    $sql = "DELETE FROM `$table`
            WHERE created_at < DATE_SUB(NOW(), INTERVAL " . RETENTION_MONTHS . " MONTH)";
    if (KEEP_CONFIRMED) {
        $sql .= " AND confirmed_at IS NULL";
    }

    $deleted = $pdo->exec($sql);

    // Optionales Log (gleiche log_file-Config wie submit.php)
    if (!empty($config['log_file']) && is_string($config['log_file'])) {
        @file_put_contents(
            $config['log_file'],
            sprintf("[%s] cleanup deleted=%d retention=%dm keep_confirmed=%s\n",
                date('c'), (int) $deleted, RETENTION_MONTHS, KEEP_CONFIRMED ? 'yes' : 'no'),
            FILE_APPEND | LOCK_EX
        );
    }

    respond(200, ['ok' => true, 'deleted' => (int) $deleted]);
} catch (Throwable $e) {
    respond(500, ['ok' => false, 'error' => 'db_error']);
}
