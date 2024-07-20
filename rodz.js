var LinearLayout = {
	VERTICAL:"vertical",
	HORIZONTAL:"horizontal"
}

var Size = {
	SM:"sm",
	SMALL:"sm",
	LG:"lg",
	LARGE:"lg"
}

var Variant = {
	TXT:"text",
	TEXT:"text",
	OUTLINED:"outlined",
	CONTAINED:"contained"
}

var InputType = {
	PASSWORD:"password",
	NUMBER:"number",
	TEXT:"text",
	FILE:"file",
	CHECKBOX:"checkbox",
	RADIO:"radio"
}

var Theme = {
	DANGER:"danger",
	DARK:"dark",
	LIGHT:"light",
	PRIMARY:"primary",
	SECONDARY:"secondary",
	INFO:"info",
	SUCCESS:"success"
}

//attach table script to the page
var tableLink = document.createElement("script");
tableLink.src = "http://localhost/resources/table.js";
document.head.appendChild(tableLink);

//const sleep = time => new Promise(resolve => setTimeout(resolve, time));

$(document).on('focus', '.form-control.bb', function(event) {
	var elem = this;
	if ($(elem).hasClass('rodzInput')) {
		//do nothing...
	}
	else{
		//show the shit
		var font = document.createElement("font");
		$(font).addClass('inputLabel');
		font.style.top = (elem.offsetTop+5)+"px";
		font.style.left = (elem.offsetLeft+5)+"px";
		font.innerHTML = $(elem).attr('placeholder');
		$(elem).addClass('rodzInput');
		document.body.appendChild(font);

		$(elem).attr('dataR', $(elem).attr('placeholder')).attr('placeholder', '');
	}
})

$(document).on('blur', '.form-control.bb', function(event) {
	var elem = this;
	
	$(elem).removeClass('rodzInput');
	$(elem).attr('placeholder', $(elem).attr('dataR'))
	$('.inputLabel').remove();
})

$(document).on('focus', '.form-control.ss', function(event) {
	var elem = this;
	if ($(elem).hasClass('rodzInputs')) {
		//do nothing...
	}
	else{
		//show the shit
		var font = document.createElement("font");
		$(font).addClass('inputLabels');
		font.style.top = (elem.offsetTop-7)+"px";
		font.style.left = (elem.offsetLeft+8)+"px";
		font.innerHTML = $(elem).attr('placeholder');
		$(elem).addClass('rodzInputs');
		document.body.appendChild(font);

		$(elem).attr('dataR', $(elem).attr('placeholder')).attr('placeholder', '');
	}
})

$(document).on('blur', '.form-control.ss', function(event) {
	var elem = this;
	
	$(elem).removeClass('rodzInputs');
	$(elem).attr('placeholder', $(elem).attr('dataR'))
	$('.inputLabels').remove();
})

