import * as THREE from '../build/three.module.js'
import { CSS3DRenderer, CSS3DObject } from './d3drenderer/renderers/CSS3DRenderer.js'
import { OrbitControls } from './d3drenderer/controls/OrbitControls.js'
import * as dat from './d3drenderer/libs/dat.gui.module.js'
import { TrackballControls } from './d3drenderer/controls/TrackballControls.js'
import { FirstPersonControls } from './d3drenderer/controls/FirstPersonControls.js'
import { FlyControls } from './d3drenderer/controls/FlyControls.js'

//PARTICLE
const particles = document.getElementById("particles-js")

//SCENE
var sides = {};
var camera, scene, renderer, controls;
var target = new THREE.Vector3();
var minPan, maxPan;

const sideWalls = 'textures/wall_blue.png'
const ceilingWall = 'textures/floor.jpg'
const floorWall = sideWalls

//PLAYER
const player = document.createElement("audio")
player.setAttribute("id", "audio")
player.crossOrigin = "anonymous"
//player.loop = true
//VISUALS    
var dropZone
var draggedFile
var analyser, src, audioContext
var renClassic
var gradientFill
var landscape = false


//INIT
function initScene() {
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 100000);
    scene = new THREE.Scene();
    sides = [
        {
            url: sideWalls, // Right
            position: [- 720, 0, 0],
            rotation: [0, Math.PI / 2, 0],
        },
        {
            url: sideWalls, // Left
            position: [720, 0, 0],
            rotation: [0, - Math.PI / 2, 0]
        },
        {

            url: ceilingWall,
            position: [0, 720, 0],
            rotation: [Math.PI / 2, 0, Math.PI]
        },
        {
            url: floorWall,
            position: [0, -330, 0],
            rotation: [Math.PI / 2, 0, 0]
        },
        {
            url: sideWalls,
            position: [0, 0, 720],
            rotation: [0, Math.PI, 0]
        },
        {
            url: sideWalls,
            position: [0, 0, - 720],
            rotation: [0, 0, 0]
        }
    ];

    //Main Room
    initWalls();
    initPlayer();
    initGallery();

    renderer = new CSS3DRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    //document.body.style.touchAction = 'none';

    //Touch
    /* 
    document.addEventListener('touchstart', onPointerDown, false);
    document.addEventListener('wheel', onDocumentMouseWheel, false);
    document.addEventListener("keydown", onDocumentKeyDown, false);
    window.addEventListener('resize', onWindowResize, false); 
    */

    initCameraControls();
}

function initCameraControls() {
    controls = new OrbitControls(camera, renderer.domElement);

    controls.panningMode = 1;

    controls.autoRotate = false;
    controls.autoRotateSpeed = 0.4;

    controls.enableDamping = true;
    controls.dampingFactor = 0.1;

    /* controls.maxPolarAngle = Math.PI / 2; */
    controls.minPolarAngle = Math.PI / 2 - 0.3;

    controls.rotateSpeed = 0.4;
    controls.zoomSpeed = 3;
    controls.panSpeed = 3;
    controls.keyPanSpeed = 2;

    controls.maxDistance = 300;

    controls.target.x = 0;
    controls.target.y = 1.6;
    controls.target.z = 400;

    minPan = new THREE.Vector3(- 376, 50, - 155);
    maxPan = new THREE.Vector3(376, 50, 1000);

    controls.update();
}


