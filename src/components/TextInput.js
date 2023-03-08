import React from 'react';
import { View, TextInput as RNTextInput, Text } from 'react-native';
import { useController, useFormContext } from 'react-hook-form';

const TextInput = (props) => {
  const { name } = props;

  const formContext = useFormContext();

  if (!formContext || !name) {
    const msg = !formContext
      ? 'TextInput must be wrapped by the FormProvider'
      : 'Name must be defined';
    console.error(msg);
    return null;
  }

  return <ControlledInput {...props} />;
};

export default TextInput;

const ControlledInput = (props) => {
  const { formState, control } = useFormContext();

  const { name, label, rules, ...inputProps } = props;

  const { field } = useController({
    name,
    control,
    rules,
    defaultValue: props.defaultValue,
  });

  return (
    /* 
     ASSIGN PROPS ONCHANGETEXT, ONBLUR, AND VALUE TO
       CORRESPONDING FIELDS
  */
    <View className='flex flex-col'>
      {label && (
        <Text className='mb-2 text-lg font-bold text-teal-900'>{label}</Text>
      )}
      <View className='block w-64 py-2 px-2  text-gray-700 border border-gray-200 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500'>
        <RNTextInput
          className='w-full'
          onChangeText={field.onChange}
          onBlur={field.onBlur}
          defaultValue={field.value}
          {...inputProps}
        />
      </View>
    </View>
  );
};
