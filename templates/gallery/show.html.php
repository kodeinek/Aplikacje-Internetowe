<?php

/** @var \App\Model\Gallery $gallery */
/** @var \App\Service\Router $router */

$title = "{$gallery->getTitle()} ({$gallery->getId()})";
$bodyClass = 'show';

ob_start(); ?>
    <h1><?= $gallery->getTitle() ?></h1>
<?php if ($gallery->getImagePath()): ?>
    <img src="<?= $gallery->getImagePath() ?>" alt="Gallery image" style="max-width:300px;">
<?php endif; ?>
    <article>
        <p><?= $gallery->getDescription() ?></p>
    </article>
    <ul class="action-list">
        <li><a href="<?= $router->generatePath('gallery-index') ?>">Back to list</a></li>
        <li><a href="<?= $router->generatePath('gallery-edit', ['id' => $gallery->getId()]) ?>">Edit</a></li>
    </ul>

<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
