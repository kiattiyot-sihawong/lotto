var projectPath = location.origin;
function login(){
	const username = $('#username').val();
	const password = $('#password').val();
	if(username==''||password==''){
		Swal.fire({
			icon: 'error',
			title: 'ข้อมูลว่าง',
			text: 'โปรดกรอกข้อมูลให้ครบ!'
		});
	}else{
		$.ajax({
			method:"POST",
			url:projectPath+"/resource/controller/login.php",
			contentType:"application/x-www-form-urlencoded; charset=utf-8",
			data:{"username":username,"password":password,"func":"login"}
		}
		).done((rs)=>{
			if(rs==0){
				Swal.fire({
					icon: 'error',
					title: 'เกิดข้อผิดพลาด!',
					text: 'usernameหรือรหัสผ่านไม่ตรงกัน!'
				});
			}else if(rs==1){
				location.href = projectPath+'/home';
			}
		});
	}
}

//----------------------------------HOME----------------------------------
$('.digit-group').find('input').each(function(){
	$(this).attr('maxlength', 1);
	$(this).on('keyup', function(e) {
		var parent = $($(this).parent());
		
		if(e.keyCode === 8 || e.keyCode === 37) {
			var prev = parent.find('input#' + $(this).data('previous'));
			
			if(prev.length) {
				$(prev).select();
			}
		} else if((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 65 && e.keyCode <= 90) || (e.keyCode >= 96 && e.keyCode <= 105) || e.keyCode === 39) {
			var next = parent.find('input#' + $(this).data('next'));
			
			if(next.length) {
				$(next).select();
			} 
		}
	});
});

$("#search_btn").click((e)=>{
	let key = "";
	for(let i=0;i<6;i++){
		let thisChar = $("#digit-"+(i+1)).val();
		key+=(String(thisChar)=="")?"a":thisChar;
	}
	$("#lotery_all").load(projectPath+"/home/?s="+key+" #lotery_rows");
});


$(document).on("click", ".open-quan", function () {
	new Promise((resolve,reject)=>{
		let lotto_quan = $(this).data('quantity');
		let lotto_number = $(this).data('number');
		let lotto_img = $(this).data('img');

		$("#lottoly_id").val($(this).data("id"));
		$("#lottoly_number").html('หมายเลข '+lotto_number);
		$("#lottoly_quantity").html('<i class="fas fa-box"></i> คงเหลือ '+lotto_quan+' ใบ');
		$("#lottoly_img").html('<img  class="responsive_img" src="../images/item/'+lotto_img+'"><br><br>');
		$("#quan_select").empty();
		resolve(parseInt(lotto_quan));
	}).then((lotto_quan)=>{
		$("#quan_select").append("<option selected>เลือกจำนวน</option>");
		for(let i=0;i<lotto_quan;i++){
			$("#quan_select").append("<option value='"+(i+1)+"'>"+(i+1)+"</option>");
		}
	})
});

