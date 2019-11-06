import { PropDef, PropTypeSystem } from '@storybook/components';
import { isNil } from 'lodash';
import { parseJsDoc, ExtractedJsDocTags, ExtractedJsDocParamTag } from './jsdoc-parser';
import { DocgenInfo } from './DocgenInfo';

export interface TypeSystemHandlerResult {
  propDef?: PropDef;
  ignore: boolean;
}

export type TypeSystemHandler = (
  propName: string,
  docgenInfo: DocgenInfo
) => TypeSystemHandlerResult;

interface HandlePropResult extends TypeSystemHandlerResult {
  extractedJsDocTags?: ExtractedJsDocTags;
}

function createDefaultPropDef(
  name: string,
  type: {
    name: string;
  },
  typeSystem: PropTypeSystem,
  docgenInfo: DocgenInfo
): PropDef {
  const { description, required, defaultValue } = docgenInfo;

  return {
    name,
    type,
    required,
    description,
    defaultValue: isNil(defaultValue) ? null : defaultValue.value,
    typeSystem,
  };
}

function propMightContainsJsDoc(docgenInfo: DocgenInfo): boolean {
  return !isNil(docgenInfo.description) && docgenInfo.description.includes('@');
}

function handleProp(
  name: string,
  type: {
    name: string;
  },
  typeSystem: PropTypeSystem,
  docgenInfo: DocgenInfo
): HandlePropResult {
  const propDef = createDefaultPropDef(name, type, typeSystem, docgenInfo);

  if (propMightContainsJsDoc(docgenInfo)) {
    const { ignore, description, extractedTags } = parseJsDoc(docgenInfo);

    if (ignore) {
      return {
        ignore: true,
      };
    }

    if (!isNil(description)) {
      propDef.description = description;
    }

    const hasParams = !isNil(extractedTags.params);
    const hasReturns = !isNil(extractedTags.returns) && !isNil(extractedTags.returns.type);

    if (hasParams || hasReturns) {
      propDef.jsDocTags = {
        params: hasParams && extractedTags.params.map(x => x.raw),
        returns: hasReturns && extractedTags.returns.raw,
      };

      return {
        propDef,
        extractedJsDocTags: extractedTags,
        ignore: false,
      };
    }
  }

  return {
    propDef,
    ignore: false,
  };
}

export const propTypesHandler: TypeSystemHandler = (propName: string, docgenInfo: DocgenInfo) => {
  const result = handleProp(propName, docgenInfo.type, PropTypeSystem.PropTypes, docgenInfo);

  if (!result.ignore) {
    const { propDef, extractedJsDocTags } = result;

    // When available use the proper JSDoc tags to describe the function signature instead of displaying "func".
    if (propDef.type.name === 'func') {
      if (!isNil(extractedJsDocTags)) {
        const hasParams = !isNil(extractedJsDocTags.params);
        const hasReturns = !isNil(extractedJsDocTags.returns);

        if (hasParams || hasReturns) {
          const funcParts = [];

          if (hasParams) {
            const funcParams = extractedJsDocTags.params.map((x: ExtractedJsDocParamTag) => {
              const prettyName = x.getPrettyName();
              const typeName = x.getTypeName();

              if (!isNil(typeName)) {
                return `${prettyName}: ${typeName}`;
              }

              return prettyName;
            });

            funcParts.push(`(${funcParams.join(', ')})`);
          } else {
            funcParts.push('()');
          }

          if (hasReturns) {
            funcParts.push(`=> ${extractedJsDocTags.returns.getTypeName()}`);
          }

          propDef.type = {
            name: funcParts.join(' '),
          };
        }
      }
    }
  }

  return result;
};

export const tsHandler: TypeSystemHandler = (propName: string, docgenInfo: DocgenInfo) => {
  return handleProp(propName, docgenInfo.tsType, PropTypeSystem.TypeScript, docgenInfo);
};

export const flowHandler: TypeSystemHandler = (propName: string, docgenInfo: DocgenInfo) => {
  return handleProp(propName, docgenInfo.flowType, PropTypeSystem.Flow, docgenInfo);
};

export const unknownHandler: TypeSystemHandler = (propName: string, docgenInfo: DocgenInfo) => {
  return handleProp(propName, { name: 'unknown' }, PropTypeSystem.Unknown, docgenInfo);
};

export const TypeSystemHandlers: Record<PropTypeSystem, TypeSystemHandler> = {
  [PropTypeSystem.Flow]: flowHandler,
  [PropTypeSystem.TypeScript]: tsHandler,
  [PropTypeSystem.PropTypes]: propTypesHandler,
  [PropTypeSystem.Unknown]: unknownHandler,
};

export const getPropTypeSystem = (docgenInfo: DocgenInfo): PropTypeSystem => {
  if (!isNil(docgenInfo.flowType)) {
    return PropTypeSystem.Flow;
  }

  if (!isNil(docgenInfo.tsType)) {
    return PropTypeSystem.TypeScript;
  }

  if (!isNil(docgenInfo.type)) {
    return PropTypeSystem.PropTypes;
  }

  return PropTypeSystem.Unknown;
};

export const getTypeSystemHandler = (typeSystem: PropTypeSystem): TypeSystemHandler => {
  return TypeSystemHandlers[typeSystem];
};