//the div class
var Rodz = (function(){
	//contents 
	function Div(id) {
		if (id == undefined) {
			this.view = document.createElement("div");
		}
		else{
			if (id.tagName != undefined) {
				this.view = id;
			}
			else{
				this.view = document.getElementById(id);
			}
		}
		this.orientation = "horizontal";

		this.setPadding = function(left, top, right, bottom) {
			this.view.style.padding = top+'px '+left+'px '+bottom+'px '+right+'px';
			this.view.style.paddingLeft = left+"px";
			return this;
		}

		this.renderIn = function(id) {
			document.getElementById(id).appendChild(this.view);
		}

		this.addClass = function(className) {
			$(this.view).addClass(className);
			return this;
		}

		this.addClasses = function(list) {
			for(var c of list){
				$(this.view).addClass(c);
			}
		}

		this.removeClass = function(className) {
			$(this.view).removeClass(className);
			return this;
		}

		this.toggleClass = function(className) {
			$(this.view).toggleClass(className);
			return this;
		}

		this.addAll = function() {
			for(var arg of arguments){
				this.addView(arg);
			}
		}

		this.hasClass = function(className) {
			var classes = this.getAttribute('class').split(" ");
			if (className in classes) {
				return true;
			}
			else{
				return false;
			}
		}

		this.addView = function(elem) {
			this.view.appendChild(elem.view);
			return this;
		}

		this.removeView = function(view1) {
			this.view.removeChild(view);
			return this;
		}

		this.removeAllViews = function() {
			this.view.innerHTML = '';
			return this;
		}

		this.setOrientation = function(orientation) {
			this.orientation = orientation;
			return this;
		}

		this.setHeight = function(height) {
			this.view.style.height = height+"px";
			return this;
		}

		this.setWidth = function(height) {
			this.view.style.width = height+"px";
			return this;
		}

		this.getAttribute = function(name) {
			return $(this.view).attr(name);
		}

		this.setAttribute = function(name, value) {
			$(this.view).attr(name, value);
			return this;
		}

		this.css = function(name, value) {
			if(value == undefined){
				for(var key in name){
					$(this.view).css(key, name[key]);
				}
				return this;
			}
			else{
				$(this.view).css(name, value); //old way
				return this;
			}
		}

		this.setAttributes = function(obj) {
			for(const key in obj){
				this.setAttribute(key, obj[key]);
			}
		}

		this.setValues = function(obj) {
			for(const key in obj){
				//this.setAttribute(key, obj[key]);
				switch(key){
					case "classes":
						this.addClasses(obj['key']);
						break;
				}
			}
		}

		this.setText = function(text) {
			this.view.innerHTML = text;
		}

		this.appendText = function(text) {
			this.view.innerHTML += text;
		}

		this.prependText = function(text) {
			this.view.innerHTML = text + this.view.innerHTML;
		}

		this.getChildrenCount = function() {
			return this.view.children.length;
		}

		this.getChildAt = function(index){
			return this.view.children[index];
		}
	}


	function Span(id) {
		if (id == undefined) {
			this.view = document.createElement("span");
		}
		else{
			this.view = document.getElementById(id);
		}
		this.orientation = "horizontal";

		this.setPadding = function(left, top, right, bottom) {
			this.view.style.padding = top+'px '+left+'px '+bottom+'px '+right+'px';
			this.view.style.paddingLeft = left+"px";
			return this;
		}

		this.renderIn = function(id) {
			document.getElementById(id).appendChild(this.view);
		}

		this.addClass = function(className) {
			$(this.view).addClass(className);
			return this;
		}

		this.addClasses = function(list) {
			for(var c of list){
				$(this.view).addClass(c);
			}
		}

		this.removeClass = function(className) {
			$(this.view).removeClass(className);
			return this;
		}

		this.toggleClass = function(className) {
			$(this.view).toggleClass(className);
			return this;
		}

		this.hasClass = function(className) {
			var classes = this.getAttribute('class').split(" ");
			if (className in classes) {
				return true;
			}
			else{
				return false;
			}
		}

		this.addView = function(elem) {
			this.view.appendChild(elem.view);
			return this;
		}

		this.removeView = function(view1) {
			this.view.removeChild(view);
			return this;
		}

		this.removeAllViews = function() {
			this.view.innerHTML = '';
			return this;
		}

		this.setOrientation = function(orientation) {
			this.orientation = orientation;
			return this;
		}

		this.setHeight = function(height) {
			this.view.style.height = height+"px";
			return this;
		}

		this.setWidth = function(width) {
			this.view.style.width = width+"px";
			return this;
		}

		this.getAttribute = function(name) {
			return $(this.view).attr(name);
		}

		this.setAttribute = function(name, value) {
			$(this.view).attr(name, value);
		}

		this.onClick = function(callback) {
			this.view.addEventListener('click', function(event){
				callback(event);
			})
		}

		this.on = function(e_name, callback) {
			this.view.addEventListener(e_name, function(event) {
				callback(event);
			})
		}

		this.setAttributes = function(obj) {
			for(const key in obj){
				this.setAttribute(key, obj[key]);
			}
		}

		this.css = function(name, value) {
			$(this.view).css(name, value);
			return this;
		}
	}


	function ImageView(id) {
		if (id == undefined) {
			this.view = document.createElement("img");
		}
		else{
			this.view = document.getElementById(id);
		}
		this.orientation = "horizontal";

		this.setPadding = function(left, top, right, bottom) {
			this.view.style.padding = top+'px '+left+'px '+bottom+'px '+right+'px';
			this.view.style.paddingLeft = left+"px";
			return this;
		}

		this.renderIn = function(id) {
			document.getElementById(id).appendChild(this.view);
		}

		this.addClass = function(className) {
			$(this.view).addClass(className);
			return this;
		}

		this.addClasses = function(list) {
			for(var c of list){
				$(this.view).addClass(c);
			}
		}

		this.removeClass = function(className) {
			$(this.view).removeClass(className);
			return this;
		}

		this.toggleClass = function(className) {
			$(this.view).toggleClass(className);
			return this;
		}

		this.hasClass = function(className) {
			var classes = this.getAttribute('class').split(" ");
			if (className in classes) {
				return true;
			}
			else{
				return false;
			}
		}

		this.setHeight = function(height) {
			this.view.style.height = height+"px";
			return this;
		}

		this.setWidth = function(height) {
			this.view.style.width = height+"px";
			return this;
		}

		this.getAttribute = function(name) {
			return $(this.view).attr(name);
		}

		this.setAttribute = function(name, value) {
			$(this.view).attr(name, value);
		}

		this.setSource = function(src){
			this.setAttribute('src', src);
			return this;
		}

		this.getSource = function(src){
			return this.getAttribute('src');
		}

		this.css = function(name, value) {
			$(this.view).css(name, value);
			return this;
		}
	}


	function CheckBox() {
		this.view = document.createElement("font");

		this.span = document.createElement("span");
		$(this.span).addClass('check');

		this.check = document.createElement("input");
		$(this.check).attr('type', 'checkbox');
		var id = Math.floor(Math.random() * 100000);
		$(this.check).attr('id', id);
		$(this.span).attr('for', id);

		this.label = document.createElement('label');
		$(this.label).attr('for', id);
		$(this.label).addClass('roboto')
		this.orientation = "horizontal";

		this.span.appendChild(this.check);

		this.view.appendChild(this.span);
		this.view.appendChild(this.label);

		this.setPadding = function(left, top, right, bottom) {
			this.view.style.padding = top+'px '+left+'px '+bottom+'px '+right+'px';
			this.view.style.paddingLeft = left+"px";
			return this;
		}

		this.renderIn = function(id) {
			document.getElementById(id).appendChild(this.view);
		}

		this.addClass = function(className) {
			$(this.view).addClass(className);
			return this;
		}

		this.addClasses = function(list) {
			for(var c of list){
				$(this.view).addClass(c);
			}
		}

		this.removeClass = function(className) {
			$(this.view).removeClass(className);
			return this;
		}

		this.toggleClass = function(className) {
			$(this.view).toggleClass(className);
			return this;
		}

		this.hasClass = function(className) {
			var classes = this.getAttribute('class').split(" ");
			if (className in classes) {
				return true;
			}
			else{
				return false;
			}
		}

		this.setHeight = function(height) {
			this.view.style.height = height+"px";
			return this;
		}

		this.setWidth = function(height) {
			this.view.style.width = height+"px";
			return this;
		}

		this.getAttribute = function(name) {
			return $(this.view).attr(name);
		}

		this.setAttribute = function(name, value) {
			$(this.view).attr(name, value);
		}

		this.setName = function(name) {
			$(this.check).attr('name', name);
		}

		this.setValue = function(value) {
			$(this.check).attr('value', value);
		}

		this.setText = function(text) {
			$(this.label).html("&nbsp;"+text);
		}

		this.getText = function() {
			return $(this.label).html();
		}

		this.isChecked = function() {
			if(this.check.checked){
				return true;
			}
			else{
				return false;
			}
		}

		this.setChecked = function(bool) {
			if (bool) {
				this.check.checked = 'checked'
			}
			else{
				this.check.checked = '';
			}
		}

		this.onChange = function(callback) {
			this.view.addEventListener('change', function(event) {
				callback(event);
			})
		}

		this.on = function(e_name, callback) {
			this.view.addEventListener(e_name, function(event) {
				callback(event);
			})
		}
	}


	function Form() {
		this.view = document.createElement("form");
		this.orientation = "horizontal";

		this.setPadding = function(left, top, right, bottom) {
			this.view.style.padding = top+'px '+left+'px '+bottom+'px '+right+'px';
			this.view.style.paddingLeft = left+"px";
			return this;
		}

		this.addClass = function(className) {
			$(this.view).addClass(className);
			return this;
		}

		this.renderIn = function(id) {
			document.getElementById(id).appendChild(this.view);
		}

		this.addClasses = function(list) {
			for(var c of list){
				$(this.view).addClass(c);
			}
		}

		this.removeClass = function(className) {
			$(this.view).removeClass(className);
			return this;
		}

		this.toggleClass = function(className) {
			$(this.view).toggleClass(className);
			return this;
		}

		this.hasClass = function(className) {
			var classes = this.getAttribute('class').split(" ");
			if (className in classes) {
				return true;
			}
			else{
				return false;
			}
		}

		this.addView = function(elem) {
			this.view.appendChild(elem.view);
			return this;
		}

		this.removeView = function(view1) {
			this.view.removeChild(view);
			return this;
		}

		this.removeAllViews = function() {
			this.view.innerHTML = '';
			return this;
		}

		this.setOrientation = function(orientation) {
			this.orientation = orientation;
			return this;
		}

		this.setHeight = function(height) {
			this.view.style.height = height+"px";
			return this;
		}

		this.setWidth = function(height) {
			this.view.style.width = height+"px";
			return this;
		}

		this.getAttribute = function(name) {
			return $(this.view).attr(name);
		}

		this.setAttribute = function(name, value) {
			$(this.view).attr(name, value);
		}

		this.addAll = function() {
			for(var arg of arguments){
				this.addView(arg);
			}
		}

		this.onSubmit = function(callback) {
			this.view.addEventListener('submit', function(event) {
				callback(event);
			})
		}
	}


	//the canvas class
	function Canvas() {
		this.view = document.createElement("canvas");

		this.setPadding = function(left, top, right, bottom) {
			this.view.style.paddingLeft = left+"px";
			this.view.style.paddingRight = right+"px";
			this.view.style.paddingTop = top+"px";
			this.view.style.paddingBottom = bottom+"px";
			return this;
		}

		this.addClass = function(className) {
			$(this.view).addClass(className);
			return this;
		}

		this.addClasses = function(list) {
			for(var c of list){
				$(this.view).addClass(c);
			}
		}

		this.removeClass = function(className) {
			$(this.view).removeClass(className);
			return this;
		}

		this.renderIn = function(id) {
			document.getElementById(id).appendChild(this.view);
		}

		this.toggleClass = function(className) {
			$(this.view).toggleClass(className);
			return this;
		}

		this.hasClass = function(className) {
			var classes = this.getAttribute('class').split(" ");
			if (className in classes) {
				return true;
			}
			else{
				return false;
			}
		}

		this.setHeight = function(height) {
			this.view.style.height = height+"px";
			return this;
		}

		this.setWidth = function(height) {
			this.view.style.width = height+"px";
			return this;
		}

		this.getAttribute = function(name) {
			return $(this.view).attr(name);
		}

		this.setAttribute = function(name, value) {
			$(this.view).attr(name, value);
		}
	}


	//the label class
	function Label(id) {
		if(id == undefined){
			this.view = document.createElement("font");
		}
		else{
			this.view = document.getElementById(id);
		}

		this.setPadding = function(left, top, right, bottom) {
			this.view.style.padding = top+'px '+left+'px '+bottom+'px '+right+'px';
		}

		this.addClass = function(className) {
			$(this.view).addClass(className);
		}

		this.removeClass = function(className) {
			$(this.view).removeClass(className);
		}

		this.renderIn = function(id) {
			document.getElementById(id).appendChild(this.view);
		}

		this.toggleClass = function(className) {
			$(this.view).toggleClass(className);
		}

		this.addView = function(elem) {
			this.view.appendChild(elem.view);
		}

		this.removeView = function(view1) {
			this.view.removeChild(view);
		}

		this.setText = function(text) {
			this.view.innerHTML = text;
		}

		this.addView = function(elem) {
			this.view.appendChild(elem.view);
			return this;
		}

		this.getText = function(text) {
			return this.view.innerHTML = text;
		}

		this.addClasses = function(list) {
			for(var c of list){
				$(this.view).addClass(c);
			}
		}

		this.getAttribute = function(name) {
			return $(this.view).attr(name);
		}

		this.setAttribute = function(name, value) {
			$(this.view).attr(name, value);
		}

		this.addAll = function() {
			for(var arg of arguments){
				this.addView(arg);
			}
		}

		this.show = function() {
			this.view.style.display = 'inline';
		}

		this.hide = function(){
			this.view.style.display = 'none';
		}

		this.setAttributes = function(obj) {
			for(const key in obj){
				this.setAttribute(key, obj[key]);
			}
		}
	}


	function Button(id) {
		if (id != undefined) {
			this.view = document.getElementById(id);
		}
		else{
			this.view = document.createElement("button");
		}

		this.setPadding = function(left, top, right, bottom) {
			this.view.style.padding = top+'px '+left+'px '+bottom+'px '+right+'px';
			return this;
		}

		this.addClass = function(className) {
			$(this.view).addClass(className);
			return this;
		}

		this.removeClass = function(className) {
			$(this.view).removeClass(className);
			return this;
		}

		this.toggleClass = function(className) {
			$(this.view).toggleClass(className);
			return this;
		}

		this.addView = function(elem) {
			this.view.appendChild(elem.view);
			return this;
		}

		this.renderIn = function(id) {
			document.getElementById(id).appendChild(this.view);
		}

		this.removeView = function(view1) {
			this.view.removeChild(view);
			return this;
		}

		this.addClasses = function(list) {
			for(var c of list){
				$(this.view).addClass(c);
			}
		}

		this.getText = function(type) {
			return $(this.view).text();
		}

		this.setText = function(text) {
			$(this.view).html(text);
			return this;
		}

		this.getAttribute = function(name) {
			return $(this.view).attr(name);
		}

		this.setAttribute = function(name, value) {
			$(this.view).attr(name, value);
		}

		this.onClick = function(callback) {
			this.view.addEventListener('click', function(event){
				callback(event);
			})
		}

		this.on = function(e_name, callback) {
			this.view.addEventListener(e_name, function(event) {
				callback(event);
			})
		}
	}

	function MaterialButton() {
		this.view = document.createElement("button");

		this.setPadding = function(left, top, right, bottom) {
			this.view.style.padding = top+'px '+left+'px '+bottom+'px '+right+'px';
			return this;
		}

		this.addClass = function(className) {
			$(this.view).addClass(className);
			return this;
		}

		this.removeClass = function(className) {
			$(this.view).removeClass(className);
			return this;
		}

		this.toggleClass = function(className) {
			$(this.view).toggleClass(className);
			return this;
		}

		this.addView = function(elem) {
			this.view.appendChild(elem.view);
			return this;
		}

		this.renderIn = function(id) {
			document.getElementById(id).appendChild(this.view);
		}

		this.removeView = function(view1) {
			this.view.removeChild(view);
			return this;
		}

		this.addClasses = function(list) {
			for(var c of list){
				$(this.view).addClass(c);
			}
		}

		this.getText = function(type) {
			return $(this.view).text();
		}

		this.setText = function(text) {
			$(this.view).html(text);
			return this;
		}

		this.getAttribute = function(name) {
			return $(this.view).attr(name);
		}

		this.setAttribute = function(name, value) {
			$(this.view).attr(name, value);
		}

		this.onClick = function(callback) {
			this.view.addEventListener('click', function(event){
				callback(event);
			})
		}

		this.on = function(e_name, callback) {
			this.view.addEventListener(e_name, function(event) {
				callback(event);
			})
		}

		this.setVariant = function(variant) {
			switch(variant){
				case "text":
					this.removeClass('btn2').removeClass('btn_outline').addClasses(['btn_text']);
					break;

				case "contained":
					this.removeClass('btn_text').removeClass('btn_outline').addClasses(["btn2"]);
					break;

				case "outlined":
					this.removeClass('btn_text').removeClass('btn2').addClasses(['btn_outline']);
					break;
			}
		}

		this.setSize = function(size) {
			this.addClasses([size]);
		}

		this.show = function() {
			this.view.style.display = 'inline';
		}

		this.fire = function() {
			this.view.click();
		}

		this.hide = function(){
			this.view.style.display = 'none';
		}

		this.setTheme = function(theme) {
			this.view.classList.add(theme);
		}

		this.addClasses(['btn2']);
	}

	function EditText(id) {
		if (id != undefined) {
			this.view = document.getElementById(id);
			this.type = this.view.type;
		}
		else{
			this.view = document.createElement("input");
			this.type = "text";
		}

		this.setPadding = function(left, top, right, bottom) {
			this.view.style.padding = top+'px '+left+'px '+bottom+'px '+right+'px';
			return this;
		}

		this.addClass = function(className) {
			$(this.view).addClass(className);
			return this;
		}

		this.removeClass = function(className) {
			$(this.view).removeClass(className);
			return this;
		}

		this.toggleClass = function(className) {
			$(this.view).toggleClass(className);
			return this;
		}

		this.addClasses = function(list) {
			for(var c of list){
				$(this.view).addClass(c);
			}
		}

		this.setType = function(type) {
			$(this.view).attr('type', type);
			this.type = type;
		}

		this.setHint = function(hint) {
			$(this.view).attr('placeholder', hint);
			return this;
		}

		this.getText = function(type) {
			return $(this.view).val();
		}

		this.setText = function(text) {
			$(this.view).val(text);
			return this;
		}

		this.getAttribute = function(name) {
			return $(this.view).attr(name);
		}

		this.setAttribute = function(name, value) {
			$(this.view).attr(name, value);
		}

		this.setName = function(value) {
			$(this.view).attr('name', value);
		}

		this.setAttributes = function(obj) {
			for(const key in obj){
				this.setAttribute(key, obj[key]);
			}
		}

		this.onKeyUp = function(callback) {
			this.view.addEventListener('keyup', function(event) {
				callback(event);
			})
		}

		this.on = function(e_name, callback) {
			this.view.addEventListener(e_name, function(event) {
				callback(event);
			})
		}

		this.setType(this.type);
	}

	function TextArea() {
		this.view = document.createElement("textarea");
		this.type = "text";

		this.setPadding = function(left, top, right, bottom) {
			this.view.style.padding = top+'px '+left+'px '+bottom+'px '+right+'px';
			return this;
		}

		this.addClass = function(className) {
			$(this.view).addClass(className);
			return this;
		}

		this.removeClass = function(className) {
			$(this.view).removeClass(className);
			return this;
		}

		this.toggleClass = function(className) {
			$(this.view).toggleClass(className);
			return this;
		}

		this.addClasses = function(list) {
			for(var c of list){
				$(this.view).addClass(c);
			}
		}

		this.setType = function(type) {
			$(this.view).attr('type', type);
			this.type = type;
		}

		this.setHint = function(hint) {
			$(this.view).attr('placeholder', hint);
			return this;
		}

		this.getText = function(type) {
			return $(this.view).val();
		}

		this.setText = function(text) {
			this.view.innerHTML = text;
			return this;
		}

		this.getAttribute = function(name) {
			return $(this.view).attr(name);
		}

		this.setAttribute = function(name, value) {
			$(this.view).attr(name, value);
		}

		this.setName = function(value) {
			$(this.view).attr('name', value);
		}

		this.setWidth = function(width) {
			$(this.view).css('width', width);
		}

		this.on = function(e_name, callback) {
			this.view.addEventListener(e_name, function(event) {
				callback(event);
			})
		}

		this.setType(this.type);
	}

	function Icon(id) {
		if (id == undefined) {
			this.view = document.createElement("i");
		}
		else{
			this.view = document.getElementById(id);
		}

		this.setPadding = function(left, top, right, bottom) {
			this.view.style.padding = top+'px '+left+'px '+bottom+'px '+right+'px';
			return this;
		}

		this.addClass = function(className) {
			$(this.view).addClass(className);
			return this;
		}

		this.removeClass = function(className) {
			$(this.view).removeClass(className);
			return this;
		}

		this.toggleClass = function(className) {
			$(this.view).toggleClass(className);
			return this;
		}

		this.addClasses = function(list) {
			for(var c of list){
				$(this.view).addClass(c);
			}
		}

		this.getAttribute = function(name) {
			return $(this.view).attr(name);
		}

		this.setAttribute = function(name, value) {
			$(this.view).attr(name, value);
		}

		this.setAttributes = function(obj) {
			for(const key in obj){
				this.setAttribute(key, obj[key]);
			}
		}

		this.setColor = function(color) {
			this.view.style.color = color;
		}

		this.on = function(e_name, callback) {
			this.view.addEventListener(e_name, function(event) {
				callback(event);
			})
		}

		this.onClick = function(callback) {
			this.view.addEventListener('click', function(event) {
				callback(event);
			})
		}

		this.addClass("fa");
	}


	function Modal() {
		this.view = document.createElement("div");
		this.view.style.paddingTop = "20px";
		this.content = new Div();
		this.content.orientation = "vertical";
		this.content.setWidth(450);
		this.content.addClasses(['w3-modal-content', 'shadow', 'w3-round-large'])
		this.view.appendChild(this.content.view);

		this.titleContainer = new Div();
		this.titleContainer.addClasses(['bg-dark', 'w3-text-white', 'pl-15', 'pr-15', 'pt-30 pb-20', 'w3-large', 'rounded-top']);

		this.cancel = new Icon();
		this.cancel.addClasses(['fa-times', 'pointer', 'w3-hover-text-red mr-30']);
		this.cancel.view.addEventListener("click", function() {
			//alert("hello");
			$('#reusable').html('');
		}, false);
		this.titleContainer.addView(this.cancel);

		this.titleLabel = new Label();
		this.titleContainer.addView(this.titleLabel);
		this.content.addView(this.titleContainer);

		this.container = new Div();
		this.container.orientation = "vertical";
		this.content.addView(this.container);

		this.setPadding = function(left, top, right, bottom) {
			this.container.view.style.padding = top+'px '+left+'px '+bottom+'px '+right+'px';
			return this;
		}

		this.setTitle = function(title) {
			this.titleLabel.setText(title);
			return this;
		}

		this.setWidth = function(width) {
			this.content.setWidth(width);
		}

		this.show = function() {
			$(this.view).show();
		}

		this.close = function() {
			$('#reusable').html('');
		}

		this.addView = function(elem) {
			if (this.container.orientation == "vertical") {
				elem.view.style.display = "block";
			}
			else{
				elem.view.style.display = "inline";
			}
			this.container.view.appendChild(elem.view);
			return this;
		}

		$(this.view).addClass("w3-modal");
		$('#reusable').html(this.view);
	}

	function BootstrapModal() {
		this.view = document.createElement("div");
		$(this.view).addClass('modal');
		var id = Math.floor(Math.random() * 100000);
		this.id = id;
		$(this.view).attr('id', id);
		this.view.addEventListener('click', ()=>{
			try{
				remove_blur();
			}catch(E){}
		})

		this.dialog = document.createElement('div');
		$(this.dialog).addClass('modal-dialog');
		this.view.appendChild(this.dialog);
		//this.view.style.paddingTop = "20px";
		this.content = new Div();
		this.content.orientation = "vertical";
		//this.content.setWidth(450);
		this.content.addClasses(['modal-content'])
		this.dialog.appendChild(this.content.view);

		this.titleContainer = new Div();
		this.titleContainer.addClasses(['modal-header', 'w3-light-grey']);

		this.titleLabel = new Label();
		this.titleLabel.addClasses(['h4']);
		this.titleContainer.addView(this.titleLabel);

		this.cancel = new Button();
		this.cancel.setAttribute('type', 'button');
		this.cancel.addClasses(['close']);
		this.cancel.setAttribute('data-dismiss', 'modal');
		this.cancel.setAttribute('rodz', id);
		this.cancel.setText("&times;");
		this.cancel.view.addEventListener('click', function(event){
			var v = $(event.target).attr('rodz');
			var myModal = new bootstrap.Modal(document.getElementById(v), {});
			myModal.hide();
			$(".modal").remove();
			$(".modal-backdrop").remove();
			try{
				remove_blur();
			}catch(E){}
		}, false);
		
		this.titleContainer.addView(this.cancel);
		this.content.addView(this.titleContainer);
		

		this.container = new Div();
		this.container.orientation = "vertical";
		this.container.addClasses(['modal-body']);
		this.content.addView(this.container);

		this.modal_footer = new Div();
		this.modal_footer.addClasses(['modal-footer']);

		this.close_btn = new Button();
		this.close_btn.setText("Close");
		this.close_btn.addClasses(['btn2 sm danger']);
		this.close_btn.setAttribute('type', 'button');
		this.close_btn.setAttribute('data-dismiss', 'modal');
		this.close_btn.setAttribute('rodz', id);
		this.close_btn.onClick(function(event) {
			var v = $(event.target).attr('rodz');
			var myModal = new bootstrap.Modal(document.getElementById(v), {});
			myModal.hide();
			$(".modal").remove();
			$(".modal-backdrop").remove();
			try{
				remove_blur();
			}catch(E){}
		})
		this.modal_footer.addView(this.close_btn);
		this.content.addView(this.modal_footer);

		this.setPadding = function(left, top, right, bottom) {
			this.container.view.style.padding = top+'px '+left+'px '+bottom+'px '+right+'px';
			return this;
		}

		this.setTitle = function(title) {
			this.titleLabel.setText(title);
			return this;
		}

		this.centered = function() {
			this.dialog.classList.add('modal-dialog-centered');
		}

		this.fade = function() {
			this.view.classList.add('fade');
		}

		this.setWidth = function(width) {
			this.dialog.style.width = width+"px";
			this.dialog.style.maxWidth = width+"px";
		}

		this.setSize = function(size) {
			$(this.dialog).addClass('modal-'+size);
		}

		this.show = function() {
			//$(this.view).show();
			try{
				document.body.appendChild(this.view);
				var myModal = new bootstrap.Modal(this.view, {});
				myModal.show();		
				//$(this.view).modal("show");
			}
			catch(E){
				alert(E.toString()+'here');
			}
			try{
				show_blur();
			}catch(E){}
		}

		this.close = function() {
			var myModal = new bootstrap.Modal(this.view, {});
			myModal.hide();
			$(".modal").remove();
			$(".modal-backdrop").remove();
		}

		this.addView = function(elem) {
			this.container.view.appendChild(elem.view);
			return this;
		}
	}

	function closeModal(id){
		var myModal = new bootstrap.Modal(document.getElementById(id), {});
		myModal.hide();
		$(".modal").remove();
		$(".modal-backdrop").remove();
	}

	function Table(id) {
		if (id != undefined) {
			this.view = document.getElementById(id);
			this.tbody = this.view.tBodies[0];
			this.thead = this.view.tHead;
			this.cols = this.view.getElementsByTagName('th').length;
			this.id = id;
		}
		else{
			this.view = document.createElement("table");
			this.view.style.width = '100% !important';
			this.thead = document.createElement("thead");
			this.view.style.width = '100% !important';
			this.tbody = document.createElement("tbody");

			this.view.appendChild(this.thead);
			this.view.appendChild(this.tbody);
			this.cols = 0;
			this.id = Math.floor(Math.random() * 100000);
			this.view.setAttribute('id', this.id);
		}
		
		

		this.addColumn = function(name) {
			this.cols += 1;
			var elem = document.createElement("th");
			elem.innerHTML  = name;
			this.thead.appendChild(elem);
		}

		this.Label = function(text) {
			var l = new Label();
			l.setText(text);
			return l;
		}

		this.addRow = function(list) {
			var tr = document.createElement("tr");
			for(var name of list){
				var elem = document.createElement("td");
				elem.appendChild(name.view);
				tr.appendChild(elem);
			}
			this.tbody.appendChild(tr);
		}

		this.addRowData = function(list) {
			var tr = document.createElement("tr");
			for(var data of list){
				var td = document.createElement("td");
				if (data.tagName != undefined) {
					td.appendChild(data);
				}
				else{
					td.innerHTML = data;
					$(td).attr('title', data);
				}
				tr.appendChild(td);
			}
			this.tbody.appendChild(tr);
		}

		this.addColumns = function(list) {
			for(var name of list){
				this.cols += 1;
				var elem = document.createElement("th");
				elem.innerHTML  = name;
				this.thead.appendChild(elem);
			}
		}

		this.addClass = function(className) {
			$(this.view).addClass(className);
			return this;
		}

		this.addClasses = function(list) {
			for(var c of list){
				$(this.view).addClass(c);
			}
		}

		this.clear = function() {
			this.tbody.innerHTML = '';
		}

		this.removeClass = function(className) {
			$(this.view).removeClass(className);
			return this;
		}

		this.setAttribute = function(name, value) {
			$(this.view).attr(name, value);
			return this;
		}

		this.setId = function(id) {
			$(this.view).attr('id', id);
			return this;
		}

		this.toggleClass = function(className) {
			$(this.view).toggleClass(className);
			return this;
		}

		this.removeAllViews = function() {
			this.tbody.innerHTML = '';
		}

		this.addClasses(["table", 'table-striped']);
	}

	function TabPanel() {
		this.view = document.createElement("div");
		this.head = new Div();
		this.body = new Div();
		this.count = 0;
		this.id = Math.floor(Math.random() * 100000);

		this.view.appendChild(this.head.view);
		this.view.appendChild(this.body.view);
		this.head.addClass('w3-border-bottom');

		this.addTab = function(text) {
			var btn = new Button();
			var unik = Math.floor(Math.random() * 100000);
			btn.setAttribute('linker', unik);
			btn.setAttribute('parent', this.id);
			if(this.count == 0){
				btn.addClasses(['w3-padding', 'active', 'tabButton']);
			}
			else{
				btn.addClasses(['w3-padding', 'w3-white', 'tabButton']);
			}
			btn.setText(text)
			this.head.addView(btn);

			//the content
			var content = new Div();
			content.addClasses(['w3-padding', 'tabContent']);
			content.orientation = "vertical";
			
			content.setAttribute('id', unik);
			content.setAttribute('parent', this.id);
			
			this.body.addView(content);
			if(this.count == 0){
				//btn.addClasses(['w3-padding', 'w3-text-white', 'bg-dark', 'tabButton']);
			}
			else{
				content.view.style.display = 'none';
			}
			this.count += 1;
			return content;
		}
	}

	function Spinner() {
		this.view = document.createElement("select");

		this.addClass = function(className) {
			$(this.view).addClass(className);
			return this;
		}

		this.addClasses = function(list) {
			for(var c of list){
				$(this.view).addClass(c);
			}
		}

		this.removeClass = function(className) {
			$(this.view).removeClass(className);
			return this;
		}

		this.getAttribute = function(name) {
			return $(this.view).attr(name);
		}

		this.setAttribute = function(name, value) {
			$(this.view).attr(name, value);
		}

		this.setValues = function(values) {
			for(var i = 0; i < values[0].length; i++){
				$(this.view).append('<option value="'+values[0][i]+'">'+values[1][i]+'</option>');
			}
		}

		this.addClasses(['form-control']);
	}

	//////////////////////////////////////////////////////////////////
	function ProgressIndicator(id) {
		if(id == undefined){
			this.view = document.createElement("div");
			this.cont = document.createElement("div");

			$(this.view).addClass('indicator').addClass('pointer');
			$(this.cont).addClass('indicator-progress');
			this.view.appendChild(this.cont);
		}
		else{
			this.view = document.getElementById(id);
			this.cont = this.view.getElementsByTagName('div')[0];
		}

		this.setValue = function(percent) {
			this.cont.style.width = percent+'%';
		}
		this.margin = 0;
		this.canLoad = true;

		this.setLoading = function(b) {
			if (b) {
				//show loading
				this.setValue(45);
				this.canLoad = true;				
				this.load();
			}
			else{
				///stop
				this.canLoad = false;
			}
		}

		this.load = async function() {
			if (this.canLoad) {
				this.margin += 3;
				if (this.margin >= 105) {
					this.margin = -20;
				}
				this.cont.style.marginLeft = this.margin+"%";

				await sleep(30);
				this.load();
			}
		}

		this.onClick = function(callback) {
			this.view.addEventListener('click', function(event) {
				var offset = $(event.target).offset();
				var width = $(event.target).width();

				var diff = event.clientX - offset.left;
				var percent = (diff/width) * 100;

				callback(event, percent);
			})
		}

		this.setHeight = function(height) {
			this.view.style.height = height+"px";
			this.cont.style.height = height+"px";
		}

		this.setWidth = function(width) {
			this.view.style.width = width+"px";
			this.cont.style.width = width+"px";
		}

		this.setCorners = function(radius) {
			this.view.style.borderRadius = radius+"px";
			this.cont.style.borderRadius = radius+"px";
		}

		this.addClass = function(className) {
			$(this.view).addClass(className);
			return this;
		}

		this.addClasses = function(list) {
			for(var c of list){
				$(this.view).addClass(c);
			}
		}

		this.removeClass = function(className) {
			$(this.view).removeClass(className);
			return this;
		}

		this.getAttribute = function(name) {
			return $(this.view).attr(name);
		}

		this.setAttribute = function(name, value) {
			$(this.view).attr(name, value);
		}
	}

	function toggleSwitch() {
		this.view = document.createElement('font');
		this.cont = document.createElement('font');
		this.toggle = document.createElement('font');
		this.input = document.createElement('input');
		$(this).attr('type', 'checkbox');
		$(this.view).addClass('switch');
		$(this.cont).addClass('cont');
		$(this.toggle).addClass('toggle').addClass('off');
		this.cont.innerHTML = '&nbsp;'
		this.toggle.innerHTML = '&nbsp;'
		this.view.appendChild(this.cont);
		this.view.appendChild(this.toggle);
		this.view.appendChild(this.input);
		this.changecallback = null;

		this.isChecked = function() {
			if (input.checked) {
				return true;
			}
			return false;
		}

		this.setName = function(name) {
			$(this.input).attr('name', name);
		}

		this.setChecked = function(b) {
			if (b) {
				$(this.toggle).removeClass('off').addClass('on');
				this.input.checked = 'checked';
			}
			else{
				$(this.toggle).removeClass('on').addClass('off');
				this.input.checked = '';
			}
		}
	}

	function Snackbar(obj) {
		var div, font, button;

		div = new Div();
		font = new Label();
		button = new Button();

		div.addClasses(['snackbar', 'alert', 'bg-dark', 'clearfix', 'w3-text-white', 'w3-animate-bottom']);

		font.setText(obj.text);
		font.addClasses(['w3-large']);
		div.addView(font);

		button.setText(obj.buttonText);
		button.addClasses(['btn', 'snackbar-btn', 'float-right']);
		button.view.addEventListener('click', function() {
			$(div.view).remove();
			obj.handler();
		})
		div.addView(button);

		document.body.appendChild(div.view);
		var close = function() {
			$(div.view).remove();
		}
		setTimeout(close, 5000);
	}

	function BottomSheetDialog() {
		var maxZ = Math.max.apply(null, 
		    $.map($('body *'), function(e,n) {
		      if ($(e).css('position') != 'static'){
		        return parseInt($(e).css('z-index')) || 1;
		    }
		}));
		this.view = document.createElement("div");
		$(this.view).css('z-index', maxZ+1).css('position', 'fixed').css('top', '0').css('left', '0').css('width', '100%').css('background', 'rgba(0,0,0,.43');
		this.view.style.height = window.innerHeight+"px";
		$(this.view).addClass('bSheet');

		this.view1 = document.createElement("div");
		this.view.appendChild(this.view1);
		$(this.view1).addClass('bottomSheet').addClass('totop').addClass('w3-padding-bottom').addClass('w3-white');

		this.head = new Div();
		this.head.addClasses(['w3-center', 'w3-padding']);
		this.view1.appendChild(this.head.view);

		this.line = new Label();
		this.line.setText("&nbsp;");
		this.line.addClasses(['sheet-line', 'w3-center']);
		$(this.line.view).on('click', function() {
			$('.sheet-content').html('');
			$('.bottomSheet').removeClass('totop').addClass('tobottom');

			var close = function() {
				$('.bSheet').remove();
			}

			setTimeout(close, 900);
		})
		this.head.addView(this.line);

		this.content = new Div();
		this.content.addClasses(['sheet-content']);
		this.view1.appendChild(this.content.view);

		this.show = function() {
			document.body.appendChild(this.view);
			$(this.view1).show();
		}

		this.addView = function(view) {
			this.content.addView(view);
		}
	}

	function Chips(){
		this.view = document.createElement("button");

		this.startIcon = new Icon();
		this.label = new Label();
		this.endIcon = new Icon();

		this.view.appendChild(this.startIcon.view);
		this.view.appendChild(this.label.view);
		this.view.appendChild(this.endIcon.view);

		this.setPadding = function(left, top, right, bottom) {
			this.view.style.padding = top+'px '+left+'px '+bottom+'px '+right+'px';
			return this;
		}

		this.addClass = function(className) {
			$(this.view).addClass(className);
			return this;
		}

		this.removeClass = function(className) {
			$(this.view).removeClass(className);
			return this;
		}

		this.setName = function(name) {
			$(this.view).attr('name', name);
		}

		this.toggleClass = function(className) {
			$(this.view).toggleClass(className);
			return this;
		}

		this.addView = function(elem) {
			this.view.appendChild(elem.view);
			return this;
		}

		this.renderIn = function(id) {
			document.getElementById(id).appendChild(this.view);
		}

		this.removeView = function(view1) {
			this.view.removeChild(view);
			return this;
		}

		this.addClasses = function(list) {
			for(var c of list){
				$(this.view).addClass(c);
			}
		}

		this.getText = function(type) {
			return $(this.label.view).text();
		}

		this.setText = function(text) {
			$(this.label.view).html(text);
			return this;
		}

		this.getAttribute = function(name) {
			return $(this.view).attr(name);
		}

		this.isActive = function() {
			return $(this.view).hasClass('active');
		}

		this.setAttribute = function(name, value) {
			$(this.view).attr(name, value);
		}

		this.onClick = function(callback) {
			this.view.addEventListener('click', function(event){
				callback(event);
			})
		}

		this.setStartIcon = function(icon) {
			this.startIcon.addClasses(icon.split(" "));
			this.startIcon.addClasses(['mr-10']);
		}

		this.showEndIcon = function() {
			this.endIcon.addClasses(['fa', 'fa-times-circle', 'ml-10', 'w3-hover-text-red']);
		}
		this.addClasses(['chips', 'w3-round-xlarge', 'w3-hover-light-grey'])
	}

	//{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}
	function Card() {
		this.view = document.createElement("div");
		$(this.view).addClass('bs-sm').addClass('rounded').addClass('rcard');

		this.title = new Label();
		this.secondaryText = new Label();

		this.textContainer = new Div();
		this.textContainer.setPadding(16, 8, 16, 8);

		this.supportingText = new Label();

		this.image = new ImageView();
		$(this.image.view).hide();

		this.view.appendChild(this.image.view);
		this.view.appendChild(this.textContainer.view);

		this.textContainer.view.appendChild(this.title.view);
		this.textContainer.view.appendChild(this.secondaryText.view);
		this.textContainer.view.appendChild(this.supportingText.view);

		this.bottom = new Div();
		this.bottom.addClasses(['pt-15']);
		$(this.bottom.view).hide();

		this.okayButtom = new Button();
		this.bottom.addView(this.okayButtom);
		this.cancelButton = new Button();
		this.bottom.addView(this.cancelButton);
		this.textContainer.addView(this.bottom);

		this.setTitle = function(text) {
			this.title.setText(text);
			this.title.addClasses(['w3-large']);
		}

		this.setSecondaryText = function(text) {
			this.secondaryText.setText(text);
			this.secondaryText.addClasses(['w3-opacity']);
		}

		this.setSupportingText = function(text) {
			this.supportingText.setText("<br>"+text);
			this.supportingText.addClasses(['mt-10', 'w3-opacity']);
		}

		this.addClass = function(className) {
			$(this.view).addClass(className);
			return this;
		}

		this.addClasses = function(list) {
			for(var c of list){
				$(this.view).addClass(c);
			}
		}

		this.setImage = function(src) {
			$(this.image.view).show();
			this.image.setAttribute('src', src);
			this.image.view.style.width = '100%';
		}

		this.setPositiveButton = function(text, callback) {
			$(this.bottom.view).show();
			this.okayButtom.setText(text);
			this.okayButtom.addClasses(['rbtn', 'ripple1', 'text-primary']);
			//return this.okayButtom.view; 

			this.okayButtom.view.addEventListener('click', function() {
				callback();
			})
		}

		this.setNegativeButton = function(text, callback) {
			$(this.bottom.view).show();
			this.cancelButton.setText(text);
			this.cancelButton.addClasses(['rbtn', 'ripple1', 'text-primary', 'ml-10']);
			//return this.okayButtom.view; 

			this.cancelButton.view.addEventListener('click', function() {
				callback();
			})
		}
	}

	function Gallery() {
		this.view = document.createElement("div");
	}

	function Divider() {
		this.view = document.createElement("div");

		this.left = new Div();
		this.right = new Div();
		this.view.appendChild(this.left.view);
		this.view.appendChild(this.right.view);

		$(this.view).addClass('w3-row').addClass('divider');

		this.left.addClasses(['w3-col', 's3', 'w3-center']);
		this.right.addClasses(['w3-col', 's9', 'dividerR']);

		this.title = new Label();
		this.secondaryText = new Label();

		this.textContainer = new Div();
		this.textContainer.setPadding(16, 8, 16, 8);

		this.supportingText = new Label();

		this.image = new ImageView();
		$(this.image.view).hide();

		this.left.addView(this.image);
		this.right.addView(this.textContainer);

		this.textContainer.view.appendChild(this.title.view);
		this.textContainer.view.appendChild(this.secondaryText.view);
		this.textContainer.view.appendChild(this.supportingText.view);

		this.setTitle = function(text) {
			this.title.setText(text+"<br>");
			this.title.addClasses(['w3-large']);
		}

		this.setSecondaryText = function(text) {
			this.secondaryText.setText(text);
			this.secondaryText.addClasses(['w3-opacity']);
		}

		this.setSupportingText = function(text) {
			this.supportingText.setText("<br>"+text);
			this.supportingText.addClasses(['mt-10', 'w3-opacity']);
		}

		this.addClass = function(className) {
			$(this.view).addClass(className);
			return this;
		}

		this.addClasses = function(list) {
			for(var c of list){
				$(this.view).addClass(c);
			}
		}

		this.setAttribute = function(name, value) {
			$(this.view).attr(name, value);
			return this;
		}

		this.setImage = function(src) {
			$(this.image.view).show();
			this.image.setAttribute('src', src);
			this.image.view.style.width = '100%';
		}
	}


	function RateBar(){
		this.view = document.createElement("div");
		$(this.view).addClass('w3-row');
		this.id = Math.floor(Math.random() * 100000);
		$(this.view).attr('id', this.id);
		this.num = 5;
		$(this.view).attr('value', 0);
		this.stars = [];

		this.addClass = function(className) {
			$(this.view).addClass(className);
			return this;
		}

		this.addClasses = function(list) {
			for(var c of list){
				$(this.view).addClass(c);
			}
		}

		this.getValue = function() {
			return $(this.view).attr('value');
		}

		this.setValue = function(value) {
			$(this.view).attr('value', value);
			var pos = value -1;
			var parent = this.id;

			var all = this.stars;

			for(var star of all){
				if($(star).attr('parent') == parent){
					$(star).removeClass('active');
				}
			}

			for(var i = 0; i <= pos; i++){
				$(all[i]).addClass('active');
			}
			//Toast("done, "+parent+", "+pos);
		}

		this.setNumStars = function(num) {
			this.num = num;
			this.reload();
		}

		this.reload = function() {
			this.view.innerHTML = '';
			var width = 100 / this.num;
			this.stars = [];
			for(var i = 0; i < this.num; i++){
				var label = new Label();
				label.addClasses(['w3-col', 'w3-center']);
				label.view.style.width = width+"%";

				var icon = new Icon();
				icon.addClasses(['fa', 'fa-star', 'rate-star']);
				icon.setAttribute('pos', i);
				icon.setAttribute('parent', this.id);
				icon.setAttribute('id', i+""+this.id);
				label.addView(icon);
				this.stars.push(icon.view);
				this.view.appendChild(label.view);
			}
		}

		this.setWidth = function(width) {
			this.view.style.width = width+"px";
		}

		this.reload();
	}

	//666666666666666666666666666666666666666666666666666666666666666666666666666666666

	function OutlinedEditText() {
		this.view = document.createElement("div");
		$(this.view).addClass('edittext2');
		this.mode = "input";
		this.hint = "";
		this.input;

		this.label = new Label();
		this.label.addClasses(['roboto', 'text-primary','hint'])
		this.view.appendChild(this.label.view);

		this.load = function() {
			if (this.mode == "textarea") {
				this.input = new TextArea();
			}
			else{
				this.input = new EditText();
			}
			this.setHint(this.hint);
			this.view.appendChild(this.input.view);
		}

		this.setMode = function(mode) {
			if (this.input != undefined) {
				$(this.input.view).remove();
			}
			this.mode = mode;
			this.load();
		}

		this.setHint = function(hint) {
			this.hint = hint;
			this.label.setText(hint);
			this.input.setHint(hint);
		}

		this.setName = function(name) {
			this.input.setName(name);
		}

		this.getText = function() {
			return this.input.getText();
		}

		this.setText = function(text) {
			this.input.setText(text);
		}

		this.addClass = function(className) {
			$(this.view).addClass(className);
			return this;
		}

		this.addClasses = function(list) {
			for(var c of list){
				$(this.view).addClass(c);
			}
		}

		this.onKeyUp = function(callback) {
			this.input.view.addEventListener('keyup', function(event) {
				callback(event);
			})
		}

		this.setError = function(error) {
			this.removeError();
			this.input.addClasses(['error']);
			this.errorLabel = new Label();
			this.errorLabel.setText(error);
			this.errorLabel.addClasses(['text-danger']);
			this.view.appendChild(this.errorLabel.view);
			this.errorLabel.view.style.display = 'block';
		}

		this.removeError = function() {
			try{
				this.input.removeClass('error');
				$(this.errorLabel.view).remove();
			}catch(E){

			}
		}

		this.showHint = function() {
			this.label.addClasses(['animate-label']);
			$(this.label.view).show();
		}

		this.load();
	}

	function FilledEditText() {
		this.view = document.createElement("div");
		$(this.view).addClass('filled-edittext');
		this.mode = "input";
		this.hint = "";
		this.input;

		this.label = new Label();
		this.label.addClasses(['roboto', 'text-primary','hint'])
		this.view.appendChild(this.label.view);

		this.load = function() {
			if (this.mode == "textarea") {
				this.input = new TextArea();
			}
			else{
				this.input = new EditText();
			}
			this.setHint(this.hint);
			this.view.appendChild(this.input.view);
		}

		this.setMode = function(mode) {
			if (this.input != undefined) {
				$(this.input.view).remove();
			}
			this.mode = mode;
			this.load();
		}

		this.setHint = function(hint) {
			this.hint = hint;
			this.label.setText(hint);
			this.input.setHint(hint);
		}

		this.setName = function(name) {
			this.input.setName(name);
		}

		this.getText = function() {
			return this.input.getText();
		}

		this.setText = function(text) {
			this.input.setText(text);
		}

		this.addClass = function(className) {
			$(this.view).addClass(className);
			return this;
		}

		this.addClasses = function(list) {
			for(var c of list){
				$(this.view).addClass(c);
			}
		}

		this.onKeyUp = function(callback) {
			this.input.view.addEventListener('keyup', function(event) {
				callback(event);
			})
		}

		this.setError = function(error) {
			this.removeError();
			this.input.addClasses(['error']);
			this.errorLabel = new Label();
			this.errorLabel.setText(error);
			this.errorLabel.addClasses(['text-danger']);
			this.view.appendChild(this.errorLabel.view);
			this.errorLabel.view.style.display = 'block';
		}

		this.removeError = function() {
			try{
				this.input.removeClass('error');
				$(this.errorLabel.view).remove();
			}catch(E){

			}
		}

		this.load();
	}

	function StandardEditText() {
		this.view = document.createElement("div");
		$(this.view).addClass('filled-edittext').addClass('tra');
		this.mode = "input";
		this.hint = "";
		this.input;

		this.label = new Label();
		this.label.addClasses(['roboto', 'text-primary', 'hint'])
		this.view.appendChild(this.label.view);

		this.load = function() {
			if (this.mode == "textarea") {
				this.input = new TextArea();
			}
			else{
				this.input = new EditText();
			}
			this.setHint(this.hint);
			this.view.appendChild(this.input.view);
		}

		this.setMode = function(mode) {
			if (this.input != undefined) {
				$(this.input.view).remove();
			}
			this.mode = mode;
			this.load();
		}

		this.setHint = function(hint) {
			this.hint = hint;
			this.label.setText(hint);
			this.input.setHint(hint);
		}

		this.setName = function(name) {
			this.input.setName(name);
		}

		this.setWidth = function(width) {
			$(this.view).css('width', width);
		}

		this.getText = function() {
			return this.input.getText();
		}

		this.setText = function(text) {
			this.input.setText(text);
		}

		this.addClass = function(className) {
			$(this.view).addClass(className);
			return this;
		}

		this.addClasses = function(list) {
			for(var c of list){
				$(this.view).addClass(c);
			}
		}

		this.onKeyUp = function(callback) {
			this.input.view.addEventListener('keyup', function(event) {
				callback(event);
			})
		}

		this.setError = function(error) {
			this.removeError();
			this.input.addClasses(['error']);
			this.errorLabel = new Label();
			this.errorLabel.setText(error);
			this.errorLabel.addClasses(['text-danger']);
			this.view.appendChild(this.errorLabel.view);
			this.errorLabel.view.style.display = 'block';
		}

		this.removeError = function() {
			try{
				this.input.removeClass('error');
				$(this.errorLabel.view).remove();
			}catch(E){

			}
		}

		this.load();
	}

	function ProgressBar() {
		this.view = document.createElement("div");
		$(this.view).addClass('progress');
		this.view.style.height = '10px';
		this.value = 0;

		this.bar = new Div();
		this.bar.addClasses(['progress-bar']);
		this.bar.setHeight(10);
		this.view.appendChild(this.bar.view);

		this.setValue = function(value) {
			this.value = value;
			this.bar.view.style.width = value+"%";
		}

		this.getValue = function() {
			return this.value
		}
	}

	function Select(id){
		if (id != undefined) {
			this.view = document.getElementById(id);
		}
		else{
			this.view = document.createElement("select");
		}

		this.setPadding = function(left, top, right, bottom) {
			this.view.style.padding = top+'px '+left+'px '+bottom+'px '+right+'px';
			return this;
		}

		this.addClass = function(className) {
			$(this.view).addClass(className);
			return this;
		}

		this.removeClass = function(className) {
			$(this.view).removeClass(className);
			return this;
		}

		this.toggleClass = function(className) {
			$(this.view).toggleClass(className);
			return this;
		}

		this.addClasses = function(list) {
			for(var c of list){
				$(this.view).addClass(c);
			}
		}

		this.getText = function(type) {
			return $(this.view).val();
		}

		this.setText = function(text) {
			$(this.view).val(text);
			return this;
		}

		this.getAttribute = function(name) {
			return $(this.view).attr(name);
		}

		this.setAttribute = function(name, value) {
			$(this.view).attr(name, value);
		}

		this.setName = function(value) {
			$(this.view).attr('name', value);
		}

		this.add = function(obj) {
			var option = document.createElement("option");
			option.text = obj.text;
			option.value = obj.value;
			this.view.add(option);
		}

		this.removeAllViews = function() {
			this.view.innerHTML = '';
		}

		this.on = function(e_name, callback) {
			this.view.addEventListener(e_name, function(event) {
				callback(event);
			})
		}

		this.onChange = function(callback) {
			this.view.addEventListener('change', function(event) {
				callback(event);
			})
		}
	}

	function Hr() {
		this.view = document.createElement("hr");
	}

	function Br() {
		this.view = document.createElement("br");
	}


	function Dialog() {
		this.view = document.createElement("div");
		var maxZ = Math.max.apply(null, 
		    $.map($('body *'), function(e,n) {
		      if ($(e).css('position') != 'static'){
		        return parseInt($(e).css('z-index')) || 1;
		    }
		}));
		$(this.view).css('z-index', (maxZ+1));
		this.view.classList.add("w3-modal");
		this.view.addEventListener('click', function(event) {
			var d = event.target;
			$(d).fadeOut(600);
			var cloze = function() {
				$(d).remove();
			}

			setTimeout(cloze, 600);
		})

		this.content = new Rodz.Div();
		this.content.view.addEventListener('click', function(event) {
			event.stopPropagation();
		})
		this.view.appendChild(this.content.view);
		this.content.addClasses(['w3-modal-content', 'w3-padding-large', 'w3-round w3-white shadow', 'md']);

		this.title = new Rodz.Label();
		this.title.addClasses(['block', 'h3']);
		this.content.addView(this.title);

		this.message = new Rodz.Label();
		this.message.addClasses(['text-secondary']);
		this.content.addView(this.message);

		this.external = new Rodz.Div();
		this.external.addClasses(['pt-10', 'pb-10']);
		this.content.addView(this.external);

		this.bottom = new Rodz.Div();
		this.bottom.addClasses(['clearfix']);
		this.content.addView(this.bottom);

		this.right = new Rodz.Span();
		this.right.addClasses(['float-right']);
		this.bottom.addView(this.right);

		this.negativeButton = new MaterialButton();
		this.negativeButton.setVariant("text");
		this.negativeButton.hide();
		this.right.addView(this.negativeButton);
		
		this.positiveButton = new MaterialButton();
		this.positiveButton.setVariant("text");
		this.positiveButton.addClasses(['ml-15']);
		this.positiveButton.hide();
		this.right.addView(this.positiveButton);


		this.setTitle = function(text) {
			this.title.setText(text);
		}

		this.setMessage = function(text) {
			this.message.setText(text);
		}

		this.setPositiveButton = function(text, callback) {
			this.positiveButton.show();
			this.positiveButton.setText(text);
			this.positiveButton.onClick(function() {
				callback();
			})
		}

		this.setNegativeButton = function(text, callback) {
			this.negativeButton.show();
			this.negativeButton.setText(text);
			this.negativeButton.onClick(function() {
				callback();
			})
		}

		this.setView = function(view) {
			this.external.addView(view);
		}

		this.setContentView = function(view) {
			this.external.addView(view);
		}

		this.show = function() {
			document.body.appendChild(this.view);
			this.view.style.display = 'block';
		}

		this.close = function() {
			$(this.view).fadeOut(600);
			var cloze = function() {
				$(this.view).remove();
			}

			setTimeout(cloze, 600);
		}

		this.cancel = function() {
			$(this.view).fadeOut(600);
			var cloze = function() {
				$(this.view).remove();
			}

			setTimeout(cloze, 600);
		}
	}

	//start Image Chips
	function ImageChips() {
		this.view = document.createElement("font");
		this.view.classList.add("image-chips");

		this.iv = new Rodz.ImageView();
		this.view.appendChild(this.iv.view);

		this.font = new Rodz.Label();
		this.font1 = new Rodz.Label();
		this.font.addClasses(['font']);
		this.font1.addClasses(['font1']);

		this.view.appendChild(this.font.view)
		this.view.appendChild(this.font1.view);

		this.setImage = function(src) {
			this.iv.setSource(src);
		}

		this.setText = function(text) {
			this.font.setText(text);
			this.font1.setText(text);
		}

		this.getAttribute = function(name) {
			return $(this.view).attr(name);
		}

		this.setAttribute = function(name, value) {
			$(this.view).attr(name, value);
		}

		this.onClick = function(callback) {
			this.view.addEventListener('click', function(event){
				callback(event);
			})
		}

		this.on = function(e_name, callback) {
			this.view.addEventListener(e_name, function(event) {
				callback(event);
			})
		}

		this.setAttributes = function(obj) {
			for(const key in obj){
				this.setAttribute(key, obj[key]);
			}
		}

		this.css = function(name, value) {
			$(this.view).css(name, value);
			return this;
		}

		this.addClass = function(className) {
			$(this.view).addClass(className);
			return this;
		}

		this.addClasses = function(list) {
			for(var c of list){
				$(this.view).addClass(c);
			}
		}

		this.removeClass = function(className) {
			$(this.view).removeClass(className);
			return this;
		}

		this.toggleClass = function(className) {
			$(this.view).toggleClass(className);
			return this;
		}
	}


	return {Spinner,TabPanel, Div,Span,
		ImageView,
		CheckBox,
		Form,
		Canvas,
		Label,
		Button,
		MaterialButton,
		EditText,
		TextArea,
		Icon,
		Modal,
		BootstrapModal,
		closeModal,
		Table,
		ProgressIndicator,
		toggleSwitch,
		Snackbar,
		BottomSheetDialog,
		Chips,
		Card,
		Gallery,
		Divider,
		RateBar,
		OutlinedEditText,
		FilledEditText,
		StandardEditText,
		Select,
		ProgressBar,
		Br, Hr,
		Dialog,
		ImageChips
	}
})();
	

