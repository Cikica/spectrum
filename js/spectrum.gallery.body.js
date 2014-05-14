define({

	components : {},

	make_new_event : function (state) {
		return {
			state  : state,
			events : [
				{
					called       : "filter",
					presented_as : 1,
					that_happens : [
						{
							on   : state.body.body.children[0],
							is   : "click",
						}
					],
					only_if      : function (heard) {
						if ( heard.event.target.getAttribute("data-tag-name") )
							return true
						else
							return false

					}
				},
				{
					called       : "resize",
					that_happens : [
						{
							on : window,
							is : "resize"
						}
					],
					only_if : function (hear) {
						return ( hear.state.details.body.parent.clientWidth !== hear.state.details.body.width )
					}
				},
				{
					called       : "image_click",
					that_happens : [
						{
							on : state.body.body.children[1],
							is : "click"
						}
					],
					only_if : function (hear) {
						return ( hear.event.target.nodeName === "IMG" )
					}
				},
				{
					called : "startup",
				}
			]
		}
	},

	make_event_bind : function (make) {
		return this.components.events.make(make)
	},

	make : function (make) {
		return this.components.definition.make(make)
	},
})