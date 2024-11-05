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


module.exports = { insert, getById, update, remove}