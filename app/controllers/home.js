/**
 * GET /
 * Home page.
 */
var mongoose = require('mongoose');

exports.index = function(req, res) {
    mongoose.connection.db.collection("tweet", function (err, collection){
        if (err){
            console.log(err);
        }
        else{
            collection.find({},{"limit":100,"sort":{"_id":-1}},function(error,cursor){
                cursor.toArray(function(error,tweets){
                    if (error){
                        console.log(error);
                    }
                    else{
                        console.log(tweets);
                        res.render('home', {
                            title: 'Home',
                            tweets = tweets
                        });

                    }
                });
            });
            
        }
    });

    
/*    
    console.log(tweetCollection);

    res.render('home', {
        title: 'Home'
    });
*/
};
