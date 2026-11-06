const galleryImages = [
    {
        thumbnail: "images/gallery/thumbnails/photo1.webp",
        full: "images/gallery/full/photo1.webp",
        alt: "semi-truck frame"
    },
    {
        thumbnail: "images/gallery/thumbnails/photo2.webp",
        full: "images/gallery/full/photo2.webp",
        alt: "dump lift"
    },
    {
        thumbnail: "images/gallery/thumbnails/photo3.webp",
        full: "images/gallery/full/photo3.webp",
        alt: "black lo-boy"
    },
    {
        thumbnail: "images/gallery/thumbnails/photo4.webp",
        full: "images/gallery/full/photo4.webp",
        alt: "sandblasting tracks"
    },
    {
        thumbnail: "images/gallery/thumbnails/photo5.webp",
        full: "images/gallery/full/photo5.webp",
        alt: "sandblasting semi-truck frame"
    },
    {
        thumbnail: "images/gallery/thumbnails/photo6.webp",
        full: "images/gallery/full/photo6.wepb",
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
let previouslyFocusedElement = null;
let touchStartX = 0;
let touchEndX = 0;

function renderGallery() {
    const nextImages = galleryImages.slice(
        displayedImages,
        displayedImages + imagesPerPage
    );

    const startIndex = displayedImages;

    nextImages.forEach((image, index) => {
        const galleryItem = document.createElement("button");
        galleryItem.classList.add("gallery-item");
        galleryItem.type = "button";

        const img = document.createElement("img");
        img.src = image.thumbnail;
        img.alt = image.alt;
        galleryItem.setAttribute("aria-label", `View ${image.alt}`);
        img.alt = "";
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
    previouslyFocusedElement = document.activeElement;
    
    currentImageIndex = index;

    lightboxImg.src = galleryImages[currentImageIndex].full;
    lightboxImg.alt = galleryImages[currentImageIndex].alt;

    lightbox.classList.add("active");
    lightbox.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";

    closeBtn.focus();
}

function closeLightbox() {
    lightbox.classList.remove("active");
    lightbox.setAttribute("aria-hidden", "true");
    
    document.body.style.overflow = "";

    if (previouslyFocusedElement) {
        previouslyFocusedElement.focus();
    }
}

closeBtn.addEventListener("click", () => {
    console.log("Close button clicked");
    closeLightbox();
});

function changeImage(direction) {
    currentImageIndex =
        (currentImageIndex + direction + galleryImages.length) %
        galleryImages.length;

    lightboxImg.src = galleryImages[currentImageIndex].full;
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

    if (e.key === "Tab") { 
        const focusableElements = [
            clostBtn,
            prevBtn,
            nextBtn       
        ];

        const currentIndex = focusableElements.indexOf(
            document.activeElement
        );

        e.preventDefault();

        let nextIndex;

        if (e.shiftKey) {
            nextIndex = (currentIndex - 1 + focusableElements.length)
                % focusableElements.length;
        } else {
            nextIndex = (currentIndex + 1)
            % focusableElements.length;
        }

        focusableElements[nextIndex].focus();
    }
});

lightboxImg.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

lightboxImg. addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;

    const swipeDistance = touchEndX - touchStartX;

    if (Math.abs(swipeDistance) > 50) {
        if (swipeDistance < 0) {
            changeImage(1);
        } else {
            changeImage(-1);
        }
    }
}, { passive: true });

renderGallery();