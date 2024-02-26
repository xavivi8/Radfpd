<?php

require_once('../conn.php');

class PeliFav extends Conexion {

    public $status = false;
    public $message = NULL;
    public $data = NULL;

    function __construct (){
        parent::__construct();
    }

    public function insertPeliFav($usuario, $identificador) {
        try {
            $sql = $this->conexion->prepare("INSERT INTO `sgi_peli_fav` (usuario, identificador) VALUES (:usuario, :identificador)");
            $sql->bindParam(":usuario", $usuario);
            $sql->bindParam(":identificador", $identificador);
            $resultado = $sql->execute();
            if ($resultado){
                $this->status = true;
                $this->message = "Película favorita agregada correctamente";
            } else {
                $this->message = "Error al agregar la película favorita";
            }
        } catch(PDOException $error) {
            $this->message = $error->getMessage();
        }
        $this->closeConnection();
    }

    public function deletePeliFav($usuario, $identificador) {
        try {
            $sql = $this->conexion->prepare("DELETE FROM `sgi_peli_fav` WHERE `usuario`=:usuario AND `identificador`=:identificador");
            $sql->bindParam(":usuario", $usuario);
            $sql->bindParam(":identificador", $identificador);
            $resultado = $sql->execute();
            if ($resultado){
                $this->status = true;
                $this->message = "Película favorita eliminada correctamente";
            } else {
                $this->message = "Error al eliminar la película favorita";
            }
        } catch(PDOException $error) {
            $this->message = $error->getMessage();
        }
        $this->closeConnection();
        
    }

    public function getAllPeliFav($usuario) {
        try {
            $sql = $this->conexion->prepare("SELECT * FROM `sgi_peli_fav` WHERE `usuario`=:usuario");
            $sql->bindParam(":usuario", $usuario);
            $sql->execute();
            $resultados = $sql->fetchAll(PDO::FETCH_ASSOC);
            if ($resultados){
                $this->status = true;
                $this->data = $resultados;
            } else {
                $this->message = "No se encontraron películas favoritas para este usuario";
            }
        } catch(PDOException $error) {
            $this->message = $error->getMessage();
        }
        $this->closeConnection();
    }
}

?>