function initWalls() {

    // RIGHT WALL SIDE
    for (var i = 0; i < 2; i++) {

        var side = sides[0];

        var element = document.createElement('img');
        element.draggable = false;
        element.width = 1026;
        element.height = 600;
        element.src = side.url;

        var object = new CSS3DObject(element);
        switch (i) {
            case 0: object.position.fromArray(side.position); break;
            case 1: object.position.x = 720; object.position.z = 1000; break;
            case 2: object.position.x = -720; object.position.y = 0; object.position.z = -1000;
                object.rotation.x = 0; object.rotation.y = Math.PI; object.rotation.z = 0; break;

        }
        object.rotation.fromArray(side.rotation);
        scene.add(object);
    }

    // 	LEFT WALL SIDE		

    for (var i = 0; i < 2; i++) {

        var side = sides[1];

        var element = document.createElement('img');
        element.draggable = false;
        element.width = 1026; //  gap.
        element.height = 600;
        element.src = side.url;

        var object = new CSS3DObject(element);
        switch (i) {
            case 0: object.position.fromArray(side.position); break;
            case 1: object.position.x = -720; object.position.z = 1015; break;
            case 2: object.position.x = 720; object.position.z = -1015; break;
        }
        object.rotation.fromArray(side.rotation);
        scene.add(object);
    }

    // FRONT WALL 
    var side = sides[4];
    var element = document.createElement('img');
    element.draggable = false;
    element.width = 1450; // x gap.
    element.height = 600;
    element.src = side.url;

    var object = new CSS3DObject(element);
    object.position.x = 0;
    object.position.y = 0;
    object.position.z = 1500;

    object.rotation.fromArray(side.rotation);
    scene.add(object);


    //BACK
    var side = sides[5];
    var element = document.createElement('img');
    element.draggable = false;
    element.width = 1450; // x gap.
    element.height = 600;
    element.src = side.url;

    var object = new CSS3DObject(element);
    object.position.x = 0;
    object.position.y = -3;
    object.position.z = -500;

    object.rotation.fromArray(side.rotation);
    scene.add(object);

    // CEILING WALL 
    var side = sides[2];

    var element = document.createElement('img');
    element.draggable = false;
    element.width = 1700; //  gap.
    element.height = 3500;
    element.src = side.url;

    var object = new CSS3DObject(element);
    object.position.x = 0;
    object.position.y = 330;
    object.position.z = 0;
    object.rotation.fromArray(side.rotation);
    //scene.add(object);

    //GROUND WALL
    for (var i = 0; i < 1; i++) {

        var side = sides[3];

        var element = document.createElement('img');
        element.draggable = false;
        element.width = 3100; //  gap.
        element.height = 4520;
        element.src = side.url;

        var object = new CSS3DObject(element);
        switch (i) {
            case 0: object.position.fromArray(side.position); break;
            case 1: object.position.y = -500;
                object.position.z = 160;
                object.rotation.z = Math.PI / 2;
                break;
        }
        object.rotation.fromArray(side.rotation);
       //scene.add(object);
    }
}

