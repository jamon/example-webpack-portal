// entry point
define(['./account', 'lib/react'], function(Account, React) {
    return function(props, target) {
        React.render(React.createElement(Account, props), target);
    };
});
