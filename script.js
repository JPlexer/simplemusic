/****************************************
* 
*   Simply Music
*   Copyright (C) 2021 JPlexer
*
*   This program is free software: you can redistribute it and/or modify
*   it under the terms of the GNU General Public License as published by
*   the Free Software Foundation, either version 3 of the License, or
*   (at your option) any later version.
*
*   This program is distributed in the hope that it will be useful,
*   but WITHOUT ANY WARRANTY; without even the implied warranty of
*   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
*   GNU General Public License for more details.
*
*   You should have received a copy of the GNU General Public License
*   along with this program.  If not, see <http://www.gnu.org/licenses/>.
* 
* *************************************/
        const fs = require('fs');
        const electron = require('electron');
        var remote = electron.remote;
        var info = remote.getGlobal("iinfo");
        var posSlider = document.getElementById("playing");
        var volSlider = document.getElementById("vol");
        var realQueue = []
        var queue = [];
        var queuePosition = 0;
        const mm = require('music-metadata');
        var startBut = document.getElementById("startButton");
        var muteBut = document.getElementById("muteButton");
        var tempAud = 0.5;
        var muted = false;
        var repeating = 0;
        var shuffleactivated = false;
        var audio1 = new Audio(queue[queuePosition]);
        var launched = true
        const rootPath = require('electron-root-path').rootPath;
        var files = []

        var getFiles = function(path, files){
    fs.readdirSync(path).forEach(function(file){
        var subpath = path + '/' + file;
        if(fs.lstatSync(subpath).isDirectory()){
            getFiles(subpath, files);
        } else {
            files.push(path + '/' + file);
        }
    });     
}
//getFiles(rootPath + "/music", files)

async function init () {
    await getFiles(info.musi, files)
var v = await files.filter(function(file){
    return file.indexOf(".flac") !== -1;
});
var w = await files.filter(function(file){
    return file.indexOf(".mp3") !== -1;
});
var x = await files.filter(function(file){
    return file.indexOf(".ogg") !== -1;
});
var y = await files.filter(function(file){
    return file.indexOf(".wav") !== -1;
});
console.log(v.concat(w, x, y))
var z = await v.concat(w, x, y);
            z.forEach(async function (file) {
                await mm.parseFile(file)
                    .then(metadata => {
                        
                        if (metadata.common.picture) {
                            img = `data:${metadata.common.picture[0].format};base64,${metadata.common.picture[0].data.toString('base64')}`;

                        }
                        else {
                            img = "./icons/missingalbumart.png"
                        } if (metadata.common.title) {
                            title = metadata.common.title
                        } else {
                            title = file.toString();
                        }
                        if (metadata.common.artist) {
                            artist = metadata.common.artist
                            } else {
                                artist = "Unknown Artist"
                            }
                            const div = document.createElement("div");
                            div.innerHTML =
                                '<a class="btn" class="musicbutton" id="' +
                                file +
                                '" onClick="playFromTop(this.id)"><div class="musictitle" id="' + rootPath + "/music/" +
                                file +
                                '"><img id="coveer" src="'+ img +'" alt="Album Art"><p class="titler">' +
                                title + '</p><p class="artistr">' +
                                artist + '</p></div>'
                            document.getElementById('main').appendChild(div);
                            realQueue.push(file)
                            queue.push(file)
                    })
                                        

            });

            audio1 = new Audio(queue[queuePosition]);
            audio1.addEventListener("loadeddata", setSliderMax);
        };
