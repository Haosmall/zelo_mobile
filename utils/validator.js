import * as Yup from 'yup';
export const loginValid = {
  initial: {
    username: '0987654321',
    password: '12345678',
  },
  validationSchema: Yup.object().shape({
    username: Yup.string().required('Tài khoản không được bỏ trống'),
    password: Yup.string().required('Mật khẩu không được bỏ trống'),
  }),
};

export const registerValid = {
  initial: {
    name: 'Nhật Hào',
    username: '0398765421',
    password: '12345678',
  },
  validationSchema: Yup.object().shape({
    name: Yup.string().required('Tên không được bỏ trống'),
    username: Yup.string().required('Tài khoản không được bỏ trống'),
    password: Yup.string().required('Mật khẩu không được bỏ trống'),
  }),
};

export const passwordValid = {
  initial: {
    username: '0398765421',
    password: '123456789',
    passwordConfirmation: '123456789',
  },
  validationSchema: Yup.object().shape({
    username: Yup.string().required('Tài khoản không được để trống'),
    password: Yup.string().required('Mật khẩu không được để trống'),
    passwordConfirmation: Yup.string()
      .required('Không được để trống')
      .oneOf([Yup.ref('password'), null], 'Mật khẩu không khớp'),
  }),
};

export const renameConversationValid = {
  initial: {
    name: '',
  },
  validationSchema: Yup.object().shape({
    name: Yup.string()
      .required('Không hợp lệ')
      .matches(/^(?!\s+$).+/, 'Không hợp lệ'),
  }),
};

export const validateUsername = userName => {
  let validate = {
    isEmail: false,
    isPhoneNumber: false,
  };

  if (!userName) return validate;
  const regexPhoneNumber = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;
  const regexEmail =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  validate.isPhoneNumber = regexPhoneNumber.test(userName);
  validate.isEmail = regexEmail.test(userName);

  return validate;
};
