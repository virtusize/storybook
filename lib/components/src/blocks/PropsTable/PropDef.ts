export enum PropTypeSystem {
  Flow = 'Flow',
  TypeScript = 'TypeScript',
  PropTypes = 'PropTypes',
  Unknown = 'Unknown',
}

export interface PropDefJsDocTags {
  params?: PropDefJsDocTag[];
  returns?: PropDefJsDocTag;
}

export interface PropDefJsDocTag {
  name?: string;
  description?: string;
}

export interface PropDef {
  name: string;
  type: any;
  required: boolean;
  description?: string;
  defaultValue?: string;
  jsDocTags?: PropDefJsDocTags;
  typeSystem: PropTypeSystem;
}
