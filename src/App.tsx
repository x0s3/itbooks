import { AnimatedList } from '@components/animated/AnimatedList';
import { AnimatedIcon } from '@components/animated/AnimatedTouchableIcon';
import { AnimatedView } from '@components/animated/AnimatedView';
import { useReduxAction, useReduxState } from '@hooks/use-redux';
import { searchQueueBooks } from '@redux/actions';
import { books as getBooks } from '@redux/selectors/';
import React, { useEffect, useRef, useState } from 'react';
import {
	Alert,
	Dimensions,
	FlatList,
	SafeAreaView,
	StyleSheet,
	TouchableOpacity,
} from 'react-native';
import Animated, { Transition, Transitioning } from 'react-native-reanimated';
import { Colors, Constants, Text, TextField, View } from 'react-native-ui-lib';

const { width } = Dimensions.get('screen');

const { Value, Extrapolate, call, useCode } = Animated;

const AnimatedText = Animated.createAnimatedComponent(Text);
const AnimatedTextInput = Animated.createAnimatedComponent(TextField);

const NUMBER_OF_COLUMNS = 2;

const App = () => {
	const refHeader = useRef(new Value(0));
	const transitionRef = useRef(null);
	const [search, setSearch] = useState<boolean>(false);
	const books = useReduxState(getBooks);
	const fetchBooks = useReduxAction(searchQueueBooks.request);

	useEffect(() => {
		fetchBooks();
	}, []);

	const transition = (
		<Transition.Sequence>
			<Transition.Out
				type={'slide-left'}
				durationMs={200}
				interpolation={'easeIn'}
			/>
			<Transition.Change interpolation={'easeInOut'} />
			<Transition.Together>
				<Transition.In
					type={'slide-right'}
					durationMs={200}
					interpolation={'easeOut'}
					propagation={'left'}
				/>
				<Transition.In type={'fade'} durationMs={50} delayMs={50} />
			</Transition.Together>
		</Transition.Sequence>
	);

	// useCode(call([refHeader.current], ([val]) => f(!!val)), [refHeader.current]);

	const headerOpacity = refHeader.current.interpolate({
		inputRange: [-100, 0, 100, 101],
		outputRange: [0, 1, 0, 0],
		extrapolate: Extrapolate.CLAMP,
	});

	const headerX = refHeader.current.interpolate({
		inputRange: [0, width - width / 2],
		outputRange: [0, width - width / 2.25],
		extrapolate: Animated.Extrapolate.CLAMP,
	});

	const titleFontSize = refHeader.current.interpolate({
		inputRange: [-100, 0, 100, 101],
		outputRange: [60, 50, 40, 30],
		extrapolate: Extrapolate.CLAMP,
	});

	const listY = refHeader.current.interpolate({
		inputRange: [0, 220],
		outputRange: [0, -220],
		extrapolate: Animated.Extrapolate.CLAMP,
	});

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
			<View flex>
				<View paddingL-24>
					<AnimatedView
						row
						spread
						bottom
						paddingR-24
						style={[styles.separator]}
					>
						<Transitioning.View
							ref={transitionRef}
							transition={transition}
							style={{
								flexGrow: 1,
								justifyContent: 'center',
							}}
						>
							{!search ? (
								<AnimatedText
									key={search}
									style={[
										{
											lineHeight: 70,
											fontFamily: Constants.isAndroid
												? 'sans-serif-thin'
												: undefined,
											fontSize: titleFontSize,
											fontWeight: '100',
											transform: [
												{
													translateX: headerX,
												},
											],
										},
									]}
								>
									IT Books
								</AnimatedText>
							) : (
								<AnimatedTextInput
									key={search}
									text70
									red20
									hideUnderline
									floatingPlaceholder
									floatingPlaceholderColor={{ focus: Colors.red20 }}
									underlineColor={{ focus: Colors.dark20 }}
									placeholder={'Search your book'}
									floatOnFocus
									style={{
										justifyContent: 'center',
										alignSelf: 'center',
										transform: [
											{
												translateX: headerX,
											},
										],
									}}
								/>
							)}
						</Transitioning.View>
						<AnimatedIcon
							onPress={() => {
								transitionRef.current.animateNextTransition();
								setSearch(s => !s);
							}}
							style={{
								justifyContent: 'center',
								alignSelf: 'center',
								opacity: headerOpacity,
							}}
							name={!search ? 'md-search' : 'md-close'}
						/>
					</AnimatedView>
				</View>
				<AnimatedView
					paddingL-24
					style={{
						opacity: headerOpacity,
					}}
				>
					<FlatList
						bounces={false}
						horizontal={false}
						showsHorizontalScrollIndicator={false}
						showsVerticalScrollIndicator={false}
						numColumns={NUMBER_OF_COLUMNS}
						ItemSeparatorComponent={() => <View style={styles.separator} />}
						data={['Recents', 'Filters', 'Options', 'Downloaded Books']}
						keyExtractor={item => item}
						renderItem={ListItem}
						getItemLayout={(_: any, index: number) => ({
							length: 60,
							offset: 60 * index,
							index,
						})}
						renderToHardwareTextureAndroid
						shouldRasterizeIOS
					/>
				</AnimatedView>
				<AnimatedView flex style={{ marginTop: listY }} paddingB-40 paddingH-24>
					<Text text40>Recently Added</Text>
					<View style={{ backgroundColor: '#FFF' }} marginT-20>
						<AnimatedList
							data={books}
							fetchMore={fetchBooks}
							refScroll={refHeader}
						/>
					</View>
				</AnimatedView>
			</View>
			{/* <BottomSheet /> */}
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	separator: {
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderColor: Colors.dark60,
	},
});

export default App;

const ListItem = ({ item }: any) => {
	const marginLeft = item === 'Filters' && { marginLeft: 50 };
	const marginn = item === 'Downloaded Books' && { marginLeft: 10 };
	return (
		<TouchableOpacity
			style={{
				alignSelf: 'center',
				justifyContent: 'center',
				...marginLeft,
				...marginn,
			}}
			onPress={() => Alert.alert(item)}
		>
			<View
				flex
				marginL-24
				marginB-24
				height={60}
				centerV
				style={{ alignSelf: 'center' }}
				// style={[styles.separator]}
			>
				<Text text60 red20>
					{item}
				</Text>
			</View>
		</TouchableOpacity>
	);
};
