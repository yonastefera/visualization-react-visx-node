import React from 'react';

import { createStyles, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() =>
  createStyles({
    title: {
      fontSize: 16,
      fontWeight: 400,
      marginRight: 15,
    },
  })
);

export const Title = ({ children }) => {
  const styles = useStyles();
  return <Typography className={styles.title}>{children}</Typography>;
};
