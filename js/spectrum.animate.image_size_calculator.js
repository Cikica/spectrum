define({

	define : {
		require : ["morphism"]
	},

	make : function (make) {

		return {
			show : this.calculate_image_size({
				image_times  : make.pass.image_times,
				height_times : make.pass.height_times,
				image        : make.result.show,
				padding      : make.pass.padding,
				times        : make.pass.image_times,
				link         : make.pass.link_times,
				width        : make.pass.width
			}),
			hide : this.calculate_image_size({
				image_times  : make.pass.image_times,
				height_times : make.pass.height_times,
				image        : make.result.hide,
				padding      : make.pass.padding,
				times        : make.pass.image_times,
				link         : make.pass.link_times,
				width        : make.pass.width
			}),
		}
	},

	calculate_image_size : function (by) {

		var self = this
		return this.library.morphism.index_loop({
			array   : by.image,
			else_do : function (loop) {

				if ( by.image_times === false && loop.indexed.position.new.width > by.width )
					loop.indexed.position.new.width = by.width

				if ( by.image_times !== false )
					loop.indexed.position.new.width = self.calculate_width({
						width   : by.width,
						divide  : by.times,
						padding : by.padding
					})

				if ( by.height_times !== false )
					loop.indexed.position.new.height = self.calculate_height_based_on_height_times({
						width  : loop.indexed.position.new.width,
						height : by.height_times,
					})

				if ( by.heigh_times === false )
					loop.indexed.position.new.height = self.calculate_height({
						new_width      : loop.indexed.position.new.width,
						current_height : loop.indexed.element.clientHeight,
						link           : by.link,
					})

				if ( by.image_times !== false ) {
					loop.indexed.original.width  = loop.indexed.position.new.width
					loop.indexed.original.height = loop.indexed.position.new.height
				}

				return loop.into.concat(loop.indexed)
			}
		})
	},

	calculate_height_based_on_height_times : function (calculate) {

		var result

		if ( calculate.height.match("[0-9]*/[0-9]") !== null )
			result = calculate.width/parseInt(calculate.height.match("/[0-9]")[0].slice(1), 10)
		if ( calculate.height.match("[*][0-9]") !== null )
			result = calculate.width*parseFloat(calculate.height.match("[*][0-9]")[0].slice(1))

		return result
	},

	calculate_height : function (calculate) {
		return Math.floor(( calculate.link ? calculate.new_width : calculate.current_height ))
	},

	calculate_width : function (the) {
		return Math.floor(( the.width - (the.divide-1)*the.padding )/the.divide)
	},
})