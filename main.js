// ============================ songs container ================================ 
let songs = [];

// generates random numbers for shuffling 
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

// shuffle function for shuffling songs 
function shuffle(arrayLength, array) {
    let rand, temp;
    for (let i = 0; i < arrayLength; i++) {
        rand = getRndInteger(0, arrayLength);
        temp = array[rand];
        array[rand] = array[i];
        array[i] = temp;
    }
}

// to fetch json files 
function fetchJson(num, whichArray) {
    let jsonFiles = [
        'https://shivamwdev.github.io/english/english.json',
        'https://shivamwdev.github.io/hindi/hindi.json',
        'https://shivamwdev.github.io/punjabi/punjabi.json',
        'https://shivamwdev.github.io/haryanvi/haryanvi.json'
    ];

    fetch(jsonFiles[num])
        .then(function (resp) {
            return resp.json();
        })
        .then(function (data) {

            // collecting the fetched data 
            songs[whichArray] = data;

            // shuffling the array items 
            shuffle(songs[whichArray].length, songs[whichArray]);

            // creating songs container songs childs  
            for (let i = 0; i < songs[whichArray].length; i++) {
                allSongsCreate(num, whichArray, i);
            }

            // setting up the player 
            if (whichArray == 0) {
                settingUpPlayer();
            }


        });
}


// ======================= variables declaration is here ====================

// ====================== username section ====================== 
let username = document.getElementById('username');
let nextButton = document.getElementById('next-button');
// ====================== categories section ====================== 
let saveButton = document.getElementById('save-button');
let user = document.querySelector('#greeting-section > span');
let selSong = document.getElementsByClassName('sel-song');
// ====================== navbar section ====================== 
let navbarLinks = document.getElementsByClassName('navbar-links');
// ====================== home section ====================== 
let recentSongStorage;
// ====================== me section ====================== 
let moodMixItem = document.getElementsByClassName('mood-mix-item');
let toggleFavSong = document.getElementById("toggle-fav-song");
let favSongContainer = [];
let moodMixSongsContainer = [];
// ====================== player's section ====================== 
let playerContainer = document.getElementById('player-container');
let progress = document.getElementById('progress');
let nextSongIndication = document.querySelector('#next-song-indication span');
let playPauseButton = document.getElementById('playPauseButton');
let isPlay = false;
// forward and backward function 
let whichList = 0;
let isSongType = 0, isSongNum = 0
// ====================== artist's section ====================== 
let artistSongContainer = document.getElementById('artist-song-container');
let artist = document.getElementsByClassName('artist');


// ========================= u-container naming section =========================

// function for storing username locally
function SetUserName(value) {
    localStorage.setItem("USERNAME", value);
}

// function for geting username from cache
function getUserName() {
    return localStorage.getItem("USERNAME");
}

// function for next button toggle 
function nextButtonToggle() {
    let nameFlag;
    if (username.value == '') {
        nameFlag = false;
    }
    else {
        for (let i = 0; i < username.value.length; i++) {
            if (username.value[i] == ' ') {
                nameFlag = false;
            }
            else {
                nameFlag = true;
                break;
            }
        }
    }
    if (nameFlag) {
        nextButton.classList.remove('disabled-link');
    } else {
        nextButton.classList.add('disabled-link');
    }
}

// to globally set username in page function 
function nextButtonFunction() {
    SetUserName(username.value);
    document.querySelector('#greeting-section > span').innerHTML = getUserName();
    document.getElementById('me-name').innerHTML = getUserName();
    setTimeout(() => {
        document.getElementById('m-container').scrollIntoView();
    }, 300);
}

// username input event calling function
username.addEventListener('input', nextButtonToggle);

// next button click event calling function
nextButton.addEventListener('click', nextButtonFunction);



// ======================== m-container music category selection ========================

// function for saving categories 
function setCategories() {
    let value = [];

    for (let i = 0; i < selSong.length; i++) {
        value[i] = selSong[i].checked;
    }

    localStorage.setItem('CATEGORIES', JSON.stringify(value));
}

// function for getting categories 
function getCategories() {

    // checking categories 
    let value = JSON.parse(localStorage.getItem('CATEGORIES'));
    if (value === null) {
        return;
    }

    // getting categories 
    for (let i = 0; i < selSong.length; i++) {
        selSong[i].checked = value[i];
    }

    save();

    // inpect function for any recent played song stored  
    inspect();


}

// function for save button toggle(show/hide)
function toggleSaveButton() {
    let musicFlag = false;
    for (let i = 0; i < selSong.length; i++) {
        if (selSong[i].checked) {
            musicFlag = true;
            break;
        }
        else {
            musicFlag = false;
        }
    }
    if (musicFlag) {
        saveButton.classList.remove('scale');
    }
    else {
        saveButton.classList.add('scale');
    }
}

