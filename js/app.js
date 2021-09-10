Foundation.Accordion.defaults.multiExpand = true;
Foundation.Accordion.defaults.allowAllClosed = true;
/************************************************************* */
//MAIN MENU CODE
/************************************************************* */


function onMobileToggle() {
  //MOBILE SEARCH BUTTON TOGGLER
  mobileSearchSubNav.on('on.zf.toggler', function() {
    if(bodyWrapper.hasClass('is-open-right')){
      hideMobileMenus();
      mobileNav.foundation('toggle');
    }
    $(this).hide().slideDown(100, function(){
      $('#mobile-search-input').trigger("focus");
    });
  }).on('off.zf.toggler', function() {
      $(this).slideUp(100);
      mobileSearchButton.trigger('focus');
  });
  $('body').on(
    'opened.zf.offCanvas', function(){
    resetPeekNav();
    if(mobileSearchSubNav.hasClass('expanded')){
      mobileSearchSubNav.foundation('toggle');
    }
  }).on('closed.zf.offCanvas', function(){
    hideMobileMenus();
  });
  mobileNav.removeClass('hide-for-xlarge');

}
function hideMobileMenus(){
  if(bodyWrapper.hasClass('is-open-right')){
    $('#mobile-drilldown').find(".is-active").each(function(){
      $('#mobile-drilldown').foundation('_hide', $(this));
    });
    mobileNav.foundation('toggle');
  }
}

function resetMobileDrillDown(){
  $('.js-off-canvas-overlay').on('click', function(){
    hideMobileMenus();
  })
}

//If the desktop Nav is open and the screen is resized to mobile while it's open then reset it
function resetNav() {
  $(window).on('changed.zf.mediaquery', function(e, nS, oS){
    //cross threshold where desktop ribbon changes to mobile ribbon
    if((oS === "large" || oS==="xlarge" || oS==="xxlarge")  && (nS==="small" || nS==="medium")){
      bodyWrapper.removeClass('scroll-lock');
      if($('#top-nav').find(".is-active").length){
        $('#top-nav').trigger('hide.zf.dropdownMenu');
      }
    }
    //cross threshold where mega nav drops to mobile nav
    if((oS==="xlarge" || oS==="xxlarge")  && (nS==="small" || nS==="medium" || nS==="large")){
      resetPeekNav();
    }
    //cross threshold where mobile nav swaps to mega nav
    if((nS==="xlarge" || nS==="xxlarge")  && (oS==="small" || oS==="medium" || oS==="large")){
      resetPeekNav();
      hideMobileMenus();
      if(mobileSearchSubNav.hasClass('expanded')){
        mobileSearchSubNav.foundation('toggle');
      }
    }
  })
}

function focusSearch(){
  mobileSearchButton.on("click", function(){
    $('#mobile-search-input').trigger("focus");
  });
}