$("#add_to_card_btn").click(()=>{
	let lot_id = $("#lottoly_id").val();
	let lot_quan = $("#quan_select").val();
	if(String(lot_quan)==="เลือกจำนวน"){
		Swal.fire({
			icon: 'warning',
			title: 'โปรดเลือกจำนวน'
		})
	}else{
		$.ajax({
			method:"POST",
			url:projectPath+"/resource/controller/home_controller.php",
			contentType:"application/x-www-form-urlencoded; charset=utf-8",
			data:{"lotId":lot_id,"quan":lot_quan,"func":"toCart"}
		})
		.done((response)=>{
			response = JSON.parse(response);
			switch(String(response.status)){
				case "1":
				Swal.fire({
					icon: 'success',
					title: 'เพิ่มในตระกร้าแล้ว'
				});
				$('#DetailModal').modal('hide');
				$.post(projectPath+"/resource/controller/cart_controller.php","func=cart_count")
				.done((response)=>{
					response = JSON.parse(response);
					$("#cart_count,#cart_count_bottom").html(response.result.quan);
				});
				break;
				case "0":
				Swal.fire({
					icon: 'error',
					title: 'เกิดข้อผิดพลาด!'
				})
				break;
				case "non_login":
				location.href = projectPath;
				break;
			}
		});
	}
});
//----------------------------------HOME(END)----------------------------------
//----------------------------------CART---------------------------------------
function delBucket(lot_id){
	Swal.fire({
		title: 'ต้องการลบ?',
		text: "คุณต้องการลบรายการออกจากตระกร้าหรือไม่!",
		icon: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: 'ใช่'
	}).then((result) => {
		if (result.isConfirmed) {
			$.ajax({
				method:"POST",
				url:projectPath+"/resource/controller/cart_controller.php",
				contentType:"application/x-www-form-urlencoded; charset=utf-8",
				data:{"lotId":lot_id,"func":"del"}
			}).done((response)=>{
				response = JSON.parse(response);
				if(String(response.status)==0){
					Swal.fire({
						title:"เกิดข้อผิดพลาด!",
						icon:"error"
					});
				}else{
					Swal.fire({
						title:"ลบสำเร็จ",
						icon:"success"
					});
					$("#all_body_content").load(location.href+" #in_body_content");

				}
			})

		}
	})
}
function pay_order(){
	Swal.fire({
		title: 'ยืนยันการซื้อสินค้า?',
		text: "คุณต้องการยืนยันการหรือไม่!",
		icon: 'info',
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: 'ใช่'
	}).then((result)=>{
		if(result.isConfirmed){
			$.ajax({
				method:"POST",
				url:projectPath+"/resource/controller/cart_controller.php",
				contentType:"application/x-www-form-urlencoded; charset=utf-8",
				data:{"func":"confirm_cart"}
			}).done((response)=>{
				response = JSON.parse(response);
				if(parseInt(response.status)==1){
					Swal.fire({
						icon:"success",
						title:"ยืนยันการซื้อแล้ว",
						text:"โปรดส่งหลักฐานการโอนเงินภายในเวลา30นาที",
						showDenyButton: false,
						showCancelButton: false,
						confirmButtonText: `ตกลง`
					}).then((result) => {
						if (result.isConfirmed) {
							$.ajax({
								method:"POST",
								url:projectPath+"/resource/controller/purchase_list_controller.php",
								contentType:"application/x-www-form-urlencoded; charset=utf-8",
								data:{"func":"find_max_sale_id"}
							}
							).done((rs)=>{
								$('#max_sale_id').html('<input id="max_sale_id" type="hidden" name="sale_id" value="'+rs+'">');
								$( "#form_max_id" ).submit();
							});
						} 
					});

				}else if(String(response.status)=="out_stock"){
					Swal.fire({
						icon:"warning",
						title:"ยืนยันการซื้อแล้ว",
						text:"สินค้าบางรายหมดโปรดส่งหลักฐานการโอนเงินภายในเวลา30นาที"
					});
					setTimeout(()=>{
						location.reload();
					},1000);
				}else{
					Swal.fire({
						icon:"error",
						title:"เกิดข้อผิดพลาด!",
						text:"เกิดข้อผิดพลาดไม่สราบสาเหตุโปรดลองอีกครั้งในภายหลัง"
					});
				}
			})

		}
	})
}
//----------------------------------CART(END)---------------------------------------
//---------------------------------- ADMIN ---------------------------------------
function loadDataTable(key){
	const link = (key==null)?projectPath+"/admin/index.php #lottery_rows":projectPath+"/admin/?s="+key+" #lottery_rows";
	$("#lottery_all").load(link);
	setTimeout(()=>{
		$("#lottery_rows").DataTable({
			"scrollY":"500px",
			"scrollX":true,
			"scrollCollapse":true,
			"paging":false,
			"bDestroy":true,
			"bLengthChange": false,
			"bFilter": false,
			"ordering": false,
			"bInfo": false
		});
	},500)
}
function login_admin(){
	const username = $('#username').val();
	const password = $('#password').val();
	if(username==''||password==''){
		Swal.fire({
			icon: 'error',
			title: 'ข้อมูลว่าง',
			text: 'โปรดกรอกข้อมูลให้ครบ!'
		});
	}else{
		$.ajax({
			method:"POST",
			url:projectPath+"/resource/controller/admin_controller.php",
			contentType:"application/x-www-form-urlencoded; charset=utf-8",
			data:{"username":username,"password":password,"func":"login_admin"}
		}
		).done((rs)=>{
			if(rs==0){
				Swal.fire({
					icon: 'error',
					title: 'เกิดข้อผิดพลาด!',
					text: 'usernameหรือรหัสผ่านไม่ตรงกัน!'
				});
			}else if(rs==1){
				location.href = projectPath+'/admin/';
			}
		});
	}
}

$("#search_admin_btn").click((e)=>{
	let key = "";
	for(let i=0;i<6;i++){
		let thisChar = $("#digit-"+(i+1)).val();
		key+=(String(thisChar)=="")?"a":thisChar;
	}
	//----@admin.page--------------
	loadDataTable(key);
});

