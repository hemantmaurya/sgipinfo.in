(function () {
    'use strict';

    var root = document.querySelector('[data-gallery-folder]');
    if (!root) {
        return;
    }

    var folder = root.getAttribute('data-gallery-folder');
    var images = JSON.parse(root.getAttribute('data-gallery-images') || '[]');
    var pageSize = 9;
    var currentPage = 1;
    var currentImage = 0;
    var slideshowTimer;
    var gallery = document.getElementById('categoryGallery');
    var pagination = document.getElementById('categoryPagination');
    var lightbox = document.getElementById('categoryLightbox');
    var lightboxImage = document.getElementById('categoryLightboxImage');
    var lightboxCaption = document.getElementById('categoryLightboxCaption');

    function pathFor(index) {
        return 'img/' + folder + '/' + images[index];
    }

    function labelFor(index) {
        return images[index].replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
    }

    function renderPagination() {
        var totalPages = Math.ceil(images.length / pageSize);
        var links = '';

        if (totalPages > 1) {
            links += '<li class="page-item ' + (currentPage === 1 ? 'disabled' : '') + '"><button class="page-link" type="button" data-page="' + (currentPage - 1) + '" aria-label="Previous page">&laquo;</button></li>';
            for (var page = 1; page <= totalPages; page += 1) {
                links += '<li class="page-item ' + (page === currentPage ? 'active' : '') + '"><button class="page-link" type="button" data-page="' + page + '">' + page + '</button></li>';
            }
            links += '<li class="page-item ' + (currentPage === totalPages ? 'disabled' : '') + '"><button class="page-link" type="button" data-page="' + (currentPage + 1) + '" aria-label="Next page">&raquo;</button></li>';
        }

        pagination.innerHTML = links;
        pagination.querySelectorAll('[data-page]').forEach(function (link) {
            link.addEventListener('click', function () {
                var requestedPage = Number(link.getAttribute('data-page'));
                if (requestedPage >= 1 && requestedPage <= totalPages && requestedPage !== currentPage) {
                    currentPage = requestedPage;
                    renderGallery();
                    window.scrollTo({ top: gallery.offsetTop - 100, behavior: 'smooth' });
                }
            });
        });
    }

    function renderGallery() {
        if (!images.length) {
            gallery.innerHTML = '<div class="col-12"><div class="category-gallery-empty">Photos will appear here soon.</div></div>';
            pagination.innerHTML = '';
            return;
        }

        var start = (currentPage - 1) * pageSize;
        var end = Math.min(start + pageSize, images.length);
        var cards = '';

        for (var index = start; index < end; index += 1) {
            cards += '<div class="col-lg-4 col-md-6">' +
                '<button class="course-item bg-light category-gallery-card border-0 w-100 p-0" type="button" data-image-index="' + index + '">' +
                '<div class="position-relative overflow-hidden"><img src="' + pathFor(index) + '" alt="' + root.getAttribute('data-gallery-title') + ': ' + labelFor(index) + '"></div>' +
                '<div class="card-caption px-3">' + labelFor(index) + '</div>' +
                '</button>' +
                '</div>';
        }

        gallery.innerHTML = cards;
        gallery.querySelectorAll('[data-image-index]').forEach(function (card) {
            card.addEventListener('click', function () {
                openLightbox(Number(card.getAttribute('data-image-index')));
            });
        });
        renderPagination();
    }

    function showImage(index) {
        currentImage = (index + images.length) % images.length;
        lightboxImage.src = pathFor(currentImage);
        lightboxImage.alt = root.getAttribute('data-gallery-title') + ': ' + labelFor(currentImage);
        lightboxCaption.textContent = (currentImage + 1) + ' of ' + images.length + ' - ' + labelFor(currentImage);
    }

    function startSlideshow() {
        window.clearInterval(slideshowTimer);
        slideshowTimer = window.setInterval(function () {
            showImage(currentImage + 1);
        }, 5000);
    }

    function openLightbox(index) {
        if (!images.length) {
            return;
        }
        showImage(index);
        lightbox.classList.add('is-open');
        document.body.style.overflow = 'hidden';
        startSlideshow();
    }

    function closeLightbox() {
        lightbox.classList.remove('is-open');
        document.body.style.overflow = '';
        window.clearInterval(slideshowTimer);
    }

    function loadManifest() {
        if (window.location.protocol === 'file:') {
            return Promise.resolve();
        }

        return fetch('gallery-manifest.json', { cache: 'no-store' })
            .then(function (response) {
                if (!response.ok) {
                    throw new Error('Gallery manifest unavailable');
                }
                return response.json();
            })
            .then(function (manifest) {
                if (Array.isArray(manifest[folder])) {
                    images = manifest[folder];
                }
            })
            .catch(function () {
                // Keep the inline list when the JSON file is unavailable.
            });
    }

    document.getElementById('categoryPrevious').addEventListener('click', function () {
        showImage(currentImage - 1);
        startSlideshow();
    });
    document.getElementById('categoryNext').addEventListener('click', function () {
        showImage(currentImage + 1);
        startSlideshow();
    });
    document.getElementById('categoryClose').addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function (event) {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });
    document.addEventListener('keydown', function (event) {
        if (!lightbox.classList.contains('is-open')) {
            return;
        }
        if (event.key === 'Escape') {
            closeLightbox();
        } else if (event.key === 'ArrowLeft') {
            showImage(currentImage - 1);
            startSlideshow();
        } else if (event.key === 'ArrowRight') {
            showImage(currentImage + 1);
            startSlideshow();
        }
    });

    loadManifest().then(function () {
        renderGallery();
        if (images.length) {
            openLightbox(Math.floor(Math.random() * images.length));
        }
    });
}());
