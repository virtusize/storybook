import { renderType } from './PropRow';
import { PropDef, PropTypeSystem } from './PropDef';

function createPropDef(overrides: Record<string, any> = {}): PropDef {
  return {
    name: 'propName',
    type: null,
    required: false,
    description: 'propDescription',
    jsDocTags: null,
    typeSystem: PropTypeSystem.Unknown,
    ...overrides,
  };
}

function createPropType(name: string, others: Record<string, any> = {}): Record<string, string> {
  return { name, ...others };
}

describe('renderType', () => {
  describe('propTypes', () => {
    describe('custom', () => {
      it("should render raw value when it's available", () => {
        const propDef = createPropDef({
          type: createPropType('custom', { raw: 'MY_TYPE' }),
          typeSystem: PropTypeSystem.PropTypes,
        });

        const result = renderType(propDef);

        expect(result).toBe('MY_TYPE');
      });

      it("should render 'custom' when there is no raw value", () => {
        const propDef = createPropDef({
          type: createPropType('custom'),
          typeSystem: PropTypeSystem.PropTypes,
        });

        const result = renderType(propDef);

        expect(result).toBe('custom');
      });
    });

    it("should render 'any' when type is any", () => {
      const propDef = createPropDef({
        type: createPropType('any'),
        typeSystem: PropTypeSystem.PropTypes,
      });

      const result = renderType(propDef);

      expect(result).toBe('any');
    });

    it("should render 'bool' when type is bool", () => {
      const propDef = createPropDef({
        type: createPropType('bool'),
        typeSystem: PropTypeSystem.PropTypes,
      });

      const result = renderType(propDef);

      expect(result).toBe('bool');
    });

    it("should render 'string' when type is string", () => {
      const propDef = createPropDef({
        type: createPropType('string'),
        typeSystem: PropTypeSystem.PropTypes,
      });

      const result = renderType(propDef);

      expect(result).toBe('string');
    });

    describe('func', () => {
      it("should render 'func' when type is func", () => {
        const propDef = createPropDef({
          type: createPropType('func'),
          typeSystem: PropTypeSystem.PropTypes,
        });

        const result = renderType(propDef);

        expect(result).toBe('func');
      });

      it("should render the function signature when it's a signature", () => {
        const propDef = createPropDef({
          type: createPropType('(a: string) => string)'),
          typeSystem: PropTypeSystem.PropTypes,
        });

        const result = renderType(propDef);

        expect(result).toBe('(a: string) => string)');
      });
    });

    it("should render 'number' when type is number", () => {
      const propDef = createPropDef({
        type: createPropType('number'),
        typeSystem: PropTypeSystem.PropTypes,
      });

      const result = renderType(propDef);

      expect(result).toBe('number');
    });

    it("should render 'object' when type is object", () => {
      const propDef = createPropDef({
        type: createPropType('object'),
        typeSystem: PropTypeSystem.PropTypes,
      });

      const result = renderType(propDef);

      expect(result).toBe('object');
    });

    it("should render 'symbol' when type is symbol", () => {
      const propDef = createPropDef({
        type: createPropType('symbol'),
        typeSystem: PropTypeSystem.PropTypes,
      });

      const result = renderType(propDef);

      expect(result).toBe('symbol');
    });

    it("should render 'element' when type is element", () => {
      const propDef = createPropDef({
        type: createPropType('element'),
        typeSystem: PropTypeSystem.PropTypes,
      });

      const result = renderType(propDef);

      expect(result).toBe('element');
    });

    it("should render 'elementType' when type is elementType", () => {
      const propDef = createPropDef({
        type: createPropType('elementType'),
        typeSystem: PropTypeSystem.PropTypes,
      });

      const result = renderType(propDef);

      expect(result).toBe('elementType');
    });

    it('should render the instance type when type is instanceOf', () => {
      const propDef = createPropDef({
        type: createPropType('instanceOf', { value: 'Set' }),
        typeSystem: PropTypeSystem.PropTypes,
      });

      const result = renderType(propDef);

      expect(result).toBe('Set');
    });

    describe('enum', () => {
      it('should render the enumerated string values', () => {
        const propDef = createPropDef({
          type: createPropType('enum', {
            value: [
              {
                value: "'News'",
                computed: false,
              },
              {
                value: "'Photos'",
                computed: false,
              },
            ],
          }),
          typeSystem: PropTypeSystem.PropTypes,
        });

        const result = renderType(propDef);

        expect(result).toBe("'News' | 'Photos'");
      });
    });
  });
});
