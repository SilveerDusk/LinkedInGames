import cv2
import pytesseract
import os
import re

def findTime(image_path):
  # Load the image using OpenCV
  img = cv2.imread(image_path)

  # Preprocess the image (convert to grayscale and apply thresholding)
  gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
  _, thresh = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY_INV)

  # Use pytesseract to extract text from the image
  extracted_text = pytesseract.image_to_string(thresh)

  #print("Extracted text:", extracted_text)

  # Optional: Post-process the extracted text to find the time string
  pattern = r"(?i)(tango|queens|crossclimb)[\s\S]*?(\d{1,2}:\d{2})"
  matches = re.findall(pattern, extracted_text)

  if matches:
      print("Time found:", matches)
  else:
      pattern = r"(?i)(pinpoint)[\s\S]*?(\d{1})"
      matches = re.findall(pattern, extracted_text)
      if matches:
        print("Time found:", matches)
      else:
        print("Time not found in the image.")

# Loop through the files in the public folder
public_folder = "./public"
for filename in os.listdir(public_folder):
  if filename.endswith(".jpeg") or filename.endswith(".jpg"):
    image_path = os.path.join(public_folder, filename)
    findTime(image_path)