// function for saving categories 
function save() {

    // me section update categories input  
    let updateInput = document.getElementsByClassName('updt-categories');

    // fetching json files when call save function     
    let whichArray = 0;
    for (let i = 0; i < selSong.length; i++) {
        if (selSong[i].checked) {
            updateInput[i].checked = true;
            fetchJson(i, whichArray);
            whichArray++;
        } else {
            // to hide empty containers 
            document.querySelectorAll('.song-container')[i].style.display = 'none';
        }
    }

    // scrolling page to home section 
    document.querySelector('main').style.display = 'flex';
    window.scrollBy(0, window.innerHeight);

    // show navbar to display  
    setTimeout(() => {
        document.getElementById('navbar').style.display = 'flex';
    }, 700);

    // for hiding the info container 
    setTimeout(() => {
        document.getElementById('info-container').innerHTML = '';
        document.getElementById('info-container').style.height = '0';
    }, 1000);

    // setting recentSong container in an array 
    recentSongStorage = [];

    // setting is song true 
    isSongs = true;
}

// music category selection click event for hide/show event
for (let i = 0; i < selSong.length; i++) {
    selSong[i].addEventListener('input', toggleSaveButton);
};

// save button click event 
saveButton.addEventListener('click', () => {

    // calling save function 
    save();

    // storing categories 
    setCategories();

    // hiding the recent container 
    document.querySelector('#recent-container').style.display = 'none';

});

// ================================= navbar section =================================

// function for checking active links 
function activeLinks(num) {
    for (let i = 0; i < navbarLinks.length; i++) {
        navbarLinks[i].classList.remove('navlink-active');
        if (i == num) {
            navbarLinks[i].classList.add('navlink-active');
        }
    }
}

// for click events in navbar 
navbarLinks[0].addEventListener('click', () => {
    document.getElementById('home').scrollIntoView();
    activeLinks(0);
});
navbarLinks[1].addEventListener('click', () => {
    playerContainer.classList.toggle('hide-player-container');
    activeLinks(1);
    favSongChecker();
});
navbarLinks[2].addEventListener('click', () => {
    document.getElementById('search-container').style.top = '0';
    activeLinks(2);
});
navbarLinks[3].addEventListener('click', () => {
    document.getElementById('me-container').scrollIntoView();
    activeLinks(3);
});

// navbar right section 
document.querySelector('.drop-item').addEventListener('click', () => {
    let elem = document.documentElement;
    let dropItem = document.querySelector('.drop-item');

    if (dropItem.innerHTML == 'full screen mode') {

        dropItem.innerHTML = 'exit full screen mode';

        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        }
    } else {

        dropItem.innerHTML = 'full screen mode';

        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) { /* Safari */
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { /* IE11 */
            document.msExitFullscreen();
        }
    }
});

// =================================== Home section ===================================

// set recent played songs 
function setRecentSongs() {
    localStorage.setItem('RECENTSONGLIST', JSON.stringify(recentSongStorage));
}

// get recent played songs 
function getRecentSongs() {
    return localStorage.getItem('RECENTSONGLIST');
}

// inspect for any recent song played
function inspect() {
    if (getRecentSongs() == null) {
        recentSongStorage = [];
        document.querySelector('#recent-container').style.display = 'none';
    } else {
        recentSongStorage = JSON.parse(getRecentSongs());
        for (let i = 0; i < recentSongStorage.length; i++) {
            recentSongsCreate(i);
        }
    }
}

// storing recent played songs when called by songs child
function storeRecentplayedSongs(type, num) {
    // checking if value is 0 song never was played
    if (recentSongStorage.length == 0) {
        recentSongStorage[0] = songs[type][num];
    } else {
        // checking if the song was played before 
        for (let i = 0; i < recentSongStorage.length; i++) {
            if (recentSongStorage[i].songName == songs[type][num].songName) {
                if (recentSongStorage[i].artistName == songs[type][num].artistName) {
                    for (let j = i; j < recentSongStorage.length; j++) {
                        recentSongStorage[j] = recentSongStorage[j + 1];
                    }
                    recentSongStorage.pop();
                }
            }
        }

        // for shifting values backward 
        for (let i = recentSongStorage.length; i > 0; i--) {
            recentSongStorage[i] = recentSongStorage[i - 1];
        }

        recentSongStorage[0] = songs[type][num];

        // to enforce the limit upto only 15 songs allowed 
        if (recentSongStorage.length == 16) {
            recentSongStorage.pop();
        }

    }

    // displaying recent song storage 
    document.querySelector('#recent-container').style.display = 'block';

    // creating the updated list 
    document.querySelector('#recent-container > .sub-container').innerHTML = '';
    for (let i = 0; i < recentSongStorage.length; i++) {
        recentSongsCreate(i);
    }

    // storing the updates 
    setRecentSongs();
}

