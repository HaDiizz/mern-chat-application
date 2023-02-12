const valid = ({ password, username, avatar }) => {
    const err = {};
  
    if (!username) {
      err.username = "กรุณากรอกชื่อ username ของคุณ";
    } else if (username.replace(/ /g, "").length > 20) {
      err.username = "username ของคุณมีความยาวเกิน 20 ตัวอักษร";
    }
  
    if (!password) {
      err.password = "กรุณากรอกรหัสผ่านของคุณ";
    } else if (password.length < 6) {
      err.password = "รหัสผ่านของคุณมีความยาวไม่ถึง 6 ตัวอักษร";
    }
  
    if (avatar) { //1 MB
      if (avatar.size > 1024 * 1024){
        err.avatar = "ขนาดไฟล์เกิน 1 MB";
      }
      if (avatar.type !== "image/jpeg" && avatar.type !== "image/png") {
        err.avatar = "Format ไฟล์ต้องเป็น png/jpeg"
      }
    }
  
    return {
      errMsg: err,
      errLength: Object.keys(err).length,
    };
  };
  
  export default valid;