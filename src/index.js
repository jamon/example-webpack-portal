// entry point
define(['./test', 'lib/react'], function(Test, React) {
    return function(props, target) {
        React.render(React.createElement(Test, props), target);
    };
});
