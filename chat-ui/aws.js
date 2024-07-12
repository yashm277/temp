document.getElementById('fileButton').addEventListener('click', openFileSelector);

async function openFileSelector() {
    // Create an input element of type 'file'
    const input = document.createElement('input');
    input.type = 'file';

    // Simulate a click on the input element
    input.click();

    // Handle the file selection asynchronously
    input.onchange = async () => {
        if (input.files.length > 0) {
            const file = input.files[0];
            console.log('File selected:', file.name);
            // You can now handle the file as needed, e.g., upload it or read its contents
            await handleFile(file);
        }
    };
}

async function handleFile(file) {
    // Example: Read the file contents as text
    const reader = new FileReader();
    reader.onload = function(event) {
        console.log('File contents:', event.target.result);
    };
    reader.readAsText(file);
}
