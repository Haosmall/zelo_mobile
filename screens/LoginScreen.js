import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import {Formik} from 'formik';
import React, {useState} from 'react';
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
  StatusBar,
  Platform,
} from 'react-native';
import {Button} from 'react-native-elements';
import Spinner from 'react-native-loading-spinner-overlay';
import {useDispatch, useSelector} from 'react-redux';
import {loginApi, meApi} from '../api';
import InputField from '../components/InputField';
import {useKeyboardHeight} from '../hooks';
import {setLoading, setLogin} from '../redux/globalSlice';
import globalStyles from '../styles';
import {loginValid} from '../utils/validator';

const LoginScreen = ({navigation}) => {
  const {isLoading} = useSelector(state => state.global);
  const [errorMessage, setErrorMessage] = useState('');
  const dispatch = useDispatch();
  const keyboardHeight = useKeyboardHeight();

  const handleLogin = async acount => {
    errorMessage !== '' && setErrorMessage('');
    dispatch(setLoading(true));

    const response = await loginApi.login(acount);

    if (response.data) {
      setErrorMessage('Tài khoản hay mật khẩu không chính xác');
    } else {
      await AsyncStorage.setItem('token', response.token);
      const userProfile = await meApi.fetchProfile();
      await AsyncStorage.setItem('userId', userProfile._id);
      dispatch(setLogin(true));
    }

    dispatch(setLoading(false));
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <LinearGradient
        // Background Linear Gradient
        colors={['#257afe', '#00bafa']}
        style={{height: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight}}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}>
        <StatusBar
          translucent={true}
          backgroundColor={'transparent'}
          barStyle="light-content"
        />
      </LinearGradient>

      <Text style={styles.zelo}>Zelo</Text>
      <View style={styles.inputContainer}>
        <Spinner
          visible={isLoading}
          textContent={'Loading...'}
          textStyle={globalStyles.spinnerTextStyle}
        />
        <Formik
          initialValues={loginValid.initial}
          validationSchema={loginValid.validationSchema}
          onSubmit={values => handleLogin(values)}>
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
                  style={styles.input}
                  placeholder="Mật khẩu"
                  secureTextEntry={true}
                  onChangeText={handleChange('password')}
                  value={values.password}
                  error={errors.password}
                />
                <Text style={{color: 'red', marginLeft: 10}}>
                  {errorMessage}
                </Text>

                <Button
                  title="Đăng nhập"
                  style={styles.button}
                  onPress={handleSubmit}
                />
              </>
            );
          }}
        </Formik>

        <Button
          title="Đăng ký"
          type="outline"
          style={styles.button}
          onPress={() => navigation.navigate('Đăng ký')}
        />
        <Button
          title="Quên mật khẩu?"
          type="clear"
          style={styles.forgotPassword}
          onPress={() => navigation.navigate('Quên mật khẩu')}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#0068FF",
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
