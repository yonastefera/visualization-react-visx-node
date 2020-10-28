import React, { useCallback } from 'react';

import { createStyles, MenuItem } from '@material-ui/core';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';

import { Title } from '../Title';

const useStyles = makeStyles(() =>
  createStyles({
    selectorContainer: {
      display: 'flex',
      alignItems: 'center',
    },
  })
);

export const CustomSelector = ({ options, title, value, onChange }) => {
  const styles = useStyles();
  const handleChange = useCallback(
    ({ target: { value: newValue } }) => {
      onChange(newValue);
    },
    [onChange]
  );

  return (
    <section className={styles.selectorContainer}>
      <Title>{title}</Title>
      <Select label={title} onChange={handleChange} value={value}>
        {options.map(x => (
          <MenuItem key={x.value} value={x.value}>
            {x.title}
          </MenuItem>
        ))}
      </Select>
    </section>
  );
};
