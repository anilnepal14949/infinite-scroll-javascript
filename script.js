const imageContainer = document.getElementById('image-container');
const loader = document.getElementById('loader');

let ready = false;
let imagesLoaded = 0;
let totalImages = 0;
let photosArray = [];
let isInitialLoad = true;

// Unsplash API
const initialCount = 15;
const imageCategory = 'Electronics';

const API_KEY = 'jSLokxVyURUEn03vnaJZcCylwgZyjEUFOBG1eE0zvMc';
let apiURL = `https://api.unsplash.com/photos/random/?client_id=${API_KEY}&query=${imageCategory}&count=${initialCount}`;

// update api url after initial load
function updateAPIURLWithNewCount(picCount) {
    apiURL = `https://api.unsplash.com/photos/random/?client_id=${API_KEY}&count=${picCount}`;
}

// check if all images are loaded
function imageLoaded() {
    imagesLoaded++;
    if(imagesLoaded === totalImages) {
        ready = true;
        loader.hidden = true;
    } else {
        loader.hidden = false;
    }
}

// Helper function to Set Attributes on DOM Elements
function setAttributes(element, attributes) {
    for (const key in attributes) {
        element.setAttribute(key, attributes[key]);
    }
}

// Create elements for links & photos, Add to DOM
function displayPhotos() {
    // count all images
    totalImages += photosArray.length;
    // Run function for each object in photosArray
    photosArray.forEach((photo) => {
        // Create <a> to link to unsplash
        const item = document.createElement('a');
        setAttributes(item, {
            href: photo.links.html,
            target: '_blank'
        });

        // Create <img> for photo
        const img = document.createElement('img');
        setAttributes(img, {
            src: photo.urls.regular,
            alt: photo.alt_description,
            title: photo.alt_description
        });
        // Event listener, check when each is finished loading
        img.addEventListener('load', imageLoaded);

        // Put <img> inside <a>, then put both inside imageContainer Element
        item.appendChild(img);
        imageContainer.appendChild(item);
    });
}

// Get photos from Unsplash API 
async function getPhotos() {
    try {
        const response = await fetch(apiURL);
        photosArray = await response.json();
        displayPhotos();
        if(isInitialLoad) {
            updateAPIURLWithNewCount(30);
            isInitialLoad = false;
        }
    } catch(error) {
        console.log(error);
    }
}

// Check to see if scrolling near bottom of page, load more photos
window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 && ready) {
        ready = false;
        getPhotos();
    }
});

// On Load
getPhotos();