$(document).on('click', '.tabButton', function(event) {
	$('.tabButton').removeClass('active').addClass('w3-white');
	$(this).removeClass('w3-white').addClass('active');
	var id = $(this).attr('linker');
	$('.tabContent').hide();
	$('#'+id).show();

	//animate the bottom bar

	//create a ripple effect
	var dim = $(this).offset();

	var wrap = document.createElement("span");
	this.appendChild(wrap);
	$(wrap).css('position', 'absolute').css('left', '0').css('top', '0').css('width', '100%').css('height', this.clientHeight+"px");
	var x = event.clientX - dim.left;
	var y = event.clientY - dim.top;
	//write the css
	var style = document.getElementById('stylesheet1');
	var keyFrames = "@keyframes ripple{from{width: 0;height: 0;top: "+y+"px;left: "+x+"px;} to{width: 100%;height: 100%;top: 0;left: 0;}}";
	style.innerHTML = keyFrames

	wrap.classList.add('mrip');
	var remove = function() {
		$(wrap).fadeOut(100);
	}

	setTimeout(remove, 500);
})

var LayoutInflator = {
	inflate : function(resource, elem, callback) {
		var new_str = '';
		for(var i = 0; i < resource.length; i++){
			if (resource.substr(i,1) == ".") {
				new_str += "/";
			}
			else{
				new_str += resource.substr(i,1);
			}
		}
		
		resource = new_str+".html";

		//Toast(resource);

		$.get(resource, function(response, status) {
			//Toast(response);
			elem.innerHTML += response;
			callback();
		})
	}
}

