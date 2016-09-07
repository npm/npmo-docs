var $ = require('jquery');

var DropDownMenu = require('./drop-down-menu');

module.exports = function() {
  $(function() {
    var dropDownMenus = $('.drop-down-menu');

    $.each(dropDownMenus, function(idx, el) {
      var ddm = new DropDownMenu($(el));

      ddm.addListeners();

      // in case you need to refresh while the menu is open
      if (window.location.hash === '#' + ddm.id) {
        ddm.open();
      }

      // for android users and anyone who likes to press the browser navigation buttons
      $(window).on('hashchange', function() {

        if (window.location.hash === '') {
          ddm.close();
        }

        if (window.location.hash === '#' + ddm.id) {
          ddm.open();
        }
      });
    });

    $("body").on("opened:dropDownMenu", function(e, id) {
      $.each(dropDownMenus, function(idx, el) {
        if (el.id !== id) {
          $(el).trigger("close", {
            noPathChange: true
          });
        }
      });
    });


  });
};
