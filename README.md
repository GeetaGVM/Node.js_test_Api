# **QR Code Generator, Decoder & Text to PDF Maker**

This project provides three main functionalities:

1. **Text to QR Code**: Convert text into a QR code and save it as a PNG file.  
2. **QR Code to Text**: Decode a QR code image file and extract the embedded text.  
3. **Text to PDF**: Convert plain text into a PDF document and save it on the system.  
   The project is built using Node.js with the following libraries:  
* `sharp` for image processing.  
* `qrcode-reader` for QR code decoding.  
* `qrcode` for generating QR codes.  
* `pdf-lib` for generating PDFs.

## **Installation**

1. Clone the repository:  
   `git clone https://github.com/your-username/qrcode-pdf-generator.git`

   

2. Navigate to the project directory:  
   `cd qrcode-pdf-generator`

   

3. Install the necessary dependencies:  
   `npm install`  
   This will install the required packages including `sharp`, `qrcode-reader`, `qrcode`, `pdf-lib`, and `express`.

## 

## 

## **Usage**

### **Text to QR Code**

To generate a QR code from text, send a POST request to the `/generate-qrcode` endpoint. The generated QR code image will be saved in the **Downloads** folder.

#### **Request**

* **Method**: POST  
* **Endpoint**: `/generate-qrcode`  
* **Body** (JSON):  
  `{`  
    `"text": "Your text here"`  
  `}`


####  **`Response`**

**`Success`** `(200 OK):`  
`{`

  `"imagePath": "/Users/username/Downloads/qr-1627555555555.png"`

`}`

**`Error`**`:`

* `If text is not provided, you will get a 400 status with an error message:`  
  `{`  
    `"error": "Text is required!"`  
  `}`  
  


### **`QR Code to Text`**

`To decode a QR code from an image file, send a POST request to the /decode-qrcode endpoint. The image should be provided via a file upload.`

#### **`Request`**

* **`Method`**`: POST`  
* **`Endpoint`**`: /decode-qrcode`  
* **`Body`** `(multipart/form-data):`  
  * `file: The uploaded QR code image file (e.g., uploaded-image.png).`

#### **`Response`**

* **`Success`** `(200 OK):`  
  `{ "decodedText": "The decoded content of the QR code" }`

**`Error`**`:`

* `If the file is not found, you will get a 400 status with an error message:`  
  `{`  
    `"error": "File does not exist"`  
  `}`

* `If the image can't be decoded as a valid QR code, you will get a 400 status with an error message:`  
  `{`  
    `"error": "Failed to decode the QR code"`  
  `}`

### **`Text to PDF`**

`To convert plain text into a PDF document, send a POST request to the /text-to-pdf endpoint. The generated PDF will be saved in the Downloads folder.`

#### **`Request`**

* **`Method`**`: POST`  
* **`Endpoint`**`: /text-to-pdf`

**`Body`** `(JSON):`

	`{`

  `"text": "This is the text that will appear in the PDF document."`

`}`

#### **`Response`**

* **`Success`** `(200 OK):`  
  `{`  
    `"message": "PDF generated successfully.",`  
    `"filePath": "/Users/username/Downloads/generated-pdf.pdf"`  
  `}`

**`Error`**`:`

* `If text is not provided, you will get a 400 status with an error message:`  
  `{`  
    `"error": "Text is required to generate a PDF!"`  
  `}`

## **`API Endpoints`**

### **`/generate-qrcode`**

`Generates a QR code from the provided text and saves it as a PNG image in the Downloads folder.`

* **`Method`**`: POST`  
* **`Request body`**`:`  
  `{`  
    `"text": "Your text here"`  
  `}`  
* **`Response`**`:`  
  `{`

  	`"imagePath": "/Users/username/Downloads/qr-1627555555555.png"`

`}`

### **`/decode-qrcode`**

`Decodes a QR code from an image file and returns the decoded text.`

* **`Method`**`: POST`  
* **`Request body`** `(multipart/form-data):`  
  * `file: The QR code image file.`

    	  
* **`Response`**`:`  
  `{`  
    `"decodedText": "The decoded content of the QR code"`  
  `}`


### **`/text-to-pdf`**

`Converts the provided text into a PDF document and saves it in the Downloads folder.`

* **`Method`**`: POST`  
  **`Request body`**`:`

  `{`  
    `"text": "This is the text that will appear in the PDF document."`  
  `}`  
* **`Response`**`:`  
  `{`  
    `"message": "PDF generated successfully.",`  
    `"filePath": "/Users/username/Downloads/generated-pdf.pdf"`  
  `}`  