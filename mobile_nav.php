<!--Modal for mobile navigation -->
<div class="w3-modal" id="nav_mobile_modal" style="padding-top: 0px;background: rgba(255,255,255,0.01) !important;">
	<div class="w3-modal-content w3-animate-right" style="width: 100%;margin: 0px !important;">
		<div class="w3-padding-large clearfix bg-dark">
			<i class="fa fa-times fa-2x float-right pointer w3-hover-text-red" onclick="$('#nav_mobile_modal').slideUp();"></i>
		</div>
		<div class="bg w3-padding-jumbo">
			<a href="../" class="w3-btn w3-block bg w3-text-white w3-padding-xlarge w3-border-bottom w3-border-grey w3-large bold" style="text-align:left;">Home</a><a onclick="$('#nav_mobile_modal').hide();$('#results_container').show();$('#top_search').focus();" class="w3-btn w3-text-white w3-block w3-padding-xlarge w3-border-bottom w3-border-white w3-large bold" style="text-align:left;">Search <i class="fa fa-search"></i></a><a href="../signin/" class="w3-btn bg w3-text-white w3-block w3-padding-xlarge w3-border-bottom w3-border-grey w3-large bold" style="text-align:left;">Sign In</a>
		</div>
	</div>
</div>
<!--End modal for mobile navigation -->

<div class="w3-modal" id="results_container" style="padding-top: 20px;">
    <div class="w3-modal-content w3-card-16 w3-round-large" style="width: 500px;padding-bottom: 30px;">
        <div class="w3-padding-large bg rounded-top">
            <i class="fa fa-search w3-hover-text-yellow pointer" onclick="$('#results_container').fadeOut();"></i> Search in RODZ Music <i class="fa fa-times w3-right w3-hover-text-red pointer" onclick="$('#results_container').fadeOut();"></i>
        </div>
        <div class="w3-padding w3-row" id="main_content">
            <input type="text" name="top_search" id="top_search" class="form-control border" placeholder="Type in here...">
            <div style="max-height: 400px; overflow: auto;">
	            <div id="search_result_container">
	            	<h4>Previous searches</h4>
	            </div>
	        </div>
        </div>
        <div class="w3-padding clearfix">
            <button class="btn btn-danger btn-sm float-right" onclick="$('#results_container').fadeOut();">Close</button>
        </div>
    </div>
</div>

<script type="text/javascript">
	$('#top_search').on('keyup', function(event) {
		event.preventDefault();

		var text = $(this).val();

		$('#search_result_container').html('<h4>Search results</h4>');

		$.ajax({
			url: "../search.php",
			method: "POST",
			data: {text:text},
			success: function(response) {
				$('#search_result_container').html($('#search_result_container').html()+"<p>"+response+"</p>");
			}
		})
		
	})
</script>