// function for creating and adding click events to play songs from recent
function recentSongsCreate(val) {

    // creating a child 
    let parent = document.querySelector('#recent-container > .sub-container');
    let child = document.createElement('div');
    child.classList.add('recent-item');
    child.title = recentSongStorage[val].songName + '\nby ' + recentSongStorage[val].artistName;
    child.innerHTML = `<div>
                         <img class="home-song-image" src="${recentSongStorage[val].image}" alt="${recentSongStorage[val].songName}">
                       </div>
                       <div>
                         <div class="home-song-name">${recentSongStorage[val].songName}</div>
                         <div class="home-artist-name">${recentSongStorage[val].artistName}</div>
                       </div>`;
    parent.appendChild(child);

    // assigning an event 
    child.addEventListener('click', () => {
        playerContainer.classList.remove('hide-player-container');
        navbarLinks[1].classList.remove('navlink-active');
        document.querySelector('#player-artist-name').innerHTML = recentSongStorage[val].artistName;
        document.querySelector('#player-image').src = recentSongStorage[val].image;
        document.querySelector('#player-song-name').innerHTML = recentSongStorage[val].songName;
        document.querySelector('#download-song').href = recentSongStorage[val].song;
        document.querySelector('#myAudio').src = recentSongStorage[val].song;
        play();

        // for rearranging the order of recently played songs  
        let temp = recentSongStorage[val];
        for (let j = val; j > 0; j--) {
            recentSongStorage[j] = recentSongStorage[j - 1];
        }
        recentSongStorage[0] = temp;

        // now display changes 
        parent.innerHTML = '';
        for (let i = 0; i < recentSongStorage.length; i++) {
            recentSongsCreate(i)
        }

        // setting variables for forward/backward functionality 
        whichList = 0;
        isSongNum = val;
        favSongChecker();
    });
}

// function for creating all selected categories songs with corressponding events
function allSongsCreate(containerType, type, num) {

    // creating the child 
    let parent = document.querySelectorAll('.song-container > .sub-container');
    let child = document.createElement('div');
    child.classList.add('song-item');
    child.title = songs[type][num].songName + '\nby ' + songs[type][num].artistName;
    child.innerHTML = `<div>
                         <img class="home-song-image" src="${songs[type][num].image}" alt="${songs[type][num].songName}">
                       </div>
                       <div>
                         <div class="home-song-name">${songs[type][num].songName}</div>
                         <div class="home-artist-name">${songs[type][num].artistName}</div>
                       </div>`;
    parent[containerType].appendChild(child);

    // adding click events in the child 
    child.addEventListener('click', () => {
        whichList = 1;
        isSongType = type;
        isSongNum = num;
        playerContainer.classList.remove('hide-player-container');
        navbarLinks[1].classList.remove('navlink-active');
        document.querySelector('#player-artist-name').innerHTML = songs[type][num].artistName;
        document.querySelector('#player-image').src = songs[type][num].image;
        document.querySelector('#player-song-name').innerHTML = songs[type][num].songName;
        document.querySelector('#download-song').href = songs[type][num].song;
        document.querySelector('#myAudio').src = songs[type][num].song;
        if (songs[type].length == num + 1) {
            if (songs.length == type + 1) {
                document.querySelector('#next-song-indication span').innerHTML = songs[0][0].songName;
            } else {
                document.querySelector('#next-song-indication span').innerHTML = songs[type + 1][0].songName;
            }
        } else {
            document.querySelector('#next-song-indication span').innerHTML = songs[type][num + 1].songName;
        }
        play();
        storeRecentplayedSongs(type, num);
        favSongChecker();
    });
}


// ======================= search section =======================
let closeSearch = document.getElementById('close-search');

// to hide search container 
closeSearch.addEventListener('click', () => {
    document.getElementById('search-container').style.top = '120%';
    navbarLinks[2].classList.remove('navlink-active');
});

// to hide search container 
document.getElementById('close-searh-container').addEventListener('click', () => {
    document.getElementById('search-container').style.top = '120%';
    navbarLinks[2].classList.remove('navlink-active');
});

// to clear the input text 
document.getElementById('clear-text').addEventListener('click', () => {
    document.getElementById('search-song').value = '';
    searchSong();
});

