<?php
require_once('./apiClasses/peli_fav.php'); // Asumiendo que este archivo contiene las clases necesarias

$api_utils = new ApiUtils();
$api_utils->setHeaders($api_utils::ALL_HEADERS);
$api_utils->displayErrors();

$authorization = new Authorization();
$authorization->comprobarToken();

$request = json_decode(file_get_contents("php://input"), true);

$peli_fav = new PeliFav();

if (isset($_GET["usuario"])) {
    $usuario = $_GET["usuario"];
}

if ($authorization->token_valido) {

    switch ($_SERVER['REQUEST_METHOD']) {
        case $api_utils::GET:
            if (isset($usuario)) {
                $peli_fav->getAllPeliFav($usuario);
            } else {
                $peli_fav->message = "ID de usuario no proporcionado.";
            }
            break;
        case $api_utils::POST:
            if (isset($request['usuario']) && isset($request['identificador'])) {
                $peli_fav->insertPeliFav($request['usuario'], $request['identificador']);
            } else {
                $peli_fav->message = "Datos incompletos para insertar una nueva película favorita.";
            }
            break;
        case $api_utils::DELETE:
            if (isset($request['usuario']) && isset($request['identificador'])) {
                $peli_fav->deletePeliFav($request['usuario'], $request['identificador']);
            } else {
                $peli_fav->message = "Datos incompletos para eliminar una película favorita.";
            }
            break;
        default:
            $peli_fav->message = "Método HTTP no soportado.";
    }
} else {
    $peli_fav->message = "Token inválido.";
}

$api_utils->response($peli_fav->status, $peli_fav->message, $peli_fav->data, null);
echo json_encode($api_utils->response, JSON_PRETTY_PRINT);

?>
