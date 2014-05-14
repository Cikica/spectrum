define({
	// style: "",
	sort    : "spectrum.sorter",
	main    : "spectrum",
	library : [
		"morphism",
		"default_sorter",
		"node_maker",
		"event_master"
	],
	path    : [
		"spectrum.animate",
		"spectrum.animate.orchestrator",
		"spectrum.animate.orchestrator.composition",
		"spectrum.animate.filter",
		"spectrum.animate.index_image",
		"spectrum.animate.calculation_package",
		"spectrum.animate.show_calculator",
		"spectrum.animate.show_calculator.row_shifts",
		"spectrum.animate.hide_calculator",
		"spectrum.animate.retrieve_current_image_positions",
		"spectrum.animate.gallery_done",
		"spectrum.animate.image_size_calculator",
		"spectrum.animate.image_croper",
		"spectrum.gallery",
		"spectrum.gallery.body",
		"spectrum.gallery.body.events",
		"spectrum.gallery.body.definition",
		"spectrum.gallery.lightbox",
		"spectrum.gallery.lightbox.events",
		"spectrum.preset",
	]
})