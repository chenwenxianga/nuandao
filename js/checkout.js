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
$(".new").click(function () {
    $('.add').slideToggle();
})
var sum = location.search.substr(1).split('=')[1];
$('.money').text(sum);
// 获取地址
addressAjax();
function addressAjax() {
    $.ajax({
        "url": "http://h6.duchengjiu.top/shop/api_useraddress.php?token=" + localStorage.token,
        "type": "get",
        "dataType": "json",
        "success": function (response) {
            console.log(response);
            var addrData = '';
            for (var i = 0; i < response.data.length; i++) {
                var obj = response.data[i];
                addrData += `<div class="address-div col-md-4" data-id="${obj.address_id}"
                                <p>
                                    <span class="spanId" data-id="${obj.address_id}">${obj.address_name}&nbsp;&nbsp;&nbsp;</span>
                                    <span>${obj.mobile}</span>
                                </p>
                                <p>
                                    <span>${obj.province}</span>
                                    <span>${obj.city}</span>
                                    <span>${obj.district}</span>
                                    <span>${obj.address}&nbsp;&nbsp;&nbsp;</span>
                                    
                                </p>
                            </div>`
            }
            $(".address").html(addrData);

            // 选择地址
            $('.address-div').click(function () {
                $(this).addClass('active').siblings().removeClass('active');
                $('#getaddr').html($('.active').html());
                $('#getaddr .delet').remove();
            })
            // 点击 下订单
            $('.order').click(function () {
                var address_id = $('#getaddr .spanId').attr("data-id");
                if ($('#getaddr').text() === "") {
                    alert("请先选择一个地址")
                    // console.log(1)
                    return;
                }
                $.ajax({
                    "url": "http://h6.duchengjiu.top/shop/api_order.php?token=" + localStorage.token + "&status=add",
                    "type": "POST",
                    "dataType": "json",
                    "data": {
                        "address_id": address_id,
                        "total_prices": sum[1]
                    },
                    "success": function (response) {
                        console.log(response);
                        console.log(address_id)
                        if (response.code === 0) {
                            alert("提交订单成功~");
                            location.href = "dingdan.html";
                        }
                    }

                })
            })

        }




    })
}

      // 新增地址
      console.log($(".cht button"))
      $("#btn").click(function(){
        var data = $("form").serialize();
        console.log(data);
        
        $.ajax({
            "url": "http://h6.duchengjiu.top/shop/api_useraddress.php?token=" + localStorage.token + "&status=add",
            "type": "POST",
            "dataType": "json",
            "data": data,
            "success": function(response){
                if(response.code === 0){
                    console.log(response);
                    $("#add").hide();
                    addressAjax();
                    
                    
                }
            }
            
        });
    })