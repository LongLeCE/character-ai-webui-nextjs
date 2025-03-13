'use client';

import { ReactNode, useCallback } from 'react';

export default function Downloader(props: {
  data: BlobPart[] | BlobPart | (() => BlobPart[] | BlobPart);
  fileName: string;
  type?: string;
  endings?: EndingType;
  children?: ReactNode;
}) {
  const download = useCallback(
    (
      blobParts: BlobPart[] | BlobPart | (() => BlobPart[] | BlobPart),
      fileName: string,
      type?: string,
      endings?: EndingType
    ) => {
      if (typeof blobParts === 'function') {
        blobParts = blobParts();
      }
      if (!Array.isArray(blobParts)) {
        blobParts = [blobParts];
      }
      const file = new Blob(blobParts, { type: type, endings: endings });
      const element = document.createElement('a');
      element.href = URL.createObjectURL(file);
      element.download = fileName;
      element.click();
      element.remove();
    },
    []
  );

  return (
    <div
      onClick={() => download(props.data, props.fileName, props.type, props.endings)}
      className='size-full'
    >
      {props.children}
    </div>
  );
}
