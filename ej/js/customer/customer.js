window.onload =function(){

	var baseURL = "http://134.175.154.93:6677";
	var btn_add = document.getElementById("btn_add");
	var tbody = document.getElementsByTagName("tbody")[0];
	var btn_import = document.getElementById("btn_dels");

	//批量删除，为批量删除绑定事件
	$('#btn_import').click(function(){
	
    var ids =[];
    var check = $("input:checkbox:checked");
    check.each(function(){
    	ids.push(this.value);
    })
   	console.log(ids)
   	var arr=[];
   	ids.forEach(function (item,index){
   		arr.push(parseInt(item));
   	})
   	console.log(arr)
   	arr.forEach(function (item,index){
   		var url = baseURL+"/customer/deleteCustomerById?id=";
   		url=url+item;
   		var data = ids;
   		console.log(url)
   		$.post(url,data,function(){
   			reloadData();
			console.log("删除成功")
		}); 
   	})   	
})


	//为表单绑定事件
	document.forms[0].onsubmit = function(event){
		//1、获取用户输入
		var id = document.querySelector("input[name=id]").value;
		var realname = document.querySelector("input[name=realname").value;
		var telephone = document.querySelector("input[name=telephone").value;
		//2、异步提交给后台
		var xhr = new XMLHttpRequest();
		xhr.open("POST",baseURL+"/customer/saveCustomerOrUpdateCustomer");
		//要求后台传给我们的数据是json格式
		xhr.responseType = "json";
		//向后台声明我们所传递的数据是查询字符串
		xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		//将数据转换为查询字符串传递给后台
		var data;
		if (id) {
			data = "id="+id+"&realname="+realname+"&telephone="+telephone;
		}else{
			data = "realname="+realname+"&telephone="+telephone;
		}

		xhr.send(data);

		xhr.onreadystatechange = function(){
			if(this.readyState === 4){
				if(this.status === 200){
					//判断响应状态
					if(this.response.status === 200){
						alert(this.response.message);
						reloadData();
					}else{
						alert("接口异常！");
					}
				}
			}
		}

		//3、页面的局部更新
		//取消表单提交事件会跳转页面的默认行为
		event.preventDefault();
	}


	//通过id查询
	//获取表单并为表单绑定事件
	document.forms[1].onsubmit = function(){
		//获取用户输入
		var queryid = document.querySelector("input[name=queryid]");
		//将id异步提交给后台并接收响应
		var xhr = new XMLHttpRequest();
		xhr.open("GET",baseURL+"/customer/findCustomerById");
		xhr.responseType = "json";
		var data = "id="+queryid.value;
		xhr.send(data);
		xhr.onreadystatechange = function(){
			if(this.readyState === 4){
				if (this.status === 200) {
					//将响应结果渲染在页面上
					//将数据显示出来
					if (this.response.status === 200) {
						alert(2);
						var trs = document.querySelectorAll("tr[class='']");
						console.log(trs);
						//再将id所在的该值显示出来
						for(var index = 0;index<trs.length;index++){
							//如果查询的id不存在则提示为空并重载所有的数据
							if (!this.response.data) {
								alert("查询为空！");
								reloadData();
							}
							//如果查询到空则将id不等于输入的值的数据全部清除
							if (queryid.value !== trs[index].firstElementChild.children[0].value){
								console.log(this.response.data);
								trs[index].setAttribute("class","none");
							}
						}  
					}else{
						alert("查询失败！");
					}
					
				}
			}	
		}
	}	

	//给添加按钮绑定事件
	btn_add.onclick = function(){
		document.querySelector("input[name=realname]").value = "";
		document.querySelector("input[name=telephone").value = "";
		document.querySelector("input[name=id]").value = "";
	}


	//当光标移动到某一行时为该行添加背景色
	tbody.onmouseover = function(event){
		var target = event.target;
		if(target.nodeName === "TD"){
			target.parentNode.className = "current";
		}
	}

	//当光标移除时取消背景色
	tbody.onmouseout = function(event){
		var target = event.target;
		if(target.nodeName === "TD"){
			target.parentNode.className = "";
		}
	}
	
	//给删除和修改按钮绑定事件
	tbody.onclick = function(event){
		if(event.target.nodeName === "A"){
			switch(event.target.className){
				//删除功能实现
				case "btn_del":
					//先获取要删除的id
					var id = event.target.parentNode.parentNode.firstElementChild.firstElementChild.value;
					//编写ajax进行删除
					var xhr = new XMLHttpRequest();
					xhr.open("POST",baseURL+"/customer/deleteCustomerById");
					xhr.responseType = "json";
					xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
					xhr.send("id="+id);
					xhr.onreadystatechange = function(){
						if (this.readyState === 4) {
							if (this.status === 200) {
								if (this.response.status === 200) {
									//重新查询数据进行页面刷新（局部刷新）
									reloadData();
								}else{
									alert(this.response.message);
								}
							}
						}
					}
					break;

					//修改功能实现
					case "btn_upd":
						var id = event.target.parentNode.parentNode.children[0].firstElementChild.value;
						var realname = event.target.parentNode.parentNode.children[1].innerText;
						var telephone = event.target.parentNode.parentNode.children[3].innerText;
						document.querySelector("input[name=id]").value = id;
						document.querySelector("input[name=realname]").value = realname;
						document.querySelector("input[name=telephone]").value = telephone;
						break;
			}
		}
	}


	//重载数据
	function reloadData(){
		//1、通过ajax获取后台数据
		var xhr = new XMLHttpRequest();
		xhr.open("GET",baseURL+"/customer/findCustomerAll");
		xhr.responseType = "json";
		xhr.send();
		xhr.onreadystatechange = function(){
			if(this.readyState === 4){
				if(this.status === 200){
					//先将tbody原有的数据删除
					Array.prototype.slice.call(tbody.children,0).forEach(function(item,index){
						if(index !== 0){
							tbody.removeChild(item);
						}
					})
					//2、将查询到的数据渲染到页面中
					this.response.data.forEach(function(item){
						//2.1创建一个tr，将数据添加到tr中
						var newTr = tbody.firstElementChild.cloneNode(true);
						newTr.children[0].firstElementChild.value = item.id;
						newTr.children[1].innerText = item.realname;
						newTr.children[2].innerText = item.status;
						newTr.children[3].innerText = item.telephone;
						newTr.setAttribute("class","");
						tbody.appendChild(newTr);
					})
				}
			}
		}
	}

	//调用重载方法
	reloadData();

}

	