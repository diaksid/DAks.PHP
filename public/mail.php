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

    $mail->setFrom($_ENV['MAIL_USERNAME'], 'aaa@bbb.ccc', true);
    $mail->addReplyTo('aaa@bbb.ccc', null);
    $mail->addAddress('mail@daks.pro', 'DAaks');
    $mail->addCC('diaksid@mail.ru');
    $mail->addBCC('diaksid@gmail.com');

    // $mail->addAttachment('/var/tmp/file.tar.gz');
    // $mail->addAttachment('/tmp/image.jpg', 'new.jpg');

    $mail->isHTML(true);
    $mail->Subject = 'Here is the subject';
    $mail->Body = 'This is the HTML message body <b>in bold!</b>';
    $mail->AltBody = 'This is the body in plain text for non-HTML mail clients';

    // $mail->send();
    echo 'Message has been sent';
} catch (Exception $e) {
    echo 'Message could not be sent. Mailer Error: ', $mail->ErrorInfo;
}
