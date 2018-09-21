<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../vendor/autoload.php';

$dotenv = new \Dotenv\Dotenv(dirname(__DIR__));
$dotenv->load();

$mail = new PHPMailer(true);
try {
    $mail->setLanguage('ru', '../vendor/phpmailer/phpmailer/language');

    $mail->SMTPDebug = 2;
    $mail->isSMTP();
    $mail->Host = $_ENV['MAIL_HOST'];
    $mail->SMTPAuth = true;
    $mail->Username = $_ENV['MAIL_USERNAME'];
    $mail->Password = $_ENV['MAIL_PASSWORD'];
    $mail->SMTPSecure = $_ENV['MAIL_ENCRYPTION'];
    $mail->Port = $_ENV['MAIL_PORT'];
    // $mail->Sender = $_ENV['MAIL_USERNAME'];

    $mail->setFrom($_ENV['MAIL_USERNAME'], $_POST['email'], true);
    $mail->addReplyTo($_POST['email'], null);
    $mail->addAddress('mail@daks.pro', 'DAaks');
    $mail->addCC('diaksid@mail.ru');
    $mail->addBCC('diaksid@gmail.com');

    // $mail->addAttachment('/var/tmp/file.tar.gz');
    // $mail->addAttachment('/tmp/image.jpg', 'new.jpg');

    $mail->isHTML(true);
    $mail->Subject = '[daks_php]';
    $mail->Body = $_POST['message'];
    $mail->AltBody = strip_tags($_POST['message']);

    // $mail->send();
    echo json_encode([
        'code' => true,
        'message' => 'Message has been sent'
    ]);
} catch (Exception $e) {
    echo json_encode([
        'code' => false,
        'message' => $mail->ErrorInfo
    ]);
}