function productView(product){
	var cont = new Div();
	cont.setOrientation(LinearLayout.VERTICAL);
	cont.addClasses(['w3-col', 'w3-padding-small', 'produ', 'wid']);
	cont.setAttribute('views', product.views);
	cont.setAttribute('price', product.price);
	
	var bordered = new Div()
	cont.addView(bordered);
	bordered.addClasses(['w3-white', 'prodShadow', 'ya']);
	bordered.setOrientation(LinearLayout.VERTICAL);
	bordered.setAttribute('data', product.id);

	var ivContainer = new Div();
	ivContainer.addClasses(['w3-padding', 'pointer', 'w3-hover-grey', 'ivContainer', 'cc']);
	ivContainer.setOrientation(LinearLayout.VERTICAL);
	ivContainer.setAttribute('data', product.id);
	
	var iv = new ImageView();
	iv.setAttribute('src', 'products/'+product.resampled);
	iv.setAttribute('width', '100%');
	ivContainer.addView(iv);
	bordered.addView(ivContainer);

	var textContainer = new Div();
	bordered.addView(textContainer);
	textContainer.addClasses(['w3-padding-small', 'cc']);
	textContainer.setOrientation(LinearLayout.VERTICAL);

	var name = new Label();
	name.setText(product.name);
	name.addClasses(['fade-text']);
	textContainer.addView(name);

	var features = new Label();
	features.setText(product.features);
	features.addClasses(['w3-small', 'text-primary', 'fade-text']);
	textContainer.addView(features);

	var bottom = new Div();
	bottom.addClasses(['clearfix', 'pt-10', 'pb-15']);

	var stars = new Label();
	stars.view.innerHTML = '3.5 <i class="fa fa-star"></i>';
	stars.addClasses(['w3-opacity']);
	bottom.addView(stars);

	var price = new Label();
	price.setText("K"+product.price);
	price.addClasses(['float-right']);
	bottom.addView(price);
	textContainer.addView(bottom);

	return cont;
}