function switchModal(type,data){
	switch(String(type)){
		case "add" :
		$("#btn_add_lotto,#img_lotto_g").show();
		$("#btn_edit_lotto,#edit_img_check").hide();
		$("#id_lotto,#number_lotto,#stock_lotto,#price_lotto,#date_lotto").val(data.id);
		break;
		case "edit":
		$("#btn_add_lotto,#img_lotto_g").hide();
		$("#btn_edit_lotto,#edit_img_check").show();

		$("#id_lotto").val(data.id);
		$("#number_lotto").val(data.number);
		$("#stock_lotto").val(data.stock);
		$("#price_lotto").val(data.price);
		$("#date_lotto").val(data.date);
		$("#descript_lotto").val(data.descript);
		document.getElementById("status_lotto").selectedIndex = (parseInt(data.status)==1)?0:1;
		break;
	}
}

var editImgLottery = false;

$("#edit_img_check").click((e)=>{
	$("#img_lotto_g").toggle();
	editImgLottery = (editImgLottery)?false:true;
});

$("#btn_edit_lotto").click((e)=>{
	let form = new FormData();
	new Promise((resolve,reject)=>{
		if(editImgLottery){
			form.append("img",$("#img_lotto").prop("files")[0]);
		}
		form.append("id",$("#id_lotto").val());
		form.append("number",$("#number_lotto").val());
		form.append("stock",$("#stock_lotto").val());
		form.append("price",$("#price_lotto").val());
		form.append("date",$("#date_lotto").val());
		form.append("status",$("#status_lotto").val());
		form.append("descript",$("#descript_lotto").val());
		form.append("func","edit_lottery");
		resolve(form);
	})
	.then((form)=>{
		let nullVal;
		form.forEach((val)=>{
			if(val=="undefined"||val==""){
				nullVal = true;
			}
		});
		return(nullVal);
	})
	.then((nullVal)=>{
		if(nullVal){
			Swal.fire({
				icon:"warning",
				title:"ข้อมูลไม่ครบ!",
				text:"โปรดกรอกข้อมูลให้ครบถ้วน"
			});
		}else if(!nullVal){
			$.ajax({
				method:'POST',
				url:projectPath+"/resource/controller/admin_controller.php",
				contentType:false,
				processData:false,
				data:form
			}).done((rs)=>{
				if(String(rs)==="non_type"){
					Swal.fire({
						icon:"error",
						title:"ประเภทรูปภาพไม่ถูกต้อง!",
						text:"โปรดเลือกไฟล์รูปภาพเท่านั้น"
					});
				}else if(parseInt(rs)==1){
					loadDataTable(null);
					Swal.fire({
						icon:"success",
						title:"สำเร็จ!",
						text:"แก้ไขสินค้าสำเร็จ"
					});
				}else if(String(rs)==="non_login"){
					location.href = projectPath+"/admin/login_admin.php";
				}else if(String(rs)==="had_sales"){
					Swal.fire({
						icon:"warning",
						title:"สินค้าถูกขาย",
						text:"สินค้าชิ้นนี้มีผู้ซื้อแล้วไม่สามารถแก้ไขได้!"
					});
				}
			});
		}
	})
});

$("#btn_add_lotto").click((e)=>{

	let form = new FormData();
	new Promise((resolve,reject)=>{
		form.append("img",$("#img_lotto").prop("files")[0]);
		form.append("number",$("#number_lotto").val());
		form.append("stock",$("#stock_lotto").val());
		form.append("price",$("#price_lotto").val());
		form.append("date",$("#date_lotto").val());
		form.append("status",$("#status_lotto").val());
		form.append("descript",$("#descript_lotto").val());
		resolve(form);
	})
	.then((form)=>{
		let nullVal;
		form.forEach((val)=>{
			if(val=="undefined"||val==""){
				nullVal = true;
			}
		});
		return(nullVal);
	})
	.then((nullVal)=>{
		if(nullVal){
			Swal.fire({
				icon:"warning",
				title:"ข้อมูลไม่ครบ!",
				text:"โปรดกรอกข้อมูลให้ครบถ้วน"
			});
		}else if(!nullVal){

			$.ajax({
				method:'POST',
				url:projectPath+"/resource/controller/admin_controller.php",
				contentType:false,
				processData:false,
				data:form
			}).done((rs)=>{
				console.log("rs > "+rs);
				if(String(rs)==="non_type"){
					Swal.fire({
						icon:"error",
						title:"ประเภทรูปภาพไม่ถูกต้อง!",
						text:"โปรดเลือกไฟล์รูปภาพเท่านั้น"
					});
				}else if(parseInt(rs)==1){
					$("#img_lotto").val(null);
					$("#number_lotto").val("");
					$("#stock_lotto").val("");
					$("#descript_lotto").val("");
					loadDataTable(null);
					Swal.fire({
						icon:"success",
						title:"สำเร็จ!",
						text:"เพิ่มสินค้าแล้ว"
					});
				}else if(String(rs)==="non_login"){
					location.href = projectPath+"/admin/login_admin.php";
				}
			});
		}
	})
});

