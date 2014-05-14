define({

	define : {
		require : [
			"morphism"
		]
	},

	merge : function (the) {

		var self
		self                  = this
		the.parent_stack      = the.parent_stack      || {}
		the.parent_level_name = the.parent_level_name || "base"
		the.this_context      = the.this_context      || {}

		return this.library.morphism.homomorph({
			object : the.default_definition,
			with   : function (member) {
				var value

				value = (
					the.new_definition[member.property_name] === undefined ?
						member.value :
						self.library.morphism.copy({ what : the.new_definition[member.property_name] })
				)

				if ( value.constructor === Object && member.value.constructor !== Function ) {
					the.parent_stack[the.parent_level_name] = member.set
					value                                   = self.merge({
						default_definition : member.value,
						new_definition     : value,
						parent_stack       : the.parent_stack,
						parent_level_name  : member.property_name,
						this_context       : the.this_context
					})
				}

				if ( member.value.constructor === Function )
					value = member.value.call(the.this_context, {
						current_object : member.set,
						value          : ( value.constructor === Function ? false : value ),
						parent         : the.parent_stack,
					})

				return value
			}
		})
	},

})