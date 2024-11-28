import { FontAwesome6, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons"
import React, { FunctionComponent } from "react"
import { StyleSheet, TouchableOpacity, View } from "react-native"
import { ThemedText } from "../ThemedText"




export interface RenderStatusProps {
    onChange: (checked: boolean) => void
    completed: boolean
    isLightTheme: boolean
}
const RenderStatus: FunctionComponent<RenderStatusProps> = ({
    onChange,
    isLightTheme,
    completed
}) => {
    return <View style={styles.categoryStyle}>
        <TouchableOpacity
            activeOpacity={1}
            style={{ borderRadius: 10 }}
            onPress={() => { onChange(true) }}>
            <View style={[styles.categoryLabel, completed && styles.borderEnabled,
            isLightTheme ? { width: 'auto', backgroundColor: 'lightgreen' } :
                { width: 'auto', backgroundColor: '#568E57' }]} >
                <MaterialIcons name='check' color={isLightTheme ? 'green' : 'white'} size={16} />
                <ThemedText >Completed</ThemedText>
                {completed && <FontAwesome6 name="check"
                    style={{ position: 'absolute', right: -5, color: isLightTheme ? 'black' : 'white' }} />}
            </View>
        </TouchableOpacity>

        <TouchableOpacity
            activeOpacity={1}
            style={{ borderRadius: 10 }}
            onPress={() => { onChange(false) }}>
            <View style={[styles.categoryLabel, !completed && styles.borderEnabled,
            isLightTheme ? { width: 'auto', backgroundColor: '#FFD580' } : { width: 'auto', backgroundColor: '#99804D' }]} >
                <MaterialCommunityIcons name='progress-clock' color={isLightTheme ? 'darkorange' : 'white'} size={20} />
                <ThemedText style={{ margin: 'auto' }}>In-Progress</ThemedText>
                {!completed && <FontAwesome6 name="check"
                    style={{ position: 'absolute', right: -5, color: isLightTheme ? 'black' : 'white' }} />}
            </View>
        </TouchableOpacity>
    </View>
}

const styles = StyleSheet.create({
    categoryStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 10,
        paddingHorizontal: 10,
        backgroundColor: 'transparent',
        width: 'auto',
        gap: 20,
        flexWrap: 'wrap',
    },
    categoryLabel: {
        height: 40,
        borderRadius: 10,
        paddingHorizontal: 16,
        fontSize: 16,
        elevation: 5,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5
    },
    borderEnabled: {
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: 'white'
    },
})


export default RenderStatus