<style type="text/css">
    .active.lfB{
        background: white;
        color: var(--blue) !important;
        padding: 15px 0px !important;
        position: relative;
    }
    .active.lfB font{
        display: none;
    }
    .active.lfB:before{
        content: "";
        height: 20px;
        width: 5px;
        border-radius: 4px;
        position: absolute;
        top: calc(50% - 10px);
        left: 0;
        background: var(--blue) !important;
    }
    .active.lfB:hover{
        background: white !important;
    }
    .lfB:hover{
        background: rgba(0, 0, 0, .05);
    }
</style>
<div id="nav" class="w3-light-grey nav2">
    <div class="pt-20" style="position:relative">
        <center>
            <font class="w3-large roboto pointer" onclick="goHome() "><img src="images/logo.png" width="22"> <br><?=$config['name'];?></font>
        </center>
        <br>
        <div class="search-cont mt-30" style="position:relative;display: none;">
            <input type="text" name="" placeholder="Search" onkeyup="topSearch(this, event)">
            <i class="fa fa-search"></i>
        </div>
        <div class="pt-25" style="padding-right: 5px;">
            <div class="w3-padding w3-margin-small pointer rounded w3-center active lfB">
                <i class="far fa-play-circle mr-15 fa-2x"></i><br> 
                <font class='w3-small ubuntu'>Listen Now</font>
            </div>
            <div class="w3-padding w3-margin-small pointer rounded w3-center lfB">
                <i class="fa fa-th-large mr-15 fa-2x"></i><br> 
                <font class='w3-small ubuntu'>Broswe</font>
            </div>
            <div class="w3-padding w3-margin-small pointer rounded w3-center lfB">
                <i class="fa fa-tasks mr-15 fa-2x"></i><br> 
                <font class='w3-small ubuntu'>Radio</font>
            </div>
        </div>
        <hr>
        <div class="pt-25">
            <div class="w3-padding w3-margin-small pointer w3-hover-light-green rounded">
                <span style="height:16px;width: 16px;" class="mr-15"><svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" class="style-scope yt-icon" style="pointer-events: none; display: inline-block;height: 20px;width: 16px;"><g class="style-scope yt-icon"><path d="M14,12c0,1.1-0.9,2-2,2s-2-0.9-2-2s0.9-2,2-2S14,10.9,14,12z M8.48,8.45L7.77,7.75C6.68,8.83,6,10.34,6,12 s0.68,3.17,1.77,4.25l0.71-0.71C7.57,14.64,7,13.39,7,12S7.57,9.36,8.48,8.45z M16.23,7.75l-0.71,0.71C16.43,9.36,17,10.61,17,12 s-0.57,2.64-1.48,3.55l0.71,0.71C17.32,15.17,18,13.66,18,12S17.32,8.83,16.23,7.75z M5.65,5.63L4.95,4.92C3.13,6.73,2,9.24,2,12 s1.13,5.27,2.95,7.08l0.71-0.71C4.02,16.74,3,14.49,3,12S4.02,7.26,5.65,5.63z M19.05,4.92l-0.71,0.71C19.98,7.26,21,9.51,21,12 s-1.02,4.74-2.65,6.37l0.71,0.71C20.87,17.27,22,14.76,22,12S20.87,6.73,19.05,4.92z" class="style-scope yt-icon"></path></g></svg></span> <br>My Mixes<font id="current"></font>
            </div>
        </div>
        <div style="position:absolute;bottom:0" class="w3-padding center w3-tiny">
            <a href="#">Powered by Rodz</a>
            <audio id="audio" style="display:none;"></audio>
        </div>
    </div>
</div>
<script type="text/javascript">
    $(document).ready(function() {
        _('nav').style.height = window.innerHeight+"px";
        _('nav').getElementsByTagName('div')[0].style.height = (window.innerHeight-2)+"px";
    })

    function topSearch(element, event) {
        if (search_container == null) {
            search_container = new Div();
            var x = $(event.target).offset();
            var size_x = (element.clientWidth / 2) + element.clientWidth;
            search_container.css('position', 'fixed').css('top', (x.top + event.target.clientHeight + 4)+"px").css('left', x.left+"px").css('width', size_x+"px").css('min-height', '400px').css('z-index', '12');
            search_container.addClasses(['shadow', 'white-grad', 'rounded']);
            document.body.appendChild(search_container.view);
        }

        if (element.value.length == 0) {
            if (search_container != null) {
                $(search_container.view).hide();
            }
        }
        else{
            if (event.keyCode == 13) {
                window.location = 'search.php?q='+element.value;
            }
            $(search_container.view).show();
            search_container.view.innerHTML = 'searching...';

            $.post("handler.php?search="+element.value, function(response, status) {
                try{
                    var obj = JSON.parse(response);
                    search_container.removeAllViews();

                    var word = function(r) {
                        var div = new Div();
                        div.addClasses(['w3-padding', 'pointer', 'w3-hover-light-grey', 'word']);
                        div.setAttribute('data', r.id);

                        var i = new Icon();
                        i.addClasses(['fa fa-search', 'ml-10', 'mr-10', 'w3-opacity', 'w3-small']);

                        var tit = new Label();
                        tit.setText(r.name);
                        div.addAll(i, tit);
                        return div;
                    }

                    var song_show = function(row) {
                        var divrow = new Div();
                        divrow.addClasses(['w3-row', 'mb-10', 'viewSong']);
                        divrow.setAttribute('data', row.id);

                        var left = new Div();
                        left.addClasses(['w3-col s2', 'w3-center']);
                        divrow.addView(left);

                        var iv = new ImageView();
                        iv.setAttribute('src', 'artwork/'+row.resampled_artwork);
                        iv.setAttribute('width', '80%');
                        iv.addClasses(['rounded']);
                        left.addView(iv)

                        var right = new Div();
                        right.addClasses(['w3-col s10', 'pl-10']);
                        divrow.addView(right);

                        var title = new Label();
                        title.setText(row.title);
                        title.addClasses(['roboto', 'block']);
                        right.addView(title);

                        var artist = new Label();
                        artist.setText(row.artist);
                        artist.addClasses(['w3-small', 'block']);
                        right.addView(artist);


                        return divrow;
                    }

                    for(var row of obj.artists){
                        search_container.addView(word(row));
                    }

                    search_container.addView(new Hr());

                    for(var row of obj.songs){
                        search_container.addView(song_show(row));
                    }
                }
                catch(E){
                    alert(E.toString()+response);
                }
            })
        }
    }

    function goHome() {
        var url = "http://localhost/songs";
        window.location = url;
    }

    $(document).on('click', '.viewSong', function(event) {
        var id = $(this).attr('data');
        window.location = 'song.php/?id=' + id;
        //alert(id);
    })

    $(document).on('click', '.word', function(event) {
        var id = $(this).attr('data');
        window.location = 'artist.php?id=' + id;
        //alert(id);
    });

    $(document).on('click', '.lfB', function(event) {
        $('.lfB').removeClass('active');
        $(this).addClass('active');
    })
</script>