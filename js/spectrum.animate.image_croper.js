define({

	define : {
		require : [
			"morphism"
		]
	},

	make : function (make) {
		return {
			show : this.adjust({
				images : make.result.show,
				width  : make.pass.image_width
			}),
			hide : this.adjust({
				images : make.result.hide,
				width  : make.pass.image_width
			})
		}
	},

	adjust : function (what) {
		var self = this
		return this.library.morphism.index_loop({
			array   : what.images,
			else_do : function (loop) {

				loop.indexed.inner.old.width  = loop.indexed.element.firstChild.clientWidth
				loop.indexed.inner.old.height = loop.indexed.element.firstChild.clientHeight


				if ( loop.indexed.inner.old.height < loop.indexed.position.new.height ) {
					loop.indexed.inner.new.height = loop.indexed.position.new.height
					loop.indexed.inner.new.width  = self.get_height_with_aspect_ratio({
						original_width  : loop.indexed.inner.old.height,
						original_height : loop.indexed.inner.old.width,
						new_width       : loop.indexed.position.new.height,
					})
				} else if ( loop.indexed.inner.old.width < loop.indexed.position.new.width ) {
					loop.indexed.inner.new.width  = loop.indexed.position.new.width
					loop.indexed.inner.new.height = self.get_height_with_aspect_ratio({
						original_width  : loop.indexed.inner.old.width,
						original_height : loop.indexed.inner.old.height,
						new_width       : loop.indexed.position.new.width,
					})

				} else {
					loop.indexed.inner.new.width  = loop.indexed.inner.old.width
					loop.indexed.inner.new.height = loop.indexed.inner.old.height
				}

				return loop.into.concat(loop.indexed)
			}
		})
	},

	get_height_with_aspect_ratio : function (the) {
		return the.original_height/the.original_width*the.new_width
	},

})