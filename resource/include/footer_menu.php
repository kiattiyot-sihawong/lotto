<br><br><br>
<nav class="nav-menu-bottom">
  <a href="/home/" id="home_btn_a" class="nav__link">
        <i class="fas fa-store"></i>
      <span class="nav__text">ซื้อล็อตเตอรี</span>
  </a>
  <a href="/cart/" id="cart_btn_a" class="nav__link">
        <p class="badge badge-pill badge-danger" id="cart_count_bottom" style="position:absolute;top:2;left:45%;font-size:15px;">0</p>
        <i class="fas fa-shopping-cart"></i>
      <span class="nav__text">ตระกร้าสินค้า</span>
  </a>
  <a href="/purchase_list/" id="purchase_btn_a" class="nav__link nav__link">
        <i class="fab fa-bitcoin"></i>
      <span class="nav__text">การสั่งซื้อ</span>
  </a>
  <a href="/profile/" id="profile_btn_a" class="nav__link">
         <i class="fas fa-user"></i>
      <span class="nav__text">โปรไฟล์</span>
  </a>
</nav>
<style>
@media (min-width:762px) {
    .nav-menu-bottom {
        display:none;
    }
}
@media (max-width:762px) {
    .nav-menu-bottom {
        display:block;
        position: fixed;
        bottom: 0;
        width: 100%;
        height: 55px;
        box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);
        background-color: #ffffff;
        display: flex;
        overflow-x: auto;
        z-index:5000;
    }
}
.nav__link {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-grow: 1;
    min-width: 50px;
    overflow: hidden;
    white-space: nowrap;
    font-family: sans-serif;
    font-size: 13px;
    color: #444444;
    text-decoration: none;
    -webkit-tap-highlight-color: transparent;
    transition: background-color 0.1s ease-in-out;
}

.nav__link:hover {
    background-color: #eeeeee;
}

.nav__link--active {
    color: white;
    background:#FF81BA;
    /* background:#0086b3; */
    border-radius:15px 15px 0px 0px;
    box-shadow:2px 10px 10px 5px #aaaaaa;
}

.nav__icon {
    font-size: 18px;
}

</style>
<script>

    window.onload =()=>{
        coutBucket();
        makeBottomMenu();
    }

    function coutBucket(){
        $.ajax({
			method:"POST",
			url:projectPath+"/resource/controller/cart_controller.php",
			contentType:"application/x-www-form-urlencoded; charset=utf-8",
			data:{"func":"cart_count"}
        })
        .done((response)=>{
        response = JSON.parse(response);
        if(parseInt(response.status)==1){
            $("#cart_count,#cart_count_bottom").html(response.result.quan);
        }
        });
    }

    function makeBottomMenu(){
        let thisPage = "<?php echo $getData->getPageName(); ?>";
        switch(String(thisPage)){
            case "home" :
                $("#home_btn_a").addClass("nav__link--active");
                break;
            case "cart":
                $("#cart_btn_a").addClass("nav__link--active");
                break;
            case "purchase":
                $("#purchase_btn_a").addClass("nav__link--active");
                break;
            case "profile":
                $("#profile_btn_a").addClass("nav__link--active");
                break;
        }
    }
   $("a").click((e)=>{
        Swal.fire({title:'โปรดรอซักครู่...',background:"#D2D2D2"});
        Swal.showLoading();
   });
</script>