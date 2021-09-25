// import {StatusBar} from 'expo-status-bar';
import {Formik} from 'formik';
import React from 'react';
import {KeyboardAvoidingView, StyleSheet, Text, View} from 'react-native';
import {Button} from 'react-native-elements';
import Spinner from 'react-native-loading-spinner-overlay';
import {useDispatch, useSelector} from 'react-redux';
import loginApi from '../api/loginApi';
import InputField from '../components/InputField';
import {setLoading} from '../redux/globalSlice';
import globalStyles from '../styles';
import {registerValid} from '../utils/validator';

const RegisterScreen = ({navigation}) => {
  const {isLoading} = useSelector(state => state.global);
  const dispatch = useDispatch();

  // const handleConfirmAccount = async (username, otp) => {
  // 	const response = await loginApi.confirmAccount({ username, otp });
  // 	return response;
  // };

  const handleRegister = async account => {
    const {username} = account;
    dispatch(setLoading(true));

    const response = await loginApi.register(account);

    if (response.data?.status) {
      const account = await loginApi.fetchUser(username);

      navigation.navigate('Xác nhận tài khoản', {
        account,
        // handleConfirmAccount: null,
      });
    } else {
      navigation.navigate('Xác nhận tài khoản', {
        // handleConfirmAccount,
        account,
      });
    }
    dispatch(setLoading(false));
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      {/* <StatusBar style="light" /> */}
      <Text style={styles.zelo}>Zelo</Text>
      <View style={styles.inputContainer}>
        <Spinner
          visible={isLoading}
          textContent={'Loading...'}
          textStyle={globalStyles.spinnerTextStyle}
        />
        <Formik
          initialValues={registerValid.initial}
          validationSchema={registerValid.validationSchema}
          onSubmit={values => handleRegister(values)}>
          {formikProps => {
            const {values, errors, handleChange, handleSubmit} = formikProps;
            return (
              <>
                <InputField
                  placeholder="Tên dầy đủ"
                  autoFocus
                  onChangeText={handleChange('name')}
                  value={values.name}
                  error={errors.name}
                />
                <InputField
                  placeholder="Email/số điện thoại"
                  onChangeText={handleChange('username')}
                  value={values.username}
                  error={errors.username}
                />

                <InputField
                  style={styles.input}
                  placeholder="Mật khẩu"
                  secureTextEntry={true}
                  onChangeText={handleChange('password')}
                  value={values.password}
                  error={errors.password}
                />

                <Button
                  title="Đăng ký"
                  style={styles.button}
                  onPress={handleSubmit}
                />
              </>
            );
          }}
        </Formik>
      </View>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // backgroundColor: "#0068FF",
    paddingTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zelo: {
    textAlign: 'center',
    color: '#0068FF',
    fontWeight: 'bold',
    fontSize: 80,
    // marginTop: 80,
    // marginBottom: 30,
  },

  inputContainer: {
    width: 300,
  },

  input: {
    // color: "white",
  },

  button: {
    marginTop: 20,
    marginHorizontal: 10,
  },

  forgotPassword: {
    marginTop: 20,
    marginHorizontal: 10,
    borderWidth: 0,
  },
});