function initPlayer() {
    //CANVAS 
    const canvas = document.createElement("canvas")
    canvas.setAttribute("id", "canvas")
    canvas.style.setProperty("background-color", "transparent", "important")
    canvas.style.setProperty("width", "1991px", "important")
    canvas.style.setProperty("heigth", "350px", "important")

    var canvasObjRight = new CSS3DObject(canvas)
    canvasObjRight.position.set(-719, -170, 505)
    canvasObjRight.rotation.fromArray(sides[1].rotation)
    scene.add(canvasObjRight)
   
    //PLAYER
    var audioPlayer = document.createElement('div')
    audioPlayer.setAttribute("id", "audio-player")
    audioPlayer.classList.add("player")

    //TIMELINE
    var timeline = document.createElement("div")
    timeline.classList.add("timeline")
    
    //PROGRESS
    var progress = document.createElement("div")
    progress.classList.add("progress")
    timeline.appendChild(progress)

    //CONTROLS
    var controls = document.createElement("div")
    controls.classList.add("controls")

    //PLAY BTN
    var playIcon = document.createElement("i")
    playIcon.classList.add("toggle-play", "fa-solid", "fa-play", "fa-2xl")

    //REPEAT BTN
    var repeatIcon = document.createElement("i")
    repeatIcon.classList.add("toggle-repeat", "fa-solid", "fa-repeat", "fa-2xl")

    controls.appendChild(playIcon)
    controls.appendChild(repeatIcon)

    //TIME STATUS
    var timeStatus = document.createElement("i")
    timeStatus.classList.add("time")
    timeStatus.style.setProperty("font-size", "30px", "important")

        //CURRENT
        var current = document.createElement("div")
        current.classList.add("current")

        //DEVIDER
        var devider = document.createElement("div")
        devider.classList.add("divider")

        //LENGHT
        var length = document.createElement("div")
        length.classList.add("length")
        length.innerHTML = "0:00"

        timeStatus.appendChild(current)
        timeStatus.appendChild(devider)
        timeStatus.appendChild(length)

    controls.appendChild(timeStatus)

    // ....

        //VOLUME
        var volumeContainer = document.createElement("div")
        volumeContainer.classList.add("volume-container")

        //VOL BUTTON
        var volumeButton = document.createElement("div")
        volumeButton.classList.add("volume-button")

        //VOL ICON
        var volumeIcon = document.createElement("div")
        volumeIcon.classList.add("volume", "icono-volumeMedium")

        volumeButton.appendChild(volumeIcon)
        volumeContainer.appendChild(volumeButton)

        //VOL SLIDER
        var volumeSlider = document.createElement("div")
        volumeSlider.classList.add("volume-slider")

        //VOL SLIDER PERCENTAGE
        var volumePercentage = document.createElement("div")
        volumePercentage.classList.add("volume-percentage")

        volumeSlider.appendChild(volumePercentage)
        volumeContainer.appendChild(volumeSlider)
        
    
    audioPlayer.appendChild(timeline)
    controls.appendChild(volumeContainer)
    audioPlayer.appendChild(controls)

    //DROP ZONE
    dropZone = document.createElement("div")
    dropZone.setAttribute("id", "drag&drop")
    dropZone.style.setProperty("font-size", "40px", "important") 
    dropZone.classList.add("drop-zone")

        //DROP ZONE DESC
        var span = document.createElement("span")
        span.setAttribute("id", "dragndropbox")
        span.classList.add("drop-zone__prompt", "span", "loader")
        span.style.setProperty("font-size", "40px", "important") 
        span.innerHTML = "Drag & Drop or Click"
        dropZone.appendChild(span)

        //AUDIO FILE
        var audioInput = document.createElement("input")
        audioInput.setAttribute("id", "audio-file")
        audioInput.classList.add("drop-zone__input")
        audioInput.setAttribute("accept", "audio/*")
        audioInput.setAttribute("type", "file")
        dropZone.appendChild(audioInput)

    //DROP ZONE - CLICKABLE (IMPORTANT)
    document.getElementsByTagName("body")[0].appendChild(dropZone)
    //TIMELINE - CLICKABLE (IMPROTANT)
    document.getElementsByTagName("body")[0].appendChild(audioPlayer)

    //SCENE - TIMELINE PLAYER
    var timelinePlayerObj = new CSS3DObject(audioPlayer)
    timelinePlayerObj.position.set(0, 150, 1499)
    timelinePlayerObj.rotation.fromArray(sides[4].rotation);
    scene.add(timelinePlayerObj)

    //SCENE - DROP ZONE
    var dropZoneObj = new CSS3DObject(dropZone);
    dropZoneObj.position.set(0, -80, 1499);
    dropZoneObj.rotation.fromArray(sides[4].rotation);
    scene.add(dropZoneObj)

    //WE ADD LISTNERS AFTER APPENDING OBJECTS TO THE SCENE
        //INPUT LISTENER
        audioInput.onchange = function () {
            var files = this.files
            player.src = URL.createObjectURL(files[0])
            dropZone.innerHTML = this.files[0].name.substring(0, this.files[0].name.lastIndexOf("."))
            player.play()
            initVisualizer()
        }
    
        //DROP LISTENER
        document.querySelectorAll(".drop-zone__input").forEach((inputElement) => {
            const dropZoneElement = inputElement.closest(".drop-zone")
        
            dropZoneElement.addEventListener("click", (e) => {
                inputElement.click()
            })
        
            inputElement.addEventListener("change", (e) => {
                    if (inputElement.files.length) {
                        updateThumbnail(dropZoneElement, inputElement.files[0])
                    }
                })
        
            dropZoneElement.addEventListener("dragover", (e) => {
                e.preventDefault()
                dropZoneElement.classList.add("drop-zone--over")
            });
        
            ["dragleave", "dragend"].forEach((type) => {
                dropZoneElement.addEventListener(type, (e) => {
                    dropZoneElement.classList.remove("drop-zone--over")
                })
            })
        
            dropZoneElement.addEventListener("drop", (e) => {
                e.preventDefault()
        
                if (e.dataTransfer.files.length) {
                    inputElement.files = e.dataTransfer.files
                    draggedFile = e.dataTransfer.files[0]
                    player.src = URL.createObjectURL(draggedFile)
                    dropZone.innerHTML = e.dataTransfer.files[0].name.substring(0, e.dataTransfer.files[0].name.lastIndexOf("."))
                    player.play()
                    initVisualizer()
                }
                dropZoneElement.classList.remove("drop-zone--over")
            })
        })

        function updateThumbnail(dropZoneElement, file) {
            let thumbnailElement = dropZoneElement.querySelector(".drop-zone__thumb")
        
            // First time - remove the prompt
            if (dropZoneElement.querySelector(".drop-zone__prompt")) {
                dropZoneElement.querySelector(".drop-zone__prompt").remove()
            }
        
            // First time - there is no thumbnail element, so lets create it
            if (!thumbnailElement) {
                thumbnailElement = document.createElement("div")
                thumbnailElement.classList.add("drop-zone__thumb")
                dropZoneElement.appendChild(thumbnailElement)
            }
        
            thumbnailElement.dataset.label = file.name
        
            if (file.type.startsWith("img/gallery/")) {
                const reader = new FileReader()
        
                reader.readAsDataURL(file)
                reader.onload = () => {
                    thumbnailElement.style.backgroundImage = `url('${reader.result}')`
                }
            } else {
                thumbnailElement.style.backgroundImage = null
            }
        }

    //TIMELINE ELEMENTS
    const audioPlayerEl = document.querySelector(".player")
    const timelineEl = audioPlayer.querySelector(".timeline")
    const volumeSliderEl = audioPlayer.querySelector(".controls .volume-slider")
    const repeatBtnEl = audioPlayer.querySelector(".controls .toggle-repeat")
    const playBtnEl = audioPlayer.querySelector(".controls .toggle-play")
    const styleBtnEl = audioPlayer.querySelector(".controls .toggle-style")
    const galleryBtnEl = audioPlayer.querySelector(".controls .toggle-gallery")
    const apiBtnEl = audioPlayer.querySelector(".controls .toggle-api")
    const timelineUpdateSpeed = 50 // + transition 0.5s
    var initialAudioVol = .35

    //TIMELINE LISTENERS
    player.addEventListener("loadeddata", () => {
            audioPlayer.querySelector(".time .length").textContent = getTimeCodeFromNum(
                player.duration
            )
            player.volume = initialAudioVol
            /* playBtnEl.classList.add("play") */
        },
        false
    )
    player.addEventListener("ended", () => {
    document.getElementById("particles-js").style.opacity = "1"
    })
    timelineEl.addEventListener("click", e => {
        const timelineWidth = window.getComputedStyle(timeline).width
        const timeToSeek = e.offsetX / parseInt(timelineWidth) * player.duration
        player.currentTime = timeToSeek
    }, false)
    volumeSliderEl.addEventListener('click', e => {
        const sliderWidth = window.getComputedStyle(volumeSlider).width
        const newVolume = e.offsetX / parseInt(sliderWidth)
        //console.log("customAudio.volume:" + customAudio.volume + "costumAudio.volume:" + customAudio.volume + "\nnewVolume:" + newVolume )
        player.volume = initialAudioVol = newVolume
        audioPlayer.querySelector(".controls .volume-percentage").style.width = newVolume * 100 + '%'
    }, false)
    setInterval(() => {
        const progressBar = audioPlayer.querySelector(".progress")
        progressBar.style.width = player.currentTime / player.duration * 100 + "%"
        audioPlayer.querySelector(".time .current").textContent = getTimeCodeFromNum(
            player.currentTime
        )
    }, timelineUpdateSpeed)
    playIcon.addEventListener("click", () => {
            if (player.paused) {
                player.play()
            } else {
                //analyser.smoothingTimeConstant = 0.95
                player.pause()
            }
        },
        false
    )
    repeatIcon.addEventListener("click", () => {
        player.loop = !player.loop
    })
    //Update vol status
    audioPlayerEl.querySelector(".volume-button").addEventListener("click", () => {
        const volumeEl = audioPlayer.querySelector(".volume-container .volume")
        player.muted = !player.muted
        if (player.muted) {
            volumeEl.classList.remove("icono-volumeMedium")
            volumeEl.classList.add("icono-volumeMute")
        } else {
            volumeEl.classList.add("icono-volumeMedium")
            volumeEl.classList.remove("icono-volumeMute")
        }
    })
    function getTimeCodeFromNum(num) {
        let seconds = parseInt(num)
        let minutes = parseInt(seconds / 60)
        seconds -= minutes * 60
        const hours = parseInt(minutes / 60)
        minutes -= hours * 60
    
        if (hours === 0) return `${minutes}:${String(seconds % 60).padStart(2, 0)}`
        return `${String(hours).padStart(2, 0)}:${minutes}:${String(
            seconds % 60
        ).padStart(2, 0)}`
    
    }

}

    //INIT ON AUDIO FILE SELECTED
    function initVisualizer() {
    
        audioContext = new (window.AudioContext || window.webkitAudioContext)()
        src = audioContext.createMediaElementSource(player)
        analyser = audioContext.createAnalyser()
    
        //analyser.smoothingTimeConstant = 0.87
    
        analyser.minDecibels = -75
        analyser.maxDecibels = -20
        
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        var ctx = canvas.getContext("2d")
    
        src.connect(analyser)
        analyser.connect(audioContext.destination)
        analyser.fftSize = 512  //Line Density

        //ADD ANALYSER FFT CONTROLLER
        var gui = new dat.GUI();
        gui.add(analyser, 'fftSize', (2048), (2048 * 8))
    
        var bufferLength = analyser.frequencyBinCount
    
        //var dataArray = new Float32Array(bufferLength)
        var dataArray = new Uint8Array(bufferLength)
    
        var WIDTH = canvas.width
        var HEIGHT = canvas.height
    
        var barWidth = (WIDTH / bufferLength) * 2.5
        var barHeight
        var y = 0, x = 0 //Bar spacing
        var r = 175, g = 200, b = -200
    
        gradientFill = ctx.createLinearGradient(HEIGHT / 2, WIDTH / 2, 0, 0)
        gradientFill.addColorStop("0", "whitesmoke") 
        gradientFill.addColorStop("0.1", "lightblue")
        gradientFill.addColorStop("1", "blue")

        renClassic = function () {
            requestAnimationFrame(renClassic)
            x = 0
    
            analyser.getByteFrequencyData(dataArray)
            analyser.fftSize = analyser.fftSize

            ctx.fillStyle = "rgba(0, 14, 41)"
            ctx.clearRect(0, 0, WIDTH, HEIGHT)
    
            for (var i = 0; i < bufferLength / 4.99; i++) {
                barHeight = dataArray[i] * 6.77
    
                r = barHeight + (25 * i / bufferLength) - 200
                g = barHeight + (i / bufferLength) - 150
                b = barHeight
    
                if (barHeight > 350)
                    r = 0
                g += i
    
                    ctx.fillStyle = "rgba(" + r + "," + g + "," + b+ ", 1)";
                    ctx.fillRect(canvas.width - x, canvas.height - barHeight, barWidth, barHeight + 20)
                    ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight + 20)
    
                x += barWidth
                ctx.restore()
    
            }
    
        }
    
        requestAnimationFrame(renClassic)
        player.play()
        //DIMM PARTICLES
        particles.style.opacity = "0.35"
    }

