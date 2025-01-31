const imageInput = document.getElementById('imageInput');
const uploadSection = document.getElementById('upload-section');
const processingSection = document.getElementById('processing-section');
const outputSection = document.getElementById('output-section');
const outputImage = document.getElementById('outputImage');
const dropZone = document.getElementById('dropZone');
const downloadLink = document.getElementById('downloadLink');
const downloadButton = document.getElementById('downloadButton');
const autoDownloadCheckbox = document.getElementById('autoDownload');

// Enable file input on click of the upload area
uploadSection.addEventListener('click', () => imageInput.click());

// Prevent default drag-and-drop behavior
dropZone.addEventListener('dragover', (event) => {
  event.preventDefault();
});

dropZone.addEventListener('drop', (event) => {
  event.preventDefault();
  const file = event.dataTransfer.files[0];
  if (file) {
    handleFile(file);
  }
});

// Handle file input change
imageInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    handleFile(file);
  }
});

// Process the file
async function handleFile(file) {
  // Show processing spinner
  uploadSection.classList.add('is-hidden');
  processingSection.classList.remove('is-hidden');

  try {
    const webpImage = await convertToWebP(file);
    displayWebPImage(webpImage, file.name);
  } catch (error) {
    alert('Error converting the image: ' + error.message);
    uploadSection.classList.remove('is-hidden');
  } finally {
    processingSection.classList.add('is-hidden');
    uploadSection.classList.remove('is-hidden'); // Bring back the upload section
    imageInput.value = ''; // Reset file input
  }
}

function convertToWebP(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = () => {
            const img = new Image();
            
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);

                // Convert to Blob instead of a base64 string
                canvas.toBlob((blob) => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(new Error('WebP conversion failed'));
                    }
                }, 'image/webp', 0.9);
            };
            
            img.src = reader.result;
        };
        
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
    });
}

function displayWebPImage(webpBlob, originalName) {
    const webpName = originalName.replace(/\.[^/.]+$/, '.webp'); // Rename file
    const webpUrl = URL.createObjectURL(webpBlob);

    downloadLink.href = webpUrl;
    downloadLink.download = webpName;
    outputImage.src = webpUrl;
    outputSection.classList.remove('is-hidden');

    if (autoDownloadCheckbox.checked) {
        downloadLink.click();
    }
}
