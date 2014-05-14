define(["../../js/spectrum.animate.calculation_package"], function (module) {

	describe("spectrum.animate.calculation_package", function () {

		var element, definition, value
		element    = document.getElementById("images").children
		definition = [
			{
				index    : 0,
				position : {
					top : 10
				},
				original : {
					width : 100
				},
				tags     : ["tag", "stuff"]
			},
			{
				index    : 1,
				position : {
					top : 11
				},
				original : {
					width : 110
				},
				tags     : ["stuff"]
			},
			{
				index    : 2,
				position : {
					top : 12
				},
				original : {
					width : 120
				},
				tags     : ["tag"]
			}
		]
		value   = module.make({
			pass : {
				definition : definition,
				element    : element,
			},
			result : {
				show : [0,2],
				hide : [1]
			}
		})

		it("copies objects properly", function () {
			var object, copy
			object = {
				d : 10, 
				c : {
					d : {
						b : 10
					},
					a : 5 
				}
			}
			copy  	   = module.copy(object)
			copy.d     = 20
			copy.c.d.b = 546
			copy.c.a   = 552
			expect(object).not.toEqual(copy)
		})

		it("has no reference to the objects it was created from", function () { 
			var new_value = module.make({
				pass : {
					definition : definition,
					element    : element,
				},
				result : {
					show : [0,2],
					hide : [1]
				}
			})
			new_value.show[0].position.top = 50
			expect(new_value.show[0].position.top).not.toEqual(definition[0].position.top)
		})

		it("returns full definitions of images to be shown and hidden for calculation", function () {
			expect(value.show).toEqual([
				{	
					element  : element[0],
					index    : 0,
					position : {
						top : 10
					},
					original : {
						width : 100
					},
				},
				{	
					element  : element[2],
					index    : 2,
					position : {
						top : 12
					},
					original : {
						width : 120
					},
				}
			])
			expect(value.hide).toEqual([
				{	
					element  : element[1],
					index    : 1,
					position : {
						top : 11
					},
					original : {
						width : 110
					},
				}
			])
		})
	})
})