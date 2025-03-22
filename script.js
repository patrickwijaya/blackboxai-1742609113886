// Elements
const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const fileList = document.getElementById('selected-files');
const uploadButton = document.getElementById('upload-button');
const statusMessage = document.getElementById('status-message');

// Prevent default drag behaviors
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, preventDefaults, false);
    document.body.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults (e) {
    e.preventDefault();
    e.stopPropagation();
}

// Highlight drop zone when item is dragged over it
['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, unhighlight, false);
});

function highlight(e) {
    dropZone.classList.add('border-blue-500');
}

function unhighlight(e) {
    dropZone.classList.remove('border-blue-500');
}

// Handle dropped files
dropZone.addEventListener('drop', handleDrop, false);

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
}

// Handle selected files
fileInput.addEventListener('change', function() {
    handleFiles(this.files);
});

function handleFiles(files) {
    fileList.innerHTML = ''; // Clear existing list
    Array.from(files).forEach(file => {
        const item = createFileListItem(file);
        fileList.appendChild(item);
    });
}

function createFileListItem(file) {
    const li = document.createElement('li');
    li.className = 'flex items-center justify-between bg-gray-50 p-3 rounded-lg';
    
    // File info
    const fileInfo = document.createElement('div');
    fileInfo.className = 'flex items-center';
    
    // Icon based on file type
    const icon = document.createElement('i');
    icon.className = getFileIcon(file.type);
    icon.className += ' text-gray-500 mr-3 text-xl';
    
    // File name and size
    const details = document.createElement('div');
    details.innerHTML = `
        <p class="text-sm font-medium text-gray-700">${file.name}</p>
        <p class="text-xs text-gray-500">${formatFileSize(file.size)}</p>
    `;
    
    fileInfo.appendChild(icon);
    fileInfo.appendChild(details);
    li.appendChild(fileInfo);
    
    return li;
}

function getFileIcon(mimeType) {
    if (mimeType.startsWith('image/')) return 'fas fa-image';
    if (mimeType.startsWith('video/')) return 'fas fa-video';
    if (mimeType.startsWith('audio/')) return 'fas fa-music';
    if (mimeType.includes('pdf')) return 'fas fa-file-pdf';
    if (mimeType.includes('word')) return 'fas fa-file-word';
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return 'fas fa-file-excel';
    return 'fas fa-file';
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Handle file upload
uploadButton.addEventListener('click', async () => {
    const files = fileInput.files;
    if (files.length === 0) {
        showStatus('Pilih file terlebih dahulu!', 'error');
        return;
    }

    // Simulate upload process
    uploadButton.disabled = true;
    uploadButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Mengupload...';
    
    try {
        // Simulate upload delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        showStatus('File berhasil diupload!', 'success');
        fileList.innerHTML = ''; // Clear file list
        fileInput.value = ''; // Reset file input
    } catch (error) {
        showStatus('Gagal mengupload file. Silakan coba lagi.', 'error');
    } finally {
        uploadButton.disabled = false;
        uploadButton.innerHTML = 'Upload File';
    }
});

function showStatus(message, type) {
    statusMessage.className = `mt-4 text-center p-3 rounded-lg ${
        type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
    }`;
    statusMessage.textContent = message;
    statusMessage.classList.remove('hidden');
    
    // Hide status message after 3 seconds
    setTimeout(() => {
        statusMessage.classList.add('hidden');
    }, 3000);
}