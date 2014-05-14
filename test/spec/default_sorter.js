define([
	"../../js/default_sorter", 
	"../../js/morphism",
	"../../js/spectrum.gallery",
], function (module, morphism, gallery ) {
	gallery.library = {
		morphism       : morphism,
		default_sorter : module
	},
	module.library = {
		morphism : morphism
	}

	describe("merger", function () {
		var input1, input2, input3, input4, input5, output

		input1 = {
			text   : "text",
			number : 55,
			array  : [1,2,3,4,5],
			object : {
				text   : "text",
				number : 55,
				array  : [1,2,3,4,5],
			}
		}
		input2 = { 
			text   : "change text",
			number : 57,
			array  : [1,2,3,4],
			object : {
				text   : "change text",
				number : 57,
				array  : [1,2,3,4]
			}
		}
		input3 = {
			text1 : function (what) {
				console.log(what.parents)
				return what.value
			},
			number1 : function (what) { 
				console.log(what.parents)
				return what.value
			},
			object1 : {
				text2 : function (what) {
					console.log(what.parents)
					return what.value
				},
				number2 : function (what) { 
					console.log(what.parents)
					return what.value
				},
				object2 : {
					text3 : function (what) {
						console.log(what.parents)
						return what.value
					},
					number3 : function (what) { 
						console.log(what.parents)
						return what.value
					},
				}
			},
			object12 : {
				text2 : function (what) {
					console.log(what.parents)
					return what.value
				},
				number2 : function (what) { 
					console.log(what.parents)
					return what.value
				},
				object2 : {
					text3 : function (what) {
						console.log(what.parents)
						return what.value
					},
					number3 : function (what) { 
						console.log(what.parents)
						return what.value
					},
				}
			}
		}
		input4 = { 
			text1   : "change text",
			number1 : 5,
			object1 : { 
				text2   : "change text",
				number2 : 5,
				object2 : { 
					text3   : "change text",
					number3 : 5
				},
			},
			object12 : { 
				text2   : "change text",
				number2 : 5,
				object2 : { 
					text3   : "change text",
					number3 : 5
				},
			}
		}
		input5 = {
			images : {
				// directory : "https://dl.dropboxusercontent.com/u/56026180/Images/Art3",
		      	directory : "images",
				names     : [
					"01", "02", "03", "04", "05", "06", "07", "08"
					// "kingofnagas", "longtrip", "thebegginingoffreedom", "thedreamer", 
					// "trainyour", "elephant", "running"
				],
				tags      : [
					["magical"],
					["magical"],
					["water stuff"],
					["water stuff"],
					["animal"],
					["animal"],
					["animal"],
					["animal"],
				],
			},
			tag : {
				// multi_filter : true,
				// all_tag      : false
			},
			details : {
				body : {
					parent       : document.body,
					align        : "left",
					width        : 500,
					// image_width  : 50,
					// image_height : 500,
					image_times  : 4,
					link_times   : true,
				}
			}
		}
		// console.log(gallery.state)
		it("survives the stress test", function () {
			output = module.merge({
				default_definition : gallery.state,
				new_definition     : input5,
				this_context       : gallery
			})
			console.log(output)
			expect().toEqual()
		})

		// it("mergers properly with use of functions", function () {
		// 	output = module.merge({
		// 		default_definition : input3,
		// 		new_definition     : input4
		// 	})
		// 	expect(output).toEqual(input4)
		// })

		// it("cointaints no reference to objects used in the merge", function () {
		// 	output = module.merge({
		// 		default_definition : input1,
		// 		new_definition     : input2
		// 	})
		// 	output.array.push("stuff")
		// 	expect(output.array).not.toEqual(input2.array)
		// })

		// it("does a basic merger of text numbers arrays and objects", function () {
		// 	output = module.merge({
		// 		default_definition : input1,
		// 		new_definition     : input2
		// 	})

		// 	expect(output).toEqual({
		// 		text   : "change text",
		// 		number : 57,
		// 		array  : [1,2,3,4],
		// 		object : {
		// 			text   : "change text",
		// 			number : 57,
		// 			array  : [1,2,3,4]
		// 		}
		// 	})
		// })
	})
})