function searchedItem(songs, type, val) {
    let parent = document.getElementById('show-result');
    let child = document.createElement('div');
    child.classList.add('match-item');
    child.innerHTML =
        `
          <div>
            <img class="match-img" src="${songs[type][val].image}" alt="${songs[type][val].songName}">
          </div>
          <div>
            <div class="match-song">${songs[type][val].songName}</div>
            <div class="match-artist">${songs[type][val].artistName}</div>
          </div>
    `;

    parent.appendChild(child);

    child.addEventListener('click', () => {
        playerContainer.classList.remove('hide-player-container');
        navbarLinks[2].classList.remove('navlink-active');
        document.querySelector('#player-artist-name').innerHTML = songs[type][val].artistName;
        document.querySelector('#player-image').src = songs[type][val].image;
        document.querySelector('#player-song-name').innerHTML = songs[type][val].songName;
        document.querySelector('#download-song').href = songs[type][val].song;
        document.querySelector('#myAudio').src = songs[type][val].song;
        play();
        storeRecentplayedSongs(type, val);
        favSongChecker();
    });
}

function searchSong() {
    let inputValue = document.getElementById('search-song');

    document.getElementById('show-result').innerHTML = '';

    // for all songs 
    for (let i = 0; i < songs.length; i++) {
        for (let j = 0; j < songs[i].length; j++) {
            if ((songs[i][j].songName.toUpperCase().indexOf(inputValue.value.toUpperCase()) != -1) || (songs[i][j].artistName.toUpperCase().indexOf(inputValue.value.toUpperCase()) != -1)) {
                searchedItem(songs, i, j);
            }
        }
    }

    // from mood mix  
    for (let i = 0; i < moodMixSongsContainer.length; i++) {
        for (let j = 0; j < moodMixSongsContainer[i].length; j++) {
            if ((moodMixSongsContainer[i][j].songName.toUpperCase().indexOf(inputValue.value.toUpperCase()) != -1) || (moodMixSongsContainer[i][j].artistName.toUpperCase().indexOf(inputValue.value.toUpperCase()) != -1)) {
                searchedItem(moodMixSongsContainer, i, j);
            }
        }
    }

    // clearing the output 
    if (inputValue.value == '') {
        document.getElementById('show-result').innerHTML = '';
    }
}

document.getElementById('search-song').addEventListener('input', searchSong);

// ========================= about me section =========================

// function for fetching json files 
function moodMixJsonFetch(val) {
    let jsonFiles = [
        'https://shivamwdev.github.io/gym-mode/gymmode.json',
        'https://shivamwdev.github.io/moodmix/moodmix.json'
    ];

    fetch(jsonFiles[val])
        .then(resp => resp.json())
        .then((data) => {
            moodMixSongsContainer[val] = data;

            // variable for creating click event 
            let playItem = document.getElementsByClassName('play-item');

            // for mood mix section 
            for (let i = 0; i < moodMixItem.length; i++) {
                moodMixItem[i].addEventListener('click', () => {
                    document.getElementById('artist-image').src = document.getElementsByClassName('mood-img')[i].src;
                    document.getElementById('artist-name').innerHTML = document.getElementsByClassName('mood-title')[i].innerHTML;
                    document.getElementById('artist-song-container').classList.remove('hide-player-container');

                    // clearing the parent container 
                    document.getElementById('artist-songs-list-container').innerHTML = '';

                    // calling to create child in mood mix 
                    for (let j = 0; j < moodMixSongsContainer[i].length; j++) {
                        createMoodMixItem(i, j);

                        // now adding a click on event for playing songs                 
                        playItem[j].addEventListener('click', () => {
                            playerContainer.classList.remove('hide-player-container');
                            navbarLinks[1].classList.remove('navlink-active');
                            navbarLinks[3].classList.add('navlink-active');
                            document.querySelector('#player-artist-name').innerHTML = moodMixSongsContainer[i][j].artistName;
                            document.querySelector('#player-image').src = moodMixSongsContainer[i][j].image;
                            document.querySelector('#player-song-name').innerHTML = moodMixSongsContainer[i][j].songName;
                            document.querySelector('#download-song').href = moodMixSongsContainer[i][j].song;
                            document.querySelector('#myAudio').src = moodMixSongsContainer[i][j].song;
                            play();
                            favSongChecker();
                            isSongType = i;
                            isSongNum = j;
                            whichList = 4;
                        });

                    }
                });
            }
        });
}

// function for calling json files for mood mix 
for (let i = 0; i < moodMixItem.length; i++) {
    moodMixJsonFetch(i);
}

// function for creating moodmix song child 
function createMoodMixItem(type, val) {
    let parent = document.getElementById('artist-songs-list-container');
    let child = document.createElement('div');
    child.classList.add('mix-item');
    child.innerHTML = 
    `<div class="play-item">
        <div>
            <img src="${moodMixSongsContainer[type][val].image}" alt="${moodMixSongsContainer[type][val].songName}" class="mix-img">
        </div>
        <div class="mix-song-detail">
            <div class="mix-song-name">${moodMixSongsContainer[type][val].songName}</div>
            <div class="mix-artist-name">${moodMixSongsContainer[type][val].artistName}</div>
        </div>
    </div>
    <div class="mix-download">
        <a href="${moodMixSongsContainer[type][val].song}" download="" class="fas fa-download"></a>
    </div>`;

    parent.appendChild(child);

}

