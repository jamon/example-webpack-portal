require.config({
    paths: {
        "angular": "/static/portal/0.0/lib/angular.min",
        "react": "/static/portal/0.0/lib/react-with-addons.min",
        "react-bootstrap": "/static/portal/0.0/lib/react-bootstrap.min",
        "ngReact": "/static/portal/0.0/lib/ngReact.min",
        "example": "/static/example/0.0/"
    }
});
require(['example/index-angular'], function(Example) {
    console.log(Example);
});
