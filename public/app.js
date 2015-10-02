var playlist = [
    {
        url: "https://soundcloud.com/thewombats/thewombats-emoticons",
        element: null,
        widget: null,
    },
    {
        url: "https://soundcloud.com/dangervillage/walla-nature",
        element: null,
        widget: null,
    },
    {
        url: "https://soundcloud.com/deathcabforcutie/death-cab-for-cutie-black-sun",
        element: null,
        widget: null,
    },
]

var position = -1;
var currentPlayer = null;

var scWidget = null;

var socket = io();
socket.on("add track", function(msg) {
    playlist.push(msg);
});

window.onload = function() {
    playNextTrack();

    document.getElementById("addTrack").onsubmit = function(event) {
        event.preventDefault();

        var track_url = document.getElementById("trackUrl").value;

        socket.emit("add track", track_url);
        console.log("added " + track_url + " to playlist");
    }
}

function buildWidget(track, callback) {
    var div = document.createElement("div");
    var widget = null;

    document.getElementById("player").appendChild(div);
    track.element = div;

    var data = new FormData();
    data.append("format", "json");
    data.append("url", track.url);

    var xhr = new XMLHttpRequest();
    xhr.addEventListener("load", function() {
        response = JSON.parse(this.responseText);
        console.log(response);

        div.innerHTML = response.html;

        widget = SC.Widget(div.childNodes[0]);
        widget.bind(SC.Widget.Events.FINISH, function() {
            playNextTrack();
            track.element.style.display = "none";
        });

        track.widget = widget;

        if (callback !== undefined) {
            callback(track);
        }
    });
    xhr.open("POST", "https://soundcloud.com/oembed", true);
    xhr.send(data);
}

function playNextTrack() {
    console.log("next track");

    position = (position + 1) % playlist.length;
    var track = playlist[position];

    if (track.widget === null) {
        buildWidget(track, function(track) {
            track.widget.bind(SC.Widget.Events.READY, function() {
                track.widget.play();
            });
        });
    } else {
        playTrack(track);
    }
}

function playTrack(track) {
    track.element.style.display = "";
    track.widget.play();

    // preload next track
    next_track = playlist[(position + 1) % playlist.length];

    if (next_track.widget === null) {
        buildWidget(next_track);
    }
}
