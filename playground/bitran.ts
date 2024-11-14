export default defineBitranConfig({
    products: {
        blockMath: {
            async core() {
                return { core: 42 } as any;
            },
            async render() {
                const icon = null;
                const component = null;
                return {
                    icon,
                    component,
                } as any;
            },
        },
    },
    toc: ['blockMath'],
});
