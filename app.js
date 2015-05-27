var playlist = [
    {type: "sc", id: "https://soundcloud.com/thewombats/thewombats-emoticons"},
    {type: "yt", id: "p-qfzH0vnOs"},
    {type: "sc", id: "https://soundcloud.com/dangervillage/walla-nature"},
    {type: "yt", id: "CmQy6qgV2cM"}
];

var scTrack = "https://soundcloud.com/thewombats/thewombats-emoticons";
var ytTrack = "p-qfzH0vnOs";

var scPlaylist = [
    "https://soundcloud.com/thewombats/thewombats-emoticons",
    "https://soundcloud.com/dangervillage/walla-nature",
    "https://soundcloud.com/deathcabforcutie/death-cab-for-cutie-black-sun"
]

var ytPlaylist = [
    "p-qfzH0vnOs",
    "CmQy6qgV2cM"
]

var position = 0;
var currentPlayer = null;

var scWidget = null;
var ytWidget = null;

window.onload = function() {
    
    SC.oEmbed(scPlaylist[position], {auto_play: true}, function(response) {
        console.log(response);
        var player = document.querySelector("#player");
        player.innerHTML = response.html;


        var widget = SC.Widget(document.querySelector("#player iframe"));
        widget.bind(SC.Widget.Events.FINISH, function() {
            position += 1;

            if (position < scPlaylist.length) {
                widget.load(scPlaylist[position], {auto_play: true});
            }
        });
    });
    

    //playNextTrack();

    //position++;
    //var widget = YT.Player("youtube", {
    //    videoId: ytPlaylist[position],
    //    width: 400,
    //    height: 400
    //});
}

function onYouTubeIframeAPIReady() {
    // null
}

function playNextTrack() {
    console.log("next track");

    position++;
    var track = playlist[position];

    if (track.type === "sc") {
        if (scWidget === null) {
            SC.oEmbed(track.id, {auto_play: true}, function(response) {
                document.getElementById("soundcloud").innerHTML = response.html;

                widget = SC.Widget(document.querySelector("#soundcloud iframe"));
                widget.bind(SC.Widget.Events.FINISH, function() {
                    playNextTrack();
                });
            });
        } else {
            widget.load(track.id, {auto_play: true});
        }
    } else if (track.type === "yt") {
        if (ytWidget === null) {
            ytWidget = YT.Player("youtube", {
                videoId: track.id,
                events: {
                    'onStateChange': ytStateChange
                },
                playerVars: {'autoplay': 1}
            });
        } else {
            ytWidget.loadVideoById(track.id, 0, "default");
        }
    }
}

function ytStateChange(event) {
    if (event === YT.PlayerState.ENDED) {
        playNextTrack();
    }
}
