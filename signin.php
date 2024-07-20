<div class="w3-padding">
	<font class="w3-padding pointer signBtn w3-text-black">Log In</font><font class="w3-padding-large w3-large pointer signBtn w3-text-black">Sign Up</font>
</div>
<div class="sign-cont" id="SignUp">
	<form class="w3-padding" id="signupForm">
		<div class="w3-padding-bottom">
			<input type="text" name="phone" placeholder="Your phone number" class="border w3-padding w3-white" style="width:100%">
		</div>
		<div class="w3-padding-bottom">
			<input type="text" name="username" placeholder="Username" class="border w3-padding w3-white" style="width:100%">
		</div>
		<div class="w3-padding-bottom">
			<input type="password" name="password" placeholder="Password" class="border w3-padding w3-white" style="width:100%">
		</div>
		<div class="w3-padding-bottom">
			<input type="password" name="confirm" placeholder="Retype Password" class="border w3-padding w3-white" style="width:100%">
		</div>
		<div class="w3-row-padding">
			<div class="w3-half">
				<input type="radio" name="gender" value="Male" id="Male" checked> <label for="Male">Male</label>
			</div>
			<div class="w3-half">
				<input type="radio" name="gender" value="Female" id="Female"> <label for="Female">Female</label>
			</div>
		</div>
		<button class="btn2 primary" style="width:100%">Sign Up</button>
		<div class="w3-padding">
			<input type="checkbox" name="accept" value="aggreement" id="accept"> <label for="accept">I have read and accept <a href="#">Terms</a></label>
		</div>
	</form>
</div>
<div class="sign-cont" id="LogIn" style="display:none;">
	<form class="w3-padding" id="loginForm" style="display:none">
		<font id="login_error" class="block text-danger"></font>
		<div class="w3-padding-bottom">
			<input type="text" name="phone_login" placeholder="Your phone number" class="border w3-padding w3-white" style="width:100%">
		</div>
		
		<div class="w3-padding-bottom">
			<input type="password" name="password" placeholder="Password" class="border w3-padding w3-white" style="width:100%">
		</div>
		
		<button class="btn2 primary" style="width:100%">Log In</button>
		<div class="pt-20">
			<center>
				- or -
			</center>
		</div>
		<div class="w3-padding pointer w3-hover-text-blue" onclick="window.location = 'scan.php'">
			<i class="fa fa-qrcode"></i> Scan with your phone
		</div>
	</form>
	<div id="react-login"></div>
</div>