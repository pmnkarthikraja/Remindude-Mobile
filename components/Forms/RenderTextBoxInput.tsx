
import React, { FunctionComponent } from "react"
import { Control, Controller, FieldErrors, FieldPath } from "react-hook-form"
import { StyleSheet, View } from "react-native"
import { TextArea } from "tamagui"
import { ThemedText } from "../ThemedText"
import { FormData } from "@/utils/category"


type FieldName = FieldPath<FormData>

export interface RenderTextInputProps{
    name: FieldName,
    control: Control<FormData>,
    label: string,
    placeholder: string,
    errorss: FieldErrors<FormData>,
    isLightTheme:boolean,
    disabled?: boolean,
    rules?: object,
}


const RenderTextBoxInput:FunctionComponent<RenderTextInputProps> = (
    {
      control,
      errorss,
      isLightTheme,
      label,
      name,
      placeholder,
      disabled,
      rules
    }
    ) => {
      return (
        <View>
          <ThemedText style={styles.label}>{label}</ThemedText>
          <Controller
          control={control}
          name={name}
          rules={rules}
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              {(typeof value == 'string' || typeof value == 'undefined') && <TextArea
                style={[styles.textAreaInput, { backgroundColor: isLightTheme ? 'white' : 'transparent', color: isLightTheme ? 'black' : 'white' }]}
                placeholder={placeholder}
                rows={4}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />}
            </>
          )}
        />
  
          {errorss[name as keyof FieldErrors<FormData>] && (
            <ThemedText style={styles.errorText}>
              {errorss[name as keyof FieldErrors<FormData>]?.message || ''}
            </ThemedText>
          )}
        </View>
      );
    };

    const styles = StyleSheet.create({
        label: {
            marginBottom: 5,
          },   
          input: {
            height: 40,
            borderColor: '#0a7ea4', //colors.light.tint
            borderWidth: 1,
            marginBottom: 20,
            paddingLeft: 10,
            borderRadius: 8,
            backgroundColor: 'transparent',
            color: 'white',
          },
          errorText: {
            color: 'red',
            marginBottom: 10,
          },
          textAreaInput: {
            borderColor: '#0a7ea4',
            borderWidth: 1,
            marginBottom: 20,
            paddingLeft: 10,
            borderRadius: 8,
            backgroundColor: 'white',
            color: 'black'
          },
    })

    export default RenderTextBoxInput



