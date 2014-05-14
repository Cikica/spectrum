define({

	define : {
		require : ["morphism"]
	},

	make : function (make) {
		var self
		self = this
		return {
			body : [
				{
					for       : "startup",
					that_does : function (hear) {
						hear.state.data.defined = self.create_images_definition({
							images  : hear.state.body.body.children[1].children,
							tags    : self.library.morphism.index_loop({
								array    : hear.state.images,
								else_do  : function (loop) {
									var tags  = loop.array[loop.index].tags.concat(( !hear.state.tag.all_tag ? [] : "all" ))
									return loop.into.concat([tags])
								}
							}),
							details : {
								image_height : hear.state.details.body.image_height
							}
						})
						return hear
					}
				},
				{
					for       : "resize",
					that_does : function (hear) {

						hear.state.details.body.width = self.update_and_resize_gallery_width({
							current_width : hear.state.details.body.width,
							mimic_width   : hear.state.details.body.mimic_width,
							original_width: hear.state.details.body.original_width,
							gallery_body  : hear.state.body.body,
							parent        : hear.state.details.body.parent,
							animate       : function (instructions) {
								make.animate.animate(instructions)
							},
							animation     : {
								speed  : hear.state.details.body.speed,
								easing : hear.state.details.body.easing
							}
						})
						return hear
					}
				},
				{
					for       : "resize",
					that_does : function (hear) {
						return self.order_images(hear, make, false)
					}
				},
				{
					for : "resize",
					that_does : function (hear) {
						hear.state.details.body.height = self.update_and_resize_gallery_height({
							current_height: hear.state.details.body.height,
							gallery_body  : hear.state.body.body,
							parent        : hear.state.details.body.parent,
							animate       : function (instructions) {
								make.animate.animate(instructions)
							},
							animation     : {
								speed  : hear.state.details.body.speed,
								easing : hear.state.details.body.easing
							}
						})
						return hear
					}
				},
				{
					for       : "filter",
					that_does : function (hear) {
						var tag, tag_is_activated, one_tag_activated, do_we, choices
						tag               = hear.event.target.getAttribute("data-tag-name")
						tag_is_activated  = ( hear.state.data.filtered.indexOf(tag) > -1 )
						one_tag_activated = ( hear.state.data.filtered.length < 2 )
						choices           = {
							"deactivate this tag" : {
								deactivate_this   : true,
								deactivate_others : false,
							},
							"stay the same" : {
								deactivate_this   : false,
								deactivate_others : false,
							},
							"only activate this tag" : {
								deactivate_this   : false,
								deactivate_others : false,
							},
							"activate this tag deactivate others" : {
								deactivate_this   : false,
								deactivate_others : true,
							}
						}

						if (  hear.state.tag.multi_filter && tag_is_activated && !one_tag_activated )
							do_we = choices["deactivate this tag"]
						if (  hear.state.tag.multi_filter && tag_is_activated && one_tag_activated )
							do_we = choices["stay the same"]
						if ( !hear.state.tag.multi_filter && tag_is_activated )
							do_we = choices["stay the same"]
						if (  hear.state.tag.multi_filter && !tag_is_activated )
							do_we = choices["only activate this tag"]
						if (  !hear.state.tag.multi_filter && !tag_is_activated )
							do_we = choices["activate this tag deactivate others"]

						return self.library.morphism.index_loop({
							array   : hear.event.target.parentElement.children,
							if_done : function () {
								return hear
							},
							else_do : function (loop) {

								if ( loop.array[loop.index] === hear.event.target ) {
									loop.array[loop.index].setAttribute("class", (
										do_we.deactivate_this === true ?
											hear.state.details.class_names.filter_button :
											hear.state.details.class_names.selected_filter
										)
									)
								} else {
									if ( do_we.deactivate_others === true )
										loop.array[loop.index].setAttribute("class", hear.state.details.class_names.filter_button )
								}
							}
						})
					}
				},
				{
					for       : "filter",
					that_does : function (hear) {
						if ( hear.state.details.mimic_width ) {
							hear.state.details.body.width = self.update_and_resize_gallery_width({
								current_width : hear.state.details.body.width,
								gallery_body  : hear.state.body.body,
								parent        : hear.state.details.body.parent,
								animate       : function (instructions) {
									make.animate.animate(instructions)
								},
								animation     : {
									speed  : hear.state.details.body.speed,
									easing : hear.state.details.body.easing
								}
							})
						}
						return hear
					}
				},
				{
					for       : "filter",
					that_does : function (hear) {
						return self.order_images(hear, make, hear.event.target.getAttribute("data-tag-name"))
					}
				},
				{
					for       : "filter",
					that_does : function (hear) {
						hear.state.details.body.height = self.update_and_resize_gallery_height({
							current_height: hear.state.details.body.height,
							gallery_body  : hear.state.body.body,
							parent        : hear.state.details.body.parent,
							animate       : function (instructions) {
								make.animate.animate(instructions)
							},
							animation     : {
								speed  : hear.state.details.body.speed,
								easing : hear.state.details.body.easing
							}
						})
						return hear
					}
				}
			]
		}
	},

	update_and_resize_gallery_height : function (update) {
		var height
		height = update.current_height
		update.animate({
			element     : update.gallery_body.children[1],
			delay       : 0,
			property    : ["height"],
			from        : [update.gallery_body.children[1].clientHeight],
			to          : [height],
			how_long    : update.animation.speed,
			with_easing : update.animation.easing
		})
		return height
	},

	update_and_resize_gallery_width : function (update) {
		var width
		width  = update.current_width
		if (
			( update.mimic_width === false && update.original_width > update.parent.clientWidth ) ||
			( update.mimic_width === true  && update.current_width !== update.parent.clientWidth )
		) {
			update.animate({
				element     : update.gallery_body,
				delay       : 0,
				property    : ["width"],
				from        : [width],
				to          : [update.parent.clientWidth],
				how_long    : update.animation.speed,
				with_easing : update.animation.easing
			})
			update.animate({
				element     : update.gallery_body.children[1],
				delay       : 0,
				property    : ["width"],
				from        : [width],
				to          : [update.parent.clientWidth],
				how_long    : update.animation.speed,
				with_easing : update.animation.easing
			})
			width = update.parent.clientWidth
		}
		return width
	},

	order_images : function (hear, make, tag_name) {

		var result
		result = make.animate.animate_with_layers({
			finish_layer : {
				name    : "gallery_done",
				pass    : hear.state.data.defined,
				adapter : function (adapt) {
					return adapt.keep[2].images.concat(adapt.keep[3])
				}
			},
			finish_with : function (make) {
				return {
					filtered       : make.keep[0],
					defined        : make.result,
					shown          : make.keep[2].images,
					hidden         : make.keep[3],
					gallery_height : make.keep[2].gallery_height
				}
			},
			layers : [
				{
					pass : {
						filtered     : hear.state.data.filtered,
						name         : tag_name,
						multi_filter : hear.state.tag.multi_filter
					},
					name : "filter",
					keep : true
				},
				{
					pass : {
						image_definitions : hear.state.data.defined
					},
					name : "index_image",
				},
				{
					pass : {
						element    : hear.state.body.body.children[1].children,
						definition : hear.state.data.defined,
					},
					name : "calculation_package",
				},
				{
					name : "retrieve_current_image_positions",
				},
				{
					pass : {
						width        : hear.state.details.body.width,
						padding      : hear.state.details.body.padding,
						image_times  : hear.state.details.body.image_times,
						link_times   : hear.state.details.body.link_times,
						height_times : hear.state.details.body.height_times
					},
					name : "image_size_calculator",
				},
				{
					pass : {
						image_width : hear.state.details.body.image_width
					},
					name : "image_croper",
					keep : true
				},
				{
					pass : {
						align       : hear.state.details.body.align,
						padding     : hear.state.details.body.padding,
						row_padding : hear.state.details.body.row_padding,
						width       : hear.state.details.body.width,
					},
					name : "show_calculator",
					keep : true,
					adapter : function (adapt) {
						return adapt.result.show
					}
				},
				{
					pass    : {
						transition : hear.state.details.body.transition
					},
					name    : "hide_calculator",
					adapter : function (adapt) {
						return adapt.keep[1].hide
					},
					keep : true
				},
				{
					pass : {
						composition     : hear.state.details.body.transition,
						animation_speed : hear.state.details.body.speed,
						easing_method   : hear.state.details.body.easing,
					},
					name    : "orchestrator",
					adapter : function (adapt) {
						return adapt.keep[2].images.concat(adapt.keep[3])
					}
				}
			]
		})
		hear.state.data.defined        = result.defined
		hear.state.data.filtered       = result.filtered
		hear.state.data.shown          = result.shown
		hear.state.data.hidden         = result.hidden
		hear.state.details.body.height = result.gallery_height

		return hear
	},

	create_images_definition : function (define) {
		return this.library.morphism.index_loop({
			array    : define.images,
			else_do  : function (loop) {

				return loop.into.slice(0).concat({
					tags     : define.tags[loop.index],
					original : {
						height : loop.array[loop.index].offsetHeight,
						width  : loop.array[loop.index].offsetWidth,
					},
					src     : loop.indexed.firstChild.src,
					inner   : {
						old : {
							height : 0,
							width  : 0,
						},
						new : {
							height : 0,
							width  : 0,
						}
					},
					index    : loop.index,
					position : {
						old : {
							top       : 0,
							left      : 0,
							height    : define.details.image_height,
							width     : loop.array[loop.index].offsetWidth
						},
						new : {
							top       : 0,
							left      : 0,
							height    : define.details.image_height,
							width     : loop.array[loop.index].offsetWidth,
						}
					},
				})
			}
		})
	},
})