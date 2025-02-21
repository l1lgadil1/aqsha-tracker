import { Text, View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { Fragment } from 'react';
export default function NotFound() {
    return (
        <Fragment>
            <Stack.Screen options={{ title: 'Ooops!' }} />
            <View style={styles.container}>
                <Text style={styles.text}>This screen doesn't exist.</Text>
            </View>
        </Fragment>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: 'black',
    },
});
