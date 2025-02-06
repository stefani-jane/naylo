let selectedPictures = 0; // To store the selected number of pictures

// Function to select a row
function selectRow(row) {
    // Remove 'selected' class from all rows
    const rows = document.querySelectorAll('.row');
    rows.forEach(r => r.classList.remove('selected'));

    // Add 'selected' class to the clicked row
    row.classList.add('selected');

    // Set the number of pictures based on the selected row
    switch(row.textContent) {
        case "One":
            selectedPictures = 1;
            break;
        case "Two":
            selectedPictures = 2;
            break;
        case "Three":
            selectedPictures = 3;
            break;
        case "Four":
            selectedPictures = 4;
            break;
    }
}

// Function to go to the next page
function nextPage() {
    if (selectedPictures > 0) {
        // Pass the selected number of pictures as a URL parameter
        window.location.href = `nextPage.html?photoCount=${selectedPictures}`;
    } else {
        alert("Please select the number of pictures.");
    }
}
