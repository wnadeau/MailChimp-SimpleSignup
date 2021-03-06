var User = require('./user'),
    chimp = require('../../config/chimp');
/**
 * List Object
 * properties:
 *  name: list name
 *  id: list id
 */
var List = function(properties) {
        for (var key in properties) {
            this[key] = properties[key];
        }
    };
//the fetch isn't actually made in this method, which is unclear... perhaps there's a better name for this process
//Async calls made here
List.prototype.fetchMergeVars = function(user,finishCallback,finalCallback) {
    var list = this;
    if (typeof user.lists == 'undefined') {
        user.fetchLists(callback);
        if (process.env.type != 'testing') {
            console.log("Warning: merge vars fetched before lists... you're covered this time but it is unadvised.");
        }
        return false;
    }
    user.API().listMergeVars({
        id: list.id
    }, function(merge_vars) {
        list.merge_vars = merge_vars;
        user.temp.calls++;
        //passing user object to avoid circular JSON references
        finishCallback(user,finalCallback);
    });
};
/**
 * The List Compaitibility section:
 * Do the list merge vars fit with the data availalbe in Facebook?
 * Let's find out!
 * 
 * For starters, let's support Email/FName/LName
 * 
 */
List.prototype.testCompatibility = function(callback) {
    var badMergeVars = [];
    for (var i = 0; i < this.merge_vars.length; i++) {
        var merge_var = this.merge_vars[i];
        if (merge_var.req) {
            if (merge_var.tag != "FNAME" && merge_var.tag != "LNAME" && merge_var.tag != "EMAIL") {
                badMergeVars.push(merge_var);
            }
        }
    }
    this.bad_merge_vars = badMergeVars;
    if (callback){
     callback();   
    }
    return badMergeVars;
};
module.exports = List;