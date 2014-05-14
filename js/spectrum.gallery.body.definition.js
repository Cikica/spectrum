define({

	make : function (make) {
		return {
			type      : "div",
			attribute : {
				"class" : make.class_names.gallery
			},
			style : {
				width    : make.details.width +"px",
				overflow : "hidden"
			},
			children : [
				this.bar(make),
				this.box(make)
			]
		}
	},

	box : function (make) {
		return {
			type      : "div",
			attribute : {
				"class" : make.class_names.gallery_box
			},
			style : {
				position : "relative",
				overflow : "hidden",
				margin   : "0px",
				padding  : "0px",
				width    : make.details.width  +"px",
				height   : make.details.height +"px"
			},
			children : this.loop_and_generate_definition({
				from     : make.image_paths,
				of_type  : "image",
				into     : [],
				pass     : {
					class_name       : make.class_names.image_wrap,
					image_width      : make.details.image_width,
					image_height     : make.details.image_height,
					on_load_function : make.on_load_function
				},
				start_at : 0,
			})
		}
	},

	bar : function (make) {

		return {
			type      : "div",
			attribute : {
				"class" : make.class_names.filter_bar
			},
			children : this.loop_and_generate_definition({
				from     : make.tag.names,
				of_type  : "bar_button",
				into     : [],
				pass     : {
					starting_tag_name     : make.tag.start_on_tag,
					selected_class_name   : make.class_names.selected_filter,
					unselected_class_name : make.class_names.filter_button,
				},
				start_at : 0,
			})
		}
	},

	loop_and_generate_definition : function (generate) {

		if ( generate.start_at >= generate.from.length ) {
			return generate.into
		} else {
			generate.into.push(this.loopable_definitions[generate.of_type](generate))
			generate.start_at += 1
			return this.loop_and_generate_definition(generate)
		}
	},

	loopable_definitions : {
		bar_button : function (details) {
			return {
				type : "span",
				property  : {
					textContent : details.from[details.start_at]
				},
				attribute : {
					"data-tag-name" : details.from[details.start_at],
					"class"              : (
						details.pass.starting_tag_name === details.from[details.start_at] ?
							details.pass.selected_class_name :
							details.pass.unselected_class_name
					)
				}
			}
		},

		image : function (details) {
			return {
				type      : "div",
				style     : {
					position : "absolute",
					overflow : "hidden",
					width    : details.pass.image_width +"px",
					height   : details.pass.image_height+"px",
					top      : "0px",
					left     : "0px",
				},
				attribute : {
					"class" : details.pass.class_name
				},
				children : [
					{
						type : "img",
						style: {
							height   : "100%",
							width    : "auto",
							position : "relative"
						},
						property  : {
							onload : details.pass.on_load_function
						},
						attribute : {
							"src" : details.from[details.start_at].url
						}
					}
				]
			}
		},
	},

	calculate_image_width : function (details) {
		return Math.floor(
			( details.gallery_width-
				( details.padding*
					(details.image_times-1)))/ details.image_times )
	},

})