// here it ends 

// for changing the categories 
document.getElementById('categories').addEventListener('change', () => {
    let updateInput = document.getElementsByClassName('updt-categories');
    for (let i = 0; i < updateInput.length; i++) {
        if (updateInput[i].checked) {
            document.getElementById('save-changes').classList.remove('disabled-link');
            break;
        } else {
            document.getElementById('save-changes').classList.add('disabled-link');
        }
    }
})

// for saving the changes in the categories button event
document.getElementById('save-changes').addEventListener('click', () => {
    let updateInput = document.getElementsByClassName('updt-categories');
    let value = [];

    for (let i = 0; i < updateInput.length; i++) {
        value[i] = updateInput[i].checked;
    }

    localStorage.setItem('CATEGORIES', JSON.stringify(value));

    location.reload();
})

// for delete account 
document.getElementById('delete-account').addEventListener('click', () => {
    document.getElementById('delete-account-container').style.display = 'flex';
});

document.getElementById('btn-cancel').addEventListener('click', () => {
    document.getElementById('delete-account-container').style.display = 'none';
});

document.getElementById('btn-delete').addEventListener('click', () => {
    localStorage.removeItem("USERNAME");
    localStorage.removeItem('CATEGORIES');
    localStorage.removeItem('RECENTSONGLIST');
    localStorage.removeItem('FAVSONGS');
    location.reload();
});

// =========================== artist's section ===========================

// to close artist container 
document.getElementById('close-artist').addEventListener('click', () => {
    artistSongContainer.classList.add('hide-player-container');
})

// ============================== Player's section ==============================

// function for play the song without getting errors 
function play() {
    var playPromise = myAudio.play();
    isPlay = true;
    playPauseButton.classList = 'fas fa-pause-circle';

    if (playPromise !== undefined) {
        playPromise.then(_ => { })
            .catch(error => { });
    }

}

// function for pause the song 
function pause() {
    myAudio.pause();
    playPauseButton.classList = 'fas fa-play-circle';
    isPlay = false;
}

// add zero function 
function addZero(value) {
    if (value < 10) {
        return '0' + value;
    }
    return value;
}

// progress bar functions
function progressTimer() {
    document.getElementById('right-timer').innerHTML = `${addZero(Math.floor(myAudio.duration / 60))} : ${addZero(Math.floor(myAudio.duration % 60))}`;
    document.getElementById('left-timer').innerHTML = `${addZero(Math.floor(myAudio.currentTime / 60))} : ${addZero(Math.floor(myAudio.currentTime % 60))}`
}

// timer for continuous playing songs 
setInterval(() => {
    progress.value = (myAudio.currentTime / myAudio.duration) * 100;
    progressTimer();
    progress.addEventListener('input', () => {
        myAudio.currentTime = (progress.value * myAudio.duration) / 100;
    });
}, 100);

// setting up the first song in the player 
function settingUpPlayer() {
    if (recentSongStorage.length) {
        // set first song into the player from recent container
        document.querySelector('#player-artist-name').innerHTML = recentSongStorage[0].artistName;
        document.querySelector('#player-image').src = recentSongStorage[0].image;
        document.querySelector('#player-song-name').innerHTML = recentSongStorage[0].songName;
        document.querySelector('#download-song').href = recentSongStorage[0].song;
        document.querySelector('#myAudio').src = recentSongStorage[0].song;
        if (isSongNum + 1 == recentSongStorage.length) {
            document.querySelector('#next-song-indication span').innerHTML = recentSongStorage[0].songName;
        } else {
            document.querySelector('#next-song-indication span').innerHTML = recentSongStorage[isSongNum + 1].songName;
        }
        // for forwarding/backwarding the the songs 
        whichList = 0;
    } else {
        // set first song into the player from songs container
        document.querySelector('#player-artist-name').innerHTML = songs[0][0].artistName;
        document.querySelector('#player-image').src = songs[0][0].image;
        document.querySelector('#player-song-name').innerHTML = songs[0][0].songName;
        document.querySelector('#download-song').href = songs[0][0].song;
        document.querySelector('#myAudio').src = songs[0][0].song;
        document.querySelector('#next-song-indication span').innerHTML = songs[0][1].songName;

        // for forwarding/backwarding the the songs 
        whichList = 1;
    }
}


