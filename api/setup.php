<?php
require 'db.php';

try {
    $pdo->exec("CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL
    )");

    $pdo->exec("CREATE TABLE IF NOT EXISTS news (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        date DATE NOT NULL,
        category VARCHAR(100) NOT NULL,
        excerpt TEXT,
        content TEXT,
        image VARCHAR(255)
    )");

    $stmt = $pdo->prepare("SELECT * FROM users WHERE username = 'admin'");
    $stmt->execute();
    if ($stmt->rowCount() === 0) {
        $hash = password_hash('radiobuda2026', PASSWORD_DEFAULT);
        $insert = $pdo->prepare("INSERT INTO users (username, password_hash) VALUES ('admin', ?)");
        $insert->execute([$hash]);
        echo "Domyślny użytkownik 'admin' został utworzony (hasło: radiobuda2026).<br>";
    }

    echo "Konfiguracja bazy danych zakończona sukcesem. Ze względów bezpieczeństwa usuń plik setup.php.";
} catch (\PDOException $e) {
    die("Błąd konfiguracji bazy danych: " . $e->getMessage());
}
?>
