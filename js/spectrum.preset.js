define({
	multi_filter : {
		tag : {
			multi_filter : true,
			all_tag      : false
		},
		details : {
			body : {}
		}
	},
	perfect_fit : {
		details : {
			body : {
				align : "fill"
			}
		}
	},
	square_grid : {
		details : {
			body : {
				align       : "left",
				image_times : 4,
				link_times  : true,
			}
		}
	},
	horizontal_grid : {
		details : {
			body : {
				align        : "left",
				image_times  : 4,
				height_times : "1/2"
			}
		}
	},
	vertical_grid : {
		details : {
			body : {
				align        : "left",
				image_times  : 4,
				height_times : "*2"
			}
		}
	}
})