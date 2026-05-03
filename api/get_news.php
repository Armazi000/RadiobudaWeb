<?php
header('Content-Type: application/json');
require 'db.php';

$stmt = $pdo->query("SELECT * FROM news ORDER BY date DESC, id DESC");
$articles = $stmt->fetchAll();

// Zwracamy format JSON identyczny z dawnym plikiem statycznym
$response = [
    'articles' => $articles,
    'categories' => ["Wszystkie", "Sukcesy", "Sport", "Edukacja", "Wydarzenie"]
];

echo json_encode($response);
?>