function initGallery() {

    const path = "audio/"
    const audioObject = {
        "audio": {
            0: "Airbase - Tangerine (Original Mix).mp3",
            1: "Audioscribe - Free Fall.mp3",
            2: "Billy Hendrix - Body Shine.mp3",
            3: "Dr Iggy - Oci boje duge .mp3",
            4: "Dream Wave- Lift Off.mp3",
            5: "Grum - Something About You.mp3",
            6: "Ian Storm & Ron van den Beuken - Clocks.mp3",
            7: "Star Wars - The Force Theme (Far Out).mp3",
            8: "Aurora Borealis - The Milky Way.mp3",
            9: "Dabro - Улетай на крыльях ветра.mp3",
            10: "Virtual Symmetry - The V.S. (Original Mix).mp3",
            11: "Tonca Boys - Meet Us At Tonca (Choir Boys Mix) (2001)",
            12: "Spencer Brown - Nightwalk.mp3",
            13: "Robert Miles - Red Zone (Part 1).mp3",
            14: "Pryda - Bus 605 (Original Mix).mp3",
            15: "PPK - ResuRection (Space Club Mix).mp3",
            16: "Peran Van Dijk - Good Time (Original Mix).mp3",
            17: "Tullio - Rainforest.mp3",
            18: "SRTW ft. Hier - Pictures (Joshua Ellis Remix).mp3",
            19: "Moonwalk - Galactic (Original Mix).mp3",
            20: "EDX - Jaded.mp3",
            21: "Mystic Force - Kalimba.mp3",
            22: "Miss Jane - Its A Fine Day (ATB Club Remix).mp3",
            23: "Dave Rodgers -   Deja Vu.mp3",
            24: "Dave Rodgers - Beat of The Rising Sun.mp3",
            25: "Initial D - Night Of Fire.mp3",
            26: "Toby Ash - Are You Ready.mp3",
            27: "Natalie - Heartbeat.mp3",
            28: "Manuel - Gas Gas Gas.mp3",
            29: "Mad Desire - Stephy Martini.mp3",
            30: "Lou Grant - Don't Stop The Music.mp3",
            31: "Max Coveri - Golden Age.mp3",
            32: "Ken Blast - The Top.mp3",
            33: "Initial D - Speed Lover.mp3",
            34: "Initial D - Rider of the Sky.mp3",
            35: "Tetris Remix.mp3",
            36: "Boris Brejcha - Sad But True.mp3",
            37: "Zеplin - Еntеr Моrdor Original Mix.mp3",
            38: "Tom Wilson - Techno Cat.mp3",
            39: "Charlotte de Witte - Remember.mp3",
            40: "Joyhauser - C166W.mp3",
            41: "DVBBS  Borgeous - Tsunami.mp3",
            42: "David Guetta - Titanium Lyrics ft Sia.mp3",
            43: "Darude - Sandstorm (Leon Martell Remix).mp3",
            44: "Cosmic Gate - Exploration Of Space.mp3",
            45: "Faithless - Insomnia.mp3",
            46: "Sash - Ecuador.mp3",
            47: "John B - All Night.mp3",
            48: "Maneo - Beast Within.mp3",
            49: "Jeckyll & Hyde - Frozen Flame.mp3",
            50: "Moby - Why Does My Heart Feel So Bad (Ferry Corsten Remix) (1999).mp3",
            51: "Ana Criado - In A Thousand Skies (Dan Stone).mp3",
            52: "Above  Beyond - Gareth Emery Presents (OceanLab).mp3",
            53: "Lost Witness & Tracey Carmen - Red Sun Rising.mp3",
            54: "Above and Beyond - Lonely Girl (Gareth Emery).mp3",
            55: "Cressida - 6 A.M. (Kyau & Albert).mp3",
            56: "Iggy Azalea feat Rita Ora - Black Widow .mp3",
            57: "Dr Dre - The Next Episode (San Holo).mp3",
            58: "Gioni -Trigger.mp3",
            59: "Veorra - Run.mp3",
            60: "Meric - Take Off (feat. Paul Rey).mp3",
            61: "R.A.F - In 2 My Life (Magic Zone Mix).mp3",
            62: "R.A.F. - Just Take Me Higher.mp3",
            63: "The Organism - Glossolalia.mp3",
            64: "Uncle John From Jamaica (M.I.K.E Remix).mp3",
            65: "Datura - Eternity (Samsara) 1993.mp3",
            66: "DJ Kim - Jetlag (Alphazone Remix) (2001).mp3",
            67: "Bedrock - Set In Stone (1996).mp3",
            68: "Igal M - I Still Like It.mp3",
            69: "Delerium Tiesto ft. Sarah McLachlan - Silence.mp3",
            70: "John Johnson - Buenos Aires (Original Mix).mp3",
            71: "King & Queen - Special Queen.mp3",
            72: "DJ Jamo & Jack Knives - Seastar II (Remix) (1995).mp3",
            73: "Katana - Silence (Signum Remix) (1999).mp3",
            74: "Above & Beyond ft. Gemma Hayes - Counting Down The Days (WYOMI Remix).mp3",
            75: "Oliver Smith - Shadows.mp3",
            76: "Pegboard Nerds feat. Elizaveta - Hero (Teminite Remix).mp3",
            77: "Aero Chord - Surface.mp3",
            78: "Bolier, Divolly & Markward - Cafe (ft. Lena Kovacevic & C.Sen).mp3",
            79: "Initial D - Running in The 90s (Okamio Remix).mp3",
            80: "Astronomia - Tony Igy ( Eurobeat).mp3",
            81: "Dejo - Lightning over Japan.mp3"
        },
        "image": {
            0: "images/gallery/tangerine.jpg",
            1: "images/gallery/ncs.jpg",
            2: "images/gallery/body_shine.jpg",
            3: "images/gallery/dr_iggy.jpg",
            4: "images/gallery/lift_off.jpg",
            5: "images/gallery/anjuna_1.jpg",
            6: "images/gallery/clocks.jpg",
            7: "images/gallery/star_wars.jpg",
            8: "images/gallery/milky_way.png",
            9: "images/gallery/dabrojpg.jpg",
            10: "images/gallery/symmetry.jpg",
            11: "images/gallery/tonca.jpg",
            12: "images/gallery/nightwalk.jpg",
            13: "images/gallery/red_zone.png",
            14: "images/gallery/pryda.jpg",
            15: "images/gallery/resurestion_ppk.jpg",
            16: "images/gallery/good_time.jpg",
            17: "images/gallery/rainforest.jpg",
            18: "images/gallery/pictures.jpeg",
            19: "images/gallery/moonwalk.jpg",
            20: "images/gallery/jaded.jpeg",
            21: "images/gallery/kalimba.jpg",
            22: "images/gallery/fine_day.jpg",
            23: "images/gallery/deja_vu_rodgers.jpg",
            24: "images/gallery/beat_of_the_rising_sun.jpg",
            25: "images/gallery/night_of_fire.jpg",
            26: "images/gallery/are_you_ready.jpg",
            27: "images/gallery/heartbeat.jpg",
            28: "images/gallery/gas_gas_gas.jpg",
            29: "images/gallery/mad_desire.jpg",
            30: "images/gallery/dont_stop_the_music.jpg",
            31: "images/gallery/initiald_90s.jpg",
            32: "images/gallery/the_top.jpg",
            33: "images/gallery/initiald_90s.jpg",
            34: "images/gallery/initiald_90s.jpg",
            35: "images/gallery/tetris.jpg",
            36: "images/gallery/sad_but_true.jpg",
            37: "images/gallery/enter_mordor.jpg",
            38: "images/gallery/techno_cat.jpg",
            39: "images/gallery/remember_charllote.jpg",
            40: "images/gallery/c116w.jpg",
            41: "images/gallery/tsunami_dvbbs.jpg",
            42: "images/gallery/titanium.png",
            43: "images/gallery/sandstorm.jpg",
            44: "images/gallery/exploration_of_space.jpg",
            45: "images/gallery/insomnia_faithless.jpg",
            46: "images/gallery/ecuador.jpg",
            47: "images/gallery/all_night_johnb.jpg",
            48: "img/gallery/beast_within.jpg",
            49: "img/gallery/frozen_flame.jpg",
            50: "img/gallery/why_does_my_heart_feel_so_bad.jpg",
            51: "img/gallery/thousand_skies.jpg",
            52: "img/gallery/anjuna_2.jpg",
            53: "img/gallery/red_sun_rising.jpg",
            54: "img/gallery/anjuna_3.jpg",
            55: "img/gallery/6am.jpg",
            56: "img/gallery/black_widow.jpg",
            57: "img/gallery/san_holo_logo.jpg",
            58: "img/gallery/gionni_trigger.jpg",
            59: "img/gallery/veorra_run.jpg",
            60: "img/gallery/take_off_meric.png",
            61: "img/gallery/in2mylife.jpg",
            62: "img/gallery/just_take_me_higher.png",
            63: "img/gallery/glossolalia.png",
            64: "img/gallery/vengaboys_unclejohnfromjamaica.png",
            65: "img/gallery/datura_eternity.png",
            66: "img/gallery/jet_lag.jpg",
            67: "img/gallery/set_in_stone_.jpg",
            68: "img/gallery/igalm_likeit.png",
            69: "img/gallery/delerium.jpg",
            70: "img/gallery/buenos_aires.jpg",
            71: "img/gallery/king&queen.jpg",
            72: "img/gallery/seastar.png",
            73: "img/gallery/katana.png",
            74: "img/gallery/above&beyond_counting.jpg",
            75: "img/gallery/oliversmith_shadows.png",
            76: "img/gallery/pegboardners_hero.jpg",
            77: "img/gallery/aerochord_surface.png",
            78: "img/gallery/lena_cafe.jpg",
            79: "img/gallery/initiald_90s.jpg",
            80: "img/gallery/astronomia.jpg",
            81: "img/gallery/dejo_overjapan.png"
        },
        "style": {
            0: "trance",
            1: "dnb",
            2: "house",
            3: "vocal",
            4: "trance",
            5: "house",
            6: "house",
            7: "trap",
            8: "trance",
            9: "house",
            10: "trance",
            11: "trance",
            12: "trance",
            13: "trance",
            14: "trance",
            15: "trance",
            16: "house",
            17: "house",
            18: "house",
            19: "house",
            20: "house",
            21: "house",
            22: "house",
            23: "eurobeat",
            24: "eurobeat",
            25: "eurobeat",
            26: "eurobeat",
            27: "eurobeat",
            28: "eurobeat",
            29: "eurobeat",
            30: "eurobeat",
            31: "eurobeat",
            32: "eurobeat",
            33: "eurobeat",
            34: "eurobeat",
            35: "techno",
            36: "techno",
            37: "techno",
            38: "techno",
            39: "techno",
            40: "techno",
            41: "techno",
            42: "techno",
            43: "techno",
            44: "techno",
            45: "techno",
            46: "techno",
            47: "techno",
            48: "techno",
            49: "techno",
            50: "vocal",
            51: "vocal",
            52: "vocal",
            53: "vocal",
            54: "vocal",
            55: "vocal",
            56: "trap",
            57: "trap",
            58: "trap",
            59: "trap",
            60: "trap",
            61: "techno",
            62: "UNDEFINED",
            63: "house",
            64: "trance",
            65: "trance",
            66: "trance",
            67: "trance",
            68: "house",
            69: "trance",
            70: "house",
            71: "eurobeat",
            72: "trance",
            73: "trance",
            74: "trap",
            75: "house",
            76: "vocal",
            77: "trap",
            78: "house",
            79: "eurobeat",
            80: "eurobeat",
            81: "eurobeat"
        },
    }

    //PREV / NEXT
    const next = document.createElement("button")
    const prev = document.createElement("button")

    next.classList.add("custom-btn", "btn")
    prev.classList.add("custom-btn", "btn")

    next.innerHTML = "NEXT"
    prev.innerHTML = "PREV"

    //ADDING LISTENERS BEFORE ADDING OBJECT TO THE SCENE
    next.addEventListener("click", () => {
        console.log("next click")
    })
    prev.addEventListener("click", () => {
        console.log("prev click")
    })

    var btnNextObject = new CSS3DObject(next)
    btnNextObject.position.set(700, 25, 1300)
    btnNextObject.rotation.fromArray(sides[1].rotation)
    scene.add(btnNextObject)

    var btnPrevObject = new CSS3DObject(prev)
    btnPrevObject.position.set(700, -50, 1300)
    btnPrevObject.rotation.fromArray(sides[1].rotation)
    scene.add(btnPrevObject)

    //INIT
    var initialX = 400
    var initialZ = -300

    const numberOfTracks = Object.keys(audioObject["audio"]).length - 2
    console.log("number of tracks total => " + numberOfTracks)

    var domImage = []
    for(let i = 0 ; i < 24 /* numberOfTracks */; i++){
        domImage[i] = document.createElement("img")
        domImage[i].setAttribute("id" , "track_" + (i + 1).toString())
        domImage[i].setAttribute("src", audioObject["image"][i])
        domImage[i].alt = audioObject["audio"][i]
        domImage[i].classList.add("audio-image")

        domImage[i].addEventListener("click", () => {
            let filePath = path + audioObject["audio"][i] 
            console.log(filePath)
            convertToAudioAndPlay(filePath)
            dropZone.innerHTML = audioObject["audio"][i].substring(0, audioObject["audio"][i].indexOf("."))
        })

        var imageObject = new CSS3DObject(domImage[i])
        if(i % 8 == 0){
            initialX -= 200
            initialZ = -300
        }
        imageObject.position.set(720, initialX, initialZ)
        imageObject.rotation.fromArray(sides[1].rotation)
        scene.add(imageObject)

        initialZ += 200
    }

}

function convertToAudioAndPlay(localFilePath) {

    async function createFile() {
        if (localFilePath != "") {
            let response = await fetch(localFilePath)
            let data = await response.blob()
            let metadata = {
                type: 'audio/*'
            }
            var fileName = localFilePath.indexOf("/") + 1
            const file = new File([data], fileName, metadata)
        
                player.src =  URL.createObjectURL(file)    
                player.play()
                if(file != null){
                    initVisualizer()                    
                } else {
                    alert("File does not exits!!")
                }
        } else {
            alert("File does not exist!")
        }
    }
    createFile()
}

function animate() {

    requestAnimationFrame(animate);

    /* let tempCamX = camera.position.x; tempCamZ = camera.position.z;
    let tempContX = controls.target.x; tempContZ = controls.target.z;

    console.log("Target xz:  " +    controls.target.x + " : " + controls.target.z);
    console.log("Positi xz:  " + camera.position.x + " : "+ camera.position.z) */


    /* console.log(camera.position.x) */

    controls.target.clamp(minPan, maxPan);
    controls.update();

    renderer.render(scene, camera);
}


export { initScene as init, animate }