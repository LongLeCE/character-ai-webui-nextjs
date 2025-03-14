'use client';

import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react';
import { EditMenuTextOptionImperativeHandle, EditMenuTextOptionProps } from './types';

const EditMenuTextOption = forwardRef<EditMenuTextOptionImperativeHandle, EditMenuTextOptionProps>(
  (props, ref) => {
    const [value, setValue] = useState(props.value);
    const [required, setRequired] = useState(false);

    const onChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setValue(e.target.value);
      props.onChange && props.onChange(e.target.value);
    }, []);

    const require = useCallback(() => {
      if (!value) {
        setRequired(true);
        return false;
      }
      return true;
    }, [value]);

    useImperativeHandle(ref, () => {
      return {
        value,
        setValue,
        require
      };
    }, [value, require]);

    useEffect(() => {
      value && setRequired(false);
    }, [value]);

    return (
      <div className='flex flex-col w-full'>
        <span className='ml-2.5 mr-auto'>{props.label}</span>
        {required ? (
          <span className='ml-2.5 mr-auto text-red-500'>This field is required!</span>
        ) : (
          <></>
        )}
        <textarea
          className='w-full outline-none resize-none no-scrollbar bg-[#26272b] rounded-2xl py-3 px-[1.125rem] whitespace-pre-wrap break-words'
          value={value}
          onChange={onChange}
          placeholder={props.description}
          rows={props.rows ?? 1}
          spellCheck={false}
        />
      </div>
    );
  }
);

EditMenuTextOption.displayName = 'EditMenuTextOption';
export default EditMenuTextOption;
