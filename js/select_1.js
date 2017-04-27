$(document).ready(function(){
    var url = "evaluate-form/brands?type_id=0",
      marks = $('[data-kind="marks"]'),
      models = $('[data-kind="models"]'),
      year = $('[data-kind="year"]');
    
    function infoGet(url, field){
      $.get( "http://client.dev1.carprice.io/"+url, function( data ) {
        for (var i=0; i<data.data.length;i++) {
          field.append('<div value="'+data.data[i].value+'">'+data.data[i].text+'</div>')
        }
    });
    }infoGet(url,marks);
    $('.b-types__item').click(function(){
      marks.find(".active").removeClass(".active")
      year.find(".active").removeClass(".active")
      console.log(year.siblings('.select-search-input'));
      var choice = $('[name="type_tech"]:checked');
       choice = "evaluate-form/brands?type_id="+ choice.attr('value');
      infoGet(choice, marks);
      $('.select-search-input').val('')
      year.siblings('.select-search-input').prop('disabled', true);
      models.siblings('.select-search-input').prop('disabled', true);
    });
    marks.click(function(){
      var elem = $(this);
      setTimeout(function(){
        var choice = "evaluate-form/years?brand_id=" + elem.find(".active").attr("value");
          console.log("change");
          infoGet(choice, year);
          year.siblings('.select-search-input').removeAttr("disabled");
      },100); 
    });
    year.click(function(){
      var elem = $(this);
      setTimeout(function(){
        var choice = "evaluate-form/models?brand_id=" + marks.find(".active").attr("value")+"&year="+elem.find(".active").attr("value");
        infoGet(choice, models);
        models.siblings('.select-search-input').removeAttr("disabled");
      },100);
    });
    function locationGet(){
      $.get( "http://client.dev1.carprice.io/api/v1.0.0/cities?api_token=bl1xzytbboh9qfqv5cfurx2fl10xspe1", function( data ) {
        console.log(data.cities);
        for (var i=0; i<data.cities.length;i++) {
          $('.location__select .row').append('<div class="col-xs-4">'+
                          '<div class="location__list--item js-select-city" data-city-id="'+data.cities[i].value+'" data-city-phone="'+  ""  +'">'+data.cities[i].text+'"</div></div>')
        }
      });
    }locationGet();
  $('body').on('focus', '.select-search-input', function(){
    //expand selector
    $(this).val('');
    var selector = $(this).next('.select-search');
    selector.css('display', 'block');
    $(this).closest('.select-by-search').find('.close-selector').css('display','block');
  });
  $('body').on('input', '.select-search-input', function(){
    //search for an item
    var selector = $(this).next('.select-search');
    var search_for = $(this).val().trim();
    search_for = search_for.charAt(0).toUpperCase() + search_for.substr(1);
    selector.find('div').addClass('hidden');
    var matches = selector.find('div:contains("'+search_for+'")');
    selector.find('.no-results').remove();
    if (matches.length==0){
      selector.append('<div class="unselectable no-results">No results.</div>')
    }
    matches.removeClass('hidden');
  });
  $('body').on('click', '.select-search>*:not(.unselectable)', function(){
    //select an item
    var value= $(this).attr('value'),
        text= $(this).text().trim(),
     selector_container=$(this).closest('.select-by-search');
    selector_container.find('input.select-search-input').val(text);
    //set this item as "active" and place it in the first spot
    selector_container.find('div').removeClass('active');
    $(this).addClass('active').prependTo(selector_container.find('.select-search'));
    //collapse the selector
    selector_container.find('.select-search').css('display', 'none');
    $('.close-selector').css('display', 'none');
   //update the value of the actual input
    selector_container.find('.selected').val(value);
  });
  $('body').on('click', '.close-selector', function(){
    $('.select-search').css('display', 'none');
    $(this).css('display', 'none');
  });
});