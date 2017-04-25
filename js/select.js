$(document).ready(function(){
      var url = "evaluate-form/brands?type_id=0",
      marks = $('[data-kind="marks"]'),
      models = $('[data-kind="models"]'),
      year = $('[data-kind="year"]');
    
    function infoGet(url, field){
      $.get( "http://client.dev1.carprice.io/"+url, function( data ) {
        for (var i=0; i<data.data.length;i++) {
          field.append('<option value="'+data.data[i].value+'">'+data.data[i].text+'</option>')
        }
    });
    }infoGet(url,marks);
    $('.b-types__item').click(function(){
      var choice = $('[name="type_tech"]:checked');
       choice = "evaluate-form/brands?type_id="+ choice.attr('value');
       marks.siblings('.mg-custom-select').remove();
       createList(marks)
/*
      marks.siblings('.mg-custom-select').remove();
      marks.find('option').each(function(){
        if($(this).attr("value")!="Марка"){
          $(this).remove();
        }
      });
      year.siblings('.mg-custom-select').remove();
      year.find('option').each(function(){
        if($(this).attr("value")!="Год"){
          $(this).remove();
        }
      });
      models.siblings('.mg-custom-select').remove();
      models.find('option').each(function(){
        if($(this).attr("value")!="Модель"){
          $(this).remove();
        }
      });
      infoGet(choice, marks);
      reloadSelect();
    });
    marks.on("change", function(){
      var choice = "evaluate-form/years?brand_id=" + $(this).find("option:checked").attr("value");
      year.siblings('.mg-custom-select').remove();
      year.find('option').each(function(){
        if($(this).attr("value")!="Год"){
          $(this).remove();
        }
      });
      models.siblings('.mg-custom-select').remove();
      models.find('option').each(function(){
        if($(this).attr("value")!="Модель"){
          $(this).remove();
        }
      });
      infoGet(choice, year);
      reloadSelect();
    });
    year.on("change", function(){
      var choice = "evaluate-form/models?brand_id=" + marks.find("option:checked").attr("value")+"&year="+year.find("option:checked").attr("value");
      models.siblings('.mg-custom-select').remove();
      models.find('option').each(function(){
        if($(this).attr("value")!="Модель"){
          $(this).remove();
        }
      });
      infoGet(choice, models);
      reloadSelect();*/
    });
    function createList(parent){
       var customSelect__list = document.createElement('ul');
          customSelect__list.classList.add('mg-custom-select__list');
          var selectOption = Array.from(parent.querySelectorAll('option'));
          selectOption.forEach(function(item, index) {
            if ( index == 0) {
              return;
            }
            var customSelect__item = document.createElement('li');
            customSelect__item.classList.add('mg-custom-select__list__item')
            customSelect__item.dataset.value = item.value;
            customSelect__item.textContent = item.text;
            customSelect__list.appendChild(customSelect__item);
          })
    }
    function reloadSelect(){
      setTimeout(function() {
        var parents = Array.from(document.querySelectorAll('.mg-custom-select-js'));
        parents.forEach(function(item, index) {
          var parent = item;
          var withSearch = parent.classList.contains('mg-custom-select--search-js');

          var customSelect = document.createElement('div');
          customSelect.classList.add('mg-custom-select');

          var customSelect__invoker = document.createElement('div');
          customSelect__invoker.textContent = parent.childNodes[1].options[parent.childNodes[1].selectedIndex].text;
          customSelect__invoker.classList.add('mg-custom-select__button');
          customSelect.appendChild(customSelect__invoker);

          var dropdown = document.createElement('div');
          dropdown.classList.add('mg-custom-select__dropdown');

          if(withSearch) {
            var searchInput = document.createElement('input');
            searchInput.classList.add('mg-custom-select__search');
            searchInput.setAttribute('type', 'text');
            searchInput.setAttribute('placeholder', 'Поиск...')

            var searchInputLabel = document.createElement('label');
            searchInputLabel.classList.add('mg-custom-select__search__label');
            searchInputLabel.appendChild(searchInput);

            dropdown.appendChild(searchInputLabel);
          }

         createList(parent);

          dropdown.appendChild(customSelect__list);
          customSelect.appendChild(dropdown);
          parent.appendChild(customSelect);
          parent.childNodes[1].style.display = 'none';
          
          var duration = parseFloat(window.getComputedStyle(dropdown, null).getPropertyValue('transition-duration')) * 1000;
          
          var customSelect__items =  Array.from(customSelect__list.querySelectorAll('li'));
          customSelect__items.forEach(function(item, index) {
            item.addEventListener('click', function() {
              var selectedOption = parent.childNodes[1].options[parent.childNodes[1].selectedIndex];
              dropdown.classList.toggle('opened');
              parent.childNodes[1].value = this.dataset.value;

              selectedOption.removeAttribute('selected');
              parent.childNodes[1].options[index + 1].setAttribute('selected', true);

              var selectChangeEvent = document.createEvent("HTMLEvents");
              selectChangeEvent.initEvent('change', false, true);
              parent.childNodes[1].dispatchEvent(selectChangeEvent);

              customSelect__invoker.textContent = this.textContent;
              setTimeout(function() {
                if(withSearch) {
                  searchInput.value = '';
                }
                customSelect__items.forEach(function(item, index) {
                  item.classList.remove('hidden');
                })      
              }, duration)
            })
          })

          if(withSearch) {
            searchInput.addEventListener('keyup', function() {
              var inputVal = this.value;
              var pattern = new RegExp(inputVal, 'i');
              customSelect__items.forEach(function(item, index) {
                if (!item.textContent.match(pattern)) {
                  item.classList.add('hidden');
                } else {
                  item.classList.remove('hidden');
                }  
              })
            })
          }

          customSelect__invoker.addEventListener('click', function() {
            dropdown.classList.toggle('opened');
          })
 
        });
      }, 400); 
    }reloadSelect();
});
