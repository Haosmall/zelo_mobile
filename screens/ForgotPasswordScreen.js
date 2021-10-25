// import {StatusBar} from 'expo-status-bar';
import {Formik} from 'formik';
import React from 'react';
import {Alert, KeyboardAvoidingView, StyleSheet, View} from 'react-native';
import {Button} from 'react-native-elements';
import Spinner from 'react-native-loading-spinner-overlay';
import {useDispatch, useSelector} from 'react-redux';
import {loginApi} from '../api';
import InputField from '../components/InputField';
import {setLoading} from '../redux/globalSlice';
import globalStyles from '../styles';
import {passwordValid} from '../utils/validator';

const ForgotPasswordScreen = ({navigation}) => {
  const {isLoading} = useSelector(state => state.global);
  const dispatch = useDispatch();

  const handleSendOTP = async account => {
    const {username} = account;
    dispatch(setLoading(true));

    try {
      const response = await loginApi.changePassword({username});
      console.log(response.data);

      const user = await loginApi.fetchUser(username);
      console.log(user);
      if (user.isActived) {
        navigation.navigate('Xác nhận', {account, isForgotPassword: true});
      } else {
        navigation.navigate('Xác nhận tài khoản', {
          account,
        });
      }
    } catch (error) {
      Alert.alert('Cảnh báo', 'Tài khoản không tồn tại');
    }

    // if (response.data) {
    //   Alert.alert('Cảnh báo', 'Tài khoản không tồn tại');
    // } else {
    //   const user = await loginApi.fetchUser(username);
    //   console.log(user);
    //   if (user.isActived) {
    //     navigation.navigate('Xác nhận', {account, isForgotPassword: true});
    //   } else {
    //     navigation.navigate('Xác nhận tài khoản', {
    //       account,
    //     });
    //   }
    // }

    dispatch(setLoading(false));
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      {/* <StatusBar style="light" /> */}
      <View style={styles.inputContainer}>
        <Spinner
          visible={isLoading}
          textContent={'Loading...'}
          textStyle={globalStyles.spinnerTextStyle}
        />

        <Formik
          initialValues={passwordValid.initial}
          validationSchema={passwordValid.validationSchema}
          onSubmit={values => handleSendOTP(values)}>
          {formikProps => {
            const {values, errors, handleChange, handleSubmit} = formikProps;
            return (
              <>
                <InputField
                  placeholder="Email/số điện thoại"
                  autoFocus
                  onChangeText={handleChange('username')}
                  value={values.username}
                  error={errors.username}
                />
                <InputField
                  placeholder="Mật khẩu"
                  onChangeText={handleChange('password')}
                  secureTextEntry={true}
                  value={values.password}
                  error={errors.password}
                />

                <InputField
                  style={styles.input}
                  placeholder="Nhập lại mật khẩu"
                  secureTextEntry={true}
                  onChangeText={handleChange('passwordConfirmation')}
                  value={values.passwordConfirmation}
                  error={errors.passwordConfirmation}
                />

                <Button
                  title="Gửi mã OTP"
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

export default ForgotPasswordScreen;

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
