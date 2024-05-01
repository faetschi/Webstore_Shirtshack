<?php
include("./models/person.php");
class DataHandler
{
    public function queryPersons() {
        $res =  $this->getDemoData();
        return $res;
    }

    public function queryPersonById($id) {
        $result = array();
        foreach ($this->queryPersons() as $val) {
            if ($val[0]->id == $id) {
                array_push($result, $val);
            }
        }
        return $result;
    }

    public function queryPersonByName($name) {
        $result = array();
        foreach ($this->queryPersons() as $val) {
            if ($val[0]->lastname == $name) {
                $personInfo = array(
                    'firstname' => $val[0]->firstname,
                    'email' => $val[0]->email
                );
                array_push($result, $personInfo);
            }
        }
        return $result;
    }

    public function queryPersonByEmail($email) {
        $result = array();
        foreach ($this->queryPersons() as $val) {
            if ($val[0]->email == $email) {
                $personInfo = array(
                    'firstname' => $val[0]->firstname,
                    'lastname' => $val[0]->lastname,
                );
                array_push($result, $personInfo);
            }
        }
        return $result;
    }

    public function queryPersonByDepartment($department) {
        $result = array();
        foreach ($this->queryPersons() as $val) {
            if ($val[0]->department == $department) {
                $personInfo = array(
                    'firstname' => $val[0]->firstname,
                    'email' => $val[0]->email
                );
                array_push($result, $personInfo);
            }
        }
        return $result;
    }

    public function queryPersonByPosition($position) {
        $result = array();
        foreach ($this->queryPersons() as $val) {
            if ($val[0]->position == $position) {
                $personInfo = array(
                    'firstname' => $val[0]->firstname,
                    'email' => $val[0]->email
                );
                array_push($result, $personInfo);
            }
        }
        return $result;
    }

    public function queryPersonByAddress($address) {
        $result = array();
        foreach ($this->queryPersons() as $val) {
            if ($val[0]->address == $address) {
                $personInfo = array(
                    'firstname' => $val[0]->firstname,
                    'email' => $val[0]->email
                );
                array_push($result, $personInfo);
            }
        }
        return $result;
    }


    private static function getDemoData()
    {
        $demodata = [
            [new Person(1, "Jane", "Doe", "jane.doe@fhtw.at", 1234567, "IT", "Manager", "123 Main St")],
            [new Person(2, "John", "Doe", "john.doe@fhtw.at", 34345654, "Help Desk", "Technician", "456 Elm St")],
            [new Person(3, "baby", "Doe", "baby.doe@fhtw.at", 54545455, "Management", "Director", "789 Oak St")],
            [new Person(4, "Mike", "Smith", "mike.smith@fhtw.at", 343477778, "Faculty", "Professor", "321 Pine St")],
            [new Person(5, "Alice", "Johnson", "alice.johnson@fhtw.at", 9876543, "Student", "Student Assistant", "555 Maple St")],
            [new Person(6, "Bob", "Williams", "bob.williams@fhtw.at", 8765432, "Alumni", "Alumni Relations Officer", "888 Birch St")],
            [new Person(7, "Emily", "Brown", "emily.brown@fhtw.at", 3456789, "Research", "Research Scientist", "999 Cedar St")],
        ];
        return $demodata;
    }

}
