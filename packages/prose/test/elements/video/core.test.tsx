import { describe, expect, it } from 'vitest';

import { asEruditRaw } from '@src/rawElement';
import core, {
  Video,
  videoSchema,
  type VideoSchema,
} from '@src/elements/video/core';
import { Caption, captionSchema } from '@src/elements/caption/core';
import { isRawElement } from 'tsprose';
import { eruditRawToProse } from '@src/rawToProse';

describe('Video', () => {
  it('should create video correctly', () => {
    const video = asEruditRaw<VideoSchema>(
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

  it('should throw when wrong children are provided', () => {
    // Not caption child
    expect(() => <Video src="video.mp4">Only Content</Video>).toThrow();
  });
});

describe('rawToProseHook', () => {
  it('collect video srcs', async () => {
    const { files } = await eruditRawToProse({
      rawProse: (
        <>
          <Video src="video1.mp4" />
          Some text
          <Video src="video2.mp4" autoplay={true} />
        </>
      ),
      schemaHooks: new Map([[videoSchema, core.rawToProseHook]]),
    });

    expect(files).toEqual(new Set(['video1.mp4', 'video2.mp4']));
  });
});
