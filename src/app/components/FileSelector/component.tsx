'use client';

import React, { ComponentPropsWithRef, useCallback, useMemo } from 'react';

export default function FileSelector(
  props: {
    onFileSelect: ((files: FileList | null) => void) | ((files: FileList | null) => Promise<void>);
  } & Omit<ComponentPropsWithRef<'input'>, 'type' | 'onChange'>
) {
  const filteredProps = useMemo(() => {
    const { onFileSelect, ...otherProps } = props;
    return { onFileSelect, inputProps: otherProps };
  }, [props]);

  const onChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      filteredProps.onFileSelect(event.target.files);
    },
    [filteredProps.onFileSelect]
  );

  return <input type='file' onChange={onChange} {...filteredProps.inputProps} />;
}
