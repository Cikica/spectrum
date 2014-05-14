define([
	"../../js/spectrum.animate.show_calculator",
	"../../js/spectrum.animate.show_calculator.row_shifts",
	"../../js/morphism",
], function (module, rows, morphism) {
	
	module.components.row_shifts = rows
	module.library = {
		morphism : morphism
	}

	describe("show calculator make", function () { 
		var element, input, expected

		element  = document.getElementById("images").children
		input    = {
			pass : {
				align       : "left",
				padding     : 0,
				row_padding : 0,
				width       : 500,
			},
			result : [
				{
					element  : element[0],
					index    : 0,
					original : {
						width  : 100,
						height : 150
					},
					position : {
						old : {
							height : 150,
							left   : 0,
							top    : 0
						},
						new : {
							height : 150,
							left   : 0,
							top    : 0
						}
					}
				},
				{
					element  : element[1],
					index    : 0,
					original : {
						width  : 100,
						height : 150
					},
					position : {
						old : {
							height : 150,
							left   : 0,
							top    : 0
						},
						new : {
							height : 150,
							left   : 0,
							top    : 0
						}
					}
				}
			]
		}
		expected = {
			images : [
				{
					element  : element[0],
					index    : 0,
					original : {
						width  : 100,
						height : 150
					},
					position : {
						old : {
							height : 150,
							left   : 0,
							top    : 0
						},
						new : {
							height : 150,
							left   : 0,
							top    : 0
						}
					}
				},
				{
					element  : element[1],
					index    : 0,
					original : {
						width  : 100,
						height : 150
					},
					position : {
						old : {
							height : 150,
							left   : 0,
							top    : 0
						},
						new : {
							height : 150,
							left   : 100,
							top    : 0
						}
					}
				}
			],
			gallery_height : 150,
			by_row : [
				{
					elements   : [
						{
							element  : element[0],
							index    : 0,
							original : {
								width  : 100,
								height : 150
							},
							position : {
								old : {
									height : 150,
									left   : 0,
									top    : 0
								},
								new : {
									height : 150,
									left   : 0,
									top    : 0
								}
							}
						},
						{
							element  : element[1],
							index    : 0,
							original : {
								width  : 100,
								height : 150
							},
							position : {
								old : {
									height : 150,
									left   : 0,
									top    : 0
								},
								new : {
									height : 150,
									left   : 100,
									top    : 0
								}
							}
						}
					],
					space_left : 300,
					row_height : 150
				},
				{
					elements   : [],
					space_left : 0,
					row_height : 0
				}
			]
		}

		it("makes properly", function () {
			expect(module.make(input)).toEqual(expected)
		})
	})
})