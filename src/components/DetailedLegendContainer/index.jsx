import React from 'react';

import { createStyles, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() =>
  createStyles({
    legend: {
      width: ({ width }) => width,
      flexShrink: 0,
      lineHeight: '1em',
      fontSize: 15,
      padding: '10px 10px',
      float: 'left',
      margin: '5px 5px',
      color: 'wheat',
    },
    title: {
      fontSize: 18,
      marginBottom: 10,
      fontWeight: 100,
    },
  })
);

export const DetailedLegendContainer = ({ width, title, children }) => {
  const styles = useStyles({ width });
  return (
    <div className={styles.legend}>
      <div className={styles.title}>{title}</div>
      {children}
    </div>
  );
};
