const dir = '/images/galleries'
const galleryContainer = '.galleryContainer'

/**
 * Initialize a new gallery in the container element.
 * The gallery is placed in a div with the class name of element.
 *
 * @param container - container for all galleries
 * @param element - class name of the div that will host the gallery to be initialized
 * @param imageUrls - images for the gallery
 */
const initGallery = (container, element, imageUrls) => {
  // Not sure Galleria can handle more than one instance on a page,
  // so creating a new function scope.
  (function isolateScope($, container, element, imageUrls) {
    $(container).append(
      "<div class='gallery galleria " + element + "' id='" + element + "'></div>",
    );
    imageUrls.forEach(imgUrl => {
      $('#' + element).append(
        "<img class='galler galleryImage' src='" + imgUrl + "'/>"
      )
    });
    Galleria.loadTheme(
      '/scripts/lib/galleria-1.6.1/themes/classic/galleria.classic.min.js',
    )
    $('#' + element).galleria();
  })($, container, element, imageUrls)
}

/**
 * Get all image urls in a folder and initialize a gallery in the elementName div.
 *
 * @param container
 * @param elementName
 * @param folderUrl
 * @param suffix
 */
const getImageUrls = (container, elementName, folderUrl, suffix) => {
  console.log('Creating gallery for ', elementName)
  $.ajax({
    url: folderUrl,
    success: function (data) {
      const imageUrls = []
      $(data)
        .find('a:contains(' + suffix + ')')
        .each(function () {
          let fileName = this.href
            .replace(window.location.host, '')
            .replace('http://', '')
            .replace('https://', '')
          imageUrls.push(fileName)
          // DEBUG: $(".directorySlider").append("<img src='" + filename + "'>");
        })
      initGallery(container, elementName, imageUrls) //
    },
  })
}

/**
 * Find all sub folders with galleries in them ('gallery_*')
 * and initialize one gallery for each.
 *
 * @param folderUrl
 */
const initializeGalleries = (container, folderUrl) => {
  $.ajax({
    url: folderUrl,
    success: function (data) {
      const galleryMatch = 'gallery_'
      $(data)
        .find('a:contains(' + galleryMatch + ')')
        .each(function () {
          let galleryFolderUrl = this.href
            .replace(window.location.host, '')
            .replace('http://', '')
            .replace('https://', '')
          const elementName = 'slider' + galleryFolderUrl.replaceAll('/', '-')
          getImageUrls(container, elementName, galleryFolderUrl, 'jpg')
        })
    },
  })
}

/**
 * For each sub folder that starts with 'gallery_',
 * create a gallery on the page.
 */
$(document).ready(function () {
  initializeGalleries(galleryContainer, dir)
})
