document.addEventListener("DOMContentLoaded", () => {

  const token = localStorage.getItem("jwtToken");

  // If token does not exist, redirect to the login page
  if (!token) {
    alert("Unauthorized! Please log in first.");
    window.location.href = "index.html"; // Redirect to login page
  }
    // Retrieve note data from localStorage
    let foldersData = JSON.parse(localStorage.getItem("foldersData")) || [];
    let currentFolderIndex = parseInt(localStorage.getItem("currentFolderIndex"));
    let currentNoteIndex = parseInt(localStorage.getItem("currentNoteIndex"));
  
    // If data is missing, go back to home
    if (!foldersData.length || isNaN(currentFolderIndex) || isNaN(currentNoteIndex)) {
      window.location.href = "home.html";
    }
  
    // DOM elements
    const editorContent = document.getElementById("editorContent");
    const saveEditorBtn = document.getElementById("saveEditorBtn");
    const backToHomeBtn = document.getElementById("backToHomeBtn");
    const imageUploadBtn = document.getElementById("imageUploadBtn");
    const imageUploadInput = document.getElementById("imageUploadInput");
  
    // Load current note content into editor
    let currentNote = foldersData[currentFolderIndex].notes[currentNoteIndex];
    editorContent.innerHTML = currentNote.content;
  
    // Handle toolbar formatting buttons
    document.querySelectorAll(".toolbar-btn[data-command]").forEach((button) => {
      button.addEventListener("click", () => {
        const command = button.getAttribute("data-command");
        document.execCommand(command, false, null);
      });
    });
  
    // Image upload
    imageUploadBtn.addEventListener("click", () => {
      imageUploadInput.click();
    });
    imageUploadInput.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
          // Insert the image as a base64 string
          document.execCommand("insertImage", false, e.target.result);
        };
        reader.readAsDataURL(file);
      }
    });
  
    // Save button
    saveEditorBtn.addEventListener("click", async () => {
      const token = localStorage.getItem("jwtToken"); // Retrieve JWT token
      if (!token) {
        console.error("No JWT token found.");
        alert("Authentication error. Please log in again.");
        return;
      }
    
      // Retrieve contentId from localStorage
      const contentId = localStorage.getItem("currentContentId");
      if (!contentId) {
        console.error("No content ID found.");
        alert("Error: Content ID is missing.");
        return;
      }
    
      // Prepare the updated note data
      const updatedNote = {
        noteName: currentNote.title, // Keep title unchanged
        noteFolder: foldersData[currentFolderIndex].name, // Folder name
        noteKeywords: currentNote.keywords, // Keywords
        noteMainContent: editorContent.innerHTML, // Updated content
      };
    
      try {
        // Send the updated note to the API
        // const response = await fetch(`http://127.0.0.1:8080/api/notes/updatenote/${contentId}`, {
        const response = await fetch(`${API_BASE_URL}/api/notes/updatenote/${contentId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Pass JWT token
          },
          body: JSON.stringify(updatedNote), // Convert data to JSON
        });
    
        if (!response.ok) {
          throw new Error(`Failed to update note: ${response.statusText}`);
        }
    
        console.log("Note successfully updated!");
    
        // Update localStorage
        currentNote.content = updatedNote.noteMainContent;
        foldersData[currentFolderIndex].notes[currentNoteIndex] = currentNote;
        localStorage.setItem("foldersData", JSON.stringify(foldersData));
    
        alert("Note updated successfully!");
      } catch (error) {
        console.error("Error updating note:", error);
        alert("Failed to update note. Please try again.");
      }
    });
    // Back to Home
    backToHomeBtn.addEventListener("click", () => {
      window.location.href = "home.html";
    });
  });
  