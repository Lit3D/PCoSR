( function( root, factory ) {

    var pluginName = 'slimBeforeAfter';

    if ( typeof define === 'function' && define.amd ) {
        define( [], factory( pluginName ) );
    } else if ( typeof exports === 'object' ) {
        module.exports = factory( pluginName );
    } else {
        root[ pluginName ] = factory( pluginName );
    }

}( this, function( pluginName ) {
    'use strict';

    //plugin default values
    var defaults = {
        position 			: 'horizontal',
    	labelPosition		: 'center',
    	dragHandler			: 'click',
    	startPosition		: 50,
    	labelShowHover		: false,
    	loaderColor			: 'rgba(88,179,104,1)',
    	loaderOverlayColor	: 'rgba(255,255,255,1)',
    	separatorColor 		: 'rgba(255,255,255,1)',
    	separatorShow 		: true,
    	containerWidth		: 0,
    	containerHeight		: 0
    };

    //extended default parameters
    var extend = function( target, options ) {
        var prop, extended = {};
        for ( prop in defaults ) {
            if ( Object.prototype.hasOwnProperty.call( defaults, prop ) ) {
                extended[ prop ] = defaults[ prop ];
            }
        }
        for ( prop in options ) {
            if ( Object.prototype.hasOwnProperty.call( options, prop ) ) {
                extended[ prop ] = options[ prop ];
            }
        }
        return extended;
    };

    var extendDefaults = function(source, properties) {
        var property;
        for (property in properties) {
            if (properties.hasOwnProperty(property))
                source[property] = properties[property];
        }
        return source;
    }

    //loader creating
    var createLoader = function(){
    	var loader = document.createElement('div');
		loader.className = 'slim-comparison-loader';
		loader.style.backgroundColor = this.options.loaderOverlayColor;

		var inner = document.createElement('div');
		inner.className = 'slim-lds-ellipsis';

		var emptydiv1 = document.createElement('div');
		emptydiv1.style.backgroundColor = this.options.loaderColor;

		var emptydiv2 = document.createElement('div');
		emptydiv2.style.backgroundColor = this.options.loaderColor;

		var emptydiv3 = document.createElement('div');
		emptydiv3.style.backgroundColor = this.options.loaderColor;

		var emptydiv4 = document.createElement('div');
		emptydiv4.style.backgroundColor = this.options.loaderColor;

		inner.appendChild(emptydiv1);
		inner.appendChild(emptydiv2);
		inner.appendChild(emptydiv3);
		inner.appendChild(emptydiv4);

		loader.appendChild(inner);

		return loader;
    }

    //seperator creating
    var createseparator = function(){
    	var s = document.createElement('div');
		s.className = 'slim-separator';
        s.style.cssText = 'border-color:'+this.options.separatorColor+';';

		var beforeLine = document.createElement('div');
        beforeLine.className = 'slim-before-line';
        beforeLine.style.cssText = 'background-color:'+this.options.separatorColor+';';

        var afterLine = document.createElement('div');
        afterLine.className = 'slim-after-line';
        afterLine.style.cssText = 'background-color:'+this.options.separatorColor+';';

        var span1 = document.createElement('span');
		span1.className = 'slim-before-arrow';

		var span2 = document.createElement('span');
		span2.className = 'slim-after-arrow';

		s.appendChild(beforeLine);
        s.appendChild(afterLine);
        s.appendChild(span1);
		s.appendChild(span2);
		
		return s;
    }

    //loader deleting
    var deleteLoader = function(selector){
    	var loader = selector.getElementsByClassName("slim-comparison-loader")[0];
		setTimeout(function(e){
			loader.style.opacity = 0;	
			setTimeout(function(i){
				selector.getElementsByClassName('slim-comparison-wrapper')[0].removeChild(loader);
			},400);
		},200);
    }

    //seperator position setting
    var setseparatorPosition = function(selector) {
    	var element = selector.getElementsByClassName("slim-before-wrapper")[0];
    	var separator = selector.getElementsByClassName("slim-separator")[0];

        if (this.options.position == 'vertical'){
        	element.style.height = this.options.startPosition+'%';
        	separator.style.top = this.options.startPosition+'%';
        }
        else{
        	element.style.width = this.options.startPosition+'%';
        	separator.style.left = this.options.startPosition+'%';
        }

    }

    //image loading control for loader
    var loadImageControl = function(selector) {
    	var t = this;
    	var img = selector.getElementsByClassName("slim-after-wrapper")[0].getElementsByTagName('img')[0];
    	
    	if (!img.complete){
	    	img.addEventListener('load', function(){
	    		t.options.containerWidth = this.naturalWidth;
	    		t.options.containerHeight = this.naturalHeight;

				calculateImagePosition.call(t, selector);
				deleteLoader(selector);
			});
	    }
	    else{
    		t.options.containerWidth = img.naturalWidth;
    		t.options.containerHeight = img.naturalHeight;

			calculateImagePosition.call(t, selector);
			deleteLoader(selector);
	    }

    }

    //image position calculating
    var calculateImagePosition = function(selector){
    	var sW = selector.clientWidth,
    		sH = selector.clientHeight,
    		beforeImg = selector.getElementsByClassName("slim-before-wrapper")[0].getElementsByTagName('img')[0],
    		afterImg = selector.getElementsByClassName("slim-after-wrapper")[0].getElementsByTagName('img')[0];

    	beforeImg.style.width=sW+'px';
    	afterImg.style.width=sW+'px';

    	beforeImg.style.height=afterImg.clientHeight+'px';

    	selector.style.height = (sW*this.options.containerHeight/this.options.containerWidth)+'px';

    	setTimeout(function(e){
    		selector.style.transition = 'height 0s';
    	},200);
    }

    //for responsive. resize event function
    var resizeHandler = function(){
    	for ( var i = 0; i < this.selectors.length; i++ ){
    		var selector = this.selectors[i];

	    	var sW = selector.clientWidth,
	    		sH = selector.clientHeight,
	    		beforeImg = selector.getElementsByClassName("slim-before-wrapper")[0].getElementsByTagName('img')[0],
	    		afterImg = selector.getElementsByClassName("slim-after-wrapper")[0].getElementsByTagName('img')[0];

	    	afterImg.style.width = sW+'px';
	    	beforeImg.style.width = sW+'px';
	    	beforeImg.style.height = afterImg.clientHeight+'px';


	    	selector.style.height = afterImg.clientHeight+'px';
	    }
    }

    //creating all elevent
    var dragEvents = function(wrapper){
    	
		wrapper.addEventListener("touchstart", this.touchstart, false);
        wrapper.addEventListener("touchend", this.touchend, false);
        wrapper.addEventListener("touchmove", this.touchmove, false);  
		
        if (this.options.dragHandler == 'click'){
    		wrapper.addEventListener("mousedown", this.mousedown, false);
            document.addEventListener("mouseup", this.mouseup, false);
        }
        else {
    		wrapper.addEventListener("mouseenter", this.mouseenter, false);
            wrapper.addEventListener("mouseleave", this.mouseleave, false);
        }

        wrapper.addEventListener("mousemove", this.mousemove, false);
        

	}

    //drag starting only for hover handler
    var slimDragStartHover = function(e){
        e.preventDefault();
        
        this.currentDragElement = e.target.getElementsByClassName('slim-separator')[0];
        this.dragCursorType = 'mouse';      

        if (e.target.parentNode.classList.contains('slim-vertical'))
            this.currentDragPosition = 'vertical';
        else
            this.currentDragPosition = 'horizontal';

        this.dragActive = true;
    }

    //drag ending only for hover handler
    var slimDragEndHover = function(e){
        e.preventDefault();

        this.dragActive = false;
    }

    //drag starting click and touch handler
	var slimDragStart = function(e){
		e.preventDefault();

		this.currentDragElement = e.target;

		if (e.type === 'touchstart')
			this.dragCursorType = 'touch';
		else{
			this.dragCursorType = 'mouse';
        }

	    if (this.currentDragElement.parentNode.parentNode.classList.contains('slim-vertical'))
	    	this.currentDragPosition = 'vertical';
	    else
	    	this.currentDragPosition = 'horizontal';

	    this.dragActive = true;
	}

    //dragging for all events
	var slimDrag = function(e){
		e.preventDefault();

		var dragCurrentX = 0;
		var dragCurrentY = 0;

		if (this.dragActive){
			if (e.type === "touchmove") {
	          	dragCurrentX = e.touches[0].clientX;
	        	dragCurrentY = e.touches[0].clientY;
	        } else {
	          	dragCurrentX = e.pageX;
	          	dragCurrentY = e.pageY;
	        }
	        slimDragAction.call(this, dragCurrentX, dragCurrentY);
	    }
	}

    //drag ending click and touch handler
	var slimDragEnd = function(e){
		e.preventDefault();

        if (this.currentDragElement){
            if (!this.currentDragElement.parentNode.parentNode.classList.contains('slim-drag-hover'))
                this.dragActive = false;
        }
	}

    //drag action for all handlers
	var slimDragAction = function(currentX, currentY){
		if (!this.currentDragElement.classList.contains('slim-separator'))
			return false;

        var selectorPos = this.currentDragElement.parentNode.parentNode.getBoundingClientRect();

		if (this.currentDragPosition == 'vertical'){
			if (this.dragCursorType === 'mouse')
			 currentY = currentY - document.documentElement.scrollTop;

			var separatorPercentY = ((currentY - selectorPos.top) / this.currentDragElement.parentNode.clientHeight*100);

			if (separatorPercentY > 100)
				separatorPercentY = 100;

			if (separatorPercentY < 0)
				separatorPercentY = 0;

			this.currentDragElement.style.top = separatorPercentY+'%';
			this.currentDragElement.parentNode.getElementsByClassName('slim-before-wrapper')[0].style.height = separatorPercentY+'%';
		}
		else{
			var separatorPercentX = ((currentX - selectorPos.left) / this.currentDragElement.parentNode.parentNode.clientWidth*100);

			if (separatorPercentX > 100)
				separatorPercentX = 100;

			if (separatorPercentX < 0)
				separatorPercentX = 0;

			this.currentDragElement.style.left = separatorPercentX+'%';
			this.currentDragElement.parentNode.getElementsByClassName('slim-before-wrapper')[0].style.width = separatorPercentX+'%';
		}
	}


    function Plugin( options ) {
        //this.options = extend( defaults, options );
        this.init(options);
    }


    Plugin.prototype = {
        //plugin initialize method
        init: function(options) {
            this.selectors = document.querySelectorAll('.slim-comparison-container');
            this.dragActive = false;
            this.currentDragElement = null;
            this.currentDragPosition = 'horizontal';
            this.currentDragHandler = 'click';
            this.dragCursorType = 'mouse';
            this.touchstart = slimDragStart.bind(this);
            this.touchend = slimDragEnd.bind(this);
            this.touchmove = slimDrag.bind(this);
            this.mousedown = slimDragStart.bind(this);
            this.mouseup = slimDragEnd.bind(this);
            this.mousemove = slimDrag.bind(this);
            this.mouseenter = slimDragStartHover.bind(this);
            this.mouseleave = slimDragEndHover.bind(this);

            for ( var i = 0; i < this.selectors.length; i++ ) {
                var selector = this.selectors[i];
                var wrapper = selector.getElementsByClassName('slim-comparison-wrapper')[0];

                this.options = defaults;
                this.options = extend( defaults, options );

                //get all data attribute parameters from html and set to options
                this.options = extendDefaults( this.options, JSON.parse(selector.getAttribute('data-slim-params')) );

                //set default height to plugin
                if (this.options.containerHeight != 0 && this.options.containerWidth != 0)
                	selector.style.height = selector.clientWidth*this.options.containerHeight/this.options.containerWidth+'px';

                //create separator
                wrapper.appendChild(createseparator.call(this));

                //create and add loader
                wrapper.appendChild(createLoader.call(this));
                
                //set plugin position
                if (this.options.position === 'vertical')
                	selector.classList.add('slim-vertical');

                //set plugin position
                if (this.options.dragHandler === 'hover')
                	selector.classList.add('slim-drag-hover');

                //set caption hover state
                if (this.options.labelShowHover === true)
                	selector.classList.add('slim-caption-hover');

                //set separator show state
                if (this.options.separatorShow == false)
                	selector.classList.add('slim-hide-separator');

                //set plugin caption position
                selector.classList.add('slim-caption-position-'+this.options.labelPosition);
                
                //calculate start separator posiiton
                setseparatorPosition.call(this,selector);

                //image loader control
                loadImageControl.call(this,selector);

                //set events
                dragEvents.call(this,wrapper);

                var t = this;
                window.addEventListener('resize', function(e){
                	resizeHandler.call(t);
                });

            }
        },
        //plugin destroy method
        destroy: function() {
            this.selectors = document.querySelectorAll('.slim-comparison-container');
            for ( var i = 0; i < this.selectors.length; i++ ) {
                var selector = this.selectors[i];
                var wrapper = selector.getElementsByClassName('slim-comparison-wrapper')[0];

                if (selector.getElementsByClassName('slim-separator')[0] == undefined)
                	return false;

                //delete separators
                wrapper.removeChild(selector.getElementsByClassName('slim-separator')[0]);

                //delete listeners
                wrapper.removeEventListener("touchstart", this.touchstart, false);
                wrapper.removeEventListener("touchend", this.touchend, false);
                wrapper.removeEventListener("touchmove", this.touchmove, false);                
                wrapper.removeEventListener("mousedown", this.mousedown, false);
                document.removeEventListener("mouseup", this.mouseup, false);
                wrapper.removeEventListener("mousemove", this.mousemove, false);
                wrapper.removeEventListener("mouseenter", this.mouseenter, false);
                wrapper.removeEventListener("mouseleave", this.mouseleave, false);

                //selector set style none
                selector.style.cssText = '';

                //set default class to selector
                selector.className = 'slim-comparison-container';

                //set default before img wrapper
                selector.getElementsByClassName('slim-before-wrapper')[0].style.cssText = 'width:100%; height:100%;';

                //set images style none
                var img = selector.getElementsByTagName('img');
                for (var k = 0; k < img.length; k++) {
                	img[k].style.cssText = '';
                }

            }
        },
        //plugin refresh method
        refresh: function() {
            var t = this;

        	try{
        		t.destroy();
        	}
        	catch(err){
        		console.log('Already Destroyed.');
        	}

        	setTimeout(function(){
                t.init();
            },100);            
        }
    };
    return Plugin;
} ) );
