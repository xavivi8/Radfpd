<?php

require_once('interfaces/crud.php');
require_once('../conn.php');

class UnidadesCentro extends Conexion {

    public $status = false;
    public $message = NULL;
    public $data = NULL;
    const ROUTE = 'unidad_centro';

    function __construct (){
        parent::__construct();
    }

    public function get($entidad) {
        $order = " ORDER BY unidad_centro ";

        if ($entidad > 0) {
            $where = " WHERE U.id_entidad = :entidad ";
        } else {
            $where = " ";
        }

        $sql = $this->conexion->prepare(
            "SELECT U.*
            FROM sgi_unidades_centro U
            ".$where.$order);

        if ($entidad > 0) {
            $sql->bindParam(":entidad", $entidad, PDO::PARAM_STR);
        }

        $exito = $sql->execute();

        if($exito) {
            $this->status = true;
            $this->data =  $sql->fetchAll(PDO::FETCH_ASSOC);
        }

        $this->closeConnection();

    }

    public function create($data) {
        $unidad_centro = $this->trimIfString($data['unidad_centro']); //47
        $id_ciclo = $this->trimIfString($data['id_ciclo']);
        $observaciones = $this->trimIfString($data['observaciones']);
        
        if (isset($unidad_centro) && isset($id_ciclo)) {


            $sql = $this->conexion->prepare("INSERT INTO `sgi_unidades_centro` ( unidad_centro, id_ciclo, observaciones)
                    VALUES ( :unidad_centro, :id_ciclo, :observaciones)");
           
	    $sql->bindParam(":unidad_centro", $unidad_centro, PDO::PARAM_STR); 
            $sql->bindParam(":id_ciclo", $id_ciclo, PDO::PARAM_INT);
            $sql->bindParam(":observaciones", $observaciones, PDO::PARAM_STR);

            try {
                $resultado = $sql->execute();
                if ($resultado) {
                    $this->status = true;
                    $this->message = "";
                } else {$this->message = "";}
            } catch (PDOException $error) {
                $this->status = false;
                $this->message = "";
            }


            $this->closeConnection();
        }
    }

    public function update($data) {
	$id_unidad_centro = $this->trimIfString($data['id_unidad_centro']);
        $unidad_centro = $this->trimIfString($data['unidad_centro']);
        $id_ciclo = $this->trimIfString($data['id_ciclo']);
        $observaciones = $this->trimIfString($data['observaciones']);

        //83

        if (isset($unidad_centro) && isset($id_ciclo)) {


            $sql = $this->conexion->prepare("UPDATE sgi_unidades_centro SET
                    unidad_centro = :unidad_centro,
                    id_ciclo = :id_ciclo,
                    observaciones = :observaciones
                    WHERE id_unidad_centro = :id_unidad_centro");

            $sql->bindParam(":unidad_centro", $unidad_centro, PDO::PARAM_STR);
            $sql->bindParam(":id_ciclo", $id_ciclo, PDO::PARAM_INT);
            $sql->bindParam(":observaciones", $observaciones, PDO::PARAM_STR);
            $sql->bindParam(":id_unidad_centro", $id_unidad_centro, PDO::PARAM_INT);

            try {
                $resultado = $sql->execute();
                if ($resultado) {
                    $this->status = true;
                    $this->message = EDIT_UNIDAD_OK;
                } else { $this->message = EDIT_UNIDAD_KO; }
            } catch (PDOException $error) {
                $this->status = false;
                $this->message = "jajant";
            }
            $this->closeConnection();
        }
    }

    public function delete($id_unidad_centro) {
        if (isset($id_unidad_centro)) {
            try {
                $sql = $this->conexion->prepare("DELETE FROM sgi_unidades_centro WHERE id_unidad_centro = :id_unidad_centro");
                $sql->bindParam(":id_unidad_centro", $id_unidad_centro, PDO::PARAM_INT);

                $resultado = $sql->execute();
                if ($resultado) {
                    $this->status = true;
                    $this->message = DELETE_UNIDAD_OK;
                    $this->data = $idUnidad;
                } else { $this->message = DELETE_UNIDAD_KO; }
            } catch(PDOException $e) {
                if ($e->getCode() == '23000'){
                    $this->message = CONSTRAINT_UNIDAD;
                }
            }
            $this->closeConnection();
        }
    }

}

?>
