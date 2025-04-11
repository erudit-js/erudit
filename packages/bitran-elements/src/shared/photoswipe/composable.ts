import { shallowRef, onUnmounted } from 'vue';
import PhotoSwipeLightbox, {
    type PhotoSwipeOptions,
} from 'photoswipe/lightbox';

import captionClasses from '../figure/caption.module.scss';

export function usePhotoSwipe() {
    const lightbox = shallowRef<PhotoSwipeLightbox>();

    const initLightbox = (options: PhotoSwipeOptions) => {
        lightbox.value = new PhotoSwipeLightbox({
            pswpModule: () => import('photoswipe'),
            imageClickAction: 'toggle-controls',
            bgClickAction: 'close',
            doubleTapAction: 'zoom',
            wheelToZoom: true,
            bgOpacity: 1,
            ...options,
        });

        lightbox.value.addFilter('isContentZoomable', () => true);

        lightbox.value.init();
        return lightbox.value;
    };

    const registerCaption = (
        lightboxInstance: PhotoSwipeLightbox,
        captionElement: HTMLElement,
    ) => {
        if (!captionElement) return;

        lightboxInstance.on('uiRegister', () => {
            lightboxInstance.pswp?.ui?.registerElement({
                name: 'caption',
                className: `${captionClasses.caption} ${captionClasses.photoswipe}`,
                order: 9,
                isButton: false,
                appendTo: 'root',
                html: captionElement.innerHTML,
            });
        });
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
        registerCaption,
    };
}
