angular.module('legacyOwls.modal', [])

.controller('modalController', ['$scope', 'close', 'Photo', 'Trending', 'SavedArticles', function ($scope, close, Photo, Trending, SavedArticles) {
    // Retrieve information from shared factory about the photo/article to display in the modal
    $scope.photo = Photo.getPhoto();
    // Saves like to user likes and increments likes in trending when Like button is clicked
    $scope.like = function() {
        // Increments likes in trending
        Trending.like($scope.photo)
        .then(function(response) {
          $scope.photo.likes++;
        })
        .catch(function(err) {
          console.error(err);
        });
        // Saves like to user information so a user cannot like something multiple times
        SavedArticles.saveLikeToDB($scope.photo)
        .then(function(response) {
          $scope.photo.liked = true;
        })
        .catch(function(err) {
          console.error(err);
        });

    }
    // Saves story for the user so the user can view it later
    $scope.saveStory = function() {

        SavedArticles.saveArticleToDB($scope.photo)
        .then(function(response) {
          $scope.photo.saved = true;
        })
        .catch(function(err) {
          console.error(err);
        });

    }
    // Closes the modal
    $scope.close = function (result) {
        close(result, 500); // close, but give 500ms for bootstrap to animate
    };

}])

.controller('modalMainController', ['$scope', 'ModalService', 'Photo', function ($scope, ModalService, Photo) {
    // When "See More" button is clicked under the photo, modal pops up
    $scope.showYesNo = function (index) {
        // First want to pass the information about the article that is displayed in the modal using a shared factory
        var photo = $scope.photos[index];
        // Did the user already save or like the article?
        photo.saved = $scope.saved[photo.web_url] ? true : false;
        photo.liked = $scope.likes[photo.web_url] ? true : false;

        Photo.savePhoto(photo);
        // Modal is shown
        ModalService.showModal({
            templateUrl: "app/modal/modal.html",
            controller: "modalController"
        })
        .then(function (modal) {
            modal.element.modal();
            modal.close
            .then(function (result) {
                // Be sure that we keep record that user has liked an article
                if ($scope.photo.liked && !$scope.likes[photo.web_url]) {
                    $scope.likes[photo.web_url] = true; 
                }
                // Be sure that we keep record that the user has saved an article
                if ($scope.photo.saved && !$scope.saved[photo.web_url]) {
                    $scope.saved[photo.web_url] = true;
                }
            });
        });

    };

}]);