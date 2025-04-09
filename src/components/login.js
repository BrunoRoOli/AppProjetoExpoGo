import React, { useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View, Dimensions } from "react-native";
import { Card, Text, TextInput, HelperText } from "react-native-paper";
import firebase from '../components/services/connectionFirebase';

const { width, height } = Dimensions.get('window');

export default function Login({ changeStatus }) {
    const [type, setType] = useState("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    // Funções de validação (mantidas iguais ao exemplo anterior)
    function validateEmail(email) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!email) {
            setEmailError("E-mail é obrigatório");
            return false;
        }
        if (!emailRegex.test(email)) {
            setEmailError("Por favor, insira um e-mail válido");
            return false;
        }
        setEmailError("");
        return true;
    }

    function validatePassword(password) {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
        if (!password) {
            setPasswordError("Senha é obrigatória");
            return false;
        }
        if (!passwordRegex.test(password)) {
            setPasswordError("Senha deve ter: 6+ caracteres, maiúscula, minúscula, número e símbolo");
            return false;
        }
        setPasswordError("");
        return true;
    }

    function handleLogin() {
        // Função de login (mantida igual ao exemplo anterior)
        const isEmailValid = validateEmail(email);
        const isPasswordValid = validatePassword(password);

        if (!isEmailValid || !isPasswordValid) {
            return;
        }

        if (type === "login") {
            firebase.auth().signInWithEmailAndPassword(email, password)
                .then((user) => {
                    changeStatus(user.user.uid);
                })
                .catch((err) => {
                    console.log(err);
                    alert("E-mail ou senha incorretos!");
                });
        } else {
            firebase.auth().createUserWithEmailAndPassword(email, password)
                .then((user) => {
                    changeStatus(user.user.uid);
                })
                .catch((err) => {
                    console.log(err);
                    alert("Erro ao cadastrar! Verifique os dados e tente novamente.");
                });
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image 
                    style={styles.logo} 
                    source={require('../../assets/gamelogo.png')} 
                    resizeMode="contain"
                />
            </View>

            <View style={styles.cardContainer}>
                <Card style={styles.card}>
                    <Card.Content>
                        <TextInput
                            style={styles.input}
                            mode="outlined"
                            label="E-mail"
                            value={email}
                            onChangeText={(text) => {
                                setEmail(text);
                                validateEmail(text);
                            }}
                            error={!!emailError}
                        />
                        {emailError ? (
                            <HelperText type="error" visible={!!emailError}>
                                {emailError}
                            </HelperText>
                        ) : null}

                        <TextInput
                            style={styles.input}
                            mode="outlined"
                            label="Senha"
                            secureTextEntry
                            maxLength={30}
                            value={password}
                            onChangeText={(text) => {
                                setPassword(text);
                                validatePassword(text);
                            }}
                            error={!!passwordError}
                        />
                        {passwordError ? (
                            <HelperText type="error" visible={!!passwordError}>
                                {passwordError}
                            </HelperText>
                        ) : null}
                    </Card.Content>
                </Card>

                <TouchableOpacity
                    style={[
                        styles.colorButton,
                        { backgroundColor: type === 'login' ? '#7819cd' : '#FF0000' },
                    ]}
                    onPress={handleLogin}>
                    <Text style={styles.loginText}>
                        {type === 'login' ? 'Acessar' : 'Cadastrar'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    onPress={() => setType(type === 'login' ? 'cadastrar' : 'login')}
                    style={styles.createAccountTouch}
                >
                    <Text style={styles.createAccountText}>
                        {type === 'login' ? 'Criar uma conta' : 'Já possuo uma conta'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    logoContainer: {
        width: width * 0.8,
        height: height * 0.3,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
    },
    logo: {
        width: '100%',
        height: '100%',
        maxWidth: 265,
        maxHeight: 350,
    },
    cardContainer: {
        width: '100%',
        alignItems: 'center',
    },
    card: {
        width: '100%',
        marginBottom: 20,
    },
    input: {
        marginBottom: 10,
        width: '100%',
    },
    colorButton: {
        width: '100%',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 15,
    },
    loginText: {
        color: "#FFF",
        fontSize: 18,
        fontWeight: 'bold',
    },
    createAccountTouch: {
        width: '100%',
        alignItems: 'center',
    },
    createAccountText: {
        textAlign: 'center',
        color: '#4682B4',
        fontWeight: 'bold',
    }
});