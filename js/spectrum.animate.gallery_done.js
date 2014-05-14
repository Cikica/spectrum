define({

	define : {
		require : ["morphism"]
	},

	make : function (make) {
		var images, self
		self   = this
		images = this.sort_the_processed_images_into_ascending_index_order(make.result)

		return this.loop_array({
			array    : make.pass,
			start_at : 0,
			into     : [],
			if_done  : function (loop) {
				return loop.into
			},
			else_do  : function (loop) {
				loop.into = loop.into.concat(self.merge_definitions({
					old : loop.array[loop.start_at],
					new : images[loop.start_at]
				}))
				loop.start_at += 1
				return loop
			}
		})
	},

	sort_the_processed_images_into_ascending_index_order : function (images) {
		return this.library.morphism.pop_loop_base({
			array   : images,
			into    : {
				images_sorted : 0,
				definition    : [],
			},
			if_done : function (loop) {
				return loop.into.definition
			},
			else_do : function (loop) {
				if ( loop.array[0].index === loop.into.images_sorted ) {
					return {
						array : loop.array.slice(1),
						into  : {
							images_sorted : loop.into.images_sorted + 1,
							definition    : loop.into.definition.concat(loop.array[0])
						},
						if_done : loop.if_done,
						else_do : loop.else_do
					}
				} else {
					return {
						array   : loop.array.slice(1).concat(loop.array[0]),
						into    : loop.into,
						if_done : loop.if_done,
						else_do : loop.else_do
					}
				}
			}
		})
	},

	merge_definitions : function (merge) {
		merge.old.position = merge.new.position
		merge.old.inner    = merge.new.inner
		return merge.old
	},

	loop_array : function (loop) {
		if ( loop.start_at >= loop.array.length ) {
			return loop.if_done(loop)
		} else {
			return this.loop_array(loop.else_do(loop))
		}
	},

})