function nextSong() {

    // for recent songs 
    if (whichList == 0) {
        isSongNum++;
        if (isSongNum == recentSongStorage.length) {
            isSongNum = 0;
        }
        document.querySelector('#player-artist-name').innerHTML = recentSongStorage[isSongNum].artistName;
        document.querySelector('#player-image').src = recentSongStorage[isSongNum].image;
        document.querySelector('#player-song-name').innerHTML = recentSongStorage[isSongNum].songName;
        document.querySelector('#download-song').href = recentSongStorage[isSongNum].song;
        document.querySelector('#myAudio').src = recentSongStorage[isSongNum].song;
        play();
        if (isSongNum + 1 == recentSongStorage.length) {
            document.querySelector('#next-song-indication span').innerHTML = recentSongStorage[0].songName;
        } else {
            document.querySelector('#next-song-indication span').innerHTML = recentSongStorage[isSongNum + 1].songName;
        }
    }

    // for all songs 
    else if (whichList == 1) {
        isSongNum++;
        if (isSongNum == songs[isSongType].length) {
            isSongNum = 0;
            isSongType++;
            if (isSongType == songs.length) {
                isSongType = 0;
            }
        }
        document.querySelector('#player-artist-name').innerHTML = songs[isSongType][isSongNum].artistName;
        document.querySelector('#player-image').src = songs[isSongType][isSongNum].image;
        document.querySelector('#player-song-name').innerHTML = songs[isSongType][isSongNum].songName;
        document.querySelector('#download-song').href = songs[isSongType][isSongNum].song;
        document.querySelector('#myAudio').src = songs[isSongType][isSongNum].song;
        play();
        storeRecentplayedSongs(isSongType, isSongNum);
        if (isSongNum + 1 == songs[isSongType].length) {
            if (isSongType + 1 == songs.length) {
                document.querySelector('#next-song-indication span').innerHTML = songs[0][0].songName;
            } else {
                document.querySelector('#next-song-indication span').innerHTML = songs[isSongType + 1][0].songName;
            }
        } else {
            document.querySelector('#next-song-indication span').innerHTML = songs[isSongType][isSongNum + 1].songName;
        }
    }

    // for search songs 
    else if (whichList == 2) {

    } 

    // for favourite songs 
    else if (whichList == 3) {
        isSongNum++;
        if (isSongNum == favSongContainer.length) {
            isSongNum = 0;
        }
        document.querySelector('#player-artist-name').innerHTML = favSongContainer[isSongNum].artistName;
        document.querySelector('#player-image').src = favSongContainer[isSongNum].image;
        document.querySelector('#player-song-name').innerHTML = favSongContainer[isSongNum].songName;
        document.querySelector('#download-song').href = favSongContainer[isSongNum].song;
        document.querySelector('#myAudio').src = favSongContainer[isSongNum].song;
        play();
        if (isSongNum + 1 == favSongContainer.length) {
            document.querySelector('#next-song-indication span').innerHTML = favSongContainer[0].songName;
        } else {
            document.querySelector('#next-song-indication span').innerHTML = favSongContainer[isSongNum + 1].songName;
        }
    }

    // for mood mix songs 
    else if(whichList == 4){
        isSongNum++;
        if (isSongNum == moodMixSongsContainer[isSongType].length) {
            isSongNum = 0;
        }
        document.querySelector('#player-artist-name').innerHTML = moodMixSongsContainer[isSongType][isSongNum].artistName;
        document.querySelector('#player-image').src = moodMixSongsContainer[isSongType][isSongNum].image;
        document.querySelector('#player-song-name').innerHTML = moodMixSongsContainer[isSongType][isSongNum].songName;
        document.querySelector('#download-song').href = moodMixSongsContainer[isSongType][isSongNum].song;
        document.querySelector('#myAudio').src = moodMixSongsContainer[isSongType][isSongNum].song;
        play();
        if (isSongNum + 1 == moodMixSongsContainer[isSongType].length) {
            document.querySelector('#next-song-indication span').innerHTML = moodMixSongsContainer[isSongType][0].songName;
        } else {
            document.querySelector('#next-song-indication span').innerHTML = moodMixSongsContainer[isSongType][isSongNum + 1].songName;
        }
    }

    // for checking if the song is liked or not 
    favSongChecker();
}

