import { objectsEqual } from '@shared/utils/objectsEqual';
import { PreviewRequestType, type PreviewRequest } from './request';

export enum PreviewThemeName {
    Error = 'error',
    Warn = 'warn',
    Success = 'success',
    Brand = 'brand',
}

//

const _request = ref<PreviewRequest>();
const _visible = ref(false);
const _history = ref<PreviewRequest[]>([]);
const _theme = ref<PreviewThemeName>();
const _blinki = ref(0);

//

export const previewRequest = readonly(_request);
export const previewVisible = readonly(_visible);
export const previewTheme = readonly(_theme);
export const previewBlinkTrigger = readonly(_blinki);

export const hasPreviewHistory = computed(() => _history.value.length > 0);

export function showPreviousPreview() {
    if (!hasPreviewHistory.value) return;

    _request.value = _history.value.pop();
}

export function showPreview(request: PreviewRequest) {
    if (objectsEqual(_request.value, request)) {
        if (_visible.value) _blinki.value++;
        else _visible.value = true;
        return;
    }

    if (_request.value) _history.value.push(_request.value);

    _request.value = request;
    _visible.value = true;
}

export function closePreview() {
    _visible.value = false;
    _request.value = undefined;
    _history.value.length = 0;
}

export function togglePreview(visible?: boolean) {
    _visible.value = visible === undefined ? !_visible.value : visible;
}

export function setPreviewTheme(newTheme: PreviewThemeName) {
    _theme.value = newTheme;
}

export function unsetPreviewTheme() {
    _theme.value = undefined;
}
