<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../vendor/autoload.php';

$dotenv = new \Dotenv\Dotenv(dirname(__DIR__));
$dotenv->load();

$email = $_POST['email'];
$message = $_POST['message'];

$mail = new PHPMailer(true);
try {
    $mail->setLanguage('ru', '../vendor/phpmailer/phpmailer/language');

    $mail->SMTPDebug = $_SERVER['REQUEST_METHOD'] === 'GET' ? 2 : 0;
    $mail->isSMTP();
    $mail->Host = $_ENV['MAIL_HOST'];
    $mail->SMTPAuth = true;
    $mail->Username = $_ENV['MAIL_USERNAME'];
    $mail->Password = $_ENV['MAIL_PASSWORD'];
    $mail->SMTPSecure = $_ENV['MAIL_ENCRYPTION'];
    $mail->Port = $_ENV['MAIL_PORT'];
    // $mail->Sender = $_ENV['MAIL_USERNAME'];

    $mail->setFrom($_ENV['MAIL_USERNAME'], "\"$email\"", true);
    $mail->addReplyTo($email, null);
    $mail->addAddress('mail@daks.pro', 'DAaks');
    // $mail->addCC('');
    // $mail->addBCC('');

    // $mail->addAttachment('/var/tmp/file.tar.gz');
    // $mail->addAttachment('/tmp/image.jpg', 'new.jpg');

    $mail->isHTML(false);
    $mail->Subject = '[daks_php]';
    $mail->Body = strip_tags($message);
    // $mail->AltBody = strip_tags($message);

    // $mail->send();

    echo json_encode([
        'code' => true
    ]);
} catch (Exception $e) {
    echo json_encode([
        'code' => false,
        'message' => $mail->ErrorInfo
    ]);
}
