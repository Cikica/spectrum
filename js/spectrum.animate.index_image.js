define({

	define : {
		require : ["morphism"]
	},

	make : function (animate) {
		var self = this
		return this.library.morphism.index_loop({
			array    : animate.pass.image_definitions,
			into     : {
				show : [],
				hide : []
			},
			else_do  : function (loop) {
				var do_we_show
				do_we_show = self.is_the_first_domain_a_co_domain_of_the_second({
					first_domain  : loop.array[loop.index].tags,
					second_domain : animate.result
				})
				if ( do_we_show ) {
					loop.into.show = loop.into.show.concat(loop.array[loop.index].index)
				} else {
					loop.into.hide = loop.into.hide.concat(loop.array[loop.index].index)
				}
				return loop.into
			}
		})
	},

	is_the_first_domain_a_co_domain_of_the_second : function (the) {
		return this.library.morphism.index_loop({
			array    : the.second_domain,
			into     : false,
			else_do  : function (loop) {
				return ( the.first_domain.indexOf(loop.array[loop.index]) > -1 ? true : loop.into )
			}
		})
	},
})