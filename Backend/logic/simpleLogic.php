<?php
include("../config/dataHandler.php");

class SimpleLogic
{
    private $dh;
    function __construct()
    {
        $this->dh = new DataHandler();
    }

    function handleRequest($method, $param)
    {
        switch ($method) {
            case "queryPersons":
                $res = $this->dh->queryPersons();
                break;
            case "queryPersonById":
                $res = $this->dh->queryPersonById($param);
                break;
            case "queryPersonByName":
                $res = $this->dh->queryPersonByName($param);
                break;
            case "queryPersonByDepartment":
                $res = $this->dh->queryPersonByDepartment($param);
                break;
            case "queryPersonByPosition":
                $res = $this->dh->queryPersonByPosition($param);
                break;
            case "queryPersonByAddress":
                $res = $this->dh->queryPersonByAddress($param);
                break;
            case "queryPersonByEmail":
                $res = $this->dh->queryPersonByEmail($param);
                break;
            default:
                $res = null;
                break;
        }
        return $res;
    }
}