const letters = ['А', 'Б', 'В', 'Г', 'Д', 'Е'];

export default defineProblemGenerator((random) => {
    const cutLength = random.integer(3, 4);
    const cutStart = random.integer(0, letters.length - cutLength);
    const allowedLetters = letters.slice(cutStart, cutStart + cutLength);

    const wordLength = random.integer(4, 6);
    const maxPos = Math.pow(allowedLetters.length, wordLength) - 1;
    const targetPos = random.integer(50, maxPos);

    const getWordAtPos = (index: number) => {
        let word = '';
        let n = index - 1;
        for (let i = 0; i < wordLength; i++) {
            word = allowedLetters[n % allowedLetters.length] + word;
            n = Math.floor(n / allowedLetters.length);
        }
        return word;
    };

    const displayWords: string[] = [];

    for (let i = 1; i <= 5; i++) {
        const word = getWordAtPos(i);
        displayWords.push(word);
    }

    return {
        wordLength,
        allowedLetters: allowedLetters.join(', '),
        ...displayWords.reduce((acc, word, i) => {
            acc[`displayWord${i + 1}`] = word;
            return acc;
        }, {} as any),
        targetPos,
        targetWord: getWordAtPos(targetPos),
    };
});
