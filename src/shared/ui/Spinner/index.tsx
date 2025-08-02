import type { CSSProperties } from 'react';
import classes from './spinner.module.css';

type SpinnerProps = {
	style?: CSSProperties;
};

export default function Spinner({ style }: SpinnerProps) {
	return <div className={classes.loader} style={style} />;
}
