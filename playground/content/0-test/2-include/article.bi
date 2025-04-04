# Target

{ #sampleParagraph }
Article sample paragraph.\
Some of includes target me!

# Scope: Current part

<~ sampleParagraph

# Scope: Current topic

<~ practice|practiceParagraph

# Scope: Global

<~ article|/test/include|sampleParagraph

<~ practice|/test/include|practiceParagraph

# Aliases

~ sampleP sampleParagraph
~ globalSampleP article|/test/link|sampleParagraph
~ practiceP practice|practiceParagraph
~ relativeSampleP article|~/link|sampleParagraph

<~ ~sampleP

<~ ~globalSampleP

<~ ~practiceP

# Relative

<~ article|~/link|sampleParagraph

<~ practice|~/link|practiceParagraph

# Alias + Relative

<~ ~relativeSampleP

# "Link" inside "Include"

<~ summary|pWithLinks