import React, { useMemo } from 'react';
import {
  View,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { CommonActions } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  ABlurView,
  AStack,
  AText,
  AIconButton,
} from './ALibrary';
import { RootDispatch, RootState } from '../../store';
import { useThemeColors } from '../../lib/common';

export default function NavigationHeader({ navigation }): React.ReactNode {
  const { colors } = useThemeColors();
  const safeAreaInsets = useSafeAreaInsets();
  const navigationStateIndex = navigation.getState().index;
  const isStack = navigation.getState().key.startsWith('stack-');
  const currentCode = useSelector((state: RootState) => state.currencies.currentCode);
  const title = useSelector((state: RootState) => state.firefly.rangeDetails.title);
  const range = useSelector((state: RootState) => state.firefly.rangeDetails.range);
  const start = useSelector((state: RootState) => state.firefly.rangeDetails.start);
  const end = useSelector((state: RootState) => state.firefly.rangeDetails.end);
  const selectedAccountIds = useSelector((state: RootState) => state.accounts.selectedAccountIds);
  const { firefly: { setRange } } = useDispatch<RootDispatch>();

  if (![0, 1].includes(navigationStateIndex)) {
    return useMemo(() => null, [
      navigationStateIndex,
      selectedAccountIds,
      isStack,
      currentCode,
      title,
      range,
      start,
      end,
      colors,
    ]);
  }

  return useMemo(() => (
    <ABlurView
      intensity={45}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: Platform.select({ ios: colors.tabBackgroundColor, android: isStack ? colors.tileBackgroundColor : colors.blurAndroidHeader }),
        paddingTop: safeAreaInsets.top,
      }}
    >
      <AStack row px={6} py={4} justifyContent="space-between">
        <AIconButton
          icon={<FontAwesome name="angle-left" size={25} color={colors.text} />}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch();
            setRange({ direction: -1 });
          }}
        />
        <AStack px={12} alignItems="flex-start" justifyContent="space-between">
          <AText fontFamily="Montserrat_Bold" fontSize={17} lineHeight={18}>
            {title}
          </AText>
          <AText py={4} fontSize={12} numberOfLines={1}>
            {range === 1 ? `${moment(start).format('MMMM D')} - ${moment(end).format('D')}` : `${moment(start).format('MMMM D')} - ${moment(end).format('MMMM D')}`}
          </AText>
          <AStack row justifyContent="flex-start">
            <View style={{
              alignSelf: 'flex-start',
              borderWidth: 0.7,
              borderColor: colors.text,
              borderRadius: 10,
              paddingHorizontal: 5,
              marginHorizontal: 1,
            }}
            >
              <AText fontFamily="Montserrat_Bold" fontSize={10} lineHeight={12}>
                {currentCode}
              </AText>
            </View>
            <View style={{
              alignSelf: 'flex-start',
              borderWidth: 0.7,
              borderColor: colors.text,
              borderRadius: 10,
              paddingHorizontal: 5,
              marginHorizontal: 1,
            }}
            >
              <AText fontFamily="Montserrat_Bold" fontSize={10} lineHeight={12}>
                {`${range}M`}
              </AText>
            </View>
            {selectedAccountIds?.length > 0 && (
              <View style={{
                alignSelf: 'flex-start',
                borderWidth: 0.7,
                borderColor: colors.text,
                borderRadius: 10,
                paddingHorizontal: 5,
                marginHorizontal: 1,
              }}
              >
                <AText fontFamily="Montserrat_Bold" fontSize={10} lineHeight={12}>
                  {`+${selectedAccountIds.length}`}
                </AText>
              </View>
            )}
          </AStack>
        </AStack>

        <TouchableOpacity
          style={{
            margin: 5,
            padding: 5,
            borderRadius: 10,
          }}
          onPress={() => navigation.dispatch(
            CommonActions.navigate({
              name: 'FiltersScreen',
            }),
          )}
        >
          <Ionicons name="ios-filter" size={20} color={colors.text} />
        </TouchableOpacity>

        <AIconButton
          icon={<FontAwesome name="angle-right" size={25} color={colors.text} />}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch();
            setRange({ direction: +1 });
          }}
        />

      </AStack>
    </ABlurView>
  ), [
    navigationStateIndex,
    selectedAccountIds,
    isStack,
    currentCode,
    title,
    range,
    start,
    end,
    colors,
  ]);
}
