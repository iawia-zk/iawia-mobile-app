import { COPY_STATE_STYLE_MAP } from './CopyInfoItem.constants';
import { TCopyInfoItemStateProps, TCopyInfoItemGetStyleReturn } from './CopyInfoItem.types';

export function getCopyInfoItemStyle({
  copied,
}: TCopyInfoItemStateProps): TCopyInfoItemGetStyleReturn {
  if (copied) {
    return COPY_STATE_STYLE_MAP.copied;
  }
  return COPY_STATE_STYLE_MAP.default;
}
