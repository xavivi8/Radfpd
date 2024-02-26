<?php

require_once('./apiClasses/peli_fav.php');

$api_utils = new ApiUtils();
$api_utils->setHeaders($api_utils::ALL_HEADERS);
$api_utils->displayErrors();

$authorization = new Authorization();
$authorization->comprobarToken();

$request = json_decode(file_get_contents("php://input"), true);

$peli_fav = new PeliFav();

// Obtener el id_usuario de la solicitud
$id_usuario = isset($_GET["id_usuario"]) ? $_GET["id_usuario"] : null;

if ($authorization->token_valido) {

    switch ($_SERVER['REQUEST_METHOD']) {
        case $api_utils::GET:
            // Obtener todas las películas favoritas para un usuario dado
            if ($id_usuario) {
                $peli_fav->getAllByUserId($id_usuario);
            } else {
                // Error: Falta el id_usuario en la solicitud
                $peli_fav->message = "Falta el id_usuario en la solicitud.";
            }
            break;
        case $api_utils::POST:
            // Insertar una nueva película favorita para un usuario dado
            if ($id_usuario && isset($request['identificador'])) {
                $peli_fav->insert($id_usuario, $request['identificador']);
            } else {
                // Error: Faltan datos en la solicitud
                $peli_fav->message = "Faltan datos en la solicitud.";
            }
            break;
        case $api_utils::DELETE:
            // Eliminar una película favorita para un usuario dado
            if ($id_usuario && isset($request['id_pelicula_fav'])) {
                $peli_fav->delete($id_usuario, $request['id_pelicula_fav']);
            } else {
                // Error: Faltan datos en la solicitud
                $peli_fav->message = "Faltan datos en la solicitud.";
            }
            break;
        default:
            // Método de solicitud no válido
            $peli_fav->message = "Método de solicitud no válido.";
            break;
    }
} else {
    $peli_fav->message = NO_TOKEN_MESSAGE;
}

$api_utils->response($peli_fav->status, $peli_fav->message, $peli_fav->data);
echo json_encode($api_utils->response, JSON_PRETTY_PRINT);

?>