$(document).on('click', '.ivContainer, .ya', function(event){
	window.location = 'product-details.php?id='+$(this).attr('data');
});

$(document).on('click', '.switch', function() {
	var toggle = this.getElementsByClassName('toggle')[0];
	var input = this.getElementsByTagName('input')[0];

	if ($(toggle).hasClass('off')) {
		$(toggle).removeClass('off').addClass('on');
		input.checked = 'checked';
	}
	else{
		$(toggle).removeClass('on').addClass('off');
		input.checked = '';
	}

	try{
		toggleSwitchChanged(input);
	}catch(E){
		alert(E.toString());
	}
});

$(document).on('click', '.chips', function() {
	if ($(this).hasClass('active')) {
		$(this).removeClass('active').addClass('w3-light-grey');
		try{
			chipsClicked($(this).attr('name'), true);
		}catch(E){}
	}
	else{
		$(this).removeClass('w3-light-grey').addClass('active');
		try{
			chipsClicked($(this).attr('name'), false);
		}catch(E){}
	}
})


$(document).on('click', '.rate-star', function(event) {
	var pos = Number($(this).attr('pos'));
	var parent = $(this).attr('parent');

	var all = document.getElementsByClassName('rate-star');

	for(var star of all){
		if($(star).attr('parent') == parent){
			$(star).removeClass('active');
		}
	}

	for(var i = 0; i <= pos; i++){
		$('#'+i+""+parent).addClass('active');
	}
	pos += 1;

	$('#'+parent).attr('value', pos);
})


