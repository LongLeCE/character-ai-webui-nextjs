export type EditMenuTextOptionImperativeHandle = {
  value?: string;
  setValue: Dispatch<SetStateAction<string | undefined>>;
  require: () => boolean;
};

export type EditMenuTextOptionProps = {
  label: string;
  description?: string;
  rows?: number;
  value?: string;
  onChange?: ((value: string) => void) | ((value: string) => Promise<void>);
};
