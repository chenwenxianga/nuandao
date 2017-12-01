
// 判断是否登录
if(localStorage.getItem("token")){
    var html = `<span class="dropdown ">
    <button class="btn btn-default dropdown-toggle userName" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
    ${localStorage.username}
    </button>
    <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">
      <li><a href="shopping.html">我的购物车</a></li>
      <li><a href="#">我的订单</a></li>
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
var catId = location.search.substr(1).split("=");
$.ajax({
    "url": "http://h6.duchengjiu.top/shop/api_goods.php",
    "type": "GET",
    "data": {
        "goods_id":decodeURI(catId[1])
    },
    "dataType": "json",
    "success":function(response){
        // console.log(response)
        var html = `<div class="container">
                        <div class="row">
                            <div class="col-md-4 pic ">
                                <div id="normal">
                                    <img class="imgs"src="${response.data[0].goods_thumb}" alt="">
                                    <span id="lay"></span>
                                    
                                </div>
                            </div>
                            <div class="col-md-4 col-md-offset-2 script">
                                <p class="name">${response.data[0].goods_name}</p>
                                <p>${response.data[0].goods_desc}</p>
                                <b >${response.data[0].price}</b>
                                <p><a class="shopping" href="#" >加入购物车</a><p>
                            </div>
                        </div>
                    </div>`
        $('section').html(html);
        $('.shopping').click(function(){
            // 验证是否登录
            if(!localStorage.getItem("token")){
                alert("请先登录！");
                location.href= "logIn.html#callhref="+location.href;
                return;
            }
           
            // 传递数据
            var goods_Num = localStorage.getItem(catId);
            goods_Num = goods_Num?parseInt(goods_Num)+1:1;
        
                $.ajax({
                "url": "http://h6.duchengjiu.top/shop/api_cart.php?token="+ localStorage.token,
                "type": "POST",
                "data": {
                    "goods_id":catId[1],
                    "number":goods_Num  
                },
                "dataType": "json",
                "success":function(response){
                    console.log(response);

                    localStorage.setItem("cart" +catId ,goods_Num );
                    location.href="shopping.html";
                }
            })
        })
        IsPhone();
        var normal = document.getElementById("normal");
        var lay = document.getElementById("lay");
        var img = normal.getElementsByTagName("img")[0];
        window.onresize = function(){
            
            if(IsPhone()==true){                  
                return;
            }
        }
        
        normal.onmousemove = function( ev ){
            var ev = ev || event;
            var scale = 4; //图片的放缩比例 
            //将鼠标放到放大镜的中间 
            var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
            var scrollLeft = document.body.scrollLeft || document.documentElement.scrollLeft;

            var x = event.clientX - (getAllLeft(normal) - scrollLeft) -parseFloat(lay.style.width)/2;
            var y = event.clientY - (getAllTop(normal) - scrollTop  ) -parseFloat(lay.style.height)/2;
            // 设置图片放大尺寸
            img.style.width = normal.offsetWidth * scale + "px";
            img.style.height = normal.offsetHeight * scale + "px";
            // 设置放大镜尺寸
            lay.style.width = parseInt( normal.offsetWidth / scale ) + "px";
            lay.style.height = parseInt( normal.offsetHeight / scale ) + "px";
            // 放大镜移动
            lay.style.left = x + "px";
            lay.style.top = y + "px";
            
            // //设置超出边界问题
				if( x<0 ){
					x = 0; //左边界的判断，当超出时将x置为0; 
				}
				if( x>=normal.offsetWidth - lay.offsetWidth ){
					x = normal.offsetWidth - lay.offsetWidth; //右边界的判断，当超出时将x置为Box的宽度减去放大镜的宽度; 
				}
				if( y<0 ){
					y = 0; //上边界的判断，当超出时将y置为0;
				}
				if( y>= normal.offsetHeight - lay.offsetHeight ){
					y = normal.offsetHeight - lay.offsetHeight;  //下边界的判断，当超出时将y置为Box的高度减去放大镜的高度;
				}
            // 缩放
            var left = scale * x;
            var top = scale * y;
            img.style.left = -left + "px";
            img.style.top = -top + "px";

            
        }
        function getAllTop(obj){
            //累加器，累加器的初始值不是0，而是自己现在的offsetTop
            //一会儿while语句直接从他父级开始
            var allTop = obj.offsetTop;

            //当前正算高度的元素
            var currentObj = obj;
            while( currentObj = currentObj.offsetParent){
                allTop += currentObj.offsetTop;
            }

            return allTop;
        }

        function getAllLeft(obj){
            //累加器，累加器的初始值不是0，而是自己现在的offsetLeft
            //一会儿while语句直接从他父级开始
            var allLeft = obj.offsetLeft;

            //当前正算高度的元素
            var currentObj = obj;
            while( currentObj = currentObj.offsetParent){
                allLeft += currentObj.offsetLeft;
            }

            return allLeft;
        }
        normal.onmouseout = function(){
            img.style.width = '400px';
            img.style.height = '300px';
            img.style.top = 0;
            img.style.left = 0;
            
            
        }

    }
})

// 判断登录来源
function IsPhone() {
    var windowWidth = document.documentElement.clientWidth;
    if(windowWidth<450){
        normal.style.width = '100%';
        console.log(1)
    }
    var userAgentInfo = navigator.userAgent;
    var Agents = ["Android", "iPhone",
                "SymbianOS", "Windows Phone",
                "iPad", "iPod"];
    var flag = false;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = true;
            break;
        }
    }
    return flag;
}





