# Target

{ #sampleParagraph }
Article sample paragraph.\
Some of links target me!

# Unique links

Unique links target specific bitran products.

## Scope: Current part

This is a [link](sampleParagraph) to sample paragraph in this Topic Part.

## Scope: Current topic

This is a [link](practice|practiceParagraph) to sample paragraph in this Topic, but in Practice part.

## Scope: Global

This is an [global link](article|/test/link|sampleParagraph) to sample paragraph in current part.\
This is an [global link](practice|/test/link|practiceParagraph) to sample paragraph in Practice.

## Aliases

~ sampleP sampleParagraph
~ globalSampleP article|/test/link|sampleParagraph
~ practiceP practice|practiceParagraph
~ relativeSampleP article|~/link|sampleParagraph

This is an [aliased link](~sampleP) to sample paragraph in current part.\
Global aliased [link](~globalSampleP).\
This is an [aliased link](~practiceP) to sample paragraph in Practice.

## Relative

This is an [relative link](article|~/link|sampleParagraph) to sample paragraph in current part.\
This is an [relative link](practice|~/link|practiceParagraph) to sample paragraph in Practice.

## Alias + Relative

Relative aliased [link](~relativeSampleP).

# Page links

Page links target specific pages of current Erudit site.

Context link to [Article](page|article). Global [link](page|article|/test/link). Relative [link](page|article|~/link).\
Context link to [Summary](page|summary). Global [link](page|summary|/test/link). Relative [link](page|summary|~/link).\
Context link to [Practice](page|practice). Global [link](page|practice|/test/link). Relative [link](page|practice|~/link).\

Link to this [book](page|book|/test).

Global link to [group](page|group|/test/sample-group). Relative [link](page|group|~/sample-group).

Link to [contributor](page|contributor|test-contributor-1).

# Unknown page links

Link to unknown path ["/foo/bar"](/foo/bar) within current site.

# External links

External link to [Google](https://google.com).