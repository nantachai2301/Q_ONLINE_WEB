import React, { Fragment } from 'react';
import { useField, ErrorMessage } from 'formik';
import Select from 'react-select';

export const TextSelect = ({ title, useForm = true, placeholder, ...props }) => {
  const [field, meta] = useField(props);

  const customStyles = {
    control: (base, state) => ({
      ...base,
      '&:hover': {
        border: state.isFocused ? '1px solid #4BB3CD' : '1px solid black',
      },
      boxShadow: 'none',
      height: '2.5rem',
      minHeight: '36px',
      fontSize: '15px',
      background: props.isDisabled ? '#e5e7eb' : '',
      borderColor: '#ddd',
      border: state.isFocused ? '1px solid #4BB3CD' : meta.touched ? (meta.error ? '1px solid #ff0000' : '1px solid #dee2e6') : '1px solid #dee2e6',
      borderRadius: '8px',
      zIndex: 10,
    }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      return {
        ...styles,
        backgroundColor: isDisabled ? undefined : isSelected ? '#1085a2' : isFocused ? '#d1e7dd' : 'undefined',
        color: isDisabled ? '#ccc' : isSelected ? 'white' : 'black',
        cursor: isDisabled ? 'not-allowed' : 'default',
        '&:hover': {
          color: isSelected ? 'white' : 'black',
        },
        ':active': {
          ...styles[':active'],
          backgroundColor: !isDisabled ? (isSelected ? data.color : '#1085a2') : undefined,
        },
        zIndex: 10,
      };
    },
    menuPortal: (provided) => ({ ...provided, zIndex: 10 }),
    menu: (provided) => ({ ...provided, zIndex: 10 }),
  };

  return (
    <Fragment>
      <Select menuPortalTarget={document.body} styles={customStyles} {...field} {...props} placeholder={<p className="truncate">{placeholder}</p>} noOptionsMessage={() => <p className="text-red-700">ไม่พบข้อมูล !</p>} loadingMessage={() => 'กำลังโหลดข้อมูล...'} />
      <ErrorMessage component="div" name={field.name} className="text-invalid" />
    </Fragment>
  );
};
