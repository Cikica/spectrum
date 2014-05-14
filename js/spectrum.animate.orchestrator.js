define({

	define : {
		require : ["morphism"]
	},

	components : {},

	make : function (make) {
		return this.expand_composition(this.components.composition[make.pass.composition].call(this, {
			images          : make.result,
			gallery_height  : make.result.gallery_height,
			animation_speed : make.pass.animation_speed,
			easing_method   : make.pass.easing_method
		}))
	},

	expand_composition : function (composition) {
		var self = this

		return this.library.morphism.index_loop({
			array    : composition,
			else_do  : function (loop) {
				return self.library.morphism.index_loop({
					array   : loop.array[loop.index].element,
					else_do : function (iterate) {
						return iterate.into.concat(loop.array[loop.index].method.call({}, {
							definition : iterate.array[iterate.index],
							speed      : loop.array[loop.index].time,
							easing     : loop.array[loop.index].easing,
							delay      : 0,
						}))
					}
				})
			}
		})
	},

	get_the_longest_time_a_single_step_will_play : function (step) {

		var times = this.library.morphism.index_loop({
			array   : step,
			else_do : function (loop) {
				return loop.into.concat(loop.array[loop.index].time)
			}
		})

		return Math.max.apply(Math, times)
	},

})