import { Lola } from '#content/lola';

export default defineProblemGenerator((random) => {
    // console.log('Hello from Lemon generator!');
    // console.log(random.integer(10, 15));
    return {
        foo: `$$ A^2 + B^2 - C^2 = ${random.integer(10, 15)} $$`,
        label: random.arrayElement([Lola, 'Описание 2', 'Описание 3'])!,
    };
}, 'aboba');
