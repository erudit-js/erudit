Testing Preview window with different links within site content:

[Unknown](/foo/bar) page link.\
[External](https://google.com) page link.\
[Contributor](page|contributor|test-contributor-1) link.\
[Heading](sampleHeading) link.\
[Heading](includeHeading) with include link.\
[Product](sampleParagraph1) link.\
[Book](page|book|test) link.\
[Group](page|group|~/sample-group) link.\
[Topic part](page|article) link.\

{ #sampleHeading }
# Sample heading

{ #sampleParagraph1 }
Sample paragraph 1.

Sample paragraph 2.

Sample paragraph 3.

{ #includeHeading }
## Include heading

<~ sampleParagraph1

Sample paragraph 2.

Sample paragraph 3.