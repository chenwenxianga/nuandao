
// 判断是否登录
if(localStorage.getItem("token")){
    var html = `<span class="dropdown ">
    <button class="btn btn-default dropdown-toggle username" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
    ${localStorage.username}
    </button>
    <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">
      <li><a href="shopping.html">我的购物车</a></li>
      <li><a href="dingdan.html">我的订单</a></li>
      <li><a class= "log" href="#">退出登录</a></li>
    </ul>
  </span>`
    $('#head').html(html)
}
// 退出登录
$('.log').click(function(){
    localStorage.clear();
    location.href = "index.html"
})

// 导航分类
var windowsWidth;
$.get("http://h6.duchengjiu.top/shop/api_cat.php", function (response) {
    for (var i = 0; i < response.data.length - 3; i++) {
        $('#nav').append('<li class="col-md-1"><a href="index.html?cat_id=' + response.data[i].cat_id + '">' + response.data[i].cat_name + '</a></li>')
    }
})
setWidth();
window.onresize = setWidth;

function setWidth() {
    windowsWidth = document.documentElement.clientWidth;
    console.log(1)
    if (windowsWidth >= 640) {
         $('.navli').css("display", "block");
    } else {
         $('.navli').css("display", "none");
    }
}

 $('.glyphicon').click(function () {
     if (windowsWidth < 640) {
         $('.navli').slideToggle();
     }

 })
 // 模糊搜索
 var searchQuery = document.getElementsByClassName("search-query")[0];
 var twoList = document.getElementsByClassName("twolist")[0];

 searchQuery.onfocus = function () {
     twoList.style.display = "block";

 }

 searchQuery.oninput = function () {
     if (searchQuery.value != "") {
         twoList.style.display = "block";
     }
     if (searchQuery.value == "") {
         twoList.style.display = "none";
     }

     $.ajax({
         "url": "http://h6.duchengjiu.top/shop/api_goods.php",
         "type": "get",
         "datatype": "json",
         "data": {
             "search_text": searchQuery.value
         },
         "success": function (response) {
             console.log(response)
             var html = "";
             for (var i = 0; i < response.data.length-1; i++) {
                 html += `<p ><a href="detail.html?good_id=${response.data[i].goods_id}">${response.data[i].goods_name}</a></p>`
             }

             $(".twolist").html(html);
             if (response.message == "商品搜索数据为空") {

                 $(".twolist").html("<p>未搜索到此类商品，请用id搜索<p>");
             }
         }

     })
 }

 searchQuery.onblur = function () {
     if (searchQuery.value == "") {
         twoList.style.display = "none";
     }
 }
 // 商品展示
 var str = location.search.substr(1);
 var catId = str.split("=");
 $.ajax({
     "url": "http://h6.duchengjiu.top/shop/api_goods.php",
     "type": "GET",
     "data": {
         "cat_id": catId[1]
     },
     "dataType": "json",
     "success": function (response) {
         if (response.code === 0) {
             //				console.log(response);
             var html = '';
             for (var i = 0; i < response.data.length-1; i++) {
                 var obj = response.data[i];
                 html += `<div class="col-sm-6 col-md-4">
                    <div class="thumbnail">
                      <img class="sb" src="${obj.goods_thumb}" >
                      <div class="caption">
                        <h5><a href="detail.html?goods_id=${obj.goods_id}">${obj.goods_name}</a></h5>
                        <h6>${obj.goods_desc}</h6>
                        <p>价格：￥${obj.price}</p>
                        <p>
                            <span class="btn btn-primary shop" data=${obj.goods_id}  role="button">加入购物车</span>
                            <span class="addsuc">添加成功</span>
                        </p>
                      </div>
                    </div>
                  </div>`;
             }
             $("#goodsList").html(html);
             //获取第一张图片的宽度
             var w = parseInt($("#goodsList img").eq(0).width());
             //改变所有商品图片的宽度
             $("#goodsList img").css("width", w);
         }

          //商品里的添加按钮
            $('.shop').click(function(ev){
            // 验证是否登录
            if(!localStorage.getItem("token")){
                alert("请先登录！");
                location.href= "logIn.html#callhref="+location.href;
                return;
            }
            var objx = $(ev.target.parentNode).find(".btn").attr("data");
            var addsuc = $(ev.target.parentNode).find(".addsuc");
            console.log(addsuc)
            addsuc.css("display", "block");
            var timer = setTimeout(function(){
                addsuc.css("display", "none");
            },2000)
          
            
            // 传递数据

                $.ajax({
                "url": "http://h6.duchengjiu.top/shop/api_cart.php?token="+ localStorage.token,
                "type": "POST",
                "data": {
                    "goods_id":objx,
                    "number":1  
                },
                "dataType": "json",
                "success":function(response){
                    console.log(response);
                    
                    localStorage.setItem("cart" +catId,1);
                }
            })
})
     }


 })

