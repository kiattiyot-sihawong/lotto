<?php 
session_start();
include(__DIR__."/../database/db_config.php");
class GetData{
    function __construct(){
        if(!isset($_SESSION["loginStatus"])){
            header("location:".$_SERVER["REQUEST_SCHEME"]."://".$_SERVER["SERVER_NAME"]);
        }
    }
    public static function purchase_list(){
        try{
           if(isset($_SESSION["loginStatus"])){
            $conn = DB::getConnect();
            $sql="SELECT sales.id ,\n".
            "sales.`status`,\n".
            "sales_det.lottery_id,\n".
            "sales_det.price as price,\n".
            "SUM(sales_det.quan) as quan ,\n".
            "`user`.USER_NAME, \n".
            "`user`.USER_LASTNAME, \n".
            "DATE_FORMAT(sales.reg_date,\"%d-%m-%Y\") as date, \n".
            "DATE_FORMAT(lottery.date,\"%d-%m-%Y\") as lot_date,\n".
            "TIME(sales.reg_date) as time ,\n".
            "lottery.number ,\n".
            "lottery.img,\n".
            "img_confirm.img,\n".
            "IFNULL(img_confirm.img ,\"0\") as slip\n".
            "FROM sales LEFT JOIN sales_det ON sales_det.sale_id = sales.id \n".
            "LEFT JOIN lottery ON sales_det.lottery_id = lottery.id\n".
            "LEFT JOIN user ON sales.user_id = user.USER_ID\n".
            "LEFT JOIN img_confirm ON img_confirm.sale_id = sales.id  \n".
            "AND sales.id = img_confirm.sale_id\n".
            "WHERE user.USER_ID = ".$_SESSION['userData']['USER_ID']." \n".
            "GROUP BY sales.id\n".
            "ORDER BY sales.id DESC";

            $result = $conn->query($sql);
            return (($conn->affected_rows)<=0)?Null:$result;
        }else{
            echo "non_login";
        }
    }catch(Exception $e){
        echo $e->getMessage();
    }
}

public static function payment_list($sale_id){
    try{
        if(isset($_SESSION["loginStatus"])){
            $conn = DB::getConnect();
            $sql = "SELECT sales.id as s_id , \n".
            "SUM(sales_det.price) as price ,\n".
            "SUM(sales_det.quan) as quan , \n".
            "DATE(sales.reg_date) as date,\n".
            "img_confirm.img as slip_img , ".
            "TIME_FORMAT(sales.reg_date,'%H:%i') as time ,\n".
            "ADDTIME(TIME_FORMAT(sales.reg_date,'%H:%i'), '0:30:0') as deadline,\n".
            "img_confirm.img , \n".
            "sales.`status`\n".
            "FROM sales , sales_det , img_confirm\n".
            "WHERE sales.id=".$sale_id."\n".
            "AND sales.id = sales_det.sale_id\n".
            "AND sales.id = img_confirm.sale_id";

            $result = $conn->query($sql);
            return (($conn->affected_rows)<=0)?Null:$result;

        }else{
            echo "non_login";
        }
    }catch(Exception $e){
        echo $e->getMessage();
    }
}

public static function lottery_set_by_sale_id($sale_id){
    try{
        $conn = DB::getConnect();
        $sql = "SELECT sales.id , \n".
        "lottery.number , sales_det.quan\n".
        "FROM \n".
        "sales\n".
        "LEFT JOIN sales_det ON sales.id = sales_det.sale_id\n".
        "LEFT JOIN lottery ON sales_det.lottery_id = lottery.id\n".
        "WHERE sales.id = ".$sale_id;

        $result = $conn->query($sql);
        return (($conn->affected_rows)<=0)?Null:$result;
    }catch(Exception $e){
        echo $e->getMessage();
    }
}
public static function find_max_sale_id(){
    try{
        if(isset($_SESSION["loginStatus"])){
            $conn = DB::getConnect();
            $sql = "SELECT MAX(sales.id) as max_id FROM sales";

            $result = $conn->query($sql);
            $max_id = $result->fetch_array();
            echo $max_id['max_id'];
        }else{
            echo "non_login";
        }
    }catch(Exception $e){
        echo $e->getMessage();
    }
}
public function getPageName(){
    $this->pageName = "purchase";
    return $this->pageName;
}

public static function bank_account(){
    //ดึงข้อมูลบัญชีธนาคารมาโชว์ในหน้าอัปโหลดสลิป
    try{
        if(isset($_SESSION["loginStatus"])){
            $conn = DB::getConnect();
            $sql = "SELECT bank_account.id , \n".
            "bank_account.bank_type , \n".
            "bank_account.bank_account_id,\n".
            "bank_account.bank_account_name,\n".
            "bank_account.status , \n".
            "bank.id as bank_id,\n".
            "bank.name ,\n".
            "bank.img \n".
            "FROM bank_account , bank \n".
            "WHERE  bank.id = bank_account.bank_id AND bank_account.`status`=1;";

            $result = $conn->query($sql);
            return (($conn->affected_rows)<=0)?Null:$result;
        }else{
            echo "non_login";
        }
    }catch(Exception $e){
        echo $e->getMessage();
    }
}
}

