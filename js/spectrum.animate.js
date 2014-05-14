define({

	define : {
		require : [
			"morphism"
		]
	},

	components : {},

	animate_with_layers : function (animation) {
		var processed_layers, self
		self             = this
		processed_layers = this.library.morphism.index_loop({
			array   : animation.layers,
			into    : {
				final_result : {},
				results      : []
			},
			else_do : function (loop) {
				var result = self.process_animation_layer({
					layer  : loop.array[loop.index],
					result : ( loop.index === 0 && animation.pass ? animation.pass : loop.into.final_result ),
					keep   : loop.into.results
				})
				return  {
					final_result : result,
					results      : ( loop.array[loop.index].keep ?
						self.add_new_result({ result_stack : loop.into.results, result : result }) :
						loop.into.results
					)
				}
			}
		})
		this.library.morphism.index_loop({
			array    : processed_layers.final_result,
			else_do  : function (loop) {
				self.animate(loop.array[loop.index])
				return loop.into.concat(loop.index)
			}
		})
		return this.finish_result({
			layer  : animation.finish_layer || false,
			with   : animation.finish_with  || false,
			result : processed_layers.final_result,
			keep   : processed_layers.results
		})
	},

	finish_result : function (finish) {
		var result = finish.keep.slice(0)
		if ( finish.layer ) {
			result = this.process_animation_layer({
				layer  : finish.layer,
				result : finish.result,
				keep   : result
			})
		}
		if ( finish.with ) {
			result = finish.with({
				result : result,
				keep   : finish.keep,
			})
		}
		return result
	},

	add_new_result : function (add) {
		var result = this.create_new_state_of_value(add.result)
		return add.result_stack.concat(( result.constructor === Array ? [result] : result ))
	},

	create_new_state_of_value : function (value) {
		if ( value.constructor === Object )
			value = this.library.morphism.copy({ what : value })
		if ( value.constructor === Array )
			value = value.slice(0)
		return value
	},

	process_animation_layer : function (animation) {

		var result
		result = ( animation.layer.adapter ? animation.layer.adapter.call({}, {
			pass   : animation.layer.pass || {},
			result : animation.result,
			keep   : animation.keep
		}) : animation.result )

		return this.components[animation.layer.name].make.call(this.components[animation.layer.name], {
			pass   : animation.layer.pass || {},
			result : result,
		})
	},

	make : function () {
		this.animation_queue = []
		this.time            = 0
		this.support         = {
			animation : {
				request_animation_frame : false,
				performance             : this.get_animation_perfomance_support()
			}
		}
		this.get_animation_request_frame()

		return this
	},

	get_animation_request_frame : function () {

		var last_time, index, vendors, chosen_method;

		last_time = 0;
		index     = 0;
		vendors   = ['ms', 'moz', 'webkit', 'o'];

		for(; index < vendors.length && !window.requestAnimationFrame; ++index) {

			chosen_method = window[vendors[index]+'RequestAnimationFrame'];

			if ( chosen_method ) {
				window.requestAnimationFrame = chosen_method;
				this.support.animation.request_animation_frame = vendors[index];
			}
		}

		if (!window.requestAnimationFrame) {

			this.support.animation.request_animation_frame = "custom";

			window.requestAnimationFrame = function(callback) {

				var current_time, time_to_call, id;

				current_time = new Date().getTime();
				time_to_call = Math.max(0, 16 - (current_time - last_time));
				last_time    = current_time + time_to_call;
				id = window.setTimeout(function() {
					callback(current_time + time_to_call);
				}, time_to_call);
				return id;
			};
		}
	},

	get_animation_perfomance_support : function () {
		return ( window.performance && window.performance.now ? true : false );
	},

	performance : function () {
		return ( this.support.animation.performance ? window.performance.now() : +new Date() );
	},

	animate : function (instructions) {
		var self = this
		if ( instructions.delay && instructions.delay > 0 ) {
			window.setTimeout(function () {
				instructions.delay = false
				self.animate(instructions)
			}, instructions.delay )
		} else {
			this.animation_queue.push({
				definition   : instructions,
				time_elapsed : 0,
			})
			if ( this.animation_queue.length === 1 ) this.animation_loop()
		}
	},

	animation_loop : function () {

		var running, last_frame = this.performance(), loop, prototype = this

		loop = function ( now ) {

			now = prototype.performance()

			if ( running !== false ) {
				window.requestAnimationFrame( loop )
				running    = prototype.render( now - last_frame )
				last_frame = now
			}
		}

		loop( last_frame )
	},

	render : function (timestamp) {

		var index;

		for (index = 0; index < this.animation_queue.length; index++ ) {
			if ( this.process_queued_animation(this.animation_queue[index], timestamp) === false ) {
				this.animation_queue.splice( index, 1 )
			}
		}

		if ( this.animation_queue.length === 0 ) return false
	},

	process_queued_animation : function (animation, timestamp) {
		animation.time_elapsed += timestamp
		return this.element_animation({
			definition   : animation.definition,
			time_elapsed : animation.time_elapsed
		})
	},

	element_animation : function (animation) {

		var self = this

		return this.library.morphism.index_loop({
			array    : animation.definition.property,
			into     : {
				property : animation.definition.property,
				from     : animation.definition.from,
				to       : animation.definition.to,
				done     : 0,
			},
			if_done  : function (loop) {
				return (loop.into.done !== loop.into.property.length)
			},
			else_do  : function (loop) {
				var animation_not_done
				animation_not_done = self.animation_core({
					object         : animation.definition.element.style,
					property       : loop.into.property[loop.index],
					time_elapsed   : animation.time_elapsed,
					start_value    : loop.into.from[loop.index],
					end_value      : loop.into.to[loop.index],
					easing         : animation.definition.with_easing,
					duration       : animation.definition.how_long,
					value_wrapper  : function (wrap) {
						var no_postfix, postfix
						no_postfix = ["opacity"]
						postfix    = ( no_postfix.indexOf(wrap.animation.property) ? "px" : 0 )
						return wrap.value + postfix
					},
				})

				if ( !animation_not_done ) loop.into.done += 1

				return loop.into
			}
		})
	},

	animation_core : function (animation) {
		var value, self, final_value
		self              = this
		value             = this.calculate_animation_value({
			time_elapsed    : animation.time_elapsed,
			duration        : animation.duration,
			end_value       : animation.end_value,
			start_value     : animation.start_value,
			easing_function : function (precentage_of_progress) {
				return self.easing.library[animation.easing].call(self, precentage_of_progress)
			}
		})
		final_value       = ( animation.value_wrapper ? animation.value_wrapper({
			value     : value,
			animation : animation
		}) : value )
		animation.object[animation.property] = final_value

		return ( value !== animation.end_value)
	},

	calculate_animation_value : function (animation) {
		var precentage_of_progress, new_value
		precentage_of_progress = animation.time_elapsed/animation.duration
		new_value              = (
			animation.start_value + ( animation.end_value - animation.start_value ) *
			animation.easing_function(precentage_of_progress)
		)
		return ( precentage_of_progress >= 1 ? animation.end_value : new_value  )
	},

	easing : {
		library    : {

			none : function (t) {
				return t;
			},

			easeInQuad : function (t) {

				return this.easing.components.quad( t );
			},

			easeInCubic : function (t) {
				return this.easing.components.cubic( t );
			},

			easeInQuart : function (t) {
				return this.easing.components.quart( t );
			},

			easeInQuint : function (t) {
				return this.easing.components.quint( t );
			},

			easeInSine : function (t) {
				return this.easing.components.sine(t);
			},

			easeInExpo : function (t) {
				return this.easing.components.expo( t );
			},

			easeInCirc : function (t) {
				return this.easing.components.circ( t );
			},

			easeOutQuad : function (t) {
				return this.easing.tools.reverse( this.easing.components.quad, t );
			},

			easeOutCubic : function (t) {
				return this.easing.tools.reverse( this.easing.components.cubic, t );
			},

			easeOutQuart : function (t) {
				return this.easing.tools.reverse( this.easing.components.quart, t );
			},

			easeOutQuint : function (t) {
				return this.easing.tools.reverse( this.easing.components.quint, t );
			},

			easeOutSine : function (t) {
				return this.easing.tools.reverse( this.easing.components.sine, t );
			},

			easeOutExpo : function (t) {
				return this.easing.tools.reverse( this.easing.components.expo, t );
			},

			easeOutCirc : function (t) {
				return this.easing.tools.reverse( this.easing.components.circ, t );
			},

			easeInOutQuad : function (t) {
				return this.easing.tools.reflect( this.easing.components.quad, t );
			},

			easeInOutCubic : function (t) {
				return this.easing.tools.reflect( this.easing.components.cubic, t );
			},

			easeInOutQuart : function (t) {
				return this.easing.tools.reflect( this.easing.components.quart, t );
			},

			easeInOutQuint : function (t) {
				return this.easing.tools.reflect( this.easing.components.quint, t );
			},

			easeInOutSine : function (t) {
				return this.easing.tools.reflect( this.easing.components.sine, t );
			},

			easeInOutExpo : function (t) {
				return this.easing.tools.reflect( this.easing.components.expo, t );
			},

			easeInOutCirc : function (t) {
				return this.easing.tools.reflect( this.easing.components.circ, t );
			},
		},
		components : {

			quad  : function (t) {
				return Math.pow( t, 2 );
			},

			cubic : function (t) {
				return Math.pow( t, 3 );
			},

			quart : function (t) {
				return Math.pow( t, 4 );
			},

			quint : function (t) {
				return Math.pow( t, 5 );
			},

			sine : function (t) {
				return 1 - Math.cos(t * Math.PI / 2);
			},

			expo : function (t) {
				return Math.pow(2, 10 * (t - 1 ));
			},

			circ : function (t) {
				return 1 - Math.sqrt(1 - t * t);
			}
		},
		tools      : {
			reverse : function (method, t) {
				return 1 - method(1 - t);
			},

			reflect : function (method, t) {
				return 0.5 * (t < 0.5 ? method(2 * t) : (2 - method(2 - 2 * t)));
			}
		},
	},
})