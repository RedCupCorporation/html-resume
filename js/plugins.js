
// usage: log('inside coolFunc', this, arguments);
// paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
window.log = function(){
  log.history = log.history || [];   // store logs to an array for reference
  log.history.push(arguments);
  arguments.callee = arguments.callee.caller;  
  if(this.console) console.log( Array.prototype.slice.call(arguments) );
};
// make it safe to use console.log always
(function(b){function c(){}for(var d="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","),a;a=d.pop();)b[a]=b[a]||c})(window.console=window.console||{});


// place any jQuery/helper plugins in here, instead of separate, slower script files.


/*
jquery.tagcloud.js - https://github.com/addywaddy/jquery.tagcloud.js

Copyright (c) 2008 Adam Groves

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
(function($) {

  $.fn.tagcloud = function(options) {
    var opts = $.extend({}, $.fn.tagcloud.defaults, options);
    tagWeights = this.map(function(){
      return $(this).attr("rel");
    })
    tagWeights = jQuery.makeArray(tagWeights).sort(compareWeights);
    lowest = tagWeights[0];
    highest = tagWeights.pop();
    range = highest - lowest;
    if(range == 0) {range = 1};
    // Sizes
    if (opts.size) {
      fontIncr = (opts.size.end - opts.size.start)/range;
    }
    // Colors
    if (opts.color) {
      colorIncr = colorIncrement (opts.color, range);
    }
    return this.each(function() {
      weighting = $(this).attr("rel") - lowest;
      if (opts.size) {
        $(this).css({"font-size": opts.size.start + (weighting * fontIncr) + opts.size.unit});        
      }
      if (opts.color) {
        $(this).css({"color": tagColor(opts.color, colorIncr, weighting)});
      }
    })
  }
  
  $.fn.tagcloud.defaults = {
    size: {start: 14, end: 18, unit: "pt"}
  };
  
  // Converts hex to an RGB array
  function toRGB (code) {
    if (code.length == 4) {
      code = jQuery.map(/\w+/.exec(code), function(el) {return el + el }).join("");
    }
    hex = /(\w{2})(\w{2})(\w{2})/.exec(code);
    return [parseInt("0x" + hex[1]), parseInt("0x" + hex[2]), parseInt("0x" + hex[3])];
  }

  // Converts an RGB array to hex
  function toHex (ary) {
    return "#" + jQuery.map(ary, function(i) {
      hex =  i.toString(16);
      hex = (hex.length == 1) ? "0" + hex : hex;
      return hex;
    }).join("");
  }

  function colorIncrement (color, range) {
    return jQuery.map(toRGB(color.end), function(n, i) {
      return (n - toRGB(color.start)[i])/range;
    });
  }

  function tagColor (color, increment, weighting) {
    rgb = jQuery.map(toRGB(color.start), function(n, i) {
      ref = Math.round(n + (increment[i] * weighting));
      if (ref > 255) {
        ref = 255;
      } else {
        if (ref < 0) {
          ref = 0;
        }
      }
      return ref;
    });
    return toHex(rgb);
  }
  
  function compareWeights(a, b)
  {
    return a - b;
  }
  

})(jQuery);


/*
 * 	easyAccordion 0.1 - jQuery plugin
 *	written by Andrea Cima Serniotti	
 *	http://www.madeincima.eu
 *
 *	Copyright (c) 2010 Andrea Cima Serniotti (http://www.madeincima.eu)
 *	Dual licensed under the MIT (MIT-LICENSE.txt) and GPL (GPL-LICENSE.txt) licenses.
 *	Built for jQuery library http://jquery.com
 */
 
(function(jQuery) {
	jQuery.fn.easyAccordion = function(options) {
	
	var defaults = {			
		slideNum: true,
		autoStart: false,
		slideInterval: 3000
	};
			
	this.each(function() {
		
		var settings = jQuery.extend(defaults, options);		
		jQuery(this).find('dl').addClass('easy-accordion');
		
		
		// -------- Set the variables ------------------------------------------------------------------------------
		
		jQuery.fn.setVariables = function() {
			dlWidth = jQuery(this).width();
			dlHeight = jQuery(this).height();
			dtWidth = jQuery(this).find('dt').outerHeight();
			if (jQuery.browser.msie){ dtWidth = $(this).find('dt').outerWidth();}
			dtHeight = dlHeight - (jQuery(this).find('dt').outerWidth()-jQuery(this).find('dt').width());
			slideTotal = jQuery(this).find('dt').size();
			ddWidth = dlWidth - (dtWidth*slideTotal) - (jQuery(this).find('dd').outerWidth(true)-jQuery(this).find('dd').width());
			ddHeight = dlHeight - (jQuery(this).find('dd').outerHeight(true)-jQuery(this).find('dd').height());
		};
		jQuery(this).setVariables();
	
		
		// -------- Fix some weird cross-browser issues due to the CSS rotation -------------------------------------

		if (jQuery.browser.safari){ var dtTop = (dlHeight-dtWidth)/2; var dtOffset = -dtTop;  /* Safari and Chrome */ }
		if (jQuery.browser.mozilla){ var dtTop = dlHeight - 20; var dtOffset = - 20; /* FF */ }
		if (jQuery.browser.msie){ var dtTop = 0; var dtOffset = 0; /* IE */ }
		
		
		// -------- Getting things ready ------------------------------------------------------------------------------
		
		var f = 1;
		jQuery(this).find('dt').each(function(){
			jQuery(this).css({'width':dtHeight,'top':dtTop,'margin-left':dtOffset});	
			if(settings.slideNum == true){
				jQuery('<span class="slide-number">'+0+f+'</span>').appendTo(this);
				if(jQuery.browser.msie){	
					var slideNumLeft = parseInt(jQuery(this).find('.slide-number').css('left')) - 14;
					jQuery(this).find('.slide-number').css({'left': slideNumLeft})
					if(jQuery.browser.version == 6.0 || jQuery.browser.version == 7.0){
						jQuery(this).find('.slide-number').css({'bottom':'auto'});
					}
					if(jQuery.browser.version == 8.0){
					var slideNumTop = jQuery(this).find('.slide-number').css('bottom');
					var slideNumTopVal = parseInt(slideNumTop) + parseInt(jQuery(this).css('padding-top'))  - 12; 
					jQuery(this).find('.slide-number').css({'bottom': slideNumTopVal}); 
					}
				} else {
					var slideNumTop = jQuery(this).find('.slide-number').css('bottom');
					var slideNumTopVal = parseInt(slideNumTop) + parseInt(jQuery(this).css('padding-top')); 
					jQuery(this).find('.slide-number').css({'bottom': slideNumTopVal}); 
				}
			}
			f = f + 1;
		});
		
		if(jQuery(this).find('.active').size()) { 
			jQuery(this).find('.active').next('dd').addClass('active');
		} else {
			jQuery(this).find('dt:first').addClass('active').next('dd').addClass('active');
		}
		
		jQuery(this).find('dt:first').css({'left':'0'}).next().css({'left':dtWidth});
		jQuery(this).find('dd').css({'width':ddWidth,'height':ddHeight});	

		
		// -------- Functions ------------------------------------------------------------------------------
		
		jQuery.fn.findActiveSlide = function() {
				var i = 1;
				this.find('dt').each(function(){
				if(jQuery(this).hasClass('active')){
					activeID = i; // Active slide
				} else if (jQuery(this).hasClass('no-more-active')){
					noMoreActiveID = i; // No more active slide
				}
				i = i + 1;
			});
		};
			
		jQuery.fn.calculateSlidePos = function() {
			var u = 2;
			jQuery(this).find('dt').not(':first').each(function(){	
				var activeDtPos = dtWidth*activeID;
				if(u <= activeID){
					var leftDtPos = dtWidth*(u-1);
					jQuery(this).animate({'left': leftDtPos});
					if(u < activeID){ // If the item sits to the left of the active element
						jQuery(this).next().css({'left':leftDtPos+dtWidth});	
					} else{ // If the item is the active one
						jQuery(this).next().animate({'left':activeDtPos});
					}
				} else {
					var rightDtPos = dlWidth-(dtWidth*(slideTotal-u+1));
					jQuery(this).animate({'left': rightDtPos});
					var rightDdPos = rightDtPos+dtWidth;
					jQuery(this).next().animate({'left':rightDdPos});	
				}
				u = u+ 1;
			});
			setTimeout( function() {
				jQuery('.easy-accordion').find('dd').not('.active').each(function(){ 
					jQuery(this).css({'display':'none'});
				});
			}, 400);
			
		};
	
		jQuery.fn.activateSlide = function() {
			this.parent('dl').setVariables();	
			this.parent('dl').find('dd').css({'display':'block'});
			this.parent('dl').find('dd.plus').removeClass('plus');
			this.parent('dl').find('.no-more-active').removeClass('no-more-active');
			this.parent('dl').find('.active').removeClass('active').addClass('no-more-active');
			this.addClass('active').next().addClass('active');	
			this.parent('dl').findActiveSlide();
			if(activeID < noMoreActiveID){
				this.parent('dl').find('dd.no-more-active').addClass('plus');
			}
			this.parent('dl').calculateSlidePos();	
		};
	
		jQuery.fn.rotateSlides = function(slideInterval, timerInstance) {
			var accordianInstance = jQuery(this);
			timerInstance.value = setTimeout(function(){accordianInstance.rotateSlides(slideInterval, timerInstance);}, slideInterval);
			jQuery(this).findActiveSlide();
			var totalSlides = jQuery(this).find('dt').size();
			var activeSlide = activeID;
			var newSlide = activeSlide + 1;
			if (newSlide > totalSlides) newSlide = 1;
			jQuery(this).find('dt:eq(' + (newSlide-1) + ')').activateSlide(); // activate the new slide
		}


		// -------- Let's do it! ------------------------------------------------------------------------------
		
		function trackerObject() {this.value = null}
		var timerInstance = new trackerObject();
		
		jQuery(this).findActiveSlide();
		jQuery(this).calculateSlidePos();
		
		if (settings.autoStart == true){
			var accordianInstance = jQuery(this);
			var interval = parseInt(settings.slideInterval);
			timerInstance.value = setTimeout(function(){
				accordianInstance.rotateSlides(interval, timerInstance);
				}, interval);
		} 

		jQuery(this).find('dt').not('active').click(function(){		
			jQuery(this).activateSlide();
			clearTimeout(timerInstance.value);
		});	
				
		if (!(jQuery.browser.msie && jQuery.browser.version == 6.0)){ 
			jQuery('dt').hover(function(){
				jQuery(this).addClass('hover');
			}, function(){
				jQuery(this).removeClass('hover');
			});
		}
	});
	};
})(jQuery);
