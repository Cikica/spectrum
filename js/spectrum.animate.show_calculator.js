define({
	// the issue is the double end row when all the numbers for space taken are -n eg:[-55,-55] meaning that
	// it would call end row indefinetly but instead fails because the second end row cant find any elements to cut
	// because of the previous one
	define : {
		require : ["morphism"]
	},

	components : {},

	make : function (calculate) {

		return this.calculator({
			details  : {
				shift_function   : this.components.row_shifts[calculate.pass.align],
				padding          : calculate.pass.padding,
				row_padding      : calculate.pass.row_padding,
				align            : calculate.pass.align,
				width            : calculate.pass.width,
			},
			position : {
				row          : 0,
				row_order    : 0,
				order        : 0,
				space_left   : calculate.pass.width,
				space_taken  : 0,
				height_taken : 0
			},
			from : calculate.result.slice(0),
			into : {
				gallery_height : 0,
				images         : [],
				by_row         : [
					{
						elements   : [],
						space_left : 0,
						row_height : 0
					}
				]
			}
		})
	},

	calculator : function (calculate) {
		if ( calculate.from.length === 0 ) {
			var calculation
			calculation = this.make_image_position_calculation({
				old            : calculate.into,
				row            : calculate.position.row,
				shift_function : calculate.details.shift_function,
				space_left     : 0,
				row_padding    : calculate.details.row_padding,
				padding        : calculate.details.padding,
				gallery_width  : calculate.details.width,
				image          : [],
				end_of_row     : true,
			})
			calculation.images = this.library.morphism.index_loop({
				array   : calculation.by_row,
				else_do : function (loop) {
					return loop.into.concat(loop.indexed.elements)
				}
			})
			return calculation
		} else {
			return this.calculator(this.create_position_state(calculate))
		}
	},

	create_position_state : function (state) {

		var optimal

		optimal = this.find_optimal_image_and_its_index({
			images          : state.from,
			space_left      : state.position.space_left,
			space_taken     : state.position.space_taken,
			padding         : state.details.padding,
			current_height  : state.into.gallery_height
		})

		return {
			details  : state.details,
			position : this.create_position_definition({
				new_row     : ( optimal.index === -1 ),
				order       : state.position.order,
				row_order   : state.position.row_order,
				row         : state.position.row,
				width       : state.details.width,
				padding     : state.details.padding,
				space_left  : state.position.space_left,
				image       : optimal.image,
			}),
			from : this.library.morphism.epimorph_array({
				array     : state.from,
				exclude   : [optimal.index],
				by_index  : true
			}),
			into : this.make_image_position_calculation({
				old            : state.into,
				row            : state.position.row,
				shift_function : state.details.shift_function,
				space_left     : ( optimal.index === -1 ? 0 : state.position.space_left - ( optimal.image.original.width + state.details.padding ) ),
				row_padding    : state.details.row_padding,
				padding        : state.details.padding,
				gallery_width  : state.details.width,
				image          : optimal.image,
				end_of_row     : ( optimal.index === -1 ? true : false ),
			})
		}
	},

	find_optimal_image_and_its_index : function (the) {
		var result
		result = {
			index : this.get_index_of_image_which_takes_up_the_most_space_left({
				images          : the.images,
				available_space : the.space_left
			}),
			image : []
		}

		if ( result.index > -1 ) {
			result.image = this.new_image_state({
				image        : the.images[result.index],
				height_taken : the.current_height,
				space_taken  : the.space_taken,
				padding      : the.padding,
			})
		}
		return result
	},

	new_image_state : function (define) {

		return {
			element  : define.image.element,
			original : define.image.original,
			inner    : define.image.inner,
			index    : define.image.index,
			src      : define.image.src,
			position : {
				old : define.image.position.old,
				new : {
					left   : ( define.order === 0 ? define.space_taken : define.space_taken + define.padding ),
					top    : define.height_taken,
					height : define.image.position.new.height,
					width  : define.image.position.new.width,
				}
			}
		}
	},

	create_position_definition : function (definition) {
		return {
			row         : ( definition.new_row ? definition.row +1 : definition.row ),
			space_left  : ( definition.new_row ? definition.width : definition.space_left - ( definition.image.original.width + definition.padding ) ),
			space_taken : ( definition.new_row ? 0 : definition.width - ( definition.space_left - ( definition.image.original.width + definition.padding ))),
			row_order   : ( definition.new_row ? 0 : definition.row_order + 1 ),
			order       : definition.order + 1
		}
	},

	make_image_position_calculation : function (state) {

		var row_definition

		if ( state.end_of_row ) {

			row_definition = this.shift_images_in_current_row_and_add_new_row_definition({
				old            : state.old.by_row,
				padding        : state.padding,
				gallery_width  : state.gallery_width,
				shift_function : state.shift_function
			})
		} else {
			row_definition = this.update_current_row_details({
				old            : state.old.by_row,
				space_left     : state.space_left,
				image          : state.image
			})
		}

		return {
			gallery_height : ( state.end_of_row ?
				state.old.gallery_height + row_definition[row_definition.length-2].row_height + state.row_padding :
				state.old.gallery_height
			),
			by_row         : row_definition,
		}
	},

	shift_images_in_current_row_and_add_new_row_definition : function (row) {

		return row.old.slice(0, row.old.length-1).concat([
			row.shift_function.call(this, {
				row     : row.old[row.old.length-1],
				details : {
					padding : row.padding,
					width   : row.gallery_width
				}
			}),
			{
				elements   : [],
				space_left : 0,
				row_height : 0,
			}
		])
	},

	update_current_row_details : function (row) {
		return row.old.slice(0, row.old.length-1).concat({
			elements   : row.old[row.old.length-1].elements.concat(row.image),
			space_left : row.space_left,
			row_height : row.old[row.old.length-1].row_height,
		})
	},

	get_index_of_image_which_takes_up_the_most_space_left : function (calculate) {

		return this.get_the_index_of_the_optimal_image(this.library.morphism.index_loop({
			array    : calculate.images,
			into     : {
				available_space : calculate.available_space,
				space_left      : [],
				image_index     : [],
			},
			else_do  : this.calculate_space_left_after_image_insertion
		}))
	},

	get_the_index_of_the_optimal_image : function (optimal) {
		var value = ( this.are_all_values_within_array_bellow_zero(optimal.space_left) ?
			-1 :
			optimal.image_index[this.get_the_index_of_the_smallest_space_left(optimal.space_left)]
		)

		return value
	},

	are_all_values_within_array_bellow_zero : function (array) {

		return this.library.morphism.index_loop({
			array   : array,
			into    : true,
			else_do : function (loop) {
				return ( loop.indexed < 0 ? loop.into : false )
			}
		})
	},

	get_the_index_of_the_smallest_space_left : function (space_left) {
		return this.library.morphism.index_loop({
			array   : space_left,
			into    : {
				index : 0,
				value : null
			},
			if_done : function (loop) {
				return loop.into.index
			},
			else_do : function (loop) {
				if ( loop.into.value === null && loop.indexed > -1 )
					return {
						index : loop.index,
						value : loop.indexed
					}
				if ( loop.indexed < loop.into.value && loop.indexed > -1 )
					return {
						index  : loop.index,
						valule : loop.indexed
					}
				return loop.into
			}
		})
	},

	calculate_space_left_after_image_insertion : function (calculate) {

		var space_left

		space_left = calculate.into.available_space - calculate.array[calculate.index].position.new.width

		return {
			available_space : calculate.into.available_space,
			space_left      : calculate.into.space_left.concat(space_left),
			image_index     : calculate.into.image_index.concat(calculate.index)
		}
	},
})