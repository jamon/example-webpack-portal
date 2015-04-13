require.config({
    paths: {
        "react": "/static/portal/0.0/lib/react-with-addons.min",
        "example": "/static/example/0.0/index-react"
    }
});
require(['example', 'react'], function(Example, React) {
    console.log(Example);
    React.render(React.createElement(Example.Test, null), document.body);
});
