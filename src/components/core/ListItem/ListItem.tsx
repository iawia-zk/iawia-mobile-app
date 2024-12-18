import React from 'react';

import ListItemBase from 'components/core/ListItemBase';
import IconBox from 'components/core/IconBox';

import { TListItemBaseStates } from 'components/core/ListItemBase/ListItemBase.types';

import { TListItemProps } from './ListItem.types';

function ListItem({
  labelId,
  labelProps,
  descriptionId,
  descriptionProps,
  badgeProps,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  iconColor = 'textSecondary',
  iconBackgroundColor = 'backgroundPrimary',
  onPress,
  disabled,
  iconBoxProps,
  hasError,
}: TListItemProps) {
  function renderLeftComponent({ pressed, hasError: hasErrorValue }: TListItemBaseStates) {
    if (LeftIcon) {
      return (
        <IconBox
          icon={LeftIcon}
          iconColor={hasErrorValue ? 'statusErrorPrimary' : iconColor}
          backgroundColor={pressed ? 'buttonGhostPrimaryHover' : iconBackgroundColor}
          containerProps={{
            alignSelf: 'flex-start',
          }}
          {...iconBoxProps}
        />
      );
    }
    return undefined;
  }

  function renderRightComponent({ pressed }: TListItemBaseStates) {
    if (RightIcon) {
      return (
        <IconBox
          icon={RightIcon}
          iconColor={hasError ? 'statusErrorPrimary' : iconColor}
          backgroundColor={pressed ? 'buttonGhostPrimaryHover' : iconBackgroundColor}
          containerProps={{
            alignSelf: 'flex-start',
          }}
          {...iconBoxProps}
        />
      );
    }
    return undefined;
  }

  return (
    <ListItemBase
      labelId={labelId}
      labelProps={labelProps}
      descriptionId={descriptionId}
      descriptionProps={descriptionProps}
      badgeProps={badgeProps}
      onPress={onPress}
      left={renderLeftComponent}
      right={renderRightComponent}
      disabled={disabled}
      hasError={hasError}
    />
  );
}

export default ListItem;
