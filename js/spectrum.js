define({

	define : {
		require : ["morphism"]
	},

	make : function (extend) {
		var self, instance
		self     = this
		instance = {}
		instance.animation_engine = Object.create(this.components.animate).make(),
		instance.create           = function (make) {
			window.spectrum.galleries[make.name] = self.create({
				definition : make.gallery,
				animator   : instance.animation_engine
			})
		}
		instance.galleries = this.library.morphism.index_loop({
			array   : extend.galleries,
			into    : {},
			else_do : function (loop) {
				loop.into[loop.indexed.name] = self.create({
					definition : loop.indexed.gallery,
					animator   : instance.animation_engine,
				})
				return loop.into
			}
		})
		instance.undo     = function (what) {
			if ( this.galleries[what.gallery] ) {
				var homomorph = self.library.morphism.homomorph({
					object  : this.galleries[what.gallery].state.body,
					with    : function (detail) {
						detail.value.parentElement.removeChild(detail.value)
						return true
					},
				})
				delete this.galleries[what.gallery]
				return homomorph
			} else {
				return false
			}
		}

		return instance
	},

	create  : function (gallery) {

		if ( gallery.definition.preset )
			gallery.definition = this.merge_preset({
				preset     : this.components.preset[gallery.definition.preset],
				definition : gallery.definition
			})

		return Object.create(this.components.gallery).make({
			state : gallery.definition,
			method: {
				animate   : gallery.animator
			}
		})
	},

	merge_preset : function (merge) {
		var final_definition
		final_definition        = this.library.morphism.copy({ what : merge.definition })
		final_definition.images = merge.definition.images
		final_definition.tag    = this.library.morphism.monomorph({
			first_object  : merge.definition.tag || {},
			second_object : merge.preset.tag
		})
		final_definition.details.body = this.library.morphism.monomorph({
			first_object  : merge.definition.details.body,
			second_object : merge.preset.details.body
		})
		return final_definition
	},

	add_component : [
		"animate",
		"gallery",
		"preset"
	],

	components : {
		animate : {},
		gallery : {},
		preset  : {}
	},
})