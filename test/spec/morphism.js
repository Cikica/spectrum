define(["../../js/morphism"], function (module) {

	describe("epimorph array", function () {
		var input, input2, input3, input4

		input  = {
			array    : ["a","b","c","d","e"],
			exclude  : [0,3],
			by_index : true
		}
		input2 = {
			array    : ["a","b","c","d","e"],
			exclude  : ["b","d"],
			by_index : false
		}
		input3 = {
			array    : ["a","b","c","d","e"],
			include  : [1,3],
			by_index : true
		}
		input4 = {
			array    : ["a","b","c","d","e"],
			include  : ["a", "e"],
		}

		it("epimorphs without reference", function () {
			var output = module.epimorph_array(input2)
			output.push("new")
			expect(input2.array.indexOf("new")).toEqual(-1)
		})

		it("returns empty array if its not given an include or exclude", function () {
			expect(module.epimorph_array({ array : ["a", "b", "c"] })).toEqual([])
		})

		it("epimorphs properly with include by value", function () {
			expect(module.epimorph_array(input4)).toEqual(["a","e"])
		})

		it("epimorphs properly with include by index", function () {
			expect(module.epimorph_array(input3)).toEqual(["b","d"])
		})

		it("epimorphs properly with the exclude by value", function () {
			expect(module.epimorph_array(input2)).toEqual(["a","c","e"])
		})

		it("epimorphs properly with the exclude by index", function () {
			expect(module.epimorph_array(input)).toEqual(["b","c","e"])
		})
	})

	describe("homomorph", function () {
		var input, input_2
		input = {
			s : "stuff",
			n : 123,
			o : {
				s : "stuff",
				n : 123,
				a : [1,2,3],
				o : {
					s : "stuff",
					n : 123,
					a : [1,2,3]
				},
			},
			f : function (stuff) { return stuff },
			a : [1,2,3]
		}
		input_2    = Object.create(input)
		input_2.dd = "new"

		it("does not copy the prototype", function () {
			var output = module.homomorph({
				object : input_2,
				with   : function (member) {
					return member.value
				}
			})
			expect(output.s).toBe(undefined)
		})

		it("homomorphs without reference excluding", function () {
			var output = module.homomorph({
				object : input,
				with   : function (member) {
					return member.value
				}
			})
			output.s = "stuff2"
			output.n = 1234
			output.o.s = "stuff3"
			output.o.n = 1234
			output.o.a.push(4)
			output.o.o.s = "stuff3"
			output.o.o.n = 1234
			output.o.o.a.push(4)
			output.a.push(4)

			expect(input.s).not.toEqual(output.s)
			expect(input.n).not.toEqual(output.n)
			expect(input.a).not.toEqual(output.a)
			expect(input.o.s).not.toEqual(output.o.s)
			expect(input.o.n).not.toEqual(output.o.n)
			expect(input.o.a).not.toEqual(output.o.a)
			expect(input.o.o.s).not.toEqual(output.o.o.s)
			expect(input.o.o.n).not.toEqual(output.o.o.n)
			expect(input.o.o.a).not.toEqual(output.o.o.a)
			expect(output.f("test")).toEqual("test")
		})
	})

	describe("copy", function () {
		
		var input, input_2, output
		input = { 
			array        : [1,2,3],
			object_array : [{ s : 1, b : 2 }, { s : 1, b : 2 }],
			object       : {
				s : 1,
				b : 2
			},
			number: 55,
			string: "stuff",
		}
		input_2 = {
			o1 : {
				stuff : "sd",
				withs : "stuff",
			},
			o2 : {
				o3 : "s",
				o4 : "b"
			}
		}

		it("doesent mess up sibling objects in an object", function () {
			output = module.copy({ what : input_2 })
			expect(output).toEqual({
				o1 : {
					stuff : "sd",
					withs : "stuff",
				},
				o2 : {
					o3 : "s",
					o4 : "b"
				}
			})
		})

		it("copies arrays without reference", function () {
			output = module.copy({ what : input.array })
			output.push("stuff")
			expect(input.array.indexOf("stuff")).toEqual(-1)
		})

		it("copies object arrays without reference ", function () {
			output = module.copy({ what : input.object_array, object_array : true })
			output[0].s = "change"
			expect(input.object_array[0].s).toEqual(1)
		})
	})

	describe("index loop", function () {
		var input_1, input_2, input_3
		input_1 = {
			array   : [1,2,3],
			else_do : function (loop) {
				return loop.into.concat("member "+ loop.array[loop.index])
			}
		},
		input_2 = {
			array   : [1,2,3],
			else_do : function (loop) {
				return loop.into.concat("member "+ loop.array[loop.index])
			}
		},
		input_3 = {
			array   : [{ s : 1 }, { s : 2 }],
			else_do : function (loop) {
				loop.indexed.s = "change"
				return loop.into.concat(loop.indexed)
			}
		}

		it("cointains no objects with reference to their originals within itself", function () {
			var output = module.index_loop(input_3)
			expect(input_3.array[0].s).toEqual(1)
			expect(output[0].s).toEqual("change")
		})

		it("has no reference upon completion to the input array", function () {
			var output = module.index_loop(input_2)
			input_2.array.push("stuff")
			expect(output.indexOf("stuff")).toEqual(-1)
		})

		it("returns expected result with minimal paramaters and else do which returns into the \"into\" variable", function () {
			expect(module.index_loop(input_1)).toEqual(["member 1", "member 2", "member 3"])
		})
	})

	describe("index loop base", function () {
		var input, output
		input = {
			array    : [1,2,3],
			start_at : 0,
			into     : [],
			if_done  : function (loop) {
				return loop.into
			},
			else_do  : function (loop) {
				loop.into = loop.into.concat("member "+ loop.array[loop.start_at])
				loop.start_at += 1
				return loop
			}
		}
		output = module.index_loop_base(input)

		it("indexes properly", function () {
			expect(output).toEqual(["member 1", "member 2", "member 3"])
		})

		it("has no reference on completion to the input into object", function () {
			input.into.push("new stuff")
			expect(output.indexOf("new stuff")).toEqual(-1)
		})
	})
})