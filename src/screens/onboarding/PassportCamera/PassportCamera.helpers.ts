import { UIManager } from 'react-native';

export function dispatchNativeCommand(
  fragmentComponentName: string,
  viewId: number,
  command: 'create' | 'destroy'
) {
  try {
    UIManager.dispatchViewManagerCommand(
      viewId,
      UIManager.getViewManagerConfig(fragmentComponentName).Commands[command].toString(),
      [viewId]
    );
  } catch (e) {
    // Error creatingthe fragment
    // TODO: assert this only happens in dev mode when the fragment is already mounted
    console.log(e);
    if (command === 'create') {
      dispatchNativeCommand(fragmentComponentName, viewId, 'destroy');
    }
  }
}
