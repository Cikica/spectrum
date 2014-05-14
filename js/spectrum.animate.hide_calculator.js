define({

	define : {
		require : ["morphism"]
	},

	make : function (animation) {
		var self
		self = this
		return this.library.morphism.index_loop({
			array    : animation.result,
			else_do  : function (loop) {
				return loop.into.concat(self.mutate_position({
					transition : animation.pass.transition,
					definition : loop.array[loop.index]
				}))
			}
		})
	},

	mutate_position : function (mutate) {
		return {
			element  : mutate.definition.element,
			index    : mutate.definition.index,
			src      : mutate.definition.src,
			original : mutate.definition.original,
			inner    : mutate.definition.inner,
			position : {
				old : mutate.definition.position.old,
				new : this.components.mutators[mutate.transition].call(this, {
					definition : mutate.definition.position,
					dimension  : mutate.definition.original,
				})
			}
		}
	},

	components : {
		mutators : {
			basic : function (mutation) {
				return {
					top    : 0-mutation.definition.new.height,
					left   : 0-mutation.definition.new.width,
					height : mutation.definition.new.height,
					width  : mutation.definition.new.width
				}
			}
		}
	}
})