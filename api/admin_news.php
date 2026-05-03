<?php
session_start();
header('Content-Type: application/json');
require 'db.php';

if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Brak autoryzacji']);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents('php://input'), true);

if ($method === 'POST') {
    $stmt = $pdo->prepare("INSERT INTO news (title, date, category, excerpt, content, image) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->execute([
        $data['title'],
        $data['date'],
        $data['category'],
        $data['excerpt'] ?? '',
        $data['content'] ?? '',
        $data['image'] ?? 'assets/news1.jpg'
    ]);
    echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);

} elseif ($method === 'PUT') {
    $id = $data['id'] ?? null;
    if (!$id) {
        echo json_encode(['success' => false, 'message' => 'Brak ID']);
        exit;
    }
    $stmt = $pdo->prepare("UPDATE news SET title=?, date=?, category=?, excerpt=?, content=?, image=? WHERE id=?");
    $stmt->execute([
        $data['title'],
        $data['date'],
        $data['category'],
        $data['excerpt'] ?? '',
        $data['content'] ?? '',
        $data['image'] ?? 'assets/news1.jpg',
        $id
    ]);
    echo json_encode(['success' => true]);

} elseif ($method === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if (!$id) {
        echo json_encode(['success' => false, 'message' => 'Brak ID']);
        exit;
    }
    $stmt = $pdo->prepare("DELETE FROM news WHERE id=?");
    $stmt->execute([$id]);
    echo json_encode(['success' => true]);
}
?>
