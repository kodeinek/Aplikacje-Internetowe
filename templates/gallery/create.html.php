<?php

/** @var \App\Model\Gallery $gallery */
/** @var \App\Service\Router $router */

$title = 'Post a picture';
$bodyClass = "edit";

ob_start(); ?>
    <h1>Add Picture</h1>
    <form action="<?= $router->generatePath('gallery-create') ?>" method="post" class="edit-form">
        <?php require __DIR__ . DIRECTORY_SEPARATOR . '_form.html.php'; ?>
        <input type="hidden" name="action" value="gallery-create">
    </form>

    <a href="<?= $router->generatePath('gallery-index') ?>">Back to list</a>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