window.onload = init

        var convertTime = function (time) {
            var mins = Math.floor(time / 60);
            if (mins < 10) {
                mins = '0' + String(mins);
            }
            var secs = Math.floor(time % 60);
            if (secs < 10) {
                secs = '0' + String(secs);
            }

            return mins + ':' + secs;
        }
        var convertToLast = function (a) {
            a.replace(" ", "+");
            b = a.toLowerCase();
            return b;
        }

        function shuffling(array) {
            var currentIndex = array.length,
                temporaryValue, randomIndex;

            // While there remain elements to shuffle...
            while (0 !== currentIndex) {

                // Pick a remaining element...
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;

                // And swap it with the current element.
                temporaryValue = array[currentIndex];
                array[currentIndex] = array[randomIndex];
                array[randomIndex] = temporaryValue;
            }

            return array;
        }



        function setSliderMax() {
            document.getElementById("durat").innerHTML = convertTime(audio1.duration);
            posSlider.setAttribute('max', audio1.duration);
            posSlider.setAttribute('min', 0);
        }

        startBut.addEventListener("click", playButton);
        function playButton() {
            if (launched) {
                audio1 = new Audio(queue[queuePosition]);
                launched = false
                audioPlay(true);
            } else if (audio1.paused) {
                audioPlay();
            } else {
                audio1.pause();
                document.getElementById("startButton").innerHTML = '<i class="fas fa-play"></i>'
            }
        }

        function audioPlay(i) {
            launched = false
                document.getElementById("startButton").innerHTML = '<i class="fas fa-pause"></i>'
                audio1.play();
                audio1.addEventListener("timeupdate", setSliderVal);
                audio1.addEventListener("loadeddata", setSliderMax);
                mm.parseFile(queue[queuePosition])
                    .then(metadata => {
                    if (metadata.common.picture) {
                            let imgg
                            imgg = `data:${metadata.common.picture[0].format};base64,${metadata.common.picture[0].data.toString('base64')}`;
                            document.getElementById('cover').src = imgg
                    } else {
                        document.getElementById('cover').src = "./icons/missingalbumart.png"
                    }
                        if (metadata.common.title && metadata.common.artist) {
                            if ('mediaSession' in navigator) {
                                navigator.mediaSession.metadata = new MediaMetadata({
                                  title: metadata.common.title,
                                  artist: metadata.common.artist
                                });
                            }
                            document.getElementById("title").innerHTML = metadata.common.title
                            document.getElementById("wtitle").innerHTML = "Simply Music - " + metadata.common.title
                            document.getElementById("artist").innerHTML = metadata.common.artist
                            info.artist = metadata.common.artist
                            info.title = metadata.common.title
                        } else if (metadata.common.title) {
                            document.getElementById("title").innerHTML = metadata.common.title
                            document.getElementById("wtitle").innerHTML = "Simply Music - " + metadata.common.title
                            info.title = metadata.common.title
                            if ('mediaSession' in navigator) {

                                navigator.mediaSession.metadata = new MediaMetadata({
                                  title: metadata.common.title,
                                  artist: "Unknown Artist"
                                });
                            }
                        } else if (metadata.common.artist) {
                            unavaliable = queue[queuePosition]
                            newTitle = unavaliable.replace( rootPath + "/music/","");
                            if ('mediaSession' in navigator) {
                            document.getElementById("wtitle").innerHTML = "Simply Music"
                            navigator.mediaSession.metadata = new MediaMetadata({
                                title: newTitle,
                                artist: metadata.common.artist
                              });
                            }
                            document.getElementById("title").innerHTML =  newTitle
                            document.getElementById("artist").innerHTML = metadata.common.artist
                            info.artist = metadata.common.artist
                        } else {
                            unavaliable = queue[queuePosition]
                            newTitle = unavaliable.replace( rootPath + "/music/","");
                            document.getElementById("wtitle").innerHTML = "Simply Music"
                            document.getElementById("title").innerHTML =  newTitle
                            document.getElementById("artist").innerHTML = "Unknown Artist"
                            if ('mediaSession' in navigator) {

                                navigator.mediaSession.metadata = new MediaMetadata({
                                  title: newTitle,
                                  artist: "Unknown Artist"
                                });
                            }
                            info.artist = "Unknown Artist"
                            info.title = "Unknown Title"
                        }
                    })

        }

        function setSliderVal() {
            posSlider.value = audio1.currentTime;
            document.getElementById("songtime").innerHTML = convertTime(audio1.currentTime);
            if (audio1.currentTime === audio1.duration) {
                skipSong();
            }
        }

        posSlider.addEventListener("input", setPos);

        function setPos() {
            audio1.currentTime = posSlider.value;
        }

        volSlider.addEventListener("input", setVol);

        function setVol() {
            audio1.volume = volSlider.value / 100;
            tempAud = audio1.volume
        }

        muteBut.addEventListener("click", muteVol);

        function muteVol() {
            if (muted) {
                muteBut.innerHTML = '<i class="fas fa-volume-up"></i>'
                audio1.volume = tempAud
                volSlider.value = tempAud * 100
                muted = false
            } else {
                muteBut.innerHTML = '<i class="fas fa-volume-mute"></i>'
                audio1.volume = 0
                volSlider.value = 0
                muted = true
            }
        }
        skipButton.addEventListener("click", manualSkip);
    
        function manualSkip() {
    if (queuePosition >= queue.length - 1 && repeating === 1) {
                queuePosition = 0
                audio1.pause();
                audio1.currentTime = 0;
                audio1 = new Audio(queue[queuePosition]);
                if (muted) {} else {
                    audio1.volume = tempAud
                    volSlider.value = tempAud * 100
                }
                audioPlay(true);
            } else if (queuePosition >= queue.length - 1) {
                queuePosition = 0
                audio1.pause();
                audio1.currentTime = 0;
                audio1 = new Audio(queue[queuePosition]);
                if (muted) {} else {
                    audio1.volume = tempAud
                    volSlider.value = tempAud * 100
                }
                document.getElementById("title").innerHTML =  "Title"
                document.getElementById("artist").innerHTML = "Artist"
                document.getElementById('cover').src = "./icons/missingalbumart.png"
                document.getElementById("startButton").innerHTML = '<i class="fas fa-play"></i>'
            } 
            else {
                queuePosition = queuePosition + 1
                audio1.pause();
                audio1.currentTime = 0;
                audio1 = new Audio(queue[queuePosition]);
                if (muted) {} else {
                    audio1.volume = tempAud
                    volSlider.value = tempAud * 100
                }
                audioPlay(true);
            }
}
        function skipSong() {
            if (repeating === 2) {
                audio1.pause();
                audio1.currentTime = 0;
                if (muted) {} else {
                    audio1.volume = tempAud
                    volSlider.value = tempAud * 100
                }
                launched = false
                audio1.play();
                audio1.addEventListener("timeupdate", setSliderVal);
                audio1.addEventListener("loadeddata", setSliderMax);
            } else {
                manualSkip();
            }
        }

        rewindButton.addEventListener("click", unskipSong);

        function unskipSong() {
           if (queuePosition === 0 && repeating === 1) {
                queuePosition = queue.length - 1
                audio1.pause();
                audio1.currentTime = 0;
                audio1 = new Audio(queue[queuePosition]);
                if (muted) {
                    audio1.volume = 0
                    volSlider.value = 0
                } else {
                    audio1.volume = tempAud
                    volSlider.value = tempAud * 100
                }
                audioPlay(true);
            } else if (queuePosition === 0) {
                audio1.pause();
                audio1.currentTime = 0;
                audio1 = new Audio(queue[queuePosition]);
                if (muted) {
                    audio1.volume = 0
                    volSlider.value = 0
                } else {
                    audio1.volume = tempAud
                    volSlider.value = tempAud * 100
                }
                document.getElementById("title").innerHTML =  "Title"
                document.getElementById("artist").innerHTML = "Artist"
                document.getElementById('cover').src = "./icons/missingalbumart.png"
                document.getElementById("startButton").innerHTML = '<i class="fas fa-play"></i>'
            } 
            else {
                queuePosition = queuePosition - 1
                audio1.pause();
                audio1.currentTime = 0;
                audio1 = new Audio(queue[queuePosition]);
                if (muted) {
                    audio1.volume = 0
                    volSlider.value = 0
                } else {
                    audio1.volume = tempAud
                    volSlider.value = tempAud * 100
                }
                audioPlay(true);
            }
        }

        repeatButton.addEventListener("click", repeatStuff);
       

        function repeatStuff() {
            if (repeating === 0) {
                document.getElementById("repeatButton").innerHTML = '<i class="fas fa-retweet"></i>'
                document.getElementById("repeatButton").style.color = "gray"
                repeating = 1;
            } else if (repeating === 1) {
                document.getElementById("repeatButton").innerHTML = '<i class="fas fa-infinity"></i>'
                document.getElementById("repeatButton").style.color = "gray"
                repeating = 2;
            }else if (repeating === 2){
                document.getElementById("repeatButton").innerHTML = '<i class="fas fa-retweet"></i>'
                document.getElementById("repeatButton").style.color = "white"
                repeating = 0;
            }
        }
        shuffleButton.addEventListener("click", iPodShuffle);

        function iPodShuffle() {
            if (!shuffleactivated) {
                if(repeating != 0){
                    document.getElementById("repeatButton").innerHTML = '<i class="fas fa-retweet"></i>'
                document.getElementById("repeatButton").style.color = "white"
                repeating = 0;
                }
                document.getElementById("shuffleButton").style.color = "gray"
                shuffleactivated = true;
                audio1.pause();
                audio1.currentTime = 0;
                queuePosition = 0
                queue = shuffling(queue)
                audio1 = new Audio(queue[queuePosition]);
                if (muted) {} else {
                    audio1.volume = tempAud
                    volSlider.value = tempAud * 100
                }
                audioPlay(true);
            } else {
                if(repeating != 0){
                    document.getElementById("repeatButton").innerHTML = '<i class="fas fa-retweet"></i>'
                document.getElementById("repeatButton").style.color = "white"
                repeating = 0;
                }
                document.getElementById("shuffleButton").style.color = "white"
                shuffleactivated = false;
                audio1.pause();
                audio1.currentTime = 0;
                console.log(realQueue)
                queue = [...realQueue]
                console.log(queue)

                queuePosition = 0
                audio1 = new Audio(queue[queuePosition]);
                if (muted) {} else {
                    audio1.volume = tempAud
                    volSlider.value = tempAud * 100
                }
                if (repeatong === 2)
                {
                    repeating = 2
                }
                audioPlay(true);
            }
        }


        function playFromTop(id) {
                queuePosition = queue.indexOf(id);
                audio1.pause();
                audio1.currentTime = 0;
                audio1 = new Audio(queue[queuePosition]);
                if (muted) {
                    audio1.volume = 0
                    volSlider.value = 0
                } else {
                    audio1.volume = tempAud
                    volSlider.value = tempAud * 100
                }
                audioPlay(true);
        }
        const actionHandlers = [
            ['play',          () => { audioPlay() }],
            ['pause',         () => { playButton() }],
            ['previoustrack', () => { unskipSong() }],
            ['nexttrack',     () => { manualSkip() }]
          ];
          
          for (const [action, handler] of actionHandlers) {
            try {
              navigator.mediaSession.setActionHandler(action, handler);
            } catch (error) {
              console.log(`The media session action "${action}" is not supported yet.`);
            }
          }