class ExeData{
    public function add_slip(){
        try {
            if(isset($_SESSION["loginStatus"])){
                $conn = DB::getConnect();
                $sales_id  = htmlentities($conn->escape_string($_POST['sale_id'])); 
                $sql = "SELECT *,TIMESTAMPDIFF(MINUTE,reg_date,CURRENT_TIMESTAMP) as 'use_time'\n".
                "FROM sales\n".
                "WHERE id =".$sales_id;
                $salesData = $conn->query($sql)->fetch_array();
                if(intval($salesData["use_time"])>=30){
                    $this->del_order($sales_id);
                    echo "time_out";
                }else if(intval($salesData["use_time"])<30){
                    if($_FILES['img']['error']==0){
                        if($_FILES['img']['type']!='image/jpeg' && $_FILES['img']['type']!='image/png'){
                            echo 'file_not_jpg';
                        }else{
                            $img = $_FILES['img'];
                            $folder = 'slip';
                            $imgName = 'SLIP'.date("d_m_Y")."SID".$sales_id.'.'.explode(".",$img["name"])[(sizeof(explode(".",$img["name"])))-1];;
                            $imgOnServer = __DIR__."/../../images/slip/".$imgName;
                            if(move_uploaded_file($img["tmp_name"],$imgOnServer)){
                                $sql = "UPDATE `img_confirm` SET `img` = '".$imgName."', `date_upload` = '".$_POST['date_upload']."', `time_upload` = '"
                                .$_POST['time_upload']."', `bank_upload` = '".$_POST['bank']."' WHERE `sale_id` = ".$sales_id;
                                $result = $conn->query($sql);
                                echo ($result)?"ok":"0";

                            }
                        }
                    }else{
                        echo 'upload error!';
                    }
                } 
            }else{
                echo "non_login";
            }
        } catch (Exception $e) {
            echo "error-->".$e->getMessage();
        }
    }

    function del_order($sale_id){
        try{
            if(isset($_SESSION["loginStatus"])){
                $conn = DB::getConnect();
                $sale_id  = htmlentities($conn->escape_string($sale_id)); 
                $sql_del_img = "DELETE FROM `img_confirm` WHERE `sale_id` = ".$sale_id;
                $sql_sale = "DELETE FROM `sales` WHERE `id` = ".$sale_id;
                $conn->query($sql_del_img);
                return ( $conn->query($sql_sale))?1:0;
            }else{
                return 'non login';
            }
        }catch(Exception $e){
            return "error -->".$e->getMessage();
        }
    }

    function payCash(){
        try{
            if(isset($_SESSION["adminLoginStatus"])){
                $lot_id = $_POST['lot_id'];
                $lot_quantity = $_POST['lot_quantity'];
                $conn = DB::getConnect();
                $sql="UPDATE `lottery` SET  lottery.stock = lottery.stock-".$lot_quantity.
                " WHERE `lottery`.`id` = ".$lot_id;
                $result = $conn->query($sql);
                if($result){
                    echo 1;
                }else{

                    echo 0;
                }
            }else{
                return 'non login';
            }
        }catch(Exception $e){
            return "error -->".$e->getMessage();
        }
    }
}

if(isset($_POST["func"])){
 if($_POST["func"]== "add_slip"){
    $exeData = new ExeData();
    $exeData->add_slip();
}else  if($_POST["func"]== "del_order"){
    $exeData = new ExeData();
    $exeData->del_order($_POST['sale_id']);
}else  if($_POST["func"]== "find_max_sale_id"){
    $getData = new GetData();
    $getData->find_max_sale_id();
}else  if($_POST["func"]== "payCash"){
    $exeData = new ExeData();
    $exeData->payCash();
}
}
?>