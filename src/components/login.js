//declaração de componentes a serem utilizados
import React, { useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { Card, Text, TextInput } from "react-native-paper";
import firebase from '../components/services/connectionFirebase';

export default function Login({ changeStatus }) {
    const [type, setType] = useState("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Função para validar e-mail
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Função para validar senha
    function isValidPassword(password) {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{6,}$/;
        return passwordRegex.test(password);
    }

    function handleLogin() {
        if (!isValidEmail(email)) {
            alert("Por favor, insira um e-mail válido!");
            return;
        }

        if (!isValidPassword(password)) {
            alert("A senha deve ter pelo menos 6 caracteres, incluindo uma letra maiúscula, uma letra minúscula e um caractere especial.");
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
            <Image style={styles.logo} source={require('../../assets/gamelogo.png')} />
            <Card>
                <Card.Content>
                    <TextInput
                        style={styles.label}
                        mode="outlined"
                        label="E-mail"
                        value={email}
                        onChangeText={(text) => setEmail(text)}
                    />
                    <TextInput
                        style={styles.label}
                        mode="outlined"
                        label="Senha"
                        secureTextEntry
                        maxLength={30}
                        value={password}
                        onChangeText={(text) => setPassword(text)}
                    />
                </Card.Content>
            </Card>

            <TouchableOpacity
                style={[
                    styles.colorButton,
                    { backgroundColor: type === 'login' ? '#4682B4' : '#FF0000' },
                ]}
                onPress={handleLogin}>
                <Text style={styles.loginText}>
                    {type === 'login' ? 'Acessar' : 'Cadastrar'}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setType(type === 'login' ? 'cadastrar' : 'login')}>
                <Text style={{ textAlign: 'center' }}>
                    {type === 'login' ? 'Criar uma conta' : 'Já possuo uma conta'}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        textAlign: "center",
    },
    logo: {
        width: 265,
        height: 350,
        justifyContent: "center",
        alignSelf: "center",
    },
    label: {
        marginBottom: 10,
    },
    loginText: {
        color: "#FFF",
        fontSize: 24,
    },
});
