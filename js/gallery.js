const galleryImages = [
    {
        src: "images/gallery/photo1.jpg",
        alt: "semi-truck frame"
    },
    {
        src: "images/gallery/photo2.jpg",
        alt: "dump lift"
    },
    {
        src: "images/gallery/photo3.jpg",
        alt: "black lo-boy"
    },
    {
        src: "images/gallery/photo4.jpg",
        alt: "sandblasting tracks"
    },
    {
        src: "images/gallery/photo5.jpg",
        alt: "sandblasting semi-truck frame"
    },
    {
        src: "images/gallery/photo6.jpg",
        alt: "sandblasting dump truck frame"
    }
];

const galleryGrid = document.getElementById("gallery-grid");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const closeBtn = document.getElementById("lightbox-close");
const prevBtn = document.getElementById("lightbox-prev");
const nextBtn = document.getElementById("lightbox-next");
const loadMoreBtn = document.getElementById("load-more-btn");

const imagesPerPage = 12;
let displayedImages = 0;
let currentImageIndex = 0;

function renderGallery() {
    const nextImages = galleryImages.slice(
        displayedImages,
        displayedImages + imagesPerPage
    );

    const startIndex = displayedImages;

    nextImages.forEach((image, index) => {
        const galleryItem = document.createElement("div");
        galleryItem.classList.add("gallery-item");

        const img = document.createElement("img");
        img.src = image.src;
        img.alt = image.alt;
        img.loading = "lazy";

        galleryItem.addEventListener("click", () => {
            openLightbox(startIndex + index);
        });
       
        galleryItem.appendChild(img);
        galleryGrid.appendChild(galleryItem);
    });
    
    displayedImages += nextImages.length;

    if (displayedImages >= galleryImages.length) {
        loadMoreBtn.style.display = "none";
    }
}

loadMoreBtn.addEventListener("click", renderGallery);

function openLightbox(index) {
    currentImageIndex = index;

    lightboxImg.src = galleryImages[currentImageIndex].src;
    lightboxImg.alt = galleryImages[currentImageIndex].alt;

    lightbox.classList.add("active");
    lightbox.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";
}

function closeLightbox() {
    lightbox.classList.remove("active");
    lightbox.setAttribute("aria-hidden", "true");
    
    document.body.style.overflow = "";
}

closeBtn.addEventListener("click", () => {
    console.log("Close button clicked");
    closeLightbox();
});

function changeImage(direction) {
    currentImageIndex =
        (currentImageIndex + direction + galleryImages.length) %
        galleryImages.length;

    lightboxImg.src = galleryImages[currentImageIndex].src;
    lightboxImg.alt = galleryImages[currentImageIndex].alt;
}

prevBtn.addEventListener("click", () => {
    console.log("Previous clicked");
    changeImage(-1);
});

nextBtn.addEventListener("click", () => {
    console.log("Next clicked");
    changeImage(1);
});

lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("active")) return;

    if (e.key === "Escape") {
        closeLightbox();
    }

    if (e.key === "ArrowRight") {
        changeImage(1);
    }

    if (e.key === "ArrowLeft") {
        changeImage(-1);
    }
});

renderGallery();