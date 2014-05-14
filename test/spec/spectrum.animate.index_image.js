define(["../../js/spectrum.animate.index_image"], function (module) {

	describe("spectrum.animate.index_image", function () { 

		var definition
		definition = [
			{
				index    : 0,
				position : {},
				tags     : ["tag", "stuff"]
			},
			{
				index    : 1,
				position : {},
				tags     : ["stuff"]
			},
			{
				index    : 2,
				position : {},
				tags     : ["tag"]
			}
		]

		it("takes the new filter tag array, and definitions of all images, after which it returns an object with two arrays which contain indexes of images to show and hide", function () {
			var value = module.make({
				pass : {
					image_definitions : definition
				},
				result : ["tag"]
			})
			expect(value.show).toEqual([0,2])
			expect(value.hide).toEqual([1])
		})
	})
})