<?php

include('headers.php');
include('../db/airports-class.php');

$db = new SQLite3('../db/store.db');
$airports = new Airports($db);
$data = json_decode(file_get_contents('php://input'));

switch ( $_SERVER['REQUEST_METHOD'] ) {

	case "GET":
		$all_airports = $airports->read();

		http_response_code(200);
		echo json_encode( $all_airports );
		break;

	case "POST":

	//	$data = json_decode(file_get_contents('php://input'));

        $airports->name = $data->name;
        $airports->latitude = $data->latitude;
        $airports->longitude = $data->longitude;

		//$airports->name = $_POST['nom'];
		//$airports->latitude = $_POST['latitude'];
		//$airports->longitude = $_POST['longitude'];

		if ( $airports->create() ) {

			http_response_code(201);
			echo json_encode([ "message" => "aéroport ajouté avec succès" ]);

		} else {

			http_response_code(503);
			echo json_encode(["message" => "Erreur lors de la création" ]);
		}
		
		break;

	case "PUT": 
		
		break;

	case "DELETE": 

        $airports->id = $data->id;
		

		if ( $airports->delete() ) {

			http_response_code(200);
			echo json_encode([ "message" => "aéroport supprimé avec succès" ]);

		} else {

			http_response_code(503);
			echo json_encode(["message" => "Erreur lors de la suppression" ]);
		}

		break;

	default:

		break;
}