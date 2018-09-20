<?php
require_once '../vendor/autoload.php';

$dotenv = new \Dotenv\Dotenv(dirname(__DIR__));
$dotenv->load();

$manifest = __DIR__ . '/assets/manifest.json';
$manifest = file_exists($manifest) ? json_decode(file_get_contents($manifest), true) : [];

$loader = new Twig_Loader_Filesystem('../templates');
$twig = new Twig_Environment($loader, [
    'cache' => $_ENV['APP_DEBUG'] !== 'true' ? $_ENV['APP_CACHE'] : false
]);

$twig->addExtension(new \nochso\HtmlCompressTwig\Extension());

$icon = function ($type, $class = null) {
    return '<span class="icon icon-' . $type . ($class ? ' ' . $class : '') . '" aria-hidden="true"></span>';
};
$icon = new Twig_Function('icon', $icon, [
    'is_safe' => ['all']
]);
$twig->addFunction($icon);

echo $twig->render('index.twig', [
    'manifest' => $manifest
]);
