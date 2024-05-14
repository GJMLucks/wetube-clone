const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const volumeRange = document.getElementById("volume");
const currentTimeText = document.getElementById("currentTime");
const totalTimeText = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoController");

let userVolume = 0.5;
video.volume = userVolume;
let controlsMouseLeaveTimeoutID = null;
let controlsMouseMoveTimeoutID = null;

const handlePlayClick = function(event) {
    video.paused ? video.play() : video.pause();
    playBtn.innerText = video.paused ? "Play" : "Pause";
};

const handleMuteClick = function(event) {
    video.muted = !video.muted;
    video.muted ? muteBtn.innerText = "UNMUTE" : "MUTE";
    volumeRange.value = video.muted ? 0 : userVolume;
};

const handleVolumeChange = function(event) {
    const { value } = event.target;

    if (video.muted) {
        video.muted = false;
        muteBtn.innerText = "Mute";
    }

    userVolume = value;
    video.volume = value;
};

// new Date(0*1000).toISOString().substr(11,8)
// "00:00:00"
const formattedTime = function(seconds){
    new Date(seconds * 1000).toISOString().substring(11,19);
};

const handleLoadedMetadata = function(event) {
    const totalTime = Math.floor(video.duration);
    
    totalTimeText.innerText = formattedTime(totalTime);
    timeline.max = totalTime;
};

const handleTimeUpdate = function(event){
    const currentTime = Math.floor(video.currentTime);
    
    currentTimeText.innerText = formattedTime(currentTime);
    timeline.value = currentTime;
};

const handleTimelineUpdate = function(event){
    const { value } = event.target;

    video.currentTime = value;
};

const handleFullScreenClick = function(event) {
    const fullScreen = document.fullscreenElement;
    
    if (fullScreen) {
        document.exitFullscreen();
        fullScreenBtn.innerText = "Enter Full Screen";
    } else {
        videoContainer.requestFullscreen();
        fullScreenBtn.innerText = "Exit Full Screen";    
    }
};

const hideControls = function(event) {
    videoControls.classList.remove("showing");
};

const handleMouseMove = function(event) {
    if(controlsMouseLeaveTimeoutID){
        clearTimeout(controlsMouseLeaveTimeoutID);
        controlsMouseLeaveTimeoutID = null;
    }
    if(controlsMouseMoveTimeoutID){
        clearTimeout(controlsMouseMoveTimeoutID);
        controlsMouseMoveTimeoutID = null;
    }

    videoControls.classList.add("showing");
    controlsMouseMoveTimeoutID = setTimeout(hideControls, 3000);
};

const handleMouseLeave = function(event) {
    controlsMouseLeaveTimeoutID = setTimeout(hideControls, 3000);
};

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMuteClick);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("loadedmetadata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
video.addEventListener("mousemove", handleMouseMove);
video.addEventListener("mouseleave", handleMouseLeave);
timeline.addEventListener("input", handleTimelineUpdate);
fullScreenBtn.addEventListener("click", handleFullScreenClick);