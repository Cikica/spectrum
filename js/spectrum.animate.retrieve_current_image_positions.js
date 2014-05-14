define({

	define : {
		require : [
			"morphism"
		]
	},

	make : function (animate) {
		return {
			show : this.get_current_position_of_images_in_array(animate.result.show),
			hide : this.get_current_position_of_images_in_array(animate.result.hide)
		}
	},

	get_current_position_of_images_in_array : function (images) {
		var self = this
		return this.library.morphism.index_loop({
			array   : images,
			else_do : function (loop) {

				loop.array[loop.index].position.old = self.get_specified_image_element_values({
					values  : loop.array[loop.index].position.old,
					element : loop.array[loop.index].element
				})
				return loop.into.concat(loop.array[loop.index])
			}
		})
	},

	get_specified_image_element_values : function (image) {
		var self = this
		return this.library.morphism.homomorph({
			object : image.values,
			with   : function (member) {
				return self.get_element_property_value({
					element  : image.element,
					property : member.property_name
				})
			}
		})
	},

	get_element_property_value : function (get) {
		if ( get.property === "width" || get.property === "height" ) {
			return this.get_element_property({
				element  : get.element,
				property : get.property,
				prefix   : "client",
			})
		} else {
			return this.get_element_style_value({
				element  : get.element,
				style    : get.property
			})
		}
	},

	get_element_property : function (get) {
		var property_name
		property_name = ( get.prefix ? get.property.slice(0,1).toUpperCase() + get.property.slice(1) : get.property )
		return get.element[get.prefix + property_name]
	},

	get_element_style_value : function (get) {
		var value
		value = get.element.style[get.style]
		if ( this.does_text_have_postfix(value) )
			return parseInt(this.remove_postfix_from_text(value), 10)
		else
			return parseInt(value, 10)
	},

	does_text_have_postfix : function (text) {
		return ( text.match(/px|em|rem|%/g) === null ? false : true )
	},

	remove_postfix_from_text : function (text) {
		return text.replace(/px|em|rem|%/g, "")
	},
})