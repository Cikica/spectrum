define({

	define : {
		require : ["morphism"]
	},

	make : function (animation) {
		return {
			show : this.package_image_group({
				group      : animation.result.show,
				definition : this.library.morphism.copy({ what : animation.pass.definition }),
				element    : animation.pass.element,
			}),
			hide : this.package_image_group({
				group      : animation.result.hide,
				definition : this.library.morphism.copy({ what : animation.pass.definition }),
				element    : animation.pass.element,
			}),
		}
	},

	package_image_group : function (animation) {
		return this.library.morphism.index_loop({
			array    : animation.group,
			else_do  : function (loop) {
				var definition, image_index
				image_index = loop.array[loop.index]
				definition  = animation.definition[image_index]
				return loop.into.concat({
					element   : animation.element[image_index],
					position  : definition.position,
					original  : definition.original,
					inner     : definition.inner,
					index     : definition.index,
					src       : definition.src
				})
			}
		})
	},
})