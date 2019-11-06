import React, { FC } from 'react';
import Markdown from 'markdown-to-jsx';
import { styled } from '@storybook/theming';
import { transparentize } from 'polished';
import { isNil } from 'lodash';
import { PropDef, PropDefJsDocTags, PropTypeSystem } from './PropDef';

// enum PropType {
//   SHAPE = 'shape',
//   UNION = 'union',
//   ARRAYOF = 'arrayOf',
//   OBJECTOF = 'objectOf',
//   ENUM = 'enum',
//   INSTANCEOF = 'instanceOf',
// }

// interface PrettyPropTypeProps {
//   type: any;
// }

interface PrettyPropValProps {
  value: any;
}

interface JsDocParamsAndReturnsProps {
  tags: PropDefJsDocTags;
}

export interface PropRowProps {
  row: PropDef;
  // FIXME: row options
}

const Name = styled.span({ fontWeight: 'bold' });

const Required = styled.span(({ theme }) => ({
  color: theme.color.negative,
  fontFamily: theme.typography.fonts.mono,
  cursor: 'help',
}));

const StyledPropDef = styled.div(({ theme }) => ({
  color:
    theme.base === 'light'
      ? transparentize(0.4, theme.color.defaultText)
      : transparentize(0.6, theme.color.defaultText),
  fontFamily: theme.typography.fonts.mono,
  fontSize: `${theme.typography.size.code}%`,
}));

const JsDocParamsAndReturnsTBody = styled.tbody({ boxShadow: 'none !important' });

const JsDocCellStyle = { paddingTop: '0 !important', paddingBottom: '0 !important' };

const JsDocNameCell = styled.td({
  ...JsDocCellStyle,
});

const JsDocDescCell = styled.td({
  ...JsDocCellStyle,
  width: 'auto !important',
});

interface PropTypesType {
  name: string;
  value?: any;
  computed?: boolean;
  raw?: string;
}

interface TypeScriptType {
  name: string;
}

interface UnsupportedType {
  name: string;
}

type TypeRenderer = (type: any) => string;

interface PropRenderers {
  type: TypeRenderer;
}

const propTypesTypeRenderer: TypeRenderer = (type: PropTypesType) => {
  if (isNil(type) || isNil(type.name)) {
    return '';
  }

  switch (type.name) {
    case 'custom':
      // TODO: raw might be a long stringify function, what do we do?
      // If it's a name function it's fine,
      // If it's something that contains "function" or "(" or "{" or "\n" or longuer than X characters we want to show "custom".
      // Could use something to generate an AST from a string. (Also do this for defaultValue);
      return isNil(type.raw) ? type.name : type.raw;
    case 'instanceOf':
      return type.value;
    case 'enum':
      if (Array.isArray(type.value)) {
        return type.value.map((x: any) => x.value).join(' | ');
      }

      return type.value;
    default:
      return type.name;
  }
};

const typeScriptTypeRenderer: TypeRenderer = (type: TypeScriptType) => {
  if (isNil(type) || isNil(type.name)) {
    return '';
  }

  // TODO: Need more work, for example: unionOfPrimitive doesn't work.
  return type.name;
};

const unsupportedTypeRenderer: TypeRenderer = (type: UnsupportedType) => {
  if (isNil(type) || isNil(type.name)) {
    return '';
  }

  return type.name;
};

const TypeSystemRenderer: Record<PropTypeSystem, PropRenderers> = {
  [PropTypeSystem.PropTypes]: {
    type: propTypesTypeRenderer,
  },
  [PropTypeSystem.TypeScript]: {
    type: typeScriptTypeRenderer,
  },
  [PropTypeSystem.Flow]: {
    type: unsupportedTypeRenderer,
  },
  [PropTypeSystem.Unknown]: {
    type: unsupportedTypeRenderer,
  },
};

export function renderType(propDef: PropDef): string {
  // console.log('**** ', propDef);

  try {
    const renderer = TypeSystemRenderer[propDef.typeSystem];

    return renderer.type(propDef.type);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);

    return 'unknown';
  }
}

// const renderType = (type: any): string => {
//   if (!type || !type.name) {
//     return '';
//   }
//   let fields = '';
//   switch (type.name) {
//     case PropType.SHAPE:
//       fields = Object.keys(type.value)
//         .map((key: string) => `${key}: ${renderType(type.value[key])}`)
//         .join(', ');
//       return `{ ${fields} }`;
//     case PropType.UNION:
//       return Array.isArray(type.value)
//         ? type.value.map(renderType).join(' | ')
//         : JSON.stringify(type.value);
//     case PropType.ARRAYOF: {
//       let shape = type.value.name;

//       if (shape === 'custom') {
//         if (type.value.raw) {
//           shape = type.value.raw.replace(/PropTypes./g, '').replace(/.isRequired/g, '');
//         }
//       }

//       return `[ ${shape} ]`;
//     }
//     case PropType.OBJECTOF:
//       return `objectOf(${renderType(type.value)})`;
//     case PropType.ENUM:
//       if (type.computed) {
//         return JSON.stringify(type);
//       }
//       return Array.isArray(type.value)
//         ? type.value.map((v: any) => v && v.value && v.value.toString()).join(' | ')
//         : JSON.stringify(type);
//     case PropType.INSTANCEOF:
//       return JSON.stringify(type.value);
//     default:
//       return type.name;
//   }
// };

// export const PrettyPropType: FC<PrettyPropTypeProps> = ({ type }) => (
//   <span>{renderType(type)}</span>
// );

export const PrettyPropVal: FC<PrettyPropValProps> = ({ value }) => (
  <span>{JSON.stringify(value)}</span>
);

const JsDocParamsAndReturns: FC<JsDocParamsAndReturnsProps> = ({ tags }) => {
  if (isNil(tags)) {
    return null;
  }

  const params = (tags.params || []).filter(x => x.description);
  const hasDisplayableParams = params.length !== 0;
  const hasDisplayableReturns = !isNil(tags.returns) && !isNil(tags.returns.description);

  if (!hasDisplayableParams && !hasDisplayableReturns) {
    return null;
  }

  return (
    <table>
      <JsDocParamsAndReturnsTBody>
        {hasDisplayableParams &&
          params.map(x => (
            <tr key={x.name}>
              <JsDocNameCell>
                <code>{x.name}</code>
              </JsDocNameCell>
              <JsDocDescCell>{x.description}</JsDocDescCell>
            </tr>
          ))}
        {hasDisplayableReturns && (
          <tr key="returns">
            <JsDocNameCell>
              <code>Returns</code>
            </JsDocNameCell>
            <JsDocDescCell>{tags.returns.description}</JsDocDescCell>
          </tr>
        )}
      </JsDocParamsAndReturnsTBody>
    </table>
  );
};

export const PropRow: FC<PropRowProps> = ({ row }) => {
  const { name, type, required, description, defaultValue, jsDocTags } = row;

  return (
    <tr>
      <td>
        <Name>{name}</Name>
        {required ? <Required title="Required">*</Required> : null}
      </td>
      <td>
        <Markdown>{description || ''}</Markdown>
        <StyledPropDef>
          <span>{renderType(row)}</span>
        </StyledPropDef>
        <JsDocParamsAndReturns tags={jsDocTags} />
      </td>
      <td>{isNil(defaultValue) ? '-' : <PrettyPropVal value={defaultValue} />}</td>
    </tr>
  );
};
