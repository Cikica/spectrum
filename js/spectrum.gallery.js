define({

	define : {
		require : [
			"morphism",
			"default_sorter",
			"node_maker",
			"event_master"
		]
	},

	method : {
		animate : {},
		create  : {},
		event   : {},
	},

	state : {
		images : function (merge) {

			return ( merge.value.constructor === Array ?
				merge.value :
				this.convert_object_image_definition_into_array(merge.value)
			)
		},
		tag : {
			all_tag      : "all",
			multi_filter : false,
			names   : function (merge) {

				var all_tag_index, tags

				tags = this.get_all_unique_tag_names_that_exist_in_the_images(merge.parent.base.images)

				if ( merge.current_object.all_tag !== false ) {
					all_tag_index = tags.indexOf(merge.current_object.all_tag)
					if ( all_tag_index !== -1 )
						tags.splice(all_tag_index, 1)
					tags.unshift(merge.current_object.all_tag)
				}

				return tags
			},
			start_on_tag : function (merge) {
				var start_on_tag = ( !merge.current_object.all_tag && !merge.value ?
					merge.current_object.names[0] :
					merge.value || merge.current_object.all_tag
				)

				return start_on_tag
			},
		},
		components : {
			lightbox : {}
		},
		data  : {
			defined  : [],
			shown    : [],
			hidden   : [],
			filtered : function (merge) {

				return [merge.parent.base.tag.start_on_tag]
			}
		},
		details : {
			body      : {
				parent       : false,
				mimic_width  : true,
				width        : function (merge) {
					var width
					if ( merge.value && !merge.current_object.mimic_width )
						width = merge.value
					else
						width = ( merge.current_object.parent.clientWidth === 0 ? merge.current_object.parent.offsetWidth : merge.current_object.parent.clientWidth )
					return width
				},
				original_width : function (merge) {
					return ( !merge.current_object.mimic_width ?
						merge.current_object.width :
						false
					)
				},
				height       : 100,
				padding      : 0,
				row_padding  : 0,
				transition   : function () {
					return "basic"
				},
				speed        : 1000,
				image_times  : false,
				link_times   : false,
				align        : function (merge) {
					return (
						!merge.value ||
						merge.current_object.image_times && merge.value === "fill" ?
							"left" :
							merge.value
					)
				},
				image_width  : function (merge) {
					var value
					value = "auto"

					if ( merge.current_object.image_times )
						value = this.calculate_the_width_of_an_image_as_a_division_of_the_galleries_width({
							width   : merge.current_object.width,
							divide  : merge.current_object.image_times,
							padding : merge.current_object.padding
						})
					if ( merge.value )
						value = merge.value

					return value
				},
				height_times : function (merge) {
					return ( merge.current_object.link_times ? "*1" : false )
				},
				image_height : function (merge) {
					var value

					value = 100
					if ( merge.current_object.link_times )
						value = merge.current_object.image_width
					if ( merge.value )
						value = merge.value
					if ( merge.current_object.image_width !== "auto" && merge.current_object.height_times !== false ) {
						if ( merge.current_object.height_times.match("[0-9]*/[0-9]") !== null )
							value = merge.current_object.image_width/parseInt(merge.current_object.height_times.match("/[0-9]")[0].slice(1), 10)
						if ( merge.current_object.height_times.match("[*][0-9]") !== null )
							value = merge.current_object.image_width*parseFloat(merge.current_object.height_times.match("[*][0-9]")[0].slice(1))
					}

					return value
				},
				easing       : "easeOutCirc",
			},
			lightbox  : {

			},
			class_names  : {
				gallery                                : "gallery_main",
				gallery_box                            : "gallery_box",
				image_wrap                             : "gallery_image_wrap",
				filter_bar                             : "gallery_filter_bar",
				filter_button                          : "gallery_filter_button",
				selected_filter                        : "gallery_filter_selected_button",
				gallery_lightbox                       : "gallery_lightbox",
				gallery_lightbox_window                : "gallery_lightbox_window",
				gallery_lightbox_window_image          : "gallery_lightbox_window_image",
				gallery_lightbox_view                  : "gallery_lightbox_view",
				gallery_lightbox_view_inner            : "gallery_lightbox_view_inner",
				gallery_lightbox_view_controls         : "gallery_lightbox_view_controls",
				gallery_lightbox_view_control_next     : "gallery_lightbox_view_control_next",
				gallery_lightbox_view_control_previous : "gallery_lightbox_view_control_previous",
				gallery_lightbox_view_control_close    : "gallery_lightbox_view_control_close",
				gallery_lightbox_window_control_minus  : "gallery_lightbox_window_control_minus",
				gallery_lightbox_window_control_plus   : "gallery_lightbox_window_control_plus",
				gallery_lightbox_window_controls       : "gallery_lightbox_window_controls",
				gallery_lightbox_view_inner_image      : "gallery_lightbox_view_inner_image",
			},
		},
		body : function (merge) {

			var self
			self = this
			return this.epimorph({
				object : this.components,
				include: this.premited_structure_components,
				with   : function (component) {
					var component_premission
					component_premission = self.component_premission[component.property_name].call(self, merge.current_object)

					return self.library.node_maker.make_node(
						self.components[component.property_name].make(component_premission.definition)
					).append(component_premission.append_to)
				}
			})
		}
	},

	premited_structure_components : [
		"body",
		"cover",
		"lightbox"
	],

	component_premission : {
		body : function (state) {
			var self
			self = this
			return {
				append_to  : state.details.body.parent,
				definition : {
					details          : state.details.body,
					class_names      : state.details.class_names,
					image_paths      : state.images,
					tag              : state.tag,
					on_load_function : function () {
						this.parentElement.setAttribute("data-loaded", "true")
						if ( self.how_many_images_have_loaded(state.body.body.children[1].children) === state.body.body.children[1].children.length ) {
							self.method.event.body.stage_event({
								called : "startup"
							})
							self.method.event.body.stage_event({
								called : "filter",
								as     : function (state) {
									return {
										state : state,
										event : {
											target : self.find_and_return_element_with_given_attribute({
												element         : state.body.body.firstChild,
												attribute       : "data-tag-name",
												attribute_value : state.tag.start_on_tag
											})
										}
									}
								}
							})
						}
					}
				}
			}
		},
		lightbox : function (state) {
			return {
				append_to  : document.body,
				definition : {
					class_names : state.details.class_names
				}
			}
		}
	},

	add_component : [
		"event",
		"body",
		"lightbox",
	],

	components : {},

	make : function (instructions) {

		var self
		self         = this
		this.method  = {
			animate   : instructions.method.animate,
			make_node : instructions.method.make_node
		}
		this.state   = this.library.default_sorter.merge({
			default_definition : this.state,
			new_definition     : instructions.state,
			this_context       : this,
		})

		this.method.event = this.pass_an_object_of_definitions_to_a_wraped_method({
			definition : this.retrieve_specific_method_value_from_allowed_components({
				components    : this.components,
				premited_list : this.premited_structure_components,
				method_name   : "make_new_event",
				details       : this.state
			}),
			method : function (add) {
				return Object.create(self.library.event_master).make(add.value[0])
			}
		})
		this.pass_an_object_of_definitions_to_a_wraped_method({
			definition : this.retrieve_specific_method_value_from_allowed_components({
				components    : this.components,
				premited_list : this.premited_structure_components,
				method_name   : "make_event_bind",
				details       : {
					animate : this.method.animate
				}
			}),
			method : function (add) {
				self.library.morphism.homomorph({
					object : add.value[0],
					with   : function (detail) {
						self.method.event[detail.property_name].add_listener(detail.value)
					}
				})
			}
		})
		return this
	},

	retrieve_specific_method_value_from_allowed_components : function (from) {
		return this.epimorph({
			object  : from.components,
			include : from.premited_list,
			with    : function (member) {
				return ( member.value[from.method_name] ?
					[].concat(member.value[from.method_name](from.details)) :
					[]
				)
			}
		})
	},

	pass_an_object_of_definitions_to_a_wraped_method : function (add) {
		return this.library.morphism.homomorph({
			object : add.definition,
			with   : function(member) {
				return add.method(member)
			}
		})
	},

	calculate_the_width_of_an_image_as_a_division_of_the_galleries_width : function (the) {
		return ( the.width - (the.divide-1)*the.padding )/the.divide
	},

	how_many_images_have_loaded : function (images) {
		return this.library.morphism.index_loop({
			array    : images,
			into     : 0,
			else_do  : function (loop) {
				return ( loop.array[loop.index].getAttribute("data-loaded") === "true" ?
					loop.into + 1 :
					loop.into
				)
			}
		})
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

	epimorph : function (morph) {
		var set = {}
		for ( var property in morph.object ) {
			if ( morph.include.indexOf(property) > -1 ) {
				set[property] = morph.with.call({}, {
					value         : morph.object[property],
					property_name : property,
					set           : set,
				})
			}
		}
		return set
	},

	convert_object_image_definition_into_array : function (definition) {

		var directory, format

		directory      = ( definition.directory || "" ) + "/"
		format         = "."+ ( definition.format || "jpg" )

		return this.library.morphism.index_loop({
			array   : definition.names,
			else_do : function (loop) {
				var url, own_format, tags

				url        = directory + definition.names[loop.index]
				own_format = definition.names[loop.index].match(/.jpg|.png|.jpeg/g)
				tags       = []

				if ( definition.tags[loop.index] || definition.tags[loop.index].length > 0 ) {
					tags = ( tags.constructor === String ?
						definition.tags[loop.index].split(/, ?/) :
						definition.tags[loop.index]
					)
				}

				return loop.into.concat({
					url  : ( own_format ? url : url + format ),
					tags : tags
				})
			}
		})
	},

	get_all_tags_within_the_images : function (images) {
		return this.library.morphism.index_loop({
			array   : images,
			else_do : function (loop) {
				return loop.into.concat(loop.indexed.tags)
			}
		})
	},

	get_all_unique_tag_names_that_exist_in_the_images : function (images) {

		return this.library.morphism.index_loop({
			array   : this.get_all_tags_within_the_images(images),
			else_do : function (loop) {
				return ( loop.array.indexOf(loop.indexed) === loop.index ?
					loop.into.concat(loop.indexed) :
					loop.into
				)
			}
		})
	},

	find_and_return_element_with_given_attribute : function (what) {
		return this.library.morphism.index_loop_base({
			array    : what.element.children,
			start_at : 0,
			into     : null,
			if_done  : function (loop) {
				return loop.into
			},
			else_do  : function (loop) {
				if ( loop.array[loop.start_at].getAttribute(what.attribute) === what.attribute_value )
					loop.into     = loop.array[loop.start_at]
				loop.start_at += 1
				return loop
			}
		})
	}
})