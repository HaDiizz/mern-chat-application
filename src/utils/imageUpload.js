    export const imageUpload = async (images) => {
    let imgArr = [];
    for (const item of images) {
      const formData = new FormData();
  
      if (item.camera) {
        formData.append("file", item.camera);
      } else {
        formData.append("file", item);
      }
  
      formData.append("upload_preset", "gjdrzik6");
      formData.append("cloud_name", "dwiylz9ql");
  
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dwiylz9ql/upload",
        {
          method: "POST",
          body: formData,
        }
      );
  
      const data = await res.json();
      imgArr.push({ public_id: data.public_id, url: data.secure_url });
    }
    return imgArr;
  };