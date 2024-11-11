import fs from "fs";

const filePath = "./data.json";

// Function to append data to data.json
export function appendDataToFile(data) {
    fs.readFile(filePath, "utf8", (readError, fileContent) => {
      if (readError) {
        console.error("Error reading data.json:", readError);
        return;
      }
  
      let existingData;
      try {
        existingData = JSON.parse(fileContent);
      } catch (parseError) {
        console.error("Error parsing JSON:", parseError);
        return;
      }
  
      // Ensure it's an array (just in case)
      if (!Array.isArray(existingData)) {
        console.error("data.json is not an array");
        return;
      }
  
      // Append the new data
      existingData.push(data);
  
      // Write the updated data back to data.json
      fs.writeFile(filePath, JSON.stringify(existingData, null, 2), "utf8", (writeError) => {
        if (writeError) {
          console.error("Error writing to data.json:", writeError);
        } else {
          console.log("Data appended successfully to data.json");
        }
      });
    });
  }