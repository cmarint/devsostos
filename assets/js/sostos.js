$(document).ready(function(){
	//Scroll up//
		$("body").append("<div class='scrollup'><img src='assets/img/up.png'></div>");
	  		$(window).scroll(function(){
	    		if ($(this).scrollTop() > 250) $('.scrollup').fadeIn();
				else $('.scrollup').fadeOut();
			});
	    $(document).on("click",".scrollup",function(e){ 
	      	e.preventDefault();
	      	$("html, body").stop().animate({ scrollTop: 0 }, "slow");
	    });
	        // fade .navbar
    $(function () {
        $(window).scroll(function () {
            // set distance user needs to scroll before we fadeIn navbar
            if ($(this).scrollTop() > 95) {
                $('.menu2').addClass('navbar-fixed-top');

            } else {
                $('.menu2').removeClass('navbar-fixed-top'); 
            }
        });
	});
    //mostrar
    $(function(){
      $("#Add").click(function () {
        $('.more').append("<div class='row'><label class='control-label col-md-4' for='nombcurs'>Curso</label><div class='col-md-4'><input type='text' class='form-control' id='nombcurs' placeholder='4° Medio A'></div><label class='control-label col-md-2' for='nAnno'>Año</label><div class='col-md-2'><input type='text' class='form-control' placeholder='2017'></div></div>");
          });
    })
    $(function(){
      $("#AddEstb").click(function () {
        $('.more').append("<div class='row'><label class='control-label col-md-4' for='nombInstitucion'>Nombre establecimiento</label><div class='col-md-8'><input type='text' class='form-control' id='nombInstitucion' placeholder='Ingrese establecimiento'></div></div>");
          });
    })
    $(function(){
      $("#AddAsig").click(function () {
        $('.more').append("<div class='row'><label class='control-label col-md-4' for='nombInstitucion'>Nombre asignatura</label><div class='col-md-8'><input type='text' class='form-control' id='nombasig' placeholder='Ingrese asignatura'></div></div>");
          });
    })
    $(function(){
      $("#Ex").click(function () {
        document.getElementById('carga').style.display = 'block';
          });
    })
    //chat	
     $(function(){
$("#addClass").click(function () {
          $('#qnimate').addClass('popup-box-on');
            });
          
            $("#removeClass").click(function () {
          $('#qnimate').removeClass('popup-box-on');
            });
  })
        
});