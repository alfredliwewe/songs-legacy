function PrintMuiSlider(props){
    return (
        <div className="mui-slider" id={props.id} style={{height:"40px"}}>
			<input type="range" name="" style={{display: "none"}} />
			<div className="slider-rail">&nbsp;</div>
			<span className="slider-progress">&nbsp;</span>
			<span className="slider-thumb">&nbsp;</span>
		</div>
    )
}

var canSlideDrag = false;
var SlideElem;
$(document).on('mouseenter', '.slider-thumb', function(event) {
    if (!canSlideDrag) {
        var element = this;

        $('.slider-thumb-clicked').remove();

        var offset = $(element).offset();

        var hover_span = document.createElement("span");
        hover_span.innerHTML = "&nbsp;";
        hover_span.classList.add('slider-thumb-hover');

        hover_span.style.left = (offset.left - 9)+"px";
        hover_span.style.top = (offset.top - 9)+"px";

        document.body.appendChild(hover_span);

        //element.style.border = '6px solid rgba(179, 204, 255, .3)'
    }
})

$(document).on('mouseleave', '.slider-thumb', function(event) {
    var element = this;

    //element.style.border = 'none'

    $('.slider-thumb-hover').remove();
    //$('.slider-thumb-clicked').remove();
})

$(document).on('mousedown', '.slider-thumb', function(event) {
    var element = this;
    canSlideDrag = true;
    SlideElem = element;

    var offset = $(element).offset();

    $('.slider-thumb-hover').remove();
    $('.slider-thumb-clicked').remove();

    var hover_span = document.createElement("span");
    hover_span.innerHTML = "&nbsp;";
    hover_span.classList.add('slider-thumb-clicked');

    hover_span.style.left = (offset.left - 16)+"px";
    hover_span.style.top = (offset.top - 16)+"px";

    document.body.appendChild(hover_span);

    //element.style.border = '6px solid rgba(179, 204, 255, .3)'
});

$(document).on('mouseup', function(event) {
    var element = this;
    canSlideDrag = false;
    SlideElem = null;
    //$('.slider-thumb-clicked').remove();
});

$(document).on('mousemove', '.mui-slider', function(event) {
    if (canSlideDrag) {

        var parent_offset = $(SlideElem.parentElement).offset();
        var left = event.clientX - parent_offset.left;
        if (left >= 5 && left <= SlideElem.parentElement.clientWidth) {
            SlideElem.style.left = (event.clientX - parent_offset.left -9)+"px";

            var progress = SlideElem.parentElement.getElementsByClassName("slider-progress")[0];
            progress.style.width = (event.clientX - parent_offset.left)+"px";

            var hover_span = document.getElementsByClassName('slider-thumb-clicked')[0];
            if (hover_span != null) {
                hover_span.style.left = (event.clientX - 23)+"px";
            }
        }
    }
});

function MuiSlider(id){
    this.view = document.getElementById(id);
    this.range = this.view.getElementsByTagName("input")[0];
    this.rail = this.view.getElementsByClassName("slider-rail")[0];
    this.progress = this.view.getElementsByClassName("slider-progress")[0];
    this.thumb = this.view.getElementsByClassName("slider-thumb")[0];


    this.onDrop = function(callback) {
        let progress = this.progress;
        let view = this.view;
        document.addEventListener('mouseup', function(event) {
            var percent = Math.floor((progress.clientWidth / view.clientWidth)*100);
            callback(event, percent);
        })
    }

    this.setValue = function(value){
        let width= Math.floor((value/100) * this.view.clientWidth);
        this.progress.style.width = width+"px";
        this.thumb.style.left = (width -9)+"px";
    }
}


/*$(document).ready(function(event){
    var slider = new MuiSlider('slider');

    var number = document.getElementById('number');

    number.addEventListener('change', function(event) {
        slider.setValue(Number(number.value));
    });

    slider.onDrop(function(event, value) {
        number.value = value;
    })
})*/