$(document).on('focus', '.edittext2 input, .edittext2 textarea, .filled-edittext input', function(event) {
	var div = this.parentElement;
	var label = div.getElementsByTagName('font')[0];
	if ($(div).hasClass("filled-edittext")) {
		$(label).removeClass('animate-labelf').addClass('animate-labelf').addClass('text-primary').show();
	}
	else{
		$(label).removeClass('animate-label').addClass('animate-label').addClass('text-primary').show();
	}
	$(this).attr('placeholder', '');
})

$(document).on('blur', '.edittext2 input, .edittext2 textarea, .filled-edittext input', function(event) {
	if (this.value == "") {
		var div = this.parentElement;
		var label = div.getElementsByTagName('font')[0];
		$(label).hide();
		$(this).attr('placeholder', label.innerHTML);
	}
	else{
		var div = this.parentElement;
		var label = div.getElementsByTagName('font')[0];
		$(label).removeClass('text-primary');
		//$(this).attr('placeholder', label.innerHTML);
	}
});


function inflateContextMenu(event, resource) {
	var new_str = '';
	for(var i = 0; i < resource.length; i++){
		if (resource.substr(i,1) == ".") {
			new_str += "/";
		}
		else{
			new_str += resource.substr(i,1);
		}
	}
	
	resource = new_str+".json";

	//Toast(resource);

	$.get(resource, function(response, status) {
		try{
			//var obj = JSON.parse(response);
			var container2 = new Rodz.Div();
			container2.addClasses(['menuContainer', 'w3-white']);
			document.body.appendChild(container2.view);
			container2.view.style.top = (event.clientY)+"px";
			container2.view.style.left = (event.clientX)+"px";
			container2.view.style.display = 'block';

			for(var menu of response){
				var dic = new Rodz.Div();
				dic.addClasses(['w3-padding', 'pointer','w3-hover-light-grey', 'menuC', 'rounded']);
				dic.setAttribute('data', menu.id);

				if(menu.icon != undefined){
					var ic = new Rodz.Icon();
					ic.addClasses(menu.icon.split(" "));
					ic.addClasses(['mr-15']);
					dic.addView(ic);
				}

				var tit = new Rodz.Label();
				tit.setText(menu.title);
				dic.addView(tit);

				container2.addView(dic);
			}
		}
		catch(E){
			alert(E.toString()+response);
		}
	})
}

