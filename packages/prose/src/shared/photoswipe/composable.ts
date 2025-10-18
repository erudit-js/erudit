import { shallowRef, onUnmounted } from 'vue';
import PhotoSwipeLightbox, {
    type PhotoSwipeOptions,
} from 'photoswipe/lightbox';
import 'photoswipe/style.css';

import './style.css';

export function usePhotoSwipe() {
    const lightbox = shallowRef<PhotoSwipeLightbox>();

    const initLightbox = (
        options: PhotoSwipeOptions,
        captionElement?: HTMLElement,
    ) => {
        lightbox.value = new PhotoSwipeLightbox({
            pswpModule: () => import('photoswipe'),
            imageClickAction: 'toggle-controls',
            bgClickAction: 'close',
            doubleTapAction: 'zoom',
            wheelToZoom: true,
            bgOpacity: 1,
            preloaderDelay: 0,
            showAnimationDuration: 200,
            hideAnimationDuration: 200,
            ...options,
        });

        lightbox.value.addFilter('isContentZoomable', () => true);

        if (captionElement) {
            lightbox.value.on('uiRegister', () => {
                lightbox.value!.pswp?.ui?.registerElement({
                    name: 'caption',
                    className:
                        'text-xs micro:text-sm absolute bottom-0 w-full text-center p-normal bg-bg-main/50 backdrop-blur-md',
                    order: 9,
                    isButton: false,
                    appendTo: 'root',
                    html: patchCaptionHtml(captionElement),
                });
            });
        }

        lightbox.value.init();

        lightbox.value.on('contentAppend', (e) => {
            const { content } = e;
            if (!content || !content.element) return;

            const el = content.element;

            el.style.opacity = '0';
            el.style.transition = 'opacity 0.2s ease';
            requestAnimationFrame(() => {
                el.style.opacity = '1';
            });
        });

        return lightbox.value;
    };

    const patchCaptionHtml = (el: HTMLElement): string => {
        const cloned = el.cloneNode(true) as HTMLElement;
        cloned.querySelectorAll('a[href]').forEach((a) => {
            a.setAttribute('target', '_blank');
        });
        return cloned.innerHTML;
    };

    const destroyLightbox = () => {
        if (lightbox.value) {
            lightbox.value.destroy();
            lightbox.value = undefined;
        }
    };

    onUnmounted(() => {
        destroyLightbox();
    });

    return {
        lightbox,
        initLightbox,
        destroyLightbox,
        patchCaptionHtml,
    };
}
