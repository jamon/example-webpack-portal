require.config({
    paths: {
        "react": "/static/portal/0.0/lib/react-with-addons",
        "react-bootstrap": "/static/portal/0.0/lib/react-bootstrap",
        "example": "/static/example/0.0/index-react"
    }
});
require(['example', 'react'], function(Example, React) {
    console.log(Example);
    React.render(React.createElement(Example.Test, null), document.body);
});
