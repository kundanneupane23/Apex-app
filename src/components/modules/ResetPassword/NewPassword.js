/**
 * This is one of three screens for signup. It contains a form for filling up user's information.
 * @param {Object} props.navigation - contains all the propeties of react navigation.
 * @returns {NewPassword}- returns a module for Register.
 */
import {Image, Text, View, TouchableOpacity} from 'react-native';
import CustomButton from '@elements/CustomButton';
import CustomTextInput from '@elements/CustomTextInput';
import React, {useEffect} from 'react';
import styles from '@styles/modules/ResetPassword/NewPassword.scss';

const NewPassword = props => {
  const handleNewPassChange = () => {
    props.navigation.navigate('Reset');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleNewPassChange} style={styles.left}>
        <Image source={require('@assets/images/leftArrow.png')} />
      </TouchableOpacity>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>Enter New Password</Text>
      </View>

      <View style={styles.formContainer}>
        <CustomTextInput
          onChange={() => {}}
          placeholder="Password"
          hidden={true}
        />
        <CustomTextInput
          onChange={() => {}}
          placeholder="Confirm Password"
          hidden={true}
        />
      </View>

      <CustomButton
        type="theme"
        title={'Change Password'}
        style={styles.signUp}
        onPress={handleNewPassChange}
      />
    </View>
  );
};

export default NewPassword;
