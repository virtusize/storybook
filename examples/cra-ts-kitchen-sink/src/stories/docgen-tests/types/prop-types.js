/* eslint-disable react/no-unused-prop-types */
import React from 'react';
import PropTypes, { string } from 'prop-types';

const ITEM_SHAPE = {
  text: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

const TOP_LEFT = 'top-left';
const TOP_RIGHT = 'top-right';
const TOP_CENTER = 'top-center';

export const POSITIONS = [TOP_LEFT, TOP_RIGHT, TOP_CENTER];

export const PropTypesProps = () => <div>PropTypes!</div>;

PropTypesProps.propTypes = {
  arrayOfPrimitive: PropTypes.arrayOf(PropTypes.string),
  arrayOfShape: PropTypes.arrayOf(ITEM_SHAPE),
  arrayOfInlineShape: PropTypes.arrayOf({
    text: string.isRequired,
    value: string.isRequired,
  }).isRequired,
  oneOf: PropTypes.oneOf(POSITIONS),
};

PropTypesProps.defaultProps = {
  arrayOfPrimitive: ['foo', 'bar'],
  arrayOfShape: [{ text: 'foo', value: 'bar' }],
  oneOf: TOP_RIGHT,
};
