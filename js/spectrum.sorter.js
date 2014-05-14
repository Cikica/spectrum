define({

	make : function (sort) {

		var sorted, self, library
		self    = this
		library = this.make_library_module_object({
			path   : sort.library_path,
			module : sort.library
		})
		library = this.loop_array({
			array    : sort.library_path,
			start_at : 0,
			into     : library,
			if_done  : function (loop) {
				return loop.into
			},
			else_do  : function (loop) {
				self.deal_with_define({
					library : loop.into,
					module  : sort.library[loop.start_at]
				})
				loop.start_at += 1
				return loop
			}
		})
		sorted = this.loop_array({
			array    : sort.path,
			start_at : 1,
			into     : [],
			if_done  : function (loop) {
				return loop.into
			},
			else_do  : function (loop) {
				var module_name
				module_name   = self.find_component_destination_and_insert_it({
					first_module : sort.module[0],
					this_module  : sort.module[loop.start_at],
					module_path  : loop.array[loop.start_at],
					library      : library
				})
				loop.into     = loop.into.concat(module_name)
				loop.start_at += 1
				return loop
			}
		})
		self.deal_with_define({
			module  : sort.module[0],
			library : library
		})
		window.spectrum = sort.module[0].make(window.spectrum)
		return sorted
	},

	find_component_destination_and_insert_it : function (find) {

		var component_reference, module_name

		component_reference = find.first_module
		module_name         = this.get_module_name_from_path({
			path       : find.module_path,
			start_from : 1
		})

		if ( module_name.parts.length > 1 )
			component_reference = this.get_component_reference({
				reference : component_reference.components,
				name      : module_name
			})

		if ( find.this_module.define )
			this.deal_with_define({
				module  : find.this_module,
				library : find.library
			})

		this.add_component({
			name      : module_name.full,
			module    : find.this_module,
			reference : component_reference
		})

		return module_name.parts.join(".")
	},

	make_library_module_object : function (library) {
		var self = this
		return this.loop_array({
			array    : library.path,
			start_at : 0,
			into     : {},
			if_done  : function (loop) {
				return loop.into
			},
			else_do  : function (loop) {
				var module_name
				module_name = self.get_module_name_from_path({
					path     : loop.array[loop.start_at],
					start_at : 1,
				})
				loop.into[module_name.full] = library.module[loop.start_at]
				loop.start_at += 1
				return loop
			}
		})
	},

	deal_with_define : function (deal) {

		if ( deal.module.define && deal.module.define.require )
			deal.module.library = this.fullfil_module_requirement({
				module_library : deal.module.library || {},
				library        : deal.library,
				required       : deal.module.define.require
			})
	},

	fullfil_module_requirement : function (through) {
		return this.loop_array({
			array    : through.required,
			start_at : 0,
			into     : through.module_library,
			if_done  : function (loop) {
				return loop.into
			},
			else_do  : function (loop) {
				var required_module_name
				required_module_name = loop.array[loop.start_at]
				if ( through.library[required_module_name] ) {
					loop.into[required_module_name] = through.library[required_module_name]
				}
				loop.start_at += 1
				return loop
			}
		})
	},

	add_component : function (add) {

		if ( this.does_parent_module_accept_component_addition_though_a_function(add.reference) )
			add.reference.add_component({
				name   : add.name,
				module : add.module
			})

		if ( this.does_parent_module_accept_addition_of_listed_components({ name : add.name, module : add.reference }) )
			add.reference.components[add.name] = add.module

		if ( !add.reference.add_component )
			add.reference.components[add.name] = add.module
	},

	does_parent_module_accept_addition_of_listed_components : function (add) {
		return (
			add.module.add_component &&
			add.module.add_component.constructor === Array &&
			add.module.add_component.indexOf(add.name) !== -1
		)
	},

	does_parent_module_accept_component_addition_though_a_function : function (module) {
		return ( module.add_component && module.add_component.constructor === Function )
	},

	get_component_reference : function (component) {

		var index, early_reference

		index = 0

		for (; index < component.name.parts.length-1; index++) {
			if ( !component.reference[component.name.parts[index]].components )
				throw new Error( component.name.full +" can not be made a component of "+ component.name.parts[index] +" becayse "+ component.name.parts[index] +" does not have a \"components\" object in its prototype chain")

			early_reference     = component.reference[component.name.parts[index]]
			component.reference = component.reference[component.name.parts[index]].components
		}

		return early_reference
	},

	get_module_name_from_path : function (get) {

		var name

		name = {}

		name.parts = get.path.split("/")
		name.parts = name.parts[name.parts.length-1].split(".")
		name.full  = name.parts[name.parts.length-1]
		name.parts = name.parts.slice(get.start_from)

		return name
	},

	loop_array : function (loop) {
		if ( loop.start_at < loop.array.length ) {
			return this.loop_array(loop.else_do(loop))
		} else {
			return loop.if_done(loop)
		}
	},
})