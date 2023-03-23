chrome.runtime.sendMessage('enable-youtube-audio');
let audio = null;
let videoElement = null;

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        let url = request.url;

        if ( ! audio) {
            createAudioTrack();
        }

        videoElement = document.getElementsByTagName('video')[0];
    
        videoElement.onvolumechange = onvolumechange;
        videoElement.onpause = onpause;
        videoElement.onplay = onplay;
        videoElement.ontimeupdate = ontimeupdate;
        videoElement.onseeked = onseeked;


        let audioOnlyDivs = document.getElementsByClassName('audio_only_div');
        // Append alert text
        if (audioOnlyDivs.length == 0 && url.includes('mime=audio')) {
            let extensionAlert = document.createElement('div');
            extensionAlert.className = 'audio_only_div';

            let alertText = document.createElement('p');
            alertText.className = 'alert_text';
            alertText.innerHTML = 'Youtube Audio Extension is running. It disables the video stream and uses only the audio stream' +
                ' which saves battery life and bandwidth / data when you just want to listen to just songs. If you want to watch' +
                ' video also, click on the extension icon and refresh your page.';

            extensionAlert.appendChild(alertText);
            let parent = videoElement.parentNode.parentNode;

            // Append alert only if options specify to do so
            chrome.storage.local.get('disable_video_text', function(values) {
              var disableVideoText = (values.disable_video_text ? true : false);
              if (!disableVideoText && parent.getElementsByClassName("audio_only_div").length == 0)
                parent.appendChild(extensionAlert);
            });
        }
        else if (url == "") {
            for(div in audioOnlyDivs) {
                div.parentNode.removeChild(div);
            }
        }
    }
);

const onvolumechange = (e) => {
    audio.volume = e.target.volume;
    if (e.target.volume < 0) {
        audio.muted = true;
    }
    videoElement.muted = true;
}

const onplay = (e) => {
    audio.play()
}

const onpause = (e) => {
    audio.pause()
}

const createAudioTrack = () => {
    audio = document.createElement('audio');
    audio.id = 'youtube-audio';
    audio.setAttribute('controls', true);
    audio.src = 'https://yte2e.s3.fr-par.scw.cloud/8sHekgL5fa0.mp3';
    document.body.appendChild(audio);
}

const ontimeupdate = (e) => {
    videoElement.muted = true;
}

const onseeked = (e) => {
    audio.currentTime = e.target.currentTime;
}