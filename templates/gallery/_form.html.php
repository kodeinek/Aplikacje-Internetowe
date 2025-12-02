<?php
/** @var $gallery ?\App\Model\Gallery */ ?>

<div class="form-group">
    <label for="title">Title</label>
    <input type="text" id="title" name="gallery[title]" value="<?= $gallery ? $gallery->getTitle() : '' ?>">
</div>
<div class="form-group">
    <label for="image_path">Picture URL</label>
    <input type="text" id="description" name="gallery[image_path]" value="<?= $gallery ? $gallery->getImagePath() : '' ?>">
</div>
<div class="form-group">
    <label for="description">Description</label>
    <textarea id="description" name="gallery[description]"><?= $gallery ? $gallery->getDescription() : '' ?></textarea>
</div>
<div class="form-group">
    <input type="submit" value="Submit">
</div>