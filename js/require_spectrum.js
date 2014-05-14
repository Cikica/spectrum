(function (load_spectrum) {

	var current_scripts, this_script, spectrum_directory

	current_scripts    = document.getElementsByTagName("script")
	this_script        = current_scripts[current_scripts.length-1]
	spectrum_directory = this_script.getAttribute("data-directory")

	window.spectrum = {
		galleries : [],
		create    : function (make) {
			window.spectrum.galleries = window.spectrum.galleries.concat(make)
		},
	}

	if ( typeof define === 'function' && define.amd) {
		load_spectrum(spectrum_directory)
	} else {

		var require_js_script

		require_js_script        = document.createElement("script")
		require_js_script.src    = spectrum_directory + "/require.js"
		require_js_script.onload = function () {
			load_spectrum(spectrum_directory)
		}
		document.head.appendChild(require_js_script)
	}


}(function (spectrum_directory) {

	window.requirejs([ spectrum_directory + "/spectrum.configuration"], function (config) {

		var paths, index_loop

		index_loop = function (loop) {
			if ( loop.start_at >= loop.array.length ) {
				return loop.into
			} else {
				return index_loop(loop.else_do({
					array    : loop.array,
					start_at : loop.start_at,
					into     : loop.into,
					else_do  : loop.else_do
				}))
			}
		}
		paths = index_loop({
			array    : [].concat(config.main, config.path, config.library, config.sort),
			start_at : 0,
			into     : [],
			else_do  : function (loop) {
				return {
					array    : loop.array,
					into     : loop.into.concat(spectrum_directory +"/"+ loop.array[loop.start_at]),
					start_at : loop.start_at + 1,
					else_do  : loop.else_do,
				}
			}
		})

		window.requirejs(paths, function () {

			var modules, sorter, spectrum, libraries

			modules   = Array.prototype.slice.call(arguments, 0)
			sorter    = modules.pop()
			libraries = modules.splice(config.path.length+1)
			spectrum  = Object.create(sorter).make({
				module       : modules,
				library      : libraries,
				library_path : config.library.slice(0),
				path         : paths.slice(0, config.path.length+1)
			})
		})
	})
}))