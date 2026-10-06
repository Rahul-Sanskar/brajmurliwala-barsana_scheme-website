<?php
/**
 * contact.php — Enquiry form email handler
 *
 * Upload this file to your Hostinger public_html folder.
 * It receives JSON from the Next.js /api/enquiry route and
 * sends an email using PHP mail().
 *
 * Set the TO_EMAIL below to your desired recipient address.
 */

// ── CONFIGURE THIS ────────────────────────────────────────────────
$TO_EMAIL   = "info@brajmurliwala.online"; // change to your email
$SITE_NAME  = "Braj Murliwala Residency";
$ALLOWED_ORIGINS = [
    "https://www.brajmurliwala.online",
    "https://brajmurliwala.online",
    "http://localhost:3000",
];
// ─────────────────────────────────────────────────────────────────

// CORS — only allow requests from your own domain
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $ALLOWED_ORIGINS, true)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    http_response_code(403);
    echo json_encode(["success" => false, "error" => "Forbidden."]);
    exit;
}

header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Only accept POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "error" => "Method not allowed."]);
    exit;
}

// Parse JSON body
$raw  = file_get_contents("php://input");
$data = json_decode($raw, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Invalid request."]);
    exit;
}

// ── Sanitize inputs ───────────────────────────────────────────────
function clean(string $value, int $maxLen = 255): string {
    return htmlspecialchars(substr(trim($value), 0, $maxLen), ENT_QUOTES, 'UTF-8');
}

$fullName       = clean($data['fullName']       ?? '');
$mobile         = clean($data['mobile']         ?? '');
$email          = clean($data['email']          ?? '');
$unitPreference = clean($data['unitPreference'] ?? '');
$message        = clean($data['message']        ?? '', 1000);

// ── Server-side validation ────────────────────────────────────────
if (strlen($fullName) < 2) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Invalid name."]);
    exit;
}
if (!preg_match('/^[6-9]\d{9}$/', $mobile)) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Invalid mobile number."]);
    exit;
}
if (!filter_var($data['email'] ?? '', FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Invalid email."]);
    exit;
}
$allowedUnits = ['1bhk', '2bhk', '3bhk', 'any'];
if (!in_array($data['unitPreference'] ?? '', $allowedUnits, true)) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Invalid configuration."]);
    exit;
}

// ── Unit label map ────────────────────────────────────────────────
$unitLabels = [
    '1bhk' => '1 BHK (881–895 sq.ft.)',
    '2bhk' => '2 BHK (1,395–1,675 sq.ft.)',
    '3bhk' => '3 BHK (1,916–1,982 sq.ft.)',
    'any'  => 'Open to All Configurations',
];
$unitLabel = $unitLabels[$data['unitPreference']] ?? $unitPreference;

// ── Build HTML email ──────────────────────────────────────────────
$messageRow = $message ? "
    <tr style='background:#f8f4f0;'>
      <td style='padding:10px 14px;font-weight:700;border-bottom:1px solid #e4ddd8;vertical-align:top;'>Message</td>
      <td style='padding:10px 14px;border-bottom:1px solid #e4ddd8;white-space:pre-wrap;'>$message</td>
    </tr>" : "";

$ist = new DateTimeZone('Asia/Kolkata');
$now = new DateTime('now', $ist);
$timestamp = $now->format('d M Y, h:i A') . ' IST';

$htmlBody = "
<!DOCTYPE html>
<html>
<head><meta charset='UTF-8' /></head>
<body style='font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;color:#1a1a1a;'>
  <div style='background:#9F1D20;padding:18px 24px;margin-bottom:24px;'>
    <h1 style='color:#fff;font-size:1.1rem;margin:0;font-weight:800;'>
      NEW ENQUIRY — $SITE_NAME
    </h1>
    <p style='color:rgba(255,255,255,0.75);font-size:0.78rem;margin:4px 0 0;'>
      Barsana Housing Scheme · Goverdhan Road, Barsana
    </p>
  </div>
  <table style='width:100%;border-collapse:collapse;font-size:0.9rem;'>
    <tr style='background:#f8f4f0;'>
      <td style='padding:10px 14px;font-weight:700;width:36%;border-bottom:1px solid #e4ddd8;'>Name</td>
      <td style='padding:10px 14px;border-bottom:1px solid #e4ddd8;'>$fullName</td>
    </tr>
    <tr>
      <td style='padding:10px 14px;font-weight:700;border-bottom:1px solid #e4ddd8;'>Mobile</td>
      <td style='padding:10px 14px;border-bottom:1px solid #e4ddd8;font-weight:700;'>+91 $mobile</td>
    </tr>
    <tr style='background:#f8f4f0;'>
      <td style='padding:10px 14px;font-weight:700;border-bottom:1px solid #e4ddd8;'>Email</td>
      <td style='padding:10px 14px;border-bottom:1px solid #e4ddd8;'>$email</td>
    </tr>
    <tr>
      <td style='padding:10px 14px;font-weight:700;border-bottom:1px solid #e4ddd8;'>Configuration</td>
      <td style='padding:10px 14px;border-bottom:1px solid #e4ddd8;font-weight:700;color:#E87516;'>$unitLabel</td>
    </tr>
    $messageRow
  </table>
  <div style='margin-top:24px;padding:14px 18px;background:#fff7ed;border-left:4px solid #E87516;font-size:0.82rem;color:#555;'>
    <strong>Action required:</strong> Follow up with <strong>$fullName</strong> — mobile: <strong>+91 $mobile</strong>.
  </div>
  <p style='margin-top:20px;font-size:0.72rem;color:#aaa;text-align:center;'>
    Sent via brajmurliwala.online · $timestamp
  </p>
</body>
</html>";

// ── Send email ────────────────────────────────────────────────────
$subject = "New Enquiry: $fullName — $unitLabel";
$headers  = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";
$headers .= "From: $SITE_NAME <noreply@brajmurliwala.online>\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";

$sent = mail($TO_EMAIL, $subject, $htmlBody, $headers);

if ($sent) {
    echo json_encode(["success" => true]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Failed to send email. Please try again."]);
}
?>
