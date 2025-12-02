<?php
namespace App\Controller;

use App\Exception\NotFoundException;
use App\Model\Gallery;
use App\Service\Router;
use App\Service\Templating;

class GalleryController
{
    public function indexAction(Templating $templating, Router $router): ?string
    {
        $gallerys = Gallery::findAll();
        $html = $templating->render('gallery/index.html.php', [
            'gallerys' => $gallerys,
            'router' => $router,
        ]);
        return $html;
    }

    public function createAction(?array $requestGallery, Templating $templating, Router $router): ?string
    {
        if ($requestGallery) {
            $gallery = Gallery::fromArray($requestGallery);
            // @todo missing validation
            $gallery->save();

            $path = $router->generatePath('gallery-index');
            $router->redirect($path);
            return null;
        } else {
            $gallery = new Gallery();
        }

        $html = $templating->render('gallery/create.html.php', [
            'gallery' => $gallery,
            'router' => $router,
        ]);
        return $html;
    }

    public function editAction(int $galleryId, ?array $requestGallery, Templating $templating, Router $router): ?string
    {
        $gallery = Gallery::find($galleryId);
        if (! $gallery) {
            throw new NotFoundException("Missing gallery with id $galleryId");
        }

        if ($requestGallery) {
            $gallery->fill($requestGallery);
            // @todo missing validation
            $gallery->save();

            $path = $router->generatePath('gallery-index');
            $router->redirect($path);
            return null;
        }

        $html = $templating->render('gallery/edit.html.php', [
            'gallery' => $gallery,
            'router' => $router,
        ]);
        return $html;
    }

    public function showAction(int $galleryId, Templating $templating, Router $router): ?string
    {
        $gallery = Gallery::find($galleryId);
        if (! $gallery) {
            throw new NotFoundException("Missing gallery with id $galleryId");
        }

        $html = $templating->render('gallery/show.html.php', [
            'gallery' => $gallery,
            'router' => $router,
        ]);
        return $html;
    }

    public function deleteAction(int $galleryId, Router $router): ?string
    {
        $gallery = Gallery::find($galleryId);
        if (! $gallery) {
            throw new NotFoundException("Missing gallery with id $galleryId");
        }

        $gallery->delete();
        $path = $router->generatePath('gallery-index');
        $router->redirect($path);
        return null;
    }
}
