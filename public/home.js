var pokemonURL = "http://assets.pokemon.com//assets/cms2/img/pokedex/detail/";
var pad = function(value) {
  var valueStr = value.toString();
  if (valueStr.length == 1) {
    valueStr = "00" + valueStr;
  }
  else if (valueStr.length == 2) {
    valueStr = "0" + valueStr;
  }
  var url = "http://assets.pokemon.com//assets/cms2/img/pokedex/detail/";
  var format = ".png";
  return url + valueStr + format;
}

// helper functions for Pokemon data display
var populateResults = function(legality, parsed) {
  // $('.results').html("");  // clear existing html
  var htmlString = "";

  var i=0;
  for (var key in legality) { // same for parsed
    // var dexNo = parsed.key.dexNo;
    if (i%3 == 0)     htmlString += '<div class="row">';
    htmlString +=                      '<div class="col-sm-4">';
    htmlString +=                       '<div class="results-thumbs thumbnail">';
    htmlString +=                         '<img src="' + pad(parsed[key].dexNo) + '">';
    htmlString +=                         '<div class="caption">';
    htmlString +=                           '<h3>' + key + '</h3>'

    if (legality[key].isLegal)  htmlString +=
                                            '<h4>Legal</h4>'
    else htmlString +=                      '<h4>Not legal</h4>'

    if (!legality[key].isLegal) {
      var errors = legality[key].errors;
      console.log(errors);
      for (var j=0; j<errors.length; j++) {
        htmlString += '<p><strong>' + errors[j].field + ': </strong>' + errors[j].message + '</p>';
      }
    }
    htmlString +=                         '</div class="caption">';
    htmlString +=                       '</div>';
    htmlString +=                     '</div>';
    if (i%3 == 2) {
                      htmlString += '</div>';
    }
    i++;
  }

  $('.results').html(htmlString);


}

// drag and drop box code

var isAdvancedUpload = function() {
  var div = document.createElement('div');
  return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
}();

var $form = $('.box');

if (isAdvancedUpload) {
  $form.addClass('has-advanced-upload');

  var droppedFiles = false;

  $form.on('drag dragstart dragend dragover dragenter dragleave drop', function(e) {
    e.preventDefault();
    e.stopPropagation();
  })
  .on('dragover dragenter', function() {
    $form.addClass('is-dragover');
  })
  .on('dragleave dragend drop', function() {
    $form.removeClass('is-dragover');
  })
  .on('drop', function(e) {
    droppedFiles = e.originalEvent.dataTransfer.files;
  });
}

$form.on('submit', function(e) {
  if ($form.hasClass('is-uploading')) return false;   // prevents repeat submissions

  $form.addClass('is-uploading').removeClass('is-error');

  if (isAdvancedUpload) { /* ajax for modern browsers*/
    e.preventDefault();

    var ajaxData = new FormData($form.get(0));

    if (droppedFiles) {
      $.each( droppedFiles, function(i, file) {
        ajaxData.append( $input.attr('name'), file );
      });
    }

    $.ajax({
      url: $form.attr('action'),
      type: $form.attr('method'),
      data: ajaxData,
      dataType: 'json',  // TODO: add JSON response back. If file(s) are valid pokemon files, redirect to new page
      cache: false,
      contentType: false,
      processData: false,
      complete: function() {
        $form.removeClass('is-uploading');
      },
      success: function(data) {
        console.log(data);
        $form.addClass('is-success');
        $('.upload-box').addClass('done');
        $('.main').addClass('show');
        populateResults(data.legality, data.parsed);
      },
      error: function() {
        // Log the error, show an alert, whatever works for you
      }
    });
  } else {  /* ajax for legacy browsers*/
    // targeting the form on a dynamically inserted iframe does the trick
    var iframeName  = 'uploadiframe' + new Date().getTime();
    $iframe = $('<iframe name="' + iframeName + '" style="display: none;"></iframe>');

    $('body').append($iframe);
    $form.attr('target', iframeName);

    $iframe.one('load', function() {
      var data = JSON.parse($iframe.contents().find('body').text());
      $form
        .removeClass('is-uploading')
        .addClass(data.success == true ? 'is-success' : 'is-error')
        .removeAttr('target');
      if (!data.success) $errorMsg.text(data.error);
      $form.removeAttr('target');
      $iframe.remove();
    });
    }
});


/* display uploaded files */
var $input = $form.find('input[type="file"]'),
    $label = $form.find('label'),
    showFiles = function(files) {
      $label.text(files.length > 1 ? ($input.attr('data-multiple-caption') || '').replace( '{count}', files.length ) : files[ 0 ].name);
    };

// ...

$form.on('drop', function(e) {
  droppedFiles = e.originalEvent.dataTransfer.files; // the files that were dropped
  // console.log(droppedFiles);
  showFiles( droppedFiles );
});

//...

$input.on('change', function(e) {
  showFiles(e.target.files);
});

$('#back-btn').on('click', function(e) {
  $form.removeClass('is-success');
  $('.upload-box').removeClass('done');
  $('.main').removeClass('show');
  $label.html('<strong class="hover-highlight">Choose files</strong><span class="box__dragndrop"> or drag them here.</span>');
})
