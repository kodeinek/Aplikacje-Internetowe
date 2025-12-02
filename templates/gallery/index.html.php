<?php

/** @var \App\Model\Gallery[] $gallerys */
/** @var \App\Service\Router $router */

$title = 'gallery List';
$bodyClass = 'index';

ob_start(); ?>
    <h1>Gallery List</h1>

    <a href="<?= $router->generatePath('gallery-create') ?>">Create new</a>

    <ul class="index-list">
        <?php foreach ($gallerys as $gallery): ?>
            <li>
                <h3><?= $gallery->getTitle() ?></h3>
                <?php if ($gallery->getImagePath()): ?>
                    <img src="<?= $gallery->getImagePath() ?>" alt="Gallery image" style="max-width: 222px; max-height: 222px;">
                <?php endif; ?>
                <ul class="action-list">
                    <li><a href="<?= $router->generatePath('gallery-show', ['id' => $gallery->getId()]) ?>">Details</a></li>
                    <li><a href="<?= $router->generatePath('gallery-edit', ['id' => $gallery->getId()]) ?>">Edit</a></li>
                </ul>
            </li>
        <?php endforeach; ?>
    </ul>

<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
