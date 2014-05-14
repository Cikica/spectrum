define({

	define : {
		require : [
			"morphism",
			"node_maker",
		]
	},

	get_zoomed_image_dimensions : function (zoom) {
		var zoom_change, dimensions
		zoom_change       = ( zoom.type === "in" ? zoom.increment : -zoom.increment )
		dimensions        = {}
		dimensions.width  = zoom.element.clientWidth+zoom_change
		dimensions.height = zoom.element.clientHeight/zoom.element.clientWidth*dimensions.width
		dimensions.left   = zoom.element.offsetLeft-(zoom_change/2)
		if ( dimensions.width < 0 )
			return {
				width  : zoom.element.clientWidth,
				height : zoom.element.clientHeight,
				left   : zoom.element.offsetLeft,
				top    : zoom.element.offsetTop,
			}
		else
			return dimensions
	},

	create_viewed_image : function (image) {
		var self = this
		return this.library.node_maker.make_node({
			type  : "img",
			style : {
				top      : "0px",
				left     : "0px",
				position : "relative",
				cursor   : "pointer",
				opacity  : "0"
			},
			attribute : {
				src       : image.source,
				draggable : "false"
			},
			property : {
				onload : function (event) {
					var cordinates, image_index, move_view_by, container

					container    = event.target.parentElement.parentElement.lastChild.lastChild.firstChild
					cordinates   = self.get_centered_image_cordinates(event.target)
					image_index  = self.get_image_index_within_container_based_on_source({
						source    : event.target.src,
						container : container
					})
					move_view_by = ( image_index === 0 ?
							0 :
							self.get_height_of_every_image_within_container_up_to_a_point({
							container : container,
							point     : image_index
						})
					)

					image.animate({
						element : container,
						delay   : 0,
						property: ["top"],
						from    : [parseInt(container.style.top.replace("px",""), 10)],
						to      : [-move_view_by]
					})

					image.animate({
						element  : event.target,
						delay    : 0,
						property : ["opacity"],
						from     : [0],
						to       : [1],

					})
					event.target.style.left = cordinates.left +"px"
					event.target.style.top  = cordinates.top +"px"
				}
			}
		}).node
	},

	get_centered_image_cordinates : function (image) {
		return {
			left : (image.parentElement.clientWidth/2) - (image.clientWidth/2),
			top  : (image.parentElement.clientHeight/2) - (image.clientHeight/2),
		}
	},

	get_height_of_every_image_within_container_up_to_a_point : function (image) {
		var self = this
		return this.library.morphism.index_loop_base({
			array   : image.container.children,
			start_at: 0,
			into    : [],
			if_done : function (loop) {
				return self.add_up_all_the_values_within_array(loop.into.slice(0,image.point))
			},
			else_do : function (loop) {
				loop.into = loop.into.concat(loop.array[loop.start_at].clientHeight)
				loop.start_at += 1
				return loop
			}
		})
	},

	get_image_index_within_container_based_on_source : function (image) {
		return this.library.morphism.index_loop_base({
			array   : image.container.children,
			start_at: 0,
			into    : 0,
			if_done : function (loop) {
				return loop.into
			},
			else_do : function (loop) {
				if ( loop.array[loop.start_at].src === image.source )
					loop.into = loop.start_at
				loop.start_at += 1
				return loop
			}
		})
	},

	get_image_source_from : function (the) {
		var new_image, children_for
		children_for = {
			next : ["nextSibling", "firstChild"],
			previous : ["previousSibling", "lastChild"]
		}
		new_image       = this.get_image_that_matches_given_source({
			source    : the.current_source,
			container : the.container
		})[children_for[the.direction][0]]
		return ( new_image === null ?
			the.container[children_for[the.direction][1]].src :
			new_image.src
		)
	},

	get_image_that_matches_given_source : function (image) {
		return this.library.morphism.index_loop_base({
			array   : image.container.children,
			start_at: 0,
			into    : 0,
			if_done : function (loop) {
				return loop.into
			},
			else_do : function (loop) {
				if ( loop.array[loop.start_at].src === image.source )
					loop.into = loop.array[loop.start_at]
				loop.start_at += 1
				return loop
			}
		})
	},

	add_up_all_the_values_within_array : function (array) {
		return this.library.morphism.index_loop({
			array : array,
			into  : 0,
			else_do : function (loop) {
				return loop.into + loop.indexed
			}
		})
	},

	create_inner_view : function (define) {
		var self = this
		return this.library.node_maker.make_node({
			type : "div",
			attribute : {
				"class" : define.view_class_name
			},
			style : {
				position : "relative",
				width    : "100%",
				left     : "100%",
				top      : "0px"
			},
			children : this.library.morphism.index_loop({
				array   : define.images,
				else_do : function (loop) {
					return loop.into.concat({
						type : "img",
						style: {
							width : "100%"
						},
						attribute : {
							"class"       : define.image_class_name,
							src           : loop.indexed.src,
							"data-loaded" : "false"
						},
						property    : {
							onload : function (event) {
								event.target.setAttribute("data-loaded", "true" )

								if (self.have_all_inner_view_images_loaded(event.target.parentElement.children)) {
									define.animate({
										element     : event.target.parentElement,
										delay       : 0,
										property    : ["left"],
										from        : [event.target.parentElement.parentElement.clientWidth],
										to          : [0],
									})
								}
							}
						}
					})
				}
			})
		}).node
	},

	have_all_inner_view_images_loaded : function (images) {
		return this.library.morphism.index_loop({
			array   : images,
			into    : 0,
			if_done : function (loop) {
				return ( loop.into === images.length )
			},
			else_do : function (loop) {
				return ( loop.indexed.getAttribute("data-loaded") === "true" ? loop.into + 1 : loop.into )
			}
		})
	}
})