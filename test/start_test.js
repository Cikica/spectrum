(function (requirejs) {

    var loop_array = function (loop) {
        if ( loop.start_at >= loop.array.length ) {
            return loop.if_done(loop)
        } else {
            return loop_array(loop.else_do(loop))
        }
    }

    requirejs(["test.configuration"], function (run) {

        requirejs(run.path, function () { 
            var jasmineEnv = jasmine.getEnv()
            jasmineEnv.updateInterval = 1000
            var htmlReporter = new jasmine.HtmlReporter()
            jasmineEnv.addReporter(htmlReporter)
            jasmineEnv.specFilter = function(spec) {
                return htmlReporter.specFilter(spec)
            }
            jasmineEnv.execute()
        })
    })
})(requirejs)