define({

	define : {
		require : ["morphism"]
	},

	make_new_event : function (make) {
		return {
			state  : {
				element : make.body.lightbox,
				details : {
					speed  : make.details.body.speed,
					easing : make.details.body.easing,
				},
				state   : {
					window_mousedown : {
						clicked  : false,
						position : {
							top : 0,
							left: 0
						}
					}
				}
			},
			events : [
				{
					called    : "window_mousedown",
					that_happens : [
						{
							on   : make.body.lightbox.children[0],
							is   : "mousedown",
						}
					],
					only_if      : function () {
						return true
					}
				},
				{
					called    : "window_mouseup",
					that_happens : [
						{
							on   : make.body.lightbox.children[0],
							is   : "mouseup",
						}
					],
					only_if      : function () {
						return true
					}
				},
				{
					called    : "window_mousemove",
					that_happens : [
						{
							on   : make.body.lightbox.children[0],
							is   : "mousemove",
						}
					],
					only_if      : function (hear) {
						return hear.state.state.window_mousedown.clicked
					}
				},
				{
					called : "window_mousewheel",
					that_happens : [
						{
							on : make.body.lightbox.children[0],
							is : "wheel"
						}
					],
					only_if : function () {
						return true
					}
				},
				{
					called       : "window_control_minus",
					that_happens : [
						{
							on : make.body.lightbox.children[1].children[0],
							is : "click"
						}
					],
					only_if : function () {
						return true
					}
				},
				{
					called       : "window_control_plus",
					that_happens : [
						{
							on : make.body.lightbox.children[1].children[1],
							is : "click"
						}
					],
					only_if : function () {
						return true
					}
				},
				{
					called       : "view_control_previous",
					that_happens : [
						{
							on : make.body.lightbox.children[2].children[0].children[2],
							is : "click"
						}
					],
					only_if : function () {
						return true
					}
				},
				{
					called       : "view_control_next",
					that_happens : [
						{
							on : make.body.lightbox.children[2].children[0].children[1],
							is : "click"
						}
					],
					only_if : function () {
						return true
					}
				},
				{
					called       : "view_control_close",
					that_happens : [
						{
							on : make.body.lightbox.children[2].children[0].children[0],
							is : "click"
						}
					],
					only_if : function () {
						return true
					}
				},
				{
					called       : "view_image_click",
					that_happens : [
						{
							on : make.body.lightbox.children[2].children[1],
							is : "click"
						}
					],
					only_if      : function (hear) {
						return ( hear.event.target.nodeName === "IMG" )
					}
				}
			]
		}
	},

	make_event_bind : function (make) {
		var self = this
		return {
			lightbox : [
				{
					for       : "view_control_close",
					that_does : function (hear) {
						make.animate.animate({
							element     : hear.state.element,
							delay       : 0,
							property    : ["opacity"],
							from        : [1],
							to          : [0],
							how_long    : hear.state.details.speed,
							with_easing : hear.state.details.easing
						})
						window.setTimeout(function () {
							document.body.style.overflow     = "auto"
							hear.state.element.style.display = "none"
							hear.state.element.children[0].removeChild(hear.state.element.children[0].children[0])
							hear.state.element.children[2].children[1].removeChild(hear.state.element.children[2].children[1].children[0])

						}, hear.state.details.speed )
						return hear
					}
				},
				{
					for       : "view_image_click",
					that_does : function (hear) {
						hear.state.element.children[0].children[0].src          = hear.event.target.src
						hear.state.element.children[0].children[0].style.width  = "auto"
						hear.state.element.children[0].children[0].style.height = "auto"

						return hear
					}
				},
				{
					for       : "view_control_previous",
					that_does : function (hear) {
						hear.state.element.children[0].children[0].src          = self.components.events.get_image_source_from({
							container      : hear.state.element.children[2].children[1].children[0],
							current_source : hear.state.element.children[0].children[0].src,
							direction      : "previous"
						})
						hear.state.element.children[0].children[0].style.width  = "auto"
						hear.state.element.children[0].children[0].style.height = "auto"

						return hear
					}
				},
				{
					for       : "view_control_next",
					that_does : function (hear) {
						hear.state.element.children[0].children[0].src          = self.components.events.get_image_source_from({
							container      : hear.state.element.children[2].children[1].children[0],
							current_source : hear.state.element.children[0].children[0].src,
							direction      : "next"
						})
						hear.state.element.children[0].children[0].style.width  = "auto"
						hear.state.element.children[0].children[0].style.height = "auto"

						return hear
					}
				},
				{
					for       : "window_mousedown",
					that_does : function (hear) {
						hear.state.state.window_mousedown.clicked  = true
						hear.state.state.window_mousedown.position = {
							top  : hear.event.pageY-hear.state.element.firstChild.firstChild.offsetTop,
							left : hear.event.pageX-hear.state.element.firstChild.firstChild.offsetLeft
						}
						return hear
					}
				},
				{
					for       : "window_mouseup",
					that_does : function (hear) {
						hear.state.state.window_mousedown.clicked = false
						return hear
					}
				},
				{
					for       : "window_mousemove",
					that_does : function (hear) {
						hear.state.element.firstChild.firstChild.style.top  = (
							hear.event.pageY-hear.state.state.window_mousedown.position.top
						) +"px"
						hear.state.element.firstChild.firstChild.style.left = (
							hear.event.pageX-hear.state.state.window_mousedown.position.left
						) +"px"

						return hear
					}
				},
				{
					for       : "window_mousewheel",
					that_does : function (hear) {

						var dimensions, zoom_type
						zoom_type  = ( hear.event.deltaY < 0 ? "in" : "out" )
						dimensions = self.components.events.get_zoomed_image_dimensions({
							type      : zoom_type,
							element   : hear.state.element.firstChild.firstChild,
							increment : 35
						})
						hear.state.element.firstChild.firstChild.style.width  = dimensions.width +"px"
						hear.state.element.firstChild.firstChild.style.height = dimensions.height +"px"
						hear.state.element.firstChild.firstChild.style.left   = dimensions.left +"px"

						return hear
					}
				},
				{
					for       : "window_control_plus",
					that_does : function (hear) {
						var dimensions
						dimensions = self.components.events.get_zoomed_image_dimensions({
							type      : "in",
							element   : hear.state.element.firstChild.firstChild,
							increment : 100
						})
						hear.state.element.firstChild.firstChild.style.width  = dimensions.width +"px"
						hear.state.element.firstChild.firstChild.style.height = dimensions.height +"px"
						hear.state.element.firstChild.firstChild.style.left   = dimensions.left +"px"
						return hear
					}
				},
				{
					for       : "window_control_minus",
					that_does : function (hear) {
						var dimensions
						dimensions = self.components.events.get_zoomed_image_dimensions({
							type      : "out",
							element   : hear.state.element.firstChild.firstChild,
							increment : 100
						})
						hear.state.element.firstChild.firstChild.style.width  = dimensions.width +"px"
						hear.state.element.firstChild.firstChild.style.height = dimensions.height +"px"
						hear.state.element.firstChild.firstChild.style.top    = dimensions.top +"px"
						hear.state.element.firstChild.firstChild.style.left   = dimensions.left +"px"
						return hear
					}
				}
			],
			body : [
				{
					for       : "image_click",
					that_does : function (hear) {
						var animate
						animate = function (instructions) {
							instructions.how_long    = hear.state.details.body.speed
							instructions.with_easing = hear.state.details.body.easing
							make.animate.animate(instructions)
						}
						animate({
							element     : hear.state.body.lightbox,
							delay       : 0,
							property    : ["opacity"],
							from        : [0],
							to          : [1],
							how_long    : hear.state.details.body.speed,
							with_easing : hear.state.details.body.easing
						})
						window.setTimeout(function () {
							document.body.style.overflow            = "hidden"
							hear.state.body.lightbox.style.display  = "block"
							hear.state.body.lightbox.children[0].appendChild(
								self.components.events.create_viewed_image({
									source  : hear.event.target.src,
									animate : animate
								})
							)

							hear.state.body.lightbox.children[2].children[1].appendChild(
								self.components.events.create_inner_view({
									images           : hear.state.data.shown,
									view_class_name  : hear.state.details.class_names.gallery_lightbox_view_inner,
									image_class_name : hear.state.details.class_names.gallery_lightbox_view_inner_image,
									animate          : function (instructions) {
										instructions.how_long    = hear.state.details.body.speed
										instructions.with_easing = hear.state.details.body.easing
										make.animate.animate(instructions)
									}
								})
							)
						}, hear.state.details.speed)

						return hear
					}
				}
			]
		}
	},

	make : function (make) {
		return {
			type      : "div",
			attribute : {
				"class" : make.class_names.gallery_lightbox
			},
			style : {
				width    : "100%",
				height   : "100%",
				top      : "0px",
				left     : "0px",
				display  : "none",
				opacity  : "0",
				position : "fixed"
			},
			children : [
				{
					type  : "div",
					attribute : {
						"class" : make.class_names.gallery_lightbox_window
					},
					style : {
						width    : "80%",
						height   : "100%",
						overflow : "hidden",
						"float"  : "left",
						cursor   : "pointer",
						display  : "inline-block"
					}
				},
				{
					type      : "div",
					attribute : {
						"class" : make.class_names.gallery_lightbox_window_controls
					},
					style : {},
					children : [
						{
							type : "div",
							attribute : {
								"class" : make.class_names.gallery_lightbox_window_control_minus
							}
						},
						{
							type : "div",
							attribute : {
								"class" : make.class_names.gallery_lightbox_window_control_plus
							}
						},
					]
				},
				{
					type : "div",
					attribute : {
						"class" : make.class_names.gallery_lightbox_view
					},
					style: {
						width    : "20%",
						height   : "100%",
						overflow : "hidden",
						"float"  : "left",
						display  : "inline-block"
					},
					children : [
						{
							type  : "div",
							attribute : {
								"class" : make.class_names.gallery_lightbox_view_controls
							},
							style : {
								"float"  : "left",
								position : "relative",
								zIndex   : "999"
							},
							children : [
								{
									type      : "div",
									attribute : {
										"class" : make.class_names.gallery_lightbox_view_control_close
									},
								},
								{
									type      : "div",
									attribute : {
										"class" : make.class_names.gallery_lightbox_view_control_previous
									},
								},
								{
									type      : "div",
									attribute : {
										"class" : make.class_names.gallery_lightbox_view_control_next
									},
								},
							]
						},
						{
							type      : "div",
							attribute : {
								"class" : make.class_names.gallery_lightbox_view_inner
							},
						},
					]
				}
			]
		}
	},

	components : {},

})