$(document).on('click', function(event) {
	$('.menuContainer').remove();
});

$(document).on('click', '.menuC', function(event) {
	try{
		contextMenuCliked($(this).attr('data'));
	}
	catch(E){
		alert(E.toString());
	}
})


//add ripple effects to material button
$(document).on('click', '.btn2', function(event) {
	/*//create a ripple effect
	var dim = $(this).offset();
	var half = this.clientHeight/2;

	var wrap = document.createElement("span");
	this.appendChild(wrap);
	$(wrap).css('position', 'absolute').css('left', '0').css('top', '0').css('width', '100%').css('height', this.clientHeight+"px").css('background', 'rgba(255, 255, 255, 0.2)');
	var x = event.clientX - dim.left;
	var y = event.clientY - dim.top;
	//write the css
	var style = document.getElementById('stylesheet1');
	var keyFrames = "@keyframes ripple{0%{width: 0;height: 0;top: "+y+"px;left: "+x+"px;border-radius:50%} 40%{width:"+half+"px; height:"+half+"px;border-radius:50%;top: "+y+"px;left: "+x+"px;} 100%{width: 100%;height: 100%;top: 0;left: 0;}}";
	style.innerHTML = keyFrames

	wrap.classList.add('btn2-rip');
	var remove = function() {
		$(wrap).fadeOut(100);
	}

	setTimeout(remove, 500); */
})



