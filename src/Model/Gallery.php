<?php
namespace App\Model;

use App\Service\Config;

class Gallery
{
    private ?int $id = null;
    private ?string $title = null;
    private ?string $description = null;
    private ?string $image_path = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(?int $id): Gallery
    {
        $this->id = $id;
        return $this;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(?string $title): Gallery
    {
        $this->title = $title;
        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): Gallery
    {
        $this->description = $description;
        return $this;
    }

    public function getImagePath(): ?string
    {
        return $this->image_path;
    }

    public function setImagePath(?string $image_path): Gallery
    {
        $this->image_path = $image_path;
        return $this;
    }

    public static function fromArray($array): Gallery
    {
        $gallery = new self();
        $gallery->fill($array);
        return $gallery;
    }

    public function fill($array): Gallery
    {
        if (isset($array['id']) && !$this->getId()) {
            $this->setId($array['id']);
        }
        if (isset($array['title'])) {
            $this->setTitle($array['title']);
        }
        if (isset($array['description'])) {
            $this->setDescription($array['description']);
        }
        if (isset($array['image_path'])) {
            $this->setImagePath($array['image_path']);
        }
        return $this;
    }

    public static function findAll(): array
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM gallery';
        $statement = $pdo->prepare($sql);
        $statement->execute();

        $galleries = [];
        $galleriesArray = $statement->fetchAll(\PDO::FETCH_ASSOC);
        foreach ($galleriesArray as $galleryArray) {
            $galleries[] = self::fromArray($galleryArray);
        }

        return $galleries;
    }

    public static function find($id): ?Gallery
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM gallery WHERE id = :id';
        $statement = $pdo->prepare($sql);
        $statement->execute(['id' => $id]);

        $galleryArray = $statement->fetch(\PDO::FETCH_ASSOC);
        if (!$galleryArray) {
            return null;
        }
        $gallery = Gallery::fromArray($galleryArray);

        return $gallery;
    }

    public function save(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        if (!$this->getId()) {
            $sql = "INSERT INTO gallery (title, description, image_path) VALUES (:title, :description, :image_path)";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                'title' => $this->getTitle(),
                'description' => $this->getDescription(),
                'image_path' => $this->getImagePath(),
            ]);

            $this->setId($pdo->lastInsertId());
        } else {
            $sql = "UPDATE gallery SET title = :title, description = :description, image_path = :image_path WHERE id = :id";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                ':title' => $this->getTitle(),
                ':description' => $this->getDescription(),
                ':image_path' => $this->getImagePath(),
                ':id' => $this->getId(),
            ]);
        }
    }

    public function delete(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = "DELETE FROM gallery WHERE id = :id";
        $statement = $pdo->prepare($sql);
        $statement->execute([
            ':id' => $this->getId(),
        ]);

        $this->setId(null);
        $this->setTitle(null);
        $this->setDescription(null);
        $this->setImagePath(null);
    }
}
