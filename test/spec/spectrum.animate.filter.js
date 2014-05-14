define(["../../js/spectrum.animate.filter"], function (module) {

	describe("spectrum.animate.filter", function () { 
		
		it("gives new tag name to be single filtered with an empty filter array", function () {
			var value = module.make({
				pass : {
					name         : "tag",
					filtered     : [],
					multi_filter : false,
				}
			})
			expect(value).toEqual(["tag"])
		})

		it("gives new tag name to be single filtered with an full filter array", function () {
			var value = module.make({
				pass : {
					name         : "tag",
					filtered     : ["magic"],
					multi_filter : false,
				}
			})
			expect(value).toEqual(["tag"])
		})

		it("gives new tag name to be multi filtered with an full filter array", function () {
			var value = module.make({
				pass : {
					name         : "tag",
					filtered     : ["magic"],
					multi_filter : true,
				}
			})
			expect(value).toEqual(["magic", "tag"])
		})

		it("gives existing tag name to be multi filtered with an full filter array", function () {
			var value = module.make({
				pass : {
					name         : "tag",
					filtered     : ["magic", "tag"],
					multi_filter : true,
				}
			})
			expect(value).toEqual(["magic"])
		})

		it("gives existing tag name to be multi filtered with a filter array that only has that tag name in it", function () {
			var value = module.make({
				pass : {
					name         : "tag",
					filtered     : ["tag"],
					multi_filter : true,
				}
			})
			expect(value).toEqual(["tag"])
		})
	})
})