function previousSong() {

    // for recent container 
    if (whichList == 0) {
        document.querySelector('#next-song-indication span').innerHTML = document.querySelector('#player-song-name').innerHTML;
        isSongNum--;
        if (isSongNum == -1) {
            isSongNum = recentSongStorage.length - 1;
        }
        document.querySelector('#player-artist-name').innerHTML = recentSongStorage[isSongNum].artistName;
        document.querySelector('#player-image').src = recentSongStorage[isSongNum].image;
        document.querySelector('#player-song-name').innerHTML = recentSongStorage[isSongNum].songName;
        document.querySelector('#download-song').href = recentSongStorage[isSongNum].song;
        document.querySelector('#myAudio').src = recentSongStorage[isSongNum].song;
        play();
    } 

    // for all songs 
    else if (whichList == 1) {
        document.querySelector('#next-song-indication span').innerHTML = document.querySelector('#player-song-name').innerHTML;
        isSongNum--;
        if (isSongNum == -1) {
            isSongType--;
            if (isSongType == -1) {
                isSongType = songs.length - 1;
            }
            isSongNum = songs[isSongType].length - 1;
        }
        document.querySelector('#player-artist-name').innerHTML = songs[isSongType][isSongNum].artistName;
        document.querySelector('#player-image').src = songs[isSongType][isSongNum].image;
        document.querySelector('#player-song-name').innerHTML = songs[isSongType][isSongNum].songName;
        document.querySelector('#download-song').href = songs[isSongType][isSongNum].song;
        document.querySelector('#myAudio').src = songs[isSongType][isSongNum].song;
        play();
        storeRecentplayedSongs(isSongType, isSongNum);
    } 

    // for search songs 
    else if (whichList == 2) {

    } 

    // for favourite songs 
    else if (whichList == 3) {
        document.querySelector('#next-song-indication span').innerHTML = document.querySelector('#player-song-name').innerHTML;
        isSongNum--;
        if (isSongNum == -1) {
            isSongNum = favSongContainer.length - 1;
        }
        document.querySelector('#player-artist-name').innerHTML = favSongContainer[isSongNum].artistName;
        document.querySelector('#player-image').src = favSongContainer[isSongNum].image;
        document.querySelector('#player-song-name').innerHTML = favSongContainer[isSongNum].songName;
        document.querySelector('#download-song').href = favSongContainer[isSongNum].song;
        document.querySelector('#myAudio').src = favSongContainer[isSongNum].song;
        play();
    }

    // for mood mix container 
    else if(whichList == 4){
        document.querySelector('#next-song-indication span').innerHTML = document.querySelector('#player-song-name').innerHTML;
        isSongNum--;
        if (isSongNum == -1) {
            isSongNum = moodMixSongsContainer[isSongType].length - 1;
        }
        document.querySelector('#player-artist-name').innerHTML = moodMixSongsContainer[isSongType][isSongNum].artistName;
        document.querySelector('#player-image').src = moodMixSongsContainer[isSongType][isSongNum].image;
        document.querySelector('#player-song-name').innerHTML = moodMixSongsContainer[isSongType][isSongNum].songName;
        document.querySelector('#download-song').href = moodMixSongsContainer[isSongType][isSongNum].song;
        document.querySelector('#myAudio').src = moodMixSongsContainer[isSongType][isSongNum].song;
        play();
    }

    // for checking if the song was liked
    favSongChecker();
}

// function for setting the fav songs 
function setFavSongs() {
    localStorage.setItem('FAVSONGS', JSON.stringify(favSongContainer));
}

// function for getting songs 
function getFavSongs() {
    favSongContainer = JSON.parse(localStorage.getItem('FAVSONGS')) || [];
}

// for finding which is being liked 
function whichSong() {

    let playerSongName = document.getElementById('player-song-name').innerHTML;
    let playerArtistName = document.getElementById('player-artist-name').innerHTML;

    // for all songs 
    for (let i = 0; i < songs.length; i++) {
        for (let j = 0; j < songs[i].length; j++) {
            if (playerSongName == songs[i][j].songName && playerArtistName == songs[i][j].artistName) {
                return songs[i][j];
            }
        }
    }

    // for mood mix container 
    for (let i = 0; i < moodMixSongsContainer.length; i++) {
        for (let j = 0; j < moodMixSongsContainer[i].length; j++) {
            if (playerSongName == moodMixSongsContainer[i][j].songName && playerArtistName == moodMixSongsContainer[i][j].artistName) {
                return moodMixSongsContainer[i][j];
            }
        }
    }
}

// create fav songs child function
function createFavSongs() {
    let parent = document.getElementById('fav-list');
    parent.innerHTML = '';
    for (let i = 0; i < favSongContainer.length; i++) {

        // creating child and adding to its container 
        let child = document.createElement('div');
        child.classList.add('fav-song');
        child.title = favSongContainer[i].songName + ' \nby ' + favSongContainer[i].artistName;
        child.innerHTML = `
                        <div>
                            <img class="fav-song-images" src="${favSongContainer[i].image}" alt="${favSongContainer[i].artistName}">
                        </div>
                        <div>
                            <div class="fav-song-name">${favSongContainer[i].songName}</div>
                            <div class="fav-artist-name">${favSongContainer[i].artistName}</div>
                        </div>
        `;
        parent.appendChild(child);

        // now adding the event to it 
        child.addEventListener('click', () => {
            playerContainer.classList.remove('hide-player-container');
            navbarLinks[3].classList.remove('navlink-active');
            document.querySelector('#player-artist-name').innerHTML = favSongContainer[i].artistName;
            document.querySelector('#player-image').src = favSongContainer[i].image;
            document.querySelector('#player-song-name').innerHTML = favSongContainer[i].songName;
            document.querySelector('#download-song').href = favSongContainer[i].song;
            document.querySelector('#myAudio').src = favSongContainer[i].song;
            play();
            favSongChecker();
            whichList = 3;
            isSongNum = i;
        });
    }
    if (parent.innerHTML == '') {
        parent.innerHTML = `<div id="no-fav-song">
            you haven't liked any songs yet :( <br> click <i class="far fa-heart"></i> in player's section to add the songs here :)
        </div>`;
        whichList = 1;
        isSongNum = 0;
    }
}

