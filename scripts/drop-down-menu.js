$ = require('jquery');

var DropDownMenu = function($el, $toggle, $overlay) {
  this.menu = $el;
  this.id = this.menu.attr('id');
  this.menuToggle = $toggle || $('a[href="#' + this.id + '"]');
  this.menuOverlay = $overlay || $("<div class='drop-down-menu-overlay' data-drop-down-menu='" + this.id + "'/>").appendTo("body");
};

DropDownMenu.prototype.close = function(noPathChange) {
  if (noPathChange) {
    history.pushState({}, '', window.location.pathname);
  }
  this.menu.addClass('hidden').removeClass('show');
  this.menuToggle
    .addClass('toggle-is-closed')
    .removeClass('toggle-is-open')
    .trigger('blur');
  this.menuOverlay.removeClass('show');
  this.menu.trigger("closed:dropDownMenu", [this.id]);
};

DropDownMenu.prototype.open = function() {
  history.pushState({}, '', window.location.pathname + this.menuToggle.attr('href'));
  this.menu.addClass('show').removeClass('hidden');
  this.menuToggle.addClass('toggle-is-open').removeClass('toggle-is-closed');
  this.menuOverlay.addClass('show');
  this.menu.trigger("opened:dropDownMenu", [this.id]);
};

DropDownMenu.prototype.addListeners = function() {
  var self = this;

  this.menu.on("close", function(e) {
    self.close(e.noPathChange);
  });

  this.menu.on("open", $.proxy(this.open, this));

  this.menuToggle.on('click', function(e) {
    e.preventDefault();

    if (self.menu.is(':visible')) {
      self.close();
    } else {
      self.open();
    }
  });

  this.menuOverlay.on('click', $.proxy(this.close, this));

};

module.exports = DropDownMenu;
