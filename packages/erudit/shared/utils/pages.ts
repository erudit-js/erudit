export const PAGES = {
    index: '/',
    contributors: '/contributors/',
    contributor: (contributorId?: string) => {
        return slasher(`/contributor/${contributorId ?? ''}/`);
    },
    sponsors: '/sponsors/',
};
