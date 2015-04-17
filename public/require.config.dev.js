require.config({
    paths: {
        "angular": "/static/portal/0.0/lib/angular",
        "react": "/static/portal/0.0/lib/react-with-addons",
        "react-bootstrap": "/static/portal/0.0/lib/react-bootstrap",
        "ngReact": "/static/portal/0.0/lib/ngReact",
        "example": "/static/example/0.0"
    }
});
require(['example/index-angular'], function(Example) {
    console.log(Example);
});
