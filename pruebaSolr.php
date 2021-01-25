<?php
//Important https://lucene.apache.org/solr/guide/8_7/updating-parts-of-documents.html //Tiene la guia de como actualizar y eliminar
require_once 'vendor/autoload.php';
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use GuzzleHttp\Exception\ConnectException;
addDocument();
//echo file_get_contents("http://localhost:8983/solr/repository/selectCheck?q=Name%3A*Daniel*");

function addDocument(){ //este va a añadirse
    $ch = curl_init("http://localhost:8983/solr/start/update/extract?commit=true");

    $urls = 'https://www.marista.edu.mx/,https://www.unimodelo.edu.mx/,https://www.uady.mx/,http://www.cesctm.edu.mx/,https://www.unam.mx/,https://www.itmerida.mx/';
    $urls = explode(",", $urls);

    for ($i=0; $i < count($urls); $i++) {
        $data_string = petitionGuzzle($urls[$i]);//file_get_contents($data);   
        $html = "<meta property='url' content = '$urls[$i]'>".$data_string->getBody();
        try {
            if ($data_string->getStatusCode() == 200) {
                //echo $data_string->getBody();
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
                curl_setopt($ch, CURLOPT_POST, TRUE);
                curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-type: application/json'));
                curl_setopt($ch, CURLOPT_POSTFIELDS, $html);
                echo curl_exec($ch);
            }
        } catch (\Throwable $th) {
            echo $data_string["error"];
        }

    }
}

function petitionGuzzle($url){
    try {
        // Create a client and provide a base URL
        $client = new Client();
        // Create a request with basic Auth
        $response = $client->request('GET', $url);
        // Send the request and get the response
        // echo $response->getStatusCode();
        // echo $response->getBody();
        // var_dump($response->getHeaders());
        return $response;//->getBody();
    } catch (RequestException $e) {
        return $e->getResponse();
    } catch (ConnectException $e) {
        return $e->getHandlerContext();
    }
}

function remover_javascriptCSS($html) {

    $html = preg_replace('/<script\b[^>]*>(.*?)<\/script>/is', "", $html);
    $html = preg_replace('/<style\b[^>]*>(.*?)<\/style>/is', "", $html);
    return $html;
}

?>