function trapMobileNavFocus(){
  bodyWrapper.on("openedEnd.zf.offCanvas", function(){
    var $first = mobileNav.find('li.header').first().find("a"),
      $last = mobileNav.find('.nested-close-button').find("a");
    $first.trigger("focus");
    $last.on('keydown', function(e) {
      if (e.which === 9 && !e.shiftKey) {
        e.preventDefault();
        $first.trigger("focus");
      }
    });
    $first.on('keydown', function(e) {
      if (e.which === 9 && e.shiftKey) {
        e.preventDefault();
        $last.trigger("focus");
      }
    });
  });
  $("#mobile-drilldown").on("open.zf.drilldown", function(){
    subNavTimer = setTimeout(function(){
      var $panel = $("#mobile-drilldown").find('ul:last-child').filter(".is-drilldown-submenu").not('.invisible').last(),
        $links = $panel.children('li').children('a'),
        $first = $links.first();
        $last = $links.last();
      $last.on('keydown', function(e) {
        if (e.which === 9 && !e.shiftKey) {
          e.preventDefault();
          $first.trigger("focus");
        }
      });
      $links.each(function(){
        $(this).on('keydown', function(e) {
          if (e.which === 9 && e.shiftKey) {
            e.preventDefault();
            $(this).trigger("focus");
          }
        });
      });
    }, Foundation.Drilldown.defaults.animationDuration + 80);
  });
}
function resetPeekNav(){
  headerNav.removeClass("position-fixed");
  navFiller.css({"height": 0});
  headerNavContent.removeClass("downscroll");
  bodyWrapper.removeClass('nav-expanded-overlay').removeClass('scroll-lock');
}
function peekNav(){
  /* When the user scrolls down, hide the navbar. When the user scrolls up, show the navbar */
  var prevScrollPos = window.pageYOffset;
  $(window).on('scroll resize orientationchange pageshow', function(){
    var navHeight = headerNavContent.outerHeight(),
    navRem = navHeight/16+"rem",
    intent = $("html").attr("data-whatintent"),
    currentScrollPos = window.pageYOffset;
    if(!headerNavContent.hasClass("downscroll") && currentScrollPos > navHeight){
      headerNavContent.addClass("downscroll");
    }
    if (prevScrollPos < currentScrollPos && headerNav.hasClass("position-fixed")){
      peekCloseTimer = setTimeout(function(){
        headerNav.removeClass("position-fixed");
        navFiller.css({"height": 0});
      }, 200);
    }
    if (prevScrollPos > currentScrollPos && intent !== "keyboard" && currentScrollPos > 2) {
      clearTimeout(peekCloseTimer);
      if(!headerNav.hasClass("position-fixed")){
        headerNav.addClass("position-fixed");
        navFiller.css({"height": navRem});
      }
      headerNavContent.filter(".downscroll").removeClass("downscroll");
    }
    if(currentScrollPos <= 2){
      resetPeekNav();
    }
    prevScrollPos = currentScrollPos;
  });
}
if($('#header-nav').length){
  var navItems = $('.main-nav-item'),
    bodyWrapper = $('#body-wrapper'),
    mobileNav = $('#mobile-main-nav'),
    mobileSearchButton = $('#mobile-search-btn'),
    mobileSearchSubNav = $('#mobile-search-sub-nav'),
    headerNav = $('#header-nav'),
    headerNavContent = $('#header-nav-content'),
    navFiller = $('.head-fill'),
    peekCloseTimer,
    subNavTimer;
  onMobileToggle();
  resetMobileDrillDown();
  resetNav();
  trapMobileNavFocus();
  focusSearch();
  peekNav();
}



/************************************************************* */
//TOP RIBBON  CODE
/************************************************************* */
function closeRibbonSections(){
  $('.is-accordion-submenu-parent[aria-expanded="true"]').each(
    function(){
      $.fx.off = true;
      $(this).closest('[data-accordion-menu]').foundation('hideAll');
      $.fx.off = false;
    }
  );
  $('#ribbon-nav.is-mobile-expanded').each(
    function(){
      $(this).foundation('toggle');
    }
  );
}
function ribbonNav (){
  var $ribbon = $(".ribbon-wrapper"),
  $first = $('#mobile-ribbon-trigger'),
  $last = $('#ribbon-accordion').children('li:last-child').children('a').last(),
  $lastChild = $('#ribbon-accordion').children('li').last().children('ul').children('li').last().children('a').last();
  $ribbon.find('.hide').each(function(){
    $(this).removeClass('hide');
  });
  $ribbon.on(
    'on.zf.toggler', function() {
      $('body').addClass('position-fixed');
  });
  $ribbon.on(
    'off.zf.toggler', function() {
      $('body').removeClass('position-fixed');
  });
  $last.on('keydown', function(e) {
    if (e.which === 9 && !e.shiftKey && !mediaQueryList.matches) {
      if(!$lastChild.is(':visible')){
        e.preventDefault();
        $first.trigger("focus");
      }
    }
  });
  $lastChild.on('keydown', function(e) {
    if (e.which === 9 && !e.shiftKey && !mediaQueryList.matches) {
      $first.trigger("focus");
      e.preventDefault();
    }
  });
  $first.on('keydown', function(e) {
    if (e.which === 9 && e.shiftKey && !mediaQueryList.matches) {
      if($lastChild.is(':visible')){
        e.preventDefault();
        $lastChild.trigger("focus");
      }
      else {
        e.preventDefault();
        $last.trigger("focus");
      }
    }
  });
  $('#ribbon-accordion').find('.menu').find('a[href]').on("keydown", function(event){
    var x = event.which || event.keyCode, h = $(this).attr('href');
    if(x == 13 && !h.match('javascipt')){
      location.href = h;
    }
  });

  mediaQueryList.addEventListener('change', function(event){
    if (event.matches) {
      closeRibbonSections();
    } else {
      closeRibbonSections();
    }
  });
  $('#ribbon-accordion').find('.submenu').each(function(){
    var $item = $(this).parent('li');
    $($item).on("mouseleave", function(){
      if($item.attr("aria-expanded")=="true" && mediaQueryList.matches) {
        $item.children('a').trigger('click');
      }
    });
  });
}
if($(".ribbon-wrapper").length){
  var mediaQueryList = window.matchMedia('(min-width: 61.25em)');
  ribbonNav();
}

$(document).foundation();