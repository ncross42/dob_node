$('#frm_login').validate({
  // debug: true,  
  onkeyup: false,
  submitHandler: function () {
    return true;
  },
  rules: {
    username: {
      required: true,
      minlength: 4
    },
    password: {
      required: true,
      minlength: 4,
      remote: {
        url: '/api/v1/login',
        type: 'get',
        data: {
          username: function () {
            return $('#username').val();
          }
        },
        dataFilter: function (raw) {
          var data = JSON.parse(raw);
          if (data.success) {
            return true
          } else {
            return "\"" + data.msg + "\"";
          }
        }
      }
    }
  }
});