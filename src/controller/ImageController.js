const imageModule = require('../modules/ImageModle')
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dtoazwcfd',
  api_key: '976765598717887',
  api_secret: 'MM8f0UKOYIKke1JtCookDu0DpmU'
})

const uploadFile = async (filePath) => {
  console.log(filePath);

  try {
    const result = await cloudinary.uploader.upload(filePath);
    console.log(result);

    return result

  } catch (error) {
    console.log(error);
  }
}

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

const update = async (imageId, linkImage, tourId) => {
  try {
    const data = await imageModule.findByIdAndUpdate(imageId, {
      linkImage, tourId
    }, {
      new: true
    });
    return data;
  } catch (error) {
    console.log(error);
  }

}
const remove = async (imageId) => {
  try {
    const deleteimage = await imageModule.findByIdAndDelete(imageId);
    return deleteimage;
  } catch (error) {
    console.log(error);

  }
}


module.exports = { insert, getById, update, remove, uploadFile }