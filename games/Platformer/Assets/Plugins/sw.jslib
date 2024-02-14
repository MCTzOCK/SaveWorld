mergeInto(LibraryManager.library, {
    GetHighScore: function() {
        return window.unityInstance.load("surfers", "highscore");
    },
    
    SetHighScore: function(score) {
        window.unityInstance.save("surfers", "highscore", score);
    }
})