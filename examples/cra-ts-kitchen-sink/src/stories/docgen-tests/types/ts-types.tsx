import React, { FC } from 'react';

interface ItemShape {
  text: string;
  value: string;
}

interface TypeScriptPropsProps {
  arrayOfPrimitive: string[];
  arrayOfShape: ItemShape[];
  defaultEnum: DefaultEnum;
  numericEnum: NumericEnum;
  stringEnum: StringEnum;
  namedStringLiteralUnion: StringLiteralUnion;
  inlinedStringLiteralUnion: 'bottom-left' | 'bottom-right' | 'bottom-center';
}

enum DefaultEnum {
  TopLeft,
  TopRight,
  TopCenter,
}

enum NumericEnum {
  TopLeft = 0,
  TopRight,
  TopCenter,
}

enum StringEnum {
  TopLeft = 'top-left',
  TopRight = 'top-right',
  TopCenter = 'top-center',
}

type StringLiteralUnion = 'top-left' | 'top-right' | 'top-center';

export const TypeScriptProps: FC<TypeScriptPropsProps> = () => <div>TypeScript!</div>;
TypeScriptProps.defaultProps = {
  arrayOfPrimitive: ['foo', 'bar'],
  arrayOfShape: [{ text: 'foo', value: 'bar' }],
  defaultEnum: DefaultEnum.TopRight,
  numericEnum: NumericEnum.TopRight,
  stringEnum: StringEnum.TopRight,
  namedStringLiteralUnion: 'top-right',
  inlinedStringLiteralUnion: 'bottom-right',
};
