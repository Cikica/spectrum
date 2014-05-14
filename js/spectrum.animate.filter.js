define({

	make : function (animation) {

		if ( animation.pass.name === false ) {
			return animation.pass.filtered
		}

		var tag_filter_index = animation.pass.filtered.indexOf(animation.pass.name)

		if ( animation.pass.multi_filter && animation.pass.filtered.length > 1 && tag_filter_index !== -1 )
			animation.pass.filtered.splice(tag_filter_index, 1)

		if ( animation.pass.multi_filter && tag_filter_index === -1 )
			animation.pass.filtered = animation.pass.filtered.concat(animation.pass.name)

		if ( !animation.pass.multi_filter )
			animation.pass.filtered = [animation.pass.name]

		return animation.pass.filtered
	}
})