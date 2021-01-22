<?php
//$consulta = "MéRIDA not YUCATÁN";
    if(isset($_GET['consulta'])) {
        $diccionario = array("and", "or","not");
        $consulta = strtolower ($_GET['consulta']);
        $consulta = strtolower ($consulta);
        $arrayDividido = explode(" ", $consulta);
        //$arrayDividido = array_values(removeEmptyElements($arrayDividido));
        $tamaño = count($arrayDividido);
        $sentenciaSolr = 'http://localhost:8983/solr/start/selectCheck?debug.explain.structured=true&debugQuery=on&df=attr_text&hl.fl=attr_text&hl=true&q=';
        $tipoAnterior = "elemento";
        //para el primer elemento
        $sentenciaSolr = $sentenciaSolr.'(*'.quitarTildes($arrayDividido[0]).'*)';

        for ($i=1; $i < $tamaño; $i++) {
            $variable = quitarTildes($arrayDividido[$i]);
            switch ($variable) {
                case $diccionario[0]:
                    $tipoAnterior = "and";
                    break;
                case $diccionario[1]:
                    $tipoAnterior = "or";
                    break;
                case $diccionario[2]:
                    $tipoAnterior = "not";
                    break;
                default:
                    $sentenciaSolr = agregarPalabra($variable, $tipoAnterior, $sentenciaSolr);
                    $tipoAnterior = "elemento";
                    break;
            }
        }
    } else{
        echo 'error';
    }

    //echo $sentenciaSolr;
    $resultados = file_get_contents($sentenciaSolr);
    //SolrConection($sentenciaSolr);
    echo json_encode($resultados);

    function quitarTildes($cadena) {
        $no_permitidas = array ("á","é","í","ó","ú","Á","É","Í","Ó","Ú","ñ","Ñ");
        $permitidas = array ("a","e","i","o","u","A","E","I","O","U","n","N");
        $texto = str_replace($no_permitidas, $permitidas, $cadena);
        return $texto;
    }

    function SolrConection($sentenciaSolr){
        $file = file_get_contents($sentenciaSolr);
        return $file;
        //eval("\$result = " . $file . ";");
        //eval("\$result = \"$file\";");
        /*for($i=0; $i<count($file["response"]["docs"]) ; $i++){
            echo "=========Result ".($i+$start+1)."=========<br>";
            foreach($file["response"]["docs"][$i] as $k=>$v){
                //display($k,$v);
                echo "<br>";
            }
            echo "<br>";
        }*/
    }

    function agregarPalabra($palabra, $tipoAnterior, $sentenciaSolr){
        if ($tipoAnterior == "elemento" || $tipoAnterior == "or") {
             $sentenciaSolr = $sentenciaSolr . 'OR(*' . $palabra .'*)';
        } else if ($tipoAnterior == "not") {
            $sentenciaSolr = $sentenciaSolr . '%20NOT(*' . $palabra .'*)';
        } else { 
            $sentenciaSolr = $sentenciaSolr . 'AND(*' . $palabra . '*)';
        }
        return $sentenciaSolr;
    }



   /*  function dividirCadena($arrayDividido, $i, $divisor, $tamaño){
        $palabra = "";
        for ($k=$i; $k < $tamaño; $k++) { 
            $palabra = $palabra . " " . $arrayDividido[$k];
            if(endsWith($arrayDividido[$k], ")")) {
                break;
            }
        }
        $parte1=explode($divisor,$palabra);
        $parte2=explode(')', $parte1[1]);
        $busqueda= $parte2[0];
        return $busqueda;
    }

   function removeEmptyElements(&$element){
        if (is_array($element)) {
            if ($key = key($element)) {
                $element[$key] = array_filter($element);
            }

            if (count($element) != count($element, COUNT_RECURSIVE)) {
                $element = array_filter(current($element), __FUNCTION__);
            }

            $element = array_filter($element);

            return $element;
        } else {
            return empty($element) ? false : $element;
        }
    } 
    function endsWith($haystack, $needle) {
        return substr_compare($haystack, $needle, -strlen($needle)) === 0;
    }*/

?>