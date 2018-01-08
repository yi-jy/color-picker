(function(root){
	var ele = {
		byId : function(tagId){
			return document.getElementById(tagId.replace("#",""));
		},
		byClass : function(tagClass,par){
			var result = [] , d = par || document;
			if(d.querySelectorAll){
				result = d.querySelectorAll(tagClass);
				return result;	
			}
			else{
				var allEle = this.byTag("*",d),
					re = new RegExp('\\b'+ tagClass.replace(".","") + '\\b',"i");
				for(var i=0 ; i<allEle.length ; i++){
					if(re.test(allEle[i].className)){
						result.push(allEle[i]);   	
					} 
				}
				return result;
			}
		},
		byTag : function(tagName,par){
			return (par || document).getElementsByTagName(tagName);
		},
		byName : function(attrName,par){
			return (par || document).getElementsByName(attrName);
		},
		show : function (ele){
			ele.style.display = "block";
		},
		hide : function (ele){
			ele.style.display = "none";
		},
		addClass : function (ele,tagClass){
			if(ele.className){
				var aClass = ele.className.split(" "),
					bAdd = true;
				for(var i=0,len=aClass.length ; i<len ; i++){
					if(aClass[i] === tagClass){
						bAdd=false;
						break;
					}
				}
				bAdd && (ele.className +=" "+ tagClass);
			}
			else{
				ele.className = tagClass;
			}
		},
		removeClass : function(ele,tagClass){
			if(!ele.className) return;
			var aClass = ele.className.split(" ");
			for(var i=0,len=aClass.length;i<len;i++){
				if(aClass[i] === tagClass){
					aClass.splice(i,1);
					ele.className=aClass.join(" ");
					return;
				}
			}
		},
		hasClass : function(ele,tagClass){
			if(!ele.className) return false;
			var aClass = ele.className.split(" "),
				bHas = false;
			for(var i=0,l = aClass.length;i<l;i++){
				if(aClass[i] === tagClass){
					bHas = true;
					break;
				}
			}
			return bHas;
		}
	}

	var eventUnit = {
		addEvent : function(ele,type,handler){
			if(ele.addEventListener){
				ele.addEventListener(type,handler,false);
			}
			else if(ele.attachEvent){
				ele.attachEvent("on"+type,handler);
			}
			else{
				ele["on"+type]=handler;
			}
		}
	}

	var getStyle = function(ele,attr){
		return ele.currentStyle ? ele.currentStyle[attr] : getComputedStyle(ele,false)[attr];
	}

	var addStyle = function(str){
		var styleEle = ele.byId("color-panle-styleSheet");
		if(styleEle) return ; 
		styleEle = document.createElement("style");
		styleEle.type = "text/css";
		styleEle.id = "color-panle-styleSheet";
		if(!+[1,]){
			styleEle.styleSheet.cssText = str;
		}
		else{
			styleEle.innerHTML = str;
		}
		ele.byTag("head")[0].appendChild(styleEle);
	}

	var colorTake = function(){
	    return function() {
			this.showColorPanle.apply(this, arguments);
		}	
	}();

	colorTake.prototype = {
		colorBaseArr : ["0","3","6","9","c","f"],
		htmlStr : '',
		// 容器拼接	
		joinStr : function(){
			var t = this;
			t.htmlStr = '';
			t.htmlStr += "<div class='color-read'>";
			t.htmlStr += "<span class='color-val'></span>";
			t.htmlStr += "<span class='color-show'></span>";
			t.htmlStr += "</div>";
			t.htmlStr += "<div class='color-list'>";
			
			var createColor = function(baseColor){
				var colorLiStr = '';
				for(var j=0 ; j<6 ; j++){
					for(var k=0 ; k<6 ; k++){
						var tempColor = baseColor + t.colorBaseArr[k] + t.colorBaseArr[j] ;
						colorLiStr += "<li data-bg='"+tempColor+"' style='background:#" + tempColor + ";'></li>";		
					}	
				}
				t.htmlStr +="<ul data-base='"+baseColor+"'>" + colorLiStr + "</ul>";
			}
			
			for(var i=0 , len=t.colorBaseArr.length; i<len ; i++){
				createColor(t.colorBaseArr[i]);
			}
			
			t.htmlStr += "</div>";
		},
		showColorPanle : function(showColorPanleEle){

			this.joinStr();

			var colorPanle = document.createElement("div"),
				tempColorPanleStyle = "";
				
			colorPanle.className = "color-panle";
			colorPanle.innerHTML = this.htmlStr;

			tempColorPanleStyle += ".color-panle{display:none;width:199px;background:#fff;}.color-list{border-top:1px solid #000;border-left:1px solid #000;}";
			tempColorPanleStyle += ".color-list ul{float:left;width:66px;height:66px;margin:0;padding:0;}.color-list li{list-style:none;float:left;width:10px;height:10px;border-bottom:1px solid #000;border-right:1px solid #000;overflow:hidden;cursor:pointer;}";
			tempColorPanleStyle += ".color-read{padding-bottom:5px;height:15px;}.color-read .color-val{float:right;}";
			tempColorPanleStyle += ".color-read .color-show{float:left;width:50px;height:15px;border:1px solid #000;}";
			addStyle(tempColorPanleStyle);

			eventUnit.addEvent(showColorPanleEle,"click",function(){
				document.body.appendChild(colorPanle);

				var colorPanleTempStyle = "position:absolute;left:" + parseInt(getStyle(showColorPanleEle,"left")) + "px;top:" + 
					(30 + parseInt(getStyle(showColorPanleEle,"top"))) + "px;display:block",
					colorList = ele.byClass(".color-list",colorPanle)[0],
					colorVal = ele.byClass(".color-val",colorPanle)[0],
					colorShow = ele.byClass(".color-show",colorPanle)[0];
				
				colorPanle.style.cssText = colorPanleTempStyle;

				var colorRead = function(eventType,e){
					return function (e){
						var e=window.event || e,
							target= e.target || e.srcElement;
						if(target.nodeName.toLowerCase()==="li"){
							switch (eventType){
								case  "mouseover" :
								colorShow.style.background = colorVal.innerHTML = "#" + target.getAttribute("data-bg");
								break;
								case "click" :
								showColorPanleEle.value = "#" + target.getAttribute("data-bg");
								colorPanle.style.display = "none";
								break;
								default:
								return;
							}
						}
					}
				}
				
				eventUnit.addEvent(colorList,"mouseover",colorRead("mouseover"));	
				eventUnit.addEvent(colorList,"click",colorRead("click"));
				colorRead = null;
			})
		}
	} 
	
	root.colorTake = colorTake;
	
})(window)