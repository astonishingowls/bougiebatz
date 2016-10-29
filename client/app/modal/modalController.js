angular.module('legacyOwls.modal', [])

.controller('modalController', ['$scope', 'close', 'Photo', 'Trending', 'SavedArticles', function ($scope, close, Photo, Trending, SavedArticles) {

    $scope.photo = Photo.getPhoto();

    $scope.like = function() {

        Trending.like($scope.photo)
        .then(function(response) {
          $scope.photo.likes++;
        })
        .catch(function(err) {
          console.error(err);
        });

        SavedArticles.saveLikeToDB($scope.photo)
        .then(function(response) {
          $scope.photo.liked = true;
        })
        .catch(function(err) {
          console.error(err);
        });

    }

    $scope.saveStory = function() {

        SavedArticles.saveArticleToDB($scope.photo)
        .then(function(response) {
          console.log("Success");
          $scope.photo.saved = true;
        })
        .catch(function(err) {
          console.error(err);
        });

    }

    $scope.close = function (result) {
        close(result, 500); // close, but give 500ms for bootstrap to animate
    };

}])

.controller('modalMainController', ['$scope', 'ModalService', 'Photo', function ($scope, ModalService, Photo) {

    $scope.showYesNo = function (index) {

        var photo = $scope.photos[index];

        photo.saved = $scope.saved[photo.url] ? true : false;
        photo.liked = $scope.likes[photo.url] ? true : false;

        Photo.savePhoto(photo);

        ModalService.showModal({
            templateUrl: "app/modal/modal.html",
            controller: "modalController"
        }).then(function (modal) {
            modal.element.modal();
            modal.close.then(function (result) {
                // console.log('inside modalController',$scope.photo);
                if ($scope.photo.liked && !$scope.likes[photo.url]) {
                    $scope.likes[photo.url] = true; 
                }
                if ($scope.photo.saved && !$scope.saved[photo.url]) {
                    $scope.saved[photo.url] = true;
                }
            });
        });

    };

}]);