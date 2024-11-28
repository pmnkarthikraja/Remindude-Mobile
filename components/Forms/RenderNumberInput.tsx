import { Agreements } from "@/utils/category"
import React, { useCallback, useMemo } from "react"
import { FunctionComponent } from "react"
import { Control, Controller, FieldErrors, FieldPath, useForm, UseFormSetValue, useWatch } from "react-hook-form"
import { StyleSheet, View } from "react-native"
import { ThemedText } from "../ThemedText"
import { Input } from "tamagui"
import { FormData } from "@/utils/category"
import { debounce } from "lodash"

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
     setValue: UseFormSetValue<FormData>
}

const RenderNumberInput:FunctionComponent<RenderTextInputProps> = (
   { 
    control,
    errorss,
    isLightTheme,
    label,
    name,
    placeholder,
    disabled,
    rules,
    setValue
   }
  ) => {
    const dt = useWatch({
        control,
        name: ['employeeInsuranceValue', 'spouseInsuranceValue', 'childrenInsuranceValues', 'category']
      });

    const employeeInsuranceValue= dt[0]
    const spouseInsuranceValue = dt[1]
    const childrenInsuranceValues = dt[2]
    const category = dt[3]

      const calculateTotalInsuredValue = useCallback(() => {
        if (category === 'Insurance Renewals') {
          const empValue = parseFloat(employeeInsuranceValue) || 0;
          const spValue = parseFloat(spouseInsuranceValue || '0') || 0;
          const childrenTotal = childrenInsuranceValues?.reduce((acc, val) => acc + (parseFloat(val) || 0), 0);
          const totalSum = empValue + spValue + (childrenTotal || 0);
          setValue('value', totalSum.toFixed(2)); 
        }
      }, [employeeInsuranceValue, spouseInsuranceValue, childrenInsuranceValues, category, setValue]);
    
      const debouncedCalculate = useMemo(() => debounce(calculateTotalInsuredValue, 300), [calculateTotalInsuredValue]);
    


    return (
      <View>
        <ThemedText style={styles.label}>{label}</ThemedText>
        <Controller
          control={control}
          name={name}
          rules={{
            required: 'This field is required',
            ...rules,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              keyboardType='numeric'
              style={[
                styles.input,
                {
                  backgroundColor: isLightTheme ? 'white' : 'transparent',
                  color: isLightTheme ? 'black' : 'white',
                },
              ]}
              placeholder={placeholder}
              onBlur={onBlur}
              onChangeText={(e) => {
                onChange(e)
                debouncedCalculate()
              }}
              value={typeof value === 'string' ? value : ''}
            />
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
})

export default RenderNumberInput