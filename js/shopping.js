
// 判断是否登录
if(localStorage.getItem("token")){
    var html = `<span class="dropdown ">
    <button class="btn btn-default dropdown-toggle username" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
    ${localStorage.username}
    </button>
    <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">
      <li><a href="shopping.html">我的购物车</a></li>
      <li><a href="dingdan.html">我的订单</a></li>
      <li><a class= "log" href="">退出登录</a></li>
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

$.ajax({
    "url": "http://h6.duchengjiu.top/shop/api_cart.php?token="+localStorage.getItem("token"),
    "type": "get",
    "dataType": "json",
    "success": function(response){
        console.log(response)
		var html = "";
		if(response.code  != 0){
			html = `<div class="empty">
						<img src="img/empty.png" alt="">
						<p>要不要买了些东西再回来看看，肯定会有些不一样</p>
					</div>`
		}else{
			for(var i=0;i<response.data.length;i++){
				var obj = response.data[i]
				
				 html += `<div class="goods">
								<div class="col-md-3 col-sm-3 col-xs-2 goods-box"><input type="checkbox" class="goods"><img src="${obj.goods_thumb}" alt=""></div>
								<div class="col-md-4 col-sm-4 col-xs-4">
									<div class="good-name">${obj.goods_name}</div>
								</div>
								<div class="col-md-2 col-sm-2 col-xs-2 goods-one">${obj.goods_price}</div>
								<div class="col-md-2 col-sm-2 col-xs-4 goods-lists">
									<div class="cen">
										<span class="left-button">-</span>
										<input type="text" class="center-text" value="${ obj.goods_number }"/>
										<span class="right-button">+</span>
									</div>
								</div>
								<div class="col-md-1 col-sm-1 col-xs-2 hidden-xs goods-sum">${ obj.goods_price * obj.goods_number }</div>
							</div>`;
								
				
					
				}
		}
        
            $(".good-list").html(html  );
        

        // -按钮事件
						$('.left-button').click(function(){
							upDataCarts(this,-1);
						})
						// +按钮事件
						$('.right-button').click(function(){
							upDataCarts(this,1);
						})
					
						// 单个删除事件监听
						$(".goods-op").click(function(){
							$('#tip').show();
							var This = this;
							$("#tip .no").click(function(){
								$('#tip').hide();
								return;	
							})
							$("#btnDelet").click(function(){
								delenode(This);
								var goods = This.parentNode;
								$(goods).remove();
								$('#tip').hide();
							})
							
								
						})
						// 多个删除事件监听
						$("#Delete").click(function(){
							$('#tip').show();
							$("#tip .no").click(function(){
								$('#tip').hide();
								return;	
							})
							$("#btnDelet").click(function(){
								$('#tip').hide();
								deletAll();
							})	
						})
							
					}
				});
            
                	// 修改购物数量函数
			// obj为当前元素，num为开关
			function upDataCarts(obj,num){
                var Shop = obj.parentNode.parentNode.parentNode;
				var goods_one = parseInt(Shop.getElementsByClassName("goods-one")[0].innerText);
				var goods_number = Shop.getElementsByClassName("center-text")[0];
				var goods_num_val =parseInt(goods_number.value);
				var goods_sum = Shop.getElementsByClassName("goods-sum")[0];
				var goods_sum_pric = parseInt(goods_sum.innerText);
				// 判断范围
				if(num =="-1"){
					if(goods_num_val<=1){
						return;
					}else{
						goods_num_val --;
						
					}
				}
				if(num =="1"){
					if(goods_num_val>=10){
						return;
					}else{
						goods_num_val ++;
						
					}
				}

				// 赋值
				goods_number.value = goods_num_val;
				// 更新金额
				var money = goods_one * goods_num_val;
				goods_sum.innerText = money;
				
				shopSet();

			}
			// 结算部分的函数，过滤器checked
			function shopSet(){
                console.log(1)
				var all_count =0;
				var all_money = 0;
				var goods = document.getElementsByClassName("goods");

				for(var i=0;i<goods.length;i++){
				var objgoods = goods[i];
				
				//判断
				if( $(objgoods).find(".goods").is(':checked') ){	
					all_money += parseInt($(objgoods).find(".goods-sum").text());
					all_count += parseInt($(objgoods).find(".center-text").val());
				}
					
				$('#Amount').text(all_count);	
				$('#Money').text(all_money);	
				}
				

			}	
				
			// 全选 ：事件委托
			$('section').click(function(event){
				// 1判断点击目标是全选按钮
				if(event.target.id === "selectAll"){
                    var checkAll = event.target.checked;
                    console.log(1)
					var checkboxs = document.getElementsByClassName("goods");
					for(var i =0;i<checkboxs.length;i++){
						checkboxs[i].checked = checkAll;
					}

				shopSet();
				return;
				}

				if(event.target.type === "checkbox"){
					shopSet();
				}
	
	
				


		

		// 结算
		$('#checkout').click(function(){
			var sum  = $("#Money").text();
			location.href = "checkout.html?sum=" + sum;
		})
							
					
				
			
			
	})	