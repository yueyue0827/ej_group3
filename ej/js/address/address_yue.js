//三级联动 begin


 // 三级联动 end 

var baseURL = "http://134.175.154.93:6677"
// 加载数据
function reloadData(){
	var url = baseURL+"/address/findAddressAll"
	$.get(url,function(response,status){
		//1. 将tbody清空
		$("#address_tbl tbody").empty()
		//2. 追加新的值
		response.data.forEach(function(item){
			var newTr = $(`<tr>
				<td><input type="checkbox" value="`+item.id+`" name="address_id"></td>
				<td>`+item.province+`</td>
				<td>`+item.city+`</td>
				<td>`+item.area+`</td>
				<td>`+item.address+`</td>
				<td>`+item.telephone+`</td>
				<td>
					<a class="btn_del" href="#">删除</a>
					<a class="btn_upd" href="#">修改</a>
				</td>
			</tr>`)
			$("#address_tbl").append(newTr)
		});
	});
}
// 文档加载完毕之后执行
$(function(){
	//调用重载数据
	reloadData();
	$("#btn_add").on("click",function(){
		$("")
	})
	$("tbody").on("click","a",function(event){
		switch(event.target.className){
			case "btn_del":
				var id = event.target.parentNode.parentNode.firstElementChild.firstElementChild.value
				var url = baseURL+"/address/deleteAddressById"
				var data = "id="+id
				$.post(url,data,function(response,statusText){
					console.log(response.message)
					// alert(response.message)
					reloadData()
				})
			break;
			
			case "btn_upd":
			break;
		}
	})
	//批量删除
	$('#btn_delete').click(function(){
		var ids =[]
		var check = $("input:checkbox:checked")
		check.each(function(){
			ids.push(this.value)
		})
		console.log(ids)
		var arr=[]
		ids.forEach(function (item,index){
			arr.push(parseInt(item))
		})
		console.log(arr)
		arr.forEach(function (item,index){
			var url = baseURL+"/address/deleteAddressById?id="
			url=url+item
			console.log(url)
			var data = ids
			$.post(url,data,function(){
				reloadData()
				console.log("删除成功")
			})
		})   	
	})
	// 为表当绑定事件，获取用户输入并传递给后台
	$(".btn-primary").on("click",function(event){
		console.log(event)
		var id = $('input[name=address_id]').val()
		var province = $('select[name=input_province] option').val()
		var city = $('select[name=input_city] option').val()
		var area = $('select[name=input_area] option').val()
		var address = $('input[name=address]').val()
		var telephone = $('input[name=telephone]').val()

		alert(province)
		var url = baseURL+"/address/insertAddress" 
		var data ={
			id:id,
			province:province,
			city:city,
			area:area,
			address:address,
			telephone:telephone
		}
	
		$.post(url,data,function(response,statusText){
			console.log(statusText)
			reloadData()
		})
		event.preventDefault()
	})
	//为添加按钮绑定事件，点击添加按钮时，模态框中的数据清空
	$("#btn_add").on("click",function(){
		$('input[name=address_id]').val() = ""
		$('select[name=input_province] option').val() = ""
		$('select[name=input_city] option').val() = ""
		$('select[name=input_area] option').val() = ""
		$('input[name=address]').val() = ""
		$('input[name=telephone]').val() = ""
	})
	// 当光标移动的某一行上，为这一行添加背景
	var tbody = document.getElementById("tbody");
		tbody.onmouseover = function(event){
			var target = event.target;
			if(target.nodeName === "TD"){
				target.parentNode.className = "current"
			}
		}
		tbody.onmouseout = function(event){
			var target = event.target;
			if(target.nodeName === "TD"){
				target.parentNode.className = ""
			}
		}
	//id查询
	$('input[name=address_id]').keyup(function(){
		if(event.keyCode==13){
			var id = $(this).val();
			var url = baseURL+"/address/findAddressById";
			var data = "id="+id;
			var valu = $("input:checkbox")
			valu.each(function(item){
				var check_id = item; 
				alert(check_id.val())
			})
			$.get(url,data,function(a){
				//alert($("id").not(this))
				/*if(check_id.val() == id){
					/alu.siblings().css("display","none");
					alert(check_id.val())
				}*/
			})
		}
	})

		var html = "";
	$("#input_city").append(html);
	$("#input_area").append(html);
	$.each(pdata,function(idx,item){
		if (parseInt(item.level) == 0) {
			html += "<option value="+item.code+" >"+ item.names +"</option> ";
	}
	});
	$("#input_province").append(html);
	$("#input_province").change(function(){
		if ($(this).val() == "") return;
		$("#input_city option").remove();
		$("#input_area option").remove();
		//var code = $(this).find("option:selected").attr("exid");
		var code = $(this).find("option:selected").val();
		code = code.substring(0,2);
		var html = "<option value=''>--请选择--</option>";
		$("#input_area option").append(html);
		$.each(pdata,function(idx,item){
			if (parseInt(item.level) == 1 && code == item.code.substring(0,2)) {
				html +="<option value="+item.code+" >"+ item.names +"</option> ";
		}
		});
		$("#input_city ").append(html);
	});
 
	$("#input_city").change(function(){
		if ($(this).val() == "") return;
		$("#input_area option").remove();
		var code = $(this).find("option:selected").val();
		code = code.substring(0,4);
		var html = "<option value=''>--请选择--</option>";
		$.each(pdata,function(idx,item){
			if (parseInt(item.level) == 2 && code == item.code.substring(0,4)) {
				html +="<option value="+item.code+" >"+ item.names +"</option> ";
		}
	});
	$("#input_area ").append(html);
	});
})