//ansyncronous request -- jquery ajax copy 

function post(url, formdata, callback){
	var ajax = new XMLHttpRequest();

	var completeHandler = function(event) {
        var response = event.target.responseText;
        callback(response);
    }
    
    var progressHandler = function(event) {
        //try{return obj.progress(event.loaded, event.total);}catch(E){}
    }
    
    ajax.upload.addEventListener("progress", progressHandler, false);
    ajax.addEventListener("load", completeHandler, false);
    //ajax.addEventListener("error", errorHandler, false);
    //ajax.addEventListener("abort", abortHandler, false);
    ajax.open("POST", url);
    ajax.send(formdata);
}



///RODZ DROPDOWN
function DropDown(id) {
		if (id == undefined) {
			this.view = document.createElement("button");

			var classes = ['w3-padding-small', 'w3-round-xlarge', 'border', 'rodzDrop', 'w3-hover-light-grey'];
			for(var cl of classes){
				this.view.classList.add(cl);
			}

			this.id = Math.floor(Math.random()* 2093029);
			
			$(this.view).attr('data', '[]').attr('hasShow', 'false').attr('id', this.id);
			this.view.style.outline = 'none';
			this.view.style.background = 'inherit';


			this.label = new Label();
			this.icon = new Icon();
			this.icon.addClasses(['fa-angle-down', 'ml-10']);
			this.label.setAttribute('id', 'rdl'+this.id);
			this.icon.setAttribute('id', 'rdi'+this.id);

			this.view.appendChild(this.label.view);
			this.view.appendChild(this.icon.view);
			$(this.view).attr('value', '');
		}
		else{
			this.view = document.getElementById(id);
			this.id = id;
			this.label = new Label('rdl'+id);
			this.icon = new Icon('rdi'+id);
		}

		this.getId = function() {
			return this.id;
		}

		this.setHint = function(text) {
			this.label.setText(text);
		}

		this.add = function(obj) {
			var json = JSON.parse($(this.view).attr('data'));
			json.push(obj);
			$(this.view).attr('data', JSON.stringify(json));
		}

		this.setValue = function(value) {
			$(this.view).attr('value', value);
		}

		this.getValue = function(value) {
			return $(this.view).attr('value');
		}

		this.getText = function() {
			return this.label.getText();
		}

		this.getHint = function() {
			return this.label.getText();
		}

		this.addClass = function(className) {
			$(this.view).addClass(className);
			return this;
		}

		this.removeClass = function(className) {
			$(this.view).removeClass(className);
			return this;
		}

		this.toggleClass = function(className) {
			$(this.view).toggleClass(className);
			return this;
		}

		this.addClasses = function(list) {
			for(var c of list){
				$(this.view).addClass(c);
			}
		}

		this.getAttribute = function(name) {
			return $(this.view).attr(name);
		}

		this.setAttribute = function(name, value) {
			$(this.view).attr(name, value);
		}

		this.setAttributes = function(obj) {
			for(const key in obj){
				this.setAttribute(key, obj[key]);
			}
		}
	}

	$(document).on('click', '.rodzDrop', function(event) {
		event.stopPropagation();
		var element = this;
		var drop_id = $(element).attr('id');

		$('.rodzDropContent').remove();

		var offset = $(element).offset();
		var elem_width = element.clientWidth;
		var center = offset.left + (elem_width/2);
		var width = 350;
		var offset_left = center - (width/2);

		//show notification
		var notificationsContainer = new Div();
		notificationsContainer.css('position', 'absolute').css('left', offset.left+"px").css('top', (offset.top + element.clientHeight +4)+"px").css('z-index', '20').css('min-width', elem_width+"px").css('min-height', '40px').css('max-height', '250px').css('overflow-y', 'auto');
		notificationsContainer.addClasses(['prodShadow', 'rounded', 'w3-white', 'rodzDropContent', 'w3-padding-small']);
		document.body.appendChild(notificationsContainer.view);

		var json = JSON.parse($(element).attr('data'));

		for(var row of json){
			var option = new Div();
			option.setAttributes({
				class:"w3-padding-small w3-white w3-hover-light-grey pointer rounded rodzDropOption",
				value:row.value,
				target:drop_id,
				text:row.text
			})
			notificationsContainer.addView(option);

			var label = new Label();
			label.setText(row.text);
			option.addView(label);
		}
	});


	$(document).on('click', '.rodzDropOption', function(event) {
		var target = $(this).attr('target');
		var text = $(this).attr('text');
		var value = $(this).attr('value');

		var drop = new DropDown(target);
		drop.setHint(text);
		drop.setValue(value);
		$('.rodzDropContent').remove();
	})

	$(document).on('click', function(event) {
		$('.rodzDropContent').remove();
	})

///END RODZ DROPDOWN


//make check box work when clicked on a container
$(document).on('click', '.check', function(event) {
	var element = this;
	var check = element.getElementsByTagName('input')[0];
	if (check != null) {
		if (check.checked) {
			check.checked = '';
		}
		else{
			check.checked = 'checked';
		}
	}
});

$(document).on('click', '.check input', function(event) {
	event.stopPropagation();
})
$(document).on('change', '.check input', function(event) {
	event.stopPropagation();
})


	///BOOTSTRAP TABLE SEARCHABLE AND PAGINATION
	function searchTable(id){
		console.log("id was "+id);
		var table = document.getElementById(id);

		var addPadd = function() {
			for(var arg of arguments){
				arg.addClasses(['w3-white', 'w3-padding-small', 'border', 'pointer', 'w3-hover-light-grey']);
				arg.view.style.marginRight = '3px';
			}
		}
		
		var div = new Rodz.Div();
		div.addClasses(['w3-padding']);

		var label = new Rodz.Label();
		label.setText("Search in ");

		var select = new Rodz.Select();
		var ths = table.getElementsByTagName('th');
		var i = 0;
		for(var th of ths){
			select.add({text:th.innerHTML, value:i});
			i += 1;
		}

		var input = new Rodz.EditText();
		input.setHint("Search..");
		input.view.style.display = 'inline';


		var start_btn = new Rodz.Button();
		start_btn.setText("<<");
		start_btn.setAttribute('title', 'Go to Start');

		var prev_btn = new Rodz.Button();
		prev_btn.setText("<");
		prev_btn.setAttribute('title', 'Previous');

		var page = new Rodz.Select();
		var pages = Math.ceil(table.rows.length / 25);
		for(var i = 1; i <= pages; i++){
			page.add({text:i,value:i});
		}

		var next_btn = new Rodz.Button();
		next_btn.setText(">");
		next_btn.setAttribute('title', 'Next');

		var end_btn = new Rodz.Button();
		end_btn.setText(">>");
		end_btn.setAttribute('title', 'Go to Last');


		var rows_label = new Rodz.Label();
		rows_label.setText("Show rows");


		var show_rows = new Rodz.Select();
		var data = [25, 50, 100, 200, 500];
		for(var d of data){
			show_rows.add({text:d, value:d});
		}


		div.addAll(start_btn, prev_btn, page, next_btn, end_btn, rows_label, show_rows, label, select, input);
		addPadd(start_btn, prev_btn, page, next_btn, end_btn, select, input, show_rows);

		$(table).before(div.view);

		var refreshView = function() {
			var pg = Number(page.getText());
			var rws = Number(show_rows.getText());

			var initial = rws * (pg-1);
			var final = initial + rws;

			for(var i = 0; i < table.rows.length; i++){
				if (i >= initial && i < final) {
					$(table.rows[i]).show()
				}
				else{
					$(table.rows[i]).hide()
				}
			}
			$(table.rows[0]).show()
		}
		refreshView();

		input.onKeyUp(function(event) {
			var text = input.getText();
			var column = Number(select.getText());

			var trs = table.getElementsByTagName("tr");
			for(var tr of trs){
				var td = tr.children[column];

				if (td.innerHTML.toLowerCase().indexOf(text.toLowerCase()) != (0-1)) {
					$(tr).show();
				}
				else{
					$(tr).hide();
				}
			}
		})
		
		next_btn.onClick(function() {
			var pg_num = Number(page.getText());
			var pages = Math.ceil(table.rows.length / 25);

			if(pages > pg_num){
				pg_num += 1;
				page.setText(pg_num);
				refreshView();
			}
		})

		prev_btn.onClick(function() {
			var pg_num = Number(page.getText());

			if(pg_num > 1){
				pg_num -= 1;
				page.setText(pg_num);
				refreshView();
			}
		});

		end_btn.onClick(function() {
			var pages = Math.ceil(table.rows.length / 25);
			page.setText(pages);
			refreshView();
		})

		start_btn.onClick(function() {
			page.setText(1);
			refreshView();
		});

		show_rows.onChange(function(event) {
			refreshView();
		})
	}
	//END BOOTSTRAP TABLE SEARCH