function edit_date_option(){
	const startDate = String($("#start_date").val());
	const endDate = String($("#end_date").val());
	if(startDate===""||endDate===""){
		Swal.fire({
			icon:"warning",
			title:"ข้อมูลไม่ครบ!",
			text:"โปรดกรอกข้อมูลให้ครบถ้วน"
		});
	}else{
		$.ajax({
			method:"POST",
			url:projectPath+"/resource/controller/admin_controller.php",
			contentType:"application/x-www-form-urlencoded; charset=utf-8",
			data:{"startDate":startDate,"endDate":endDate,"func":"updateDate"}
		})
		.done((response)=>{
			response = parseInt(response);
			if(response===1){
				Swal.fire({
					icon:"success",
					title:"สำเร็จ!",
					text:"อัพเดทงวดที่เปิดขายแล้ว"
				});
				loadDataTable(null);
			}else if(String(rs)==="non_login"){
				location.href = projectPath+"/admin/login_admin.php";
			}
			else if(String(rs)==="had_sales"){
				Swal.fire({
					icon:"warning",
					title:"สินค้าถูกขาย",
					text:"สินค้าชิ้นนี้มีผู้ซื้อแล้วไม่สามารถแก้ไขได้!"
				});
			}else{
				Swal.fire({
					icon: 'error',
					title: 'เกิดข้อผิดพลาด!',
					text: 'เกิดข้อผิดพลาดไม่ทราบสาเหตุโปรดลองอีกครั้งภายหลัง!'
				});
			}
		})
	}
}

function del_lottery(lotteryId){
	Swal.fire({
		title: 'ลบสินค้า?',
		text: "คุณต้องการลบสินค้านี้หรือไม่!",
		icon: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: 'ยืนยัน'
	}).then((result) => {
		if (result.isConfirmed) {
			$.ajax({
				method:"POST",
				url:projectPath+"/resource/controller/admin_controller.php",
				contentType:"application/x-www-form-urlencoded; charset=utf-8",
				data:{"id":lotteryId,"func":"delLottery"}
			})
			.done((response)=>{
				if(String(response)==="non_login"){
					location.href = projectPath+"/admin/login_admin.php";
				}else if(parseInt(response)===1){
					loadDataTable(null);
					Swal.fire({
						icon:"success",
						title:"สำเร็จ!",
						text:"ลบสินค้าแล้ว"
					});
				}else if(String(response)==="had_sales"){
					Swal.fire({
						icon:"warning",
						title:"สินค้าถูกขาย",
						text:"สินค้าชิ้นนี้มีผู้ซื้อแล้ว!"
					});
				}
			});
		}
	})
}
//---------------------------------- ADMIN(End) ---------------------------------------
//---------------------------------- SALES_REPORT -------------------------------------
function loadDatableSales(){
	$("#sales_all").load(projectPath+"/admin/sales_report/index.php #sales_rows");
	setTimeout(()=>{
		$(".table").DataTable({
			"scrollY":"500px",
			"scrollX":true,
			"scrollCollapse":true,
			"paging":false,
			"bDestroy":true,
			"bLengthChange": false,
			"bFilter": false,
			"ordering": false,
			"bInfo": false
		});
	},500);
}

function switchSalesTb(tbNum){
	let color = "primary";
	if(parseInt(tbNum)===0){
		$("#btn_sw_not_con").attr("class","btn btn-"+color+" float-right");
		$("#btn_sw_con").attr("class","btn btn-outline-"+color+" float-left");
		$("#non_confirm_tb").show();
		$("#confirm_tb").hide();
	}else if(parseInt(tbNum)===1){
		$("#btn_sw_not_con").attr("class","btn btn-outline-"+color+" float-right");
		$("#btn_sw_con").attr("class","btn btn-"+color+" float-left");
		$("#non_confirm_tb").hide();
		$("#confirm_tb").show();
	}
}

