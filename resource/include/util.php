<?php 
    class Util{

        public static function intToThai($number){
            $arr = str_split((String)$number);
            $newString = "";
            foreach($arr as $num){
                $newString .= self::intToChar($num)."  ";
            }
            return $newString;
        }

        public function intToChar($num){
            $newString = "";
            switch(intval($num)){
                case 0 :
                     $newString = "ศูนย์";
                     break;
                 case 1 :
                     $newString = "หนึ่ง";
                     break;
                 case 2 :
                     $newString = "สอง";
                     break;
                 case 3 :
                     $newString = "สาม";
                     break;
                 case 4 :
                     $newString = "สี่";
                     break;
                case 5 :
                    $newString = "ห้า";
                    break; 
                case 6 :
                    $newString = "หก";
                    break; 
                case 7 :
                    $newString = "เจ็ด";
                    break;    
                case 8 :
                    $newString = "แปด";
                    break;                      
                case 9 :
                    $newString = "เก้า";
                    break;             
            }
            return $newString;
        }

        public static function randomPassword() {
            $alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
            $pass = array(); //remember to declare $pass as an array
            $alphaLength = strlen($alphabet) - 1; //put the length -1 in cache
            for ($i = 0; $i < 8; $i++) {
                $n = rand(0, $alphaLength);
                $pass[] = $alphabet[$n];
            }
            return implode($pass); //turn the array into a string
        }
    }
?>