import type { PreviewRequest } from '@erudit-js/core/preview/request';

export const usePreview = () => {
  const previewState = useState<PreviewState>('preview', () => ({
    opened: false,
    request: undefined,
    history: [],
    blink: 0,
  }));

  const hasPreviousRequest = computed(
    () => previewState.value.history.length > 0,
  );

  function setPreview(request: PreviewRequest) {
    if (toStringEqual(request, previewState.value.request)) {
      if (previewState.value.opened) {
        previewState.value.blink += 1;
      } else {
        previewState.value.opened = true;
      }
      return;
    }

    if (previewState.value.request) {
      previewState.value.history.push(previewState.value.request);
    }

    previewState.value.request = request;
    previewState.value.opened = true;
  }

  function setPreviousPreview() {
    if (!hasPreviousRequest.value) {
      return;
    }

    previewState.value.request = previewState.value.history.pop();
    previewState.value.opened = true;
  }

  function closePreview() {
    previewState.value.opened = false;
    previewState.value.request = undefined;
    previewState.value.history = [];
  }

  return {
    previewState,
    hasPreviousRequest,
    setPreview,
    setPreviousPreview,
    closePreview,
  };
};
