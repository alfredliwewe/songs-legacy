<div style="position:relative" id="playerModalContainer">
	<div class="w3-row" id="top_bar_modal">
		<div class="w3-col m3">&nbsp;</div>
		<div class="w3-col m4">
			<div class="top_search1">
				<input type="text" name="" id="modal_search_input" placeholder="Search.." onkeyup="searchModal(event)">
				<i class="fa fa-search"></i>
			</div>
		</div>
		<div class="w3-col m5 clearfix">
			<i class="fa fa-times float-right fa-2x pointer w3-hover-text-red" style="display:none" onclick="closeModalPlayer();"></i>
			<button class="button mui-button mui-icon-button mui-small float-right" onclick="closeModalPlayer();">
				<i class="fa fa-times"></i>
			</button>
		</div>
	</div>
	<div class="w3-row" id="modalDisplay">
		<div class="w3-col m7" id="firstSongPlay">&nbsp</div>
		<div class="w3-col m5">
			<div id="relatedPlay" class="w3-padding"></div>
		</div>
	</div>
</div>