// to check if song is liked
function favSongChecker() {
    let playerSongName = document.getElementById('player-song-name').innerHTML;
    let playerArtistName = document.getElementById('player-artist-name').innerHTML;

    // frontend changes reset
    toggleFavSong.classList.remove('fa-solid');
    toggleFavSong.classList.add('far');

    for (let i = 0; i < favSongContainer.length; i++) {
        if (playerSongName == favSongContainer[i].songName && playerArtistName == favSongContainer[i].artistName) {
            // frontend changes 
            toggleFavSong.classList.remove('far');
            toggleFavSong.classList.add('fa-solid');
        }
    }
}

// click event for heart shape song 
toggleFavSong.addEventListener('click', () => {

    if (toggleFavSong.classList.contains('far')) {
        // frontend changes 
        toggleFavSong.classList.remove('far');
        toggleFavSong.classList.add('fa-solid');

        // backend changes 
        if (favSongContainer.length == 0) {
            favSongContainer[0] = whichSong();
        } else {
            for (let i = favSongContainer.length; i > 0; i--) {
                favSongContainer[i] = favSongContainer[i - 1];
            }
            favSongContainer[0] = whichSong();
        }

    } else {
        // frontend changes 
        toggleFavSong.classList.remove('fa-solid');
        toggleFavSong.classList.add('far');

        // backend changes 
        let playerSongName = document.getElementById('player-song-name').innerHTML;
        let playerArtistName = document.getElementById('player-artist-name').innerHTML;

        for (let i = 0; i < favSongContainer.length; i++) {
            if (playerSongName == favSongContainer[i].songName && playerArtistName == favSongContainer[i].artistName) {
                for (let j = i; j < favSongContainer.length; j++) {
                    favSongContainer[j] = favSongContainer[j + 1];
                }
                favSongContainer.pop();
            }
        }

    }
    createFavSongs();
    setFavSongs();
});
// function calling for player section 

// click event to hide the player 
document.getElementById('close-player-container').addEventListener('click', () => {
    playerContainer.classList.add('hide-player-container');
    navbarLinks[1].classList.remove('navlink-active');
});

// play/pause click event 
playPauseButton.addEventListener('click', () => {
    if (isPlay) {
        pause();
    } else {
        play();
    }
});

document.getElementById('forward-button').addEventListener('click', nextSong);
document.getElementById('backward-button').addEventListener('click', previousSong);

// next song play automatically
myAudio.addEventListener('ended', nextSong);

// ========================= function calling goes here =========================  



/* =========================  on window load function   =========================  */
window.addEventListener('load', () => {

    // =========================== header section =========================== 
    // loading container box in loading container and outer circle animation
    document.getElementById('loading-container').style.transform = 'scale(0)';
    document.getElementById('outer-circle').classList.remove('outer-circle');

    // closing the loader 
    document.getElementById('header').style.height = '0';

    // ========================= username section ========================= 
    if (getUserName() != null) {
        username.value = getUserName();
        document.querySelector('#greeting-section > span').innerHTML = getUserName();
        document.getElementById('me-name').innerHTML = getUserName();
        nextButton.classList.remove('disabled-link');
        document.getElementById('m-container').scrollIntoView();
    }

    // ========================= categories section ========================= 
    // check for stored categories 
    getCategories();

    // ========================== home's section ========================

    // for creating recents songs 
    // for (let i = 0; i < recentSongStorage.length; i++) {
    //     recentSongsCreate(i);
    // }

    // ========================== player's section ========================

    // to check if previously stored values inside 
    getFavSongs();

    // if yes then creating corresponding child 
    createFavSongs();

    // to check if player has favourite song 
    favSongChecker();
    // ========================= artist's section =========================
    for (let i = 0; i < artist.length; i++) {
        artist[i].addEventListener('click', () => {
            artistSongContainer.classList.remove('hide-player-container');
        })
    }

    // document.getElementById('me-container').scrollIntoView();

});
