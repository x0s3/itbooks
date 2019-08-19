import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface IIonicon {
	readonly name: string;
	readonly size?: number;
	readonly color?: string;
}

export const Ionicon: React.FC<IIonicon> = React.memo(
	({ name, color = '#000', size = 32 }) => (
		<Ionicons color={color} name={name} size={size} />
	),
);
