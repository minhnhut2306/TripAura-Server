const imageModule = require('../modules/ImageModle')

const insert = async (linkImage, tourId) => {
    try {
      const image = new imageModule({ linkImage, tourId });
      await image.save();
      return image;
    }
    catch (error) {
      console.log(error);
    }
  }

  const getById = async (tourId) => {
    try {
      const image = await imageModule.find({ tourId: tourId });
      return image;
    }
    catch (error) {
      console.log(error);
    }
  }

module.exports ={insert, getById}