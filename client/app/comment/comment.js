angular.module('legacyOwls.comment', ["pageslide-directive"])

.controller('commentBox',

  ['$scope', '$location', 'Trending','Articles','Comment',
  function($scope, $location, Trending, Articles, Comment){
    $scope.testComment ;

    $scope.articleNumber;
    $scope.articleId;
    $scope.idx;
    $scope.articleTitle;
    $scope.article;
    $scope.articles;
    $scope.refreshComment;
    $scope.titleOfFound
    $scope.newComment = [];

///////////////////////////////
/////For Trending Articles/////
///////////////////////////////
    $scope.toggleTrending = function(index) {
        $scope.checked = !$scope.checked
        $scope.idx = index;
        console.log($scope.idx)

     Trending.getAll().then(function(res){

       $scope.articleTitle; //Need to find articleTitle
        $scope.article = res.data[$scope.idx];
        // console.log(res.data[$scope.idx]);
        console.log($scope.article.articleData, ' LINE 32, comment.js')
        console.log(res.data);
     })

     $scope.submitComment = function(){
        var sendToDB = {};
        sendToDB.article = $scope.article.articleData;
        var commentData = {}
        commentData.articleTitle = $scope.article.title
        commentData.user = $scope.username = 'Anonymous'; //grab user name
        commentData.comment = $scope.userInputComment;
        sendToDB.commentData = commentData;

        Comment.postComment(sendToDB)
        $scope.newComment.push($scope.userInputComment);
        $scope.userInputComment = '';

    }
    }//End of Toggle Button for Article



///////////////////////////////
/////For Latest Articles///////
///////////////////////////////

  $scope.toggle = function(index) {

    //Slide in out Check function.
    $scope.checked = !$scope.checked
    $scope.idx = index;
    $scope.newComment = []; //clear previous comments
    $scope.getLatest = function() {
      var params = {
        source: 'all',
        section: $scope.selectedOption,
        time: '24',
        limit: 40,
        offset: 0
      }

      Articles.getLatest(params)
      .then(function(response) {
        $scope.articles = response.data.results.filter(function(photo) {
          // only want the articles that have a photo url - some of them have multimedia = ''
          // $scope.urls[photo.url] ? photo.likes = $scope.urls[photo.url] : photo.likes = 0;
          return photo.multimedia.length === 4;
        });
      $scope.article = $scope.articles[$scope.idx];
      console.log($scope.article, ' LINE 81, comment.js ')
      //Receive all comments when toggle is clicked.
      $scope.refreshComment = function(){
        //receive all comment data
        Comment.getAllComment($scope.article).then(function(res){
           console.log(res, ' RES, comment.js')
            $scope.testComment = res.data;

        })

       }();


      });
  }()

    $scope.submitComment = function(){
      var sendToDB = {};
      sendToDB.article = $scope.article;
      var commentData = {}
      commentData.articleTitle = $scope.article.title
      commentData.user = $scope.username = 'Anonymous'; //grab user name
      commentData.comment = $scope.userInputComment;
      sendToDB.commentData = commentData;

      Comment.postComment(sendToDB)
      $scope.newComment.push($scope.userInputComment);
      $scope.userInputComment = '';

    }

  }//End of Toggle Button for Latest

  }
])