import React, { Component } from 'react';
import { View, Text, ImageBackground, TouchableOpacity, Image, TextInput, Animated, Dimensions, Keyboard, Platform } from 'react-native';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/Ionicons';
import { Toast } from  'native-base';
import firebase from 'react-native-firebase';


const SCREEN_HEIGHT = Dimensions.get('window').height;
class LoginScreen extends Component {
    static navigationOptions = {
        header: null
    }
    constructor(props) {
        super(props);
        this.state = {
            placeholderText: 'Enter your mobile number'
        }
    }
    componentWillMount() {
        this.loginScreenHeight = new Animated.Value(150);

        this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', this.keyboardWillShowListener);
        this.keyboardWillHideListener = Keyboard.addListener('keyboardWillShow', this.keyboardWillHideListener);

        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShowListener);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHideListener);

        this.keyboardHeight = new Animated.Value(0);
        this.forwardArrowOpacity = new Animated.Value(0);
        this.borderBottomWidth = new Animated.Value(0);
    }
    keyboardWillShowListener = (event) => {

        Animated.parallel([
            Animated.timing(this.keyboardHeight, {
                duration: event.duration + 100,
                toValue: event.endCoordinates.height + 10
            }),
            Animated.timing(this.forwardArrowOpacity, {
                duration: event.duration,
                toValue: 1
            }),
            Animated.timing(this.borderBottomWidth, {
                duration: event.duration,
                toValue: 1
            })
        ])
    }
    keyboardDidShowListener = (event) => {
        if (Platform.OS == 'android') {
            duration = 100;
        } else {
            duration = event.duration
        }
        Animated.parallel([
            Animated.timing(this.keyboardHeight, {
                duration: duration + 100,
                toValue: event.endCoordinates.height + 10
            }),
            Animated.timing(this.forwardArrowOpacity, {
                duration: duration,
                toValue: 1
            }),
            Animated.timing(this.borderBottomWidth, {
                duration: duration,
                toValue: 1
            })
        ]).start()
    }
    keyboardDidHideListener = (event) => {
        if (Platform.OS == 'android') {
            duration = 100;
        } else {
            duration = event.duration
        }
        Animated.parallel([
            Animated.timing(this.keyboardHeight, {
                duration: duration + 100,
                toValue: 0
            }),
            Animated.timing(this.borderBottomWidth, {
                duration: duration,
                toValue: 0
            })
        ]).start()
    }
    increaseLoginScreenHeight = () => {
        this.setState({ placeholderText: '0123456789' });
        Animated.timing(this.loginScreenHeight, {
            toValue: SCREEN_HEIGHT,
            duration: 500
        }).start(() => {
            this.refs.textInputMobile.focus();
        })
    }
    reduceLoginScreenHeight = () => {
        this.setState({ placeholderText: 'Enter your mobile number' });
        Keyboard.dismiss();
        Animated.parallel([
            Animated.timing(this.forwardArrowOpacity, {
                duration: duration,
                toValue: 0
            }),
            Animated.timing(this.loginScreenHeight, {
                toValue: 150,
                duration: 500
            })
        ]).start()
    }
    sendSignUpRequest = () => {
        if (!this.state.phoneNumber) {
            Toast.show({
                text: "Please enter your phone number",
                buttonText: "Okay",
                duration: 3000,
              })
            return;
        }
        let { phoneNumber } = this.state;
        phoneNumber = '+91'+ phoneNumber; //add country code

        firebase.auth().signInWithPhoneNumber(phoneNumber)
          .then((confirmResult) => {
              console.log(confirmResult)
            // This means that the SMS has been sent to the user
            // You need to:
            //   1) Save the `confirmResult` object to use later
            this.setState({ confirmResult });
            //   2) Hide the phone number form
            //   3) Show the verification code form
          })
          .catch((error) => {
            const { code, message } = error;
            console.log(code, message)
            // For details of error codes, see the docs
            // The message contains the default Firebase string
            // representation of the error
          });
   
    }

    render() {
        const headerTextOpacity = this.loginScreenHeight.interpolate({
            inputRange: [150, SCREEN_HEIGHT],
            outputRange: [1, 0]
        });
        const headerTextMarginTop = this.loginScreenHeight.interpolate({
            inputRange: [150, SCREEN_HEIGHT],
            outputRange: [20, 50]
        });
        const headerBackArrowOpacity = this.loginScreenHeight.interpolate({
            inputRange: [150, SCREEN_HEIGHT],
            outputRange: [0, 1]
        });
        const titleTextLeft = this.loginScreenHeight.interpolate({
            inputRange: [150, SCREEN_HEIGHT],
            outputRange: [100, 25]
        });
        const titleTextBottom = this.loginScreenHeight.interpolate({
            inputRange: [150, 400, SCREEN_HEIGHT],
            outputRange: [0, 0, 30]
        });
        const titleTextOpacity = this.loginScreenHeight.interpolate({
            inputRange: [150, SCREEN_HEIGHT],
            outputRange: [0, 1]
        });
        const marginTop = this.loginScreenHeight.interpolate({
            inputRange: [150, SCREEN_HEIGHT],
            outputRange: [0, 2]
        });
        return (
            <View style={{ flex: 1 }}>
                <Animated.View
                    style={{
                        position: 'absolute',
                        height: 60,
                        width: 60,
                        top: 15,
                        left: 25,
                        zIndex: 100,
                        opacity: headerBackArrowOpacity,
                    }}
                >
                    <TouchableOpacity

                        onPress={() => this.reduceLoginScreenHeight()}
                    >
                        <Icon name="ios-arrow-round-back-outline" size={40} style={{ color: 'black' }} />
                    </TouchableOpacity>

                </Animated.View>
                <Animated.View
                    style={{
                        position: 'absolute',
                        zIndex: 100,
                        right: 10,
                        backgroundColor: '#54575e',
                        borderRadius: 30,
                        bottom: 10,
                        height: 60, width: 60,
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: this.forwardArrowOpacity
                    }}
                >
                    <TouchableOpacity
                     onPress={()=>this.sendSignUpRequest()}
                    >
                        <Icon name="ios-arrow-round-forward" size={40} style={{ color: 'white' }} />
                    </TouchableOpacity>


                </Animated.View>
                <ImageBackground
                    source={{ uri: 'https://pre00.deviantart.net/3a8d/th/pre/f/2018/017/4/a/background_netflix_2018_by_mrfantasmabr-dbz3o4b.png' }}
                    style={{ flex: 1 }}
                >
                    <Animatable.View
                        animation="zoomIn"
                        iterationCount={1}
                        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ height: 100, width: 200, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', borderRadius: 5 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 24, color: 'red' }}> STORYLINE </Text>
                        </View>
                    </Animatable.View>
                    {/* Footer Part */}
                    <Animatable.View
                        animation="slideInUp"
                        iterationCount={1}
                        style={{}}>
                        <Animated.View
                            style={{
                                height: this.loginScreenHeight,
                                backgroundColor: 'white'
                            }}
                        >
                            <Animated.View
                                style={{
                                    opacity: headerTextOpacity,
                                    alignItems: 'flex-start',
                                    paddingHorizontal: 25,
                                    marginTop: headerTextMarginTop,
                                    marginBottom: 15
                                }}
                            >
                                <Text style={{
                                    fontSize: 20,
                                    color: 'black'
                                }}>Share your stories to the world</Text>
                            </Animated.View>
                            <TouchableOpacity
                                onPress={() => this.increaseLoginScreenHeight()}
                            >
                                <Animated.View style={{
                                    flexDirection: 'row',
                                    paddingHorizontal: 25,
                                }}>

                                    <Image source={{ uri: 'https://cdn3.iconfinder.com/data/icons/finalflags/128/India-Flag.png' }} style={{ width: 25, height: 25, resizeMode: 'contain', marginTop: 5, }} />
                                    <Animated.View
                                        pointerEvents='none'
                                        style={{
                                            marginTop: 5,
                                            flexDirection: 'row',
                                            flex: 1,
                                            borderBottomWidth: this.borderBottomWidth
                                        }}>
                                        <Text
                                            style={{
                                                marginTop: 5,
                                                paddingHorizontal: 10,
                                                fontSize: 18,
                                                color: 'black'
                                            }}
                                        >+91</Text>
                                        <TextInput
                                            keyboardType='numeric'
                                            ref="textInputMobile"
                                            style={{
                                                flex: 1,
                                                fontSize: 18
                                            }}
                                            placeholder={this.state.placeholderText}
                                            underlineColorAndroid="transparent"
                                            value={this.state.phoneNumber}
                                            onChangeText={(phoneNumber) => this.setState({ phoneNumber })}
                                            onSubmitEditing={() => console.log(this.state.phoneNumber)}
                                        />
                                    </Animated.View>
                                </Animated.View>
                            </TouchableOpacity>
                        </Animated.View>
                        <View>
                            <View style={{
                                backgroundColor: 'white',
                                height: 70,
                                justifyContent: 'center',
                                alignItems: 'flex-start',
                                borderTopColor: '#e8e8ec',
                                paddingHorizontal: 25,
                                borderTopWidth: 1,
                            }}>
                                <Text style={{ fontWeight: 'bold', color: '#5a7fdf' }}>
                                    Or connect using a social account
                        </Text>
                            </View>
                        </ View>
                    </Animatable.View>

                </ImageBackground>
            </View>
        );
    }
}

export default LoginScreen;
