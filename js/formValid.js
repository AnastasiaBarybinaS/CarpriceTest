$(document).ready(function(){
    $('#send').click(function(){
       var rv_name = /^[a-zA-Zа-яА-Я]+$/; 
       var time_name = /^[0-9]+$/;
       var rv_email = /^([a-zA-Z0-9_.-])+@([a-zA-Z0-9_.-])+\.([a-zA-Z])+([a-zA-Z])+/;
       var val;
       val = $('#marks').val();
       if (val.length > 2 && val != '' && rv_name.test(val)) {
                     $('#marks').removeClass('error').addClass('not_error');} else {$('#marks').removeClass('not_error').addClass('error');}
      val = $('#year').val();
       if (val.length > 2 && val != '' && time_name.test(val)) {
                     $('#year').removeClass('error').addClass('not_error');} else {$('#year').removeClass('not_error').addClass('error');}
      val = $('#models').val();
       if (val.length > 2 && val != '' && rv_name.test(val)) {
                     $('#models').removeClass('error').addClass('not_error');} else {$('#models').removeClass('not_error').addClass('error');}
      val = $('#email').val();
       if (val.length > 2 && val != '' && rv_email.test(val)) {
                     $('#email').removeClass('error').addClass('not_error');} else {$('#email').removeClass('not_error').addClass('error');}
      val = $('#agreement:checked');
        if (val.length==1) {
          $('.b-control__indicator').removeClass('error').addClass('not_error');} else { $('.b-control__indicator').removeClass('not_error').addClass('error'); }
    });
    $('#agreement').click(function(){
        if ($('#agreement:checked').length==1) {
          $('#send').prop('disabled', false);
        } else {
          $('#send').prop('disabled', true);
        }
    });
    $('input').click(function(){
      $(this).removeClass('error');
    });

     // Теперь отправим наше письмо с помощью AJAX
     $('form.b-anketa__form').submit(function(e){
         e.preventDefault();
         if($('.not_error').length == 5)
         {
          alert("Валидация прошла успешно");
          //объект значений 1 шага
          var obj = {
              brand: $('[data-kind="marks"] div.active').attr("value"),
              year: $('[data-kind="year"] div.active').attr("value"),
              model:$('[data-kind="models"] div.active').attr("value")
          };
           
          var serialObj = JSON.stringify(obj); //сериализуем 
          localStorage.setItem("firstStep", serialObj); //запиcываем данные первого шага в хранилище
          console.log(localStorage.getItem("firstStep"));
         }
         else
         {
            return false;
         }

   }); // end submit()

  }); // end script