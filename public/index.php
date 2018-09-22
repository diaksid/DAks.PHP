<?php
require_once '../vendor/autoload.php';

$dotenv = new \Dotenv\Dotenv(dirname(__DIR__));
$dotenv->load();

$manifest = __DIR__ . '/assets/manifest.json';
$manifest = file_exists($manifest) ? json_decode(file_get_contents($manifest), true) : [];

session_start();
require_once '../includes/csrf.php';

$loader = new \Twig_Loader_Filesystem('../templates');
$twig = new Twig_Environment($loader, [
    'cache' => $_ENV['APP_DEBUG'] !== 'true' ? $_ENV['APP_CACHE'] : false,
]);

$twig->addExtension(new \nochso\HtmlCompressTwig\Extension());

require_once '../includes/twig.php';

$twig->addFunction(\PRO\Twig\Fn::icon());

echo $twig->render('index.twig', [
    'manifest' => $manifest,
    'csrf' => \PRO\CSRF::get_token()
]);
