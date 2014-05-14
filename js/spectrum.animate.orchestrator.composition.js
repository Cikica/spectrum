define({

	basic : function (animate) {
		return [
			{
				element : animate.images,
				method  : function (make) {
					return [
						{
							element     : make.definition.element,
							delay       : make.delay,
							property    : ["left", "top", "height", "width"],
							from        : [
								make.definition.position.old.left,
								make.definition.position.old.top,
								make.definition.position.old.height,
								make.definition.position.old.width,
							],
							to          : [
								make.definition.position.new.left,
								make.definition.position.new.top,
								make.definition.position.new.height,
								make.definition.position.new.width,
							],
							how_long    : make.speed,
							with_easing : make.easing,
						},
						{
							element     : make.definition.element.firstChild,
							delay       : make.delay,
							property    : ["width","height"],
							from        : [
								make.definition.inner.old.width,
								make.definition.inner.old.height,
							],
							to          : [
								make.definition.inner.new.width,
								make.definition.inner.new.height
							],
							how_long    : make.speed,
							with_easing : make.easing
						}
					]
				},
				time    : animate.animation_speed,
				easing  : animate.easing_method
			}
		]
	},
})