<?php

require_once('interfaces/crud.php');
require_once('../conn.php');

class PeliFav extends Conexion implements crud {

    public $status = false;
    public $message = NULL;
    public $data = NULL;

    const ROUTE = 'peliculas';
    const ROUTE_PROFILE = 'profile';

    function __construct (){
        parent::__construct();
    }

    public function insert($id_usuario, $identificador) {
        try {
            $sql = $this->conexion->prepare("INSERT INTO sgi_peli_fav (id_usuario, identificador) VALUES (:id_usuario, :identificador)");
            $sql->bindParam(":id_usuario", $id_usuario, PDO::PARAM_INT);
            $sql->bindParam(":identificador", $identificador, PDO::PARAM_INT);
            $resultado = $sql->execute();

            if ($resultado) {
                $this->status = true;
                $this->message = "Película favorita insertada correctamente.";
            } else {
                $this->message = "Error al insertar la película favorita.";
            }
        } catch(PDOException $error) {
            $this->message = $error->getMessage();
        }
        $this->closeConnection();
    }

    public function delete($id_usuario, $identificador) {
        try {
            $sql = $this->conexion->prepare("DELETE FROM sgi_peli_fav WHERE id_usuario = :id_usuario AND identificador = :identificador");
            $sql->bindParam(":id_usuario", $id_usuario, PDO::PARAM_INT);
            $sql->bindParam(":identificador", $identificador, PDO::PARAM_INT);
            $resultado = $sql->execute();

            if ($resultado) {
                $this->status = true;
                $this->message = "Película favorita eliminada correctamente.";
            } else {
                $this->message = "Error al eliminar la película favorita.";
            }
        } catch(PDOException $error) {
            $this->message = $error->getMessage();
        }
        $this->closeConnection();
    }

    public function getAllByUserId($id_usuario) {
        try {
            $sql = $this->conexion->prepare("SELECT * FROM sgi_peli_fav WHERE id_usuario = :id_usuario");
            $sql->bindParam(":id_usuario", $id_usuario, PDO::PARAM_INT);
            $sql->execute();
            $this->data = $sql->fetchAll(PDO::FETCH_ASSOC);
            $this->status = true;
        } catch(PDOException $error) {
            $this->message = $error->getMessage();
        }
        $this->closeConnection();
    }
}

?>
