define({

	left : function (align) {

		return {
			elements   : align.row.elements,
			space_left : align.row.space_left,
			row_height : align.row.elements[0].position.new.height
		}
	},

	right : function (align) {

		var length_of_images_from_zero, elements

		length_of_images_from_zero = align.row.elements.length-1
		elements                   = this.library.morphism.index_loop({
			array     : align.row.elements,
			else_do   : function (loop) {
				var shifted_image
				shifted_image                    = loop.array.slice(length_of_images_from_zero-loop.index)[0]
				shifted_image.position.new.left += align.row.space_left + align.details.padding
				return loop.into.concat(shifted_image)
			}
		})

		return {
			elements   : elements,
			space_left : align.row.space_left,
			row_height : align.row.elements[0].position.new.height
		}
	},

	fill : function (align) {

		var multipler, all_padding, available_width, elements, space_taken

		space_taken     = 0
		all_padding     = align.row.elements.length * align.details.padding
		available_width = align.details.width - all_padding
		multipler       = available_width / ( available_width - align.row.space_left )
		elements        = this.library.morphism.index_loop({
			array   : align.row.elements,
			into    : {
				space_taken : 0,
				elements    : []
			},
			if_done : function (loop) {
				return loop.into.elements
			},
			else_do : function (loop) {
				var width, height
				width                            = loop.indexed.original.width * multipler
				height                           = ( loop.indexed.original.height / loop.indexed.original.width ) * width
				loop.indexed.position.new.left   = loop.into.space_taken
				loop.indexed.position.new.height = height
				loop.indexed.position.new.width  = width
				loop.indexed.inner.new.height    = height
				loop.indexed.inner.new.width     = width
				return {
					space_taken : loop.into.space_taken + width + align.details.padding,
					elements    : loop.into.elements.concat(loop.indexed)
				}
			}
		})

		return {
			elements   : elements,
			space_left : align.row.space_left,
			row_height : elements[0].position.new.height
		}
	},

	justify : function (align) {

		var justified_padding, elements

		justified_padding = align.row.space_left / (align.row.elements.length-1)
		elements          = this.library.morphism.index_loop({
			array     : align.row.elements,
			else_do   : function (loop) {
				var padding
				padding                          = ( loop.index === 0 ? 0 : align.details.padding )
				loop.indexed.position.new.left += ( loop.index * justified_padding ) + padding
				return loop.into.concat(loop.indexed)
			}
		})
		return {
			elements   : elements,
			space_left : align.row.space_left,
			row_height : align.row.elements[0].position.new.height
		}
	},
})