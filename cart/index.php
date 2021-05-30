<?php 
include(__DIR__."/../resource/controller/cart_controller.php");
$getData = new GetData();
$cart = $getData->cart();
include(__DIR__.'/../resource/include/script.html');
include(__DIR__.'/../resource/include/menu.php');
?>
<!DOCTYPE html>
<html>
<head>
	<style type="text/css">
	.total {
		overflow: hidden;
		background-color: #f8f9fa!important;
		position: fixed;
		bottom: 0;
		width: 100%;

	}
	.total a {
		float: left;
		display: block;
		color: black;
		text-align: center;
		padding: 14px 16px;
		text-decoration: none;
		font-size: 17px;
	}
</style>

<title>ตระกร้าสินค้า</title>
</head>
<body>
	<br><br><br>
	<div class="container" style="text-align: center">
		<a href="/home/" class="btn btn-outline-info" style="width: 100%;text-align: left"><i class="fas fa-arrow-left"></i> ย้อนกลับ</a>
		<br>
		<br>
		<form action="/payment/" id="form_max_id" method="post">
			<input id="max_sale_id" type="hidden" name="sale_id" value="">
		</form>
		<div class="alert alert-info text-dark" style="width:100%">
			<div class="alert-body">
				<h2><i class="fas fa-shopping-basket"></i> ตะกร้าของฉัน</h2>
				
			</div>
		</div>
		<div id="lottery_list" style="margin-bottom: 30% ; margin-top: 15px">
			<div id="lottery_list_in">
				<?php 
				if(is_null($cart)){?>
					<h1 style="margin:auto;width:50%;">ไม่มีสินค้า</h1>
				<?php }else{ 
					while(($row=$cart->fetch_array())!=Null){
						?>
						<div class="shadow-sm p-3 mb-1 bg-body rounded" style="width:100% ; text-align: left">
							<div class="alert-body">
								<div class="row">
									<div class="col-8" style="text-align: center">
										<h5>หมายเลข <?php echo $row["number"]; ?></h5>
										<img  class="responsive_img" src="../images/item/<?php echo $row["img"]; ?>">

									</div>
									<div class="col-4">
										<label> <?php echo $row["price"]; ?> ฿</label>
										<br>
										<label>จำนวน  <?php echo $row["quan"]; ?> ใบ</label>
										<button class="btn btn-outline-danger" style="width: 100%" onclick='delBucket(<?php echo $row["lottery_id"]; ?>)'>ลบ</button>
									</div>

								</div>
							</div>
						</div>
					<?php } 
				}?>	   
			</div>	  
		</div>
	</div>
</div>
<?php 
if(!is_null($cart)){
	?>
	<div class="total">
		<div class="row" style="padding: 10px">
			<div class="col-8">
				<p class="text text-dark" style="width:50%;margin:auto;margin-top: 15px; font-size: 20px;">ทั้งหมด <b><?php echo $getData->totalOncart()["total"]; ?>฿</b> </p>
				<p  class="text text-dark" style="width:50%;margin:auto;margin-top: 0px; font-size: 10px;">ค่าธรรมเนียมใบละ 20฿</p>
			</div>
			<div class="col-4" style="">
				<a class="btn btn-info text-light" id="pay_order">ชำระเงิน</a>
			</div>
		</div>
	</div>
<?php } ?>
<script src='../resource/script.js'></script>
<?php 
	include(__DIR__.'/../resource/include/footer_menu.php');
?>
</body>
</html>