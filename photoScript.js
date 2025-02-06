let videoStream;
let currentCamera = 'front'; // Default to front camera
let timerInterval;
let remainingTime = 15; // Starting time for the countdown timer
let photosTaken = 0; // Counter for pictures taken
let totalPhotos = 1; // Default value in case no count is passed
let isTimerRunning = false; // Flag to track if the timer is running

// Retrieve photo count from URL (photoCount parameter)
const urlParams = new URLSearchParams(window.location.search);
totalPhotos = parseInt(urlParams.get('photoCount')) || 1; // Default to 1 if no value is passed

// Start the camera preview automatically
startCamera(currentCamera);

// Function to stop the current video stream
function stopStream() {
    if (videoStream) {
        const tracks = videoStream.getTracks();
        tracks.forEach(track => track.stop());
    }
}

// Function to start camera preview
function startCamera(camera = 'front') {
    stopStream(); // Stop the previous stream before starting a new one

    // Get access to the camera
    navigator.mediaDevices.enumerateDevices().then(devices => {
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        let selectedCamera;

        if (camera === 'front') {
            selectedCamera = videoDevices.find(device => device.label.toLowerCase().includes('front'));
        } else if (camera === 'back') {
            selectedCamera = videoDevices.find(device => device.label.toLowerCase().includes('back'));
        }

        if (!selectedCamera) {
            selectedCamera = videoDevices[0]; // Use the first available camera if no front/back camera is found
        }

        if (selectedCamera) {
            const constraints = {
                video: {
                    deviceId: selectedCamera.deviceId ? { exact: selectedCamera.deviceId } : undefined,
                    facingMode: camera
                }
            };

            navigator.mediaDevices.getUserMedia(constraints).then(stream => {
                videoStream = stream;
                const videoElement = document.getElementById('cameraPreview');
                videoElement.srcObject = stream;
                document.getElementById('takePictureButton').disabled = false; // Enable the button
            }).catch(err => {
                console.error("Camera access error:", err);
                alert("Unable to access the camera.");
            });
        } else {
            alert("No camera found.");
        }
    }).catch(err => {
        console.error("Error enumerating devices:", err);
        alert("Error accessing camera devices.");
    });
}

// Function to switch between front and back cameras
function switchCamera() {
    currentCamera = currentCamera === 'front' ? 'back' : 'front';
    startCamera(currentCamera);
}

// Function to start the timer
function startTimer() {
    if (isTimerRunning) return; // Prevent multiple timers from starting
    isTimerRunning = true;

    timerInterval = setInterval(() => {
        remainingTime--;
        document.getElementById('timer').innerText = remainingTime;

        if (remainingTime <= 0) {
            clearInterval(timerInterval);
            takePicture(); // Take a picture when timer ends
        }
    }, 1000);
}

// Function to take a picture
function takePicture() {
    if (photosTaken >= totalPhotos) {
        return; // Prevent taking more pictures than the selected count
    }

    // Start timer when the "Take Picture" button is clicked
    if (photosTaken === 0) {
        startTimer();
    }

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const videoElement = document.getElementById('cameraPreview');

    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;

    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    const imgData = canvas.toDataURL('image/png');
    photosTaken++;

    console.log(`Photo ${photosTaken} taken.`);

    if (photosTaken >= totalPhotos) {
        document.getElementById('takePictureButton').disabled = true; // Disable the button once all photos are taken
        document.getElementById('nextButton').disabled = false; // Enable the Next button
    }
}

// Function to go to the next page
function nextPage() {
    alert('Proceeding to the next page...');
    window.location.href = "nextStep.html"; // Update this to your next page URL
}

