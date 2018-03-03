/**
 */
class RasterOperations {

  /**
   * Return inverted image
   */
  static invertColor = pixels => pixels[0]
    .map((p, idx) => {
      return idx === 3 ? 256 : 256 - p;
    });


  /**
   * 
   */
  static edge(inputs) {
    const mapImage = inputs[0];
    const width = mapImage.width;
    const height = mapImage.height;

    const kernel = [-1, -1, -1, -1, -8, -1, -1, -1, -1];

    // eslint-disable-next-line
    const outputImage = convolve(mapImage, kernel);

    return {
      data: outputImage,
      width,
      height
    };
  }

  /**
   * Emboss filter
   */
  static emboss(inputs) {
    const mapImage = inputs[0];
    const width = mapImage.width;
    const height = mapImage.height;

    const kernel =
        [-2, -1, 0,
          -1, 1, 1,
          0, 1, 2];

    // eslint-disable-next-line
    const outputImage = convolve(mapImage, kernel);

    return {
      data: outputImage,
      width,
      height
    };
  }

  /**
   * Image sharpening
   */
  static sharpen(inputs) {
    const mapImage = inputs[0];
    const width = mapImage.width;
    const height = mapImage.height;

    const kernel =
        [0, -1, 0,
          -1, 5, -1,
          0, -1, 0];

    // eslint-disable-next-line
    const outputImage = convolve(mapImage, kernel);

    return {
      data: outputImage,
      width,
      height
    };
  }

  /**
   * Sobel operator horizontal
   */
  static sobelHoriz(inputs) {
    const mapImage = inputs[0];
    const width = mapImage.width;
    const height = mapImage.height;

    const kernel =
        [-1, -2, -1,
          0, 0, 0,
          1, 2, 1];

    // eslint-disable-next-line
    const outputImage = convolve(mapImage, kernel);

    return {
      data: outputImage,
      width,
      height
    };
  }

  /**
   * Sobel operator vertical
   */
  static sobelVert(inputs) {
    const mapImage = inputs[0];
    const width = mapImage.width;
    const height = mapImage.height;

    const kernel =
          [-1, 0, 1,
            -2, 0, 2,
            -1, 0, -1];

    // eslint-disable-next-line
    const outputImage = convolve(mapImage, kernel);

    return {
      data: outputImage,
      width,
      height
    };
  }

  /**
   * canny edge detection
   */
  static canny(inputs) {
    const mapImage = inputs[0];
    const width = mapImage.width;
    const height = mapImage.height;

    const kernel =
        [1, 2, 1,
          2, 4, 2,
          1, 2, 1];

    // eslint-disable-next-line
    const outputImage = convolve(mapImage, kernel);

    return {
      data: outputImage,
      width,
      height
    };
  }

  /**
   * gaussian blur
   */
  static gaussianBlur(inputs) {
    const mapImage = inputs[0];
    const width = mapImage.width;
    const height = mapImage.height;

    const kernel =
        [0, 0, 0, 5, 0, 0, 0,
          0, 5, 18, 32, 18, 5, 0,
          0, 18, 64, 100, 64, 18, 0,
          5, 32, 100, 100, 100, 32, 5,
          0, 18, 64, 100, 64, 18, 0,
          0, 5, 18, 32, 18, 5, 0,
          0, 0, 0, 5, 0, 0, 0];

    // eslint-disable-next-line
    const outputImage = convolve(mapImage, kernel);

    return {
      data: outputImage,
      width,
      height
    };
  }

  /**
   * apply Laplacian of Gaussian to image
   */
  static log(inputs) {
    const mapImage = inputs[0];
    const width = mapImage.width;
    const height = mapImage.height;

    const kernel =
      [0, 0, -1, 0, 0,
        0, -1, -2, -1, 0,
        -1, -2, 16, -2, -1,
        0, -1, -2, -1, 0,
        0, 0, -1, 0, 0];

    // eslint-disable-next-line
    const outputImage = convolve(mapImage, kernel);

    return {
      data: outputImage,
      width,
      height
    };
  }

  /**
   * convolve image
   */
  static convolve(mapImage, convMatrix) {
    const width = mapImage.width;
    const height = mapImage.height;
    const imageData = mapImage.data;

    const dim = Math.sqrt(convMatrix.length);
    const pad = Math.floor(dim / 2);

    if (dim % 2 !== 1) {
      return new RangeError('Invalid kernel dimension');
    }

    // eslint-disable-next-line
    const outputImage = new Uint8ClampedArray(imageData.length);
    for (let row = pad; row <= height; row++) {
      for (let col = pad; col <= width; col++) {
        let r = 0;
        let g = 0;
        let b = 0;

        for (let dx = -pad; dx <= pad; dx++) {
          for (let dy = -pad; dy <= pad; dy++) {
            const i = (dy + pad) * dim + (dx + pad); // kernel index
            let pix = 4 * ((row + dy) * width + (col + dx)); // image index
            r += imageData[pix++] * convMatrix[i];
            g += imageData[pix++] * convMatrix[i];
            b += imageData[pix] * convMatrix[i];
          }
        }

        let pix = 4 * ((row - pad) * width + (col - pad)); // destination index
        outputImage[pix++] = (r + .5) ^ 0;
        outputImage[pix++] = (g + .5) ^ 0;
        outputImage[pix++] = (b + .5) ^ 0;
        outputImage[pix] = 255; // we want an opaque image
      }
    }
    return outputImage;
  }

}

export default RasterOperations;
