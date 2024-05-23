// Hàm validateEmail kiểm tra một email đầu vào có phải là email hay không
exports.validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(/^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,12})(\.[a-z]{2,12})?$/);
};
  

// Hàm validateLength kiểm tra chuỗi đầu vào có đạt được độ dài tối thiểu và tối đa hay không
exports.validateLength = (text, min, max) => {
    if (text.length > max || text.length < min) {
      return false;
    }
    return true;
};
  
  