import { describe, expect, it } from 'vitest';
import { isolateProse, isRawElement, PROSE_REGISTRY } from '@jsprose/core';

import { asEruditRaw, resolveEruditRawElement } from '@erudit-js/prose';
import {
  Caption,
  captionRegistryItem,
  captionSchema,
} from '@erudit-js/prose/elements/caption/core';
import {
  Video,
  videoRegistryItem,
  videoSchema,
} from '@erudit-js/prose/elements/video/core';

const prepareRegistry = () =>
  PROSE_REGISTRY.setItems(videoRegistryItem, captionRegistryItem);

describe('Video', () => {
  it('should create video correctly', () => {
    isolateProse(() => {
      prepareRegistry();

      const video = asEruditRaw(
        <Video src="video.mp4" width="800px" autoplay={false}>
          <Caption>Video Caption</Caption>
        </Video>,
      );

      expect(isRawElement(video, videoSchema)).toBe(true);
      expect(video.data).toStrictEqual({
        src: 'video.mp4',
        width: '800px',
        autoplay: false,
      });
      expect(video.storageKey).toBe('video.mp4');
      expect(video.children).toHaveLength(1);
      expect(isRawElement(video.children![0], captionSchema)).toBe(true);

      expect(() => <Video src="video.mp4" />).not.toThrow();
    });
  });

  it('should throw when wrong children are provided', () => {
    isolateProse(() => {
      prepareRegistry();
      // Not caption child
      expect(() => <Video src="video.mp4">Only Content</Video>).toThrow();
    });
  });
});

describe('videoSrcStep', () => {
  it('collect video srcs', async () => {
    await isolateProse(async () => {
      PROSE_REGISTRY.setItems(videoRegistryItem);

      const { files } = await resolveEruditRawElement({
        context: {
          language: 'en',
          linkable: true,
        },
        rawElement: (
          <>
            <Video src="video1.mp4" />
            Some text
            <Video src="video2.mp4" autoplay={true} />
          </>
        ),
      });

      expect(files).toEqual(new Set(['video1.mp4', 'video2.mp4']));
    });
  });
});
