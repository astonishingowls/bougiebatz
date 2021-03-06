var legacyOwls = angular.module('legacyOwls', [
    'legacyOwls.auth',
    'legacyOwls.savedStory',
    'legacyOwls.latest',
    'legacyOwls.savedArticlesFactory',
    'legacyOwls.trendingArticlesFactory',
    'legacyOwls.trending',
    'legacyOwls.authFactory',
    'legacyOwls.photoFactory',
    'legacyOwls.modal',
    'legacyOwls.comment',
    'legacyOwls.commentFactory',
    'ngRoute',
    'angularModalService',
    'ngAnimate'
])

//This is where we have defined restricted or not restricted access to various routes
legacyOwls.config(function ($routeProvider) {
  $routeProvider
      .when('/', {
          templateUrl: 'app/latest/latest.html',
          controller: 'latest',
          access: {restricted: true}
      })
      .when('/login', {
          templateUrl: 'app/auth/login.html',
          controller: 'loginController',
          access: {restricted: false}
      })
      .when('/logout', {
          controller: 'logoutController',
          access: {restricted: true}
      })
      .when('/register', {
          templateUrl: 'app/auth/register.html',
          controller: 'registerController',
          access: {restricted: false}
      })
       .when('/latest', {
           templateUrl: 'app/latest/latest.html',
           controller: 'latest',
           access: {restricted: true}
       })
       .when('/trending', {
           templateUrl: 'app/trending/trending.html',
           controller: 'trendingController',
           access: {restricted: true}
       })
       .when('/savedStory', {
           templateUrl: 'app/savedStory/savedStory.html',
           controller: 'savedStoryController',
           access: {restricted: true}
       })
      .otherwise({
          redirectTo: '/'
      });

});

//This runs the authorization from the route change and confirms that user is
// logged (therefore authenticated) before allowing the route to change

legacyOwls.run(function ($rootScope, $location, $route, AuthService) {
    $rootScope.$on('$routeChangeStart',
        function (event, next, current) {
            AuthService.getUserStatus()
                .then(function () {
                    if (next.access.restricted && !AuthService.isLoggedIn()) {
                        $location.path('/login');
                        $route.reload();
                    }
                });
        });
});

