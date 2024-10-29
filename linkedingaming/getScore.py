import cv2
import pytesseract
import os
import re
import sys

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
      print(matches)
      return matches
  else:
      pattern = r"(?i)(pinpoint)[\s\S]*?(\d{1})"
      matches = re.findall(pattern, extracted_text)
      if matches:
        print(matches)
        return matches
      else:
        print("Time not found in the image.")
        return []

if __name__ == '__main__':
    # Get the file paths from command-line arguments
    for image_path in sys.argv[1:]:
      findTime(image_path)