function openSalesReportModal(id,sumPrice,imgCofirm,type){
	(parseInt(type)===1)?$("#sale_btn_confirm").hide():$("#sale_btn_confirm").show();
	$("#sales_title_id").html('<i class="fas fa-file-invoice-dollar"></i> รายการขายหมายเลข ['+id+']');
	$("#sale_btn_confirm").attr("onClick","confirmSale("+id+")");
	$.ajax({
		method:"POST",
		url:projectPath+"/resource/controller/sales_report_controller.php",
		contentType:"application/x-www-form-urlencoded; charset=utf-8",
		data:{"sales_id":id,"func":"getSalesDet"}
	}).done((response)=>{
		response = JSON.parse(response);
		$("#bill_content,#bill_content_img").empty();
		response.forEach((item,i)=>{
			$("#bill_content").append("<tr>"+
				"<td style='border:none;'>"+item.number+"</td>"+
				"<td style='float:right;border:none;'>x"+item.quan+" ใบ</td>"+
				"</tr>");
			if(i===(response.length-1)){
				$("#bill_content").append("<tr style='font-size:18px;'>"+
					"<td style='border:none;'>ราคารวม</td>"+
					"<td style='float:right;border:none;'>"+sumPrice+"บาท</td>"+
					"</tr>");
				let img = new Image(200,200);
				img.src = (String(imgCofirm)==="no_confirm")?projectPath+"/images/slip/non_confirm.jpg"
				:projectPath+"/images/slip/"+imgCofirm;
				$("#bill_content_img").append(img);
			}
		});
	});
}
function confirmSale(id){
	Swal.fire({
		title: 'ยืนยันรายการซื้อ?',
		text: "คุณต้องการยืนยันรายการซื้อหรือไม่!",
		icon: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: 'ใช่'
	}).then((result) => {
		if (result.isConfirmed) {
			$.ajax({
				method:"POST",
				url:projectPath+"/resource/controller/sales_report_controller.php",
				contentType:"application/x-www-form-urlencoded; charset=utf-8",
				data:{"sales_id":id,"func":"confirmSale"}
			}).done((response)=>{
				if(parseInt(response)===1){
					Swal.fire({
						icon:"success",
						title:"สำเร็จ",
						text:"ยืนยันใบเสร็จนี้แล้ว!"
					});
					$("#sales_modal").modal("hide");
					loadDatableSales();
				}else{
					Swal.fire({
						icon:"error",
						title:"เกิดข้อผิดพลาด!",
						text:"เกิดข้อผิดพลาดไม่สราบสาเหตุโปรดลองอีกครั้งในภายหลัง"
					});
				}
			});
		}
	});
}
//---------------------------------- SALES_REPORT(End)---------------------------------

// START function pay cash from admin/index--------------------------------------------------
function payCash(){
	let lot_id = $("#lottoly_id").val();
	let lot_quan = $("#quan_select").val();
//console.log("lot_id = "+lot_id+",lot_quan="+lot_quan);
	if(lot_quan == "เลือกจำนวน"){
		
		Swal.fire({
			icon:"error",
			title:"เกิดข้อผิดพลาด!",
			text:"กรุณาเลือกจำนวนที่ต้องการขาย"
		});
	}else{
	//console.log("lot_id = "+lot_id+",lot_quan="+lot_quan);
	Swal.fire({
		title: 'ยืนยันการขาย?',
		text: "คุณต้องการขายรายการนี้หรือไม่!",
		icon: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: 'ใช่'
	}).then((result) => {
		if (result.isConfirmed) {
			$.ajax({
				method:"POST",
				url:projectPath+"/resource/controller/purchase_list_controller.php",
				contentType:"application/x-www-form-urlencoded; charset=utf-8",
				data:{"lot_id":lot_id,"lot_quantity":lot_quan,"func":"payCash"}
			}).done((response)=>{
				//console.log("rs > "+response);
				if(parseInt(response) == 1){
					Swal.fire({
						icon:"success",
						title:"สำเร็จ",
						text:"ขายเรียบร้อยแล้ว!"
					});
					loadDataTable(null);
				}else{
					Swal.fire({
						icon:"error",
						title:"เกิดข้อผิดพลาด!",
						text:"เกิดข้อผิดพลาดไม่สราบสาเหตุโปรดลองอีกครั้งในภายหลัง"
					});
				}
			});
		}
	});
}

}
// END function pay cash from admin